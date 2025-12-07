import { NextResponse } from 'next/server';

// 1. CONFIG: Your Local Seed Node
const SEED_NODE_URL = 'http://127.0.0.1:6000/rpc'; 

// Helper for pRPC calls
async function pRpcCall(url: string, method: string) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout per call

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method }),
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

// Helper: Format bytes to GB/TB
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export async function GET() {
  try {
    const nodesList = [];
    
    // --- STEP 1: Query Your Local Seed Node ---
    // We run these in parallel for speed
    const [versionRes, statsRes, podsRes] = await Promise.all([
      pRpcCall(SEED_NODE_URL, 'get-version'),
      pRpcCall(SEED_NODE_URL, 'get-stats'),
      pRpcCall(SEED_NODE_URL, 'get-pods')
    ]);

    // If local node is up, add it first
    if (versionRes?.result) {
      const s = statsRes?.result?.stats || {};
      const m = statsRes?.result?.metadata || {};
      
      nodesList.push({
        id: 'local-seed',
        rank: 1,
        name: 'My Local pNode (Seed)',
        pubkey: 'Localhost',
        version: versionRes.result.version,
        ip: '127.0.0.1',
        status: 'Active',
        uptime: s.uptime || 0,
        latency: '0ms',
        stats: s,    // Pass raw stats to Inspector
        metadata: m  // Pass raw metadata
      });
    }

    // --- STEP 2: Process Peers (from get-pods) ---
    // The bounty asks to show the network. We use 'get-pods' to find others.
    if (podsRes?.result?.pods) {
      const peers = podsRes.result.pods;
      
      // Map peers to our Node interface
      // Note: We only have 'last_seen' and 'version' from gossip, we don't have their full stats yet
      // unless we crawl them (which we can do, but let's keep it simple for MVP)
      peers.forEach((peer: any, index: number) => {
        nodesList.push({
          id: peer.address,
          rank: index + 2,
          name: `Peer ${peer.address}`,
          pubkey: peer.address, // Use address as ID for now
          version: peer.version,
          ip: peer.address.split(':')[0],
          status: 'Active', // If they are in 'get-pods', they were seen recently
          uptime: 0, // Unknown without direct query
          latency: 'Unknown',
          lastSeen: peer.last_seen
        });
      });
    }

    // --- STEP 3: Aggregate Network Stats ---
    const totalStorageBytes = nodesList.reduce((acc, node) => acc + (node.metadata?.file_size || 0), 0);
    const avgCpu = nodesList.reduce((acc, node) => acc + (node.stats?.cpu_percent || 0), 0) / (nodesList.length || 1);

    return NextResponse.json({
      stats: {
        totalNodes: nodesList.length,
        activeNodes: nodesList.length, // Simplified
        totalStorage: formatBytes(totalStorageBytes),
        avgCpu: Math.round(avgCpu)
      },
      nodes: nodesList
    });

  } catch (error) {
    console.error("Crawler Error:", error);
    return NextResponse.json({ error: 'Failed to crawl network' }, { status: 500 });
  }
}