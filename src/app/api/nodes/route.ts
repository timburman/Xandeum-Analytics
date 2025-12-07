import { NextResponse } from 'next/server';
import http from 'http';

// CONFIG: Your Local Seed Node
const SEED_NODE_URL = 'http://127.0.0.1:6000/rpc';

// A raw HTTP request helper that acts like CURL (Bypasses Next.js fetch issues)
function rpcRequest(method: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(SEED_NODE_URL);
      const postData = JSON.stringify({ jsonrpc: '2.0', id: 1, method });

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: '/rpc',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 2000, // 2s timeout
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`HTTP Status: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      
      req.write(postData);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

// Fallback data generator if the node is offline
const getFallbackResponse = (method: string) => {
  if (method === 'get-version') return { result: { version: '0.6.0 (Fallback)' } };
  if (method === 'get-stats') return { 
      result: { 
          stats: { cpu_percent: 12, ram_used: 4000000000, ram_total: 16000000000, uptime: 3600, packets_received: 1200, packets_sent: 1100 },
          metadata: { total_bytes: 5000000000, total_pages: 500 }
      } 
  };
  if (method === 'get-pods') return { result: { pods: [] } };
  return null;
};

// Helper: Format bytes to GB/TB
const formatBytes = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export async function GET() {
  const nodesList = [];

  // Parallel requests to the local node
  const [versionRes, statsRes, podsRes] = await Promise.allSettled([
    rpcRequest('get-version'),
    rpcRequest('get-stats'),
    rpcRequest('get-pods')
  ]);

  // Helper to extract result or fallback
  const getResult = (res: PromiseSettledResult<any>, method: string) => {
    if (res.status === 'fulfilled' && res.value && !res.value.error) {
      return res.value;
    }
    // Log clean error and return fallback
    if (res.status === 'rejected') {
      console.error(`RPC Error [${method}]: ${res.reason.message}`);
    }
    return getFallbackResponse(method);
  };

  const versionData = getResult(versionRes, 'get-version');
  const statsData = getResult(statsRes, 'get-stats');
  const podsData = getResult(podsRes, 'get-pods');

  // Add the Seed Node (Local)
  if (versionData?.result) {
    const s = statsData?.result?.stats || {};
    const m = statsData?.result?.metadata || {};
    
    nodesList.push({
      id: 'local-seed',
      rank: 1,
      name: 'Local pNode',
      pubkey: 'Localhost',
      version: versionData.result.version,
      ip: '127.0.0.1',
      status: 'Active',
      uptime: s.uptime || 0,
      latency: '1ms',
      stats: s,
      metadata: m
    });
  }

  // Add Peers (from gossip)
  if (podsData?.result?.pods) {
    podsData.result.pods.forEach((peer: any, index: number) => {
      nodesList.push({
        id: peer.address,
        rank: index + 2,
        name: `Peer ${peer.address.split(':')[0]}`,
        pubkey: peer.address,
        version: peer.version,
        ip: peer.address.split(':')[0],
        status: 'Active',
        uptime: 0,
        latency: 'Unknown',
        lastSeen: peer.last_seen
      });
    });
  }

  // Aggregate Stats
  const totalStorageBytes = nodesList.reduce((acc, node) => acc + (node.metadata?.file_size || 0), 0);
  const avgCpu = nodesList.reduce((acc, node) => acc + (node.stats?.cpu_percent || 0), 0) / (nodesList.length || 1);

  return NextResponse.json({
    stats: {
      totalNodes: nodesList.length,
      activeNodes: nodesList.length,
      totalStorage: formatBytes(totalStorageBytes),
      avgCpu: Math.round(avgCpu)
    },
    nodes: nodesList
  });
}