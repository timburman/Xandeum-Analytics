import { NextResponse } from 'next/server';
import http from 'http';

// CONFIG
const SEED_NODE_URL = 'http://127.0.0.1:6000/rpc';
const MAX_PEERS_TO_CRAWL = 6; 

// Helper: Standard pRPC Request
function rpcRequest(ip: string, port: string, method: string): Promise<any> {
  return new Promise((resolve) => {
    try {
      const postData = JSON.stringify({ jsonrpc: '2.0', id: 1, method });
      const options = {
        hostname: ip,
        port: port,
        path: '/rpc',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 2500,
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          } else { resolve(null); }
        });
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.write(postData);
      req.end();
    } catch (e) { resolve(null); }
  });
}

// Helper: Geo Location (API)
async function getGeoLocation(ip: string) {
  if (ip === '127.0.0.1' || ip === 'localhost') return { lat: 20, lon: 0, country: 'Local' };
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,countryCode`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) { return null; }
}

// NEW: Deterministic Geo (The "Anti-Jumping" Fix)
// Generates the same Lat/Lng for a given IP every single time
function getStableGeo(ip: string) {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0;
    }
    // Map hash to a valid coordinate on the map
    // Lat: -50 to 60 (Avoid extreme poles)
    // Lng: -160 to 160
    const lat = ((Math.abs(hash) % 110) - 50); 
    const lng = ((Math.abs(hash >> 1) % 320) - 160);
    return { lat, lng };
}

// --- FALLBACK DATA GENERATOR ---
const getFallbackResponse = (method: string) => {
  if (method === 'get-version') return { result: { version: '0.6.0 (Simulation)' } };
  if (method === 'get-stats') return { 
      result: { 
          cpu_percent: 12.5, 
          ram_used: 4 * 1024 * 1024 * 1024, 
          ram_total: 16 * 1024 * 1024 * 1024, 
          uptime: 7200, 
          packets_received: 1540, 
          packets_sent: 1200,
          file_size: 5 * 1024 * 1024 * 1024,
          current_index: 500
      } 
  };
  // Consistent IPs for the demo
  if (method === 'get-pods') return { 
      result: { 
          pods: [
              { address: '173.212.207.32:6000', version: '0.6.0', last_seen: 'Just now' },
              { address: '142.250.190.46:6000', version: '0.6.0', last_seen: '1m ago' },
              { address: '13.235.100.20:6000', version: '0.6.0', last_seen: '5m ago' },
              { address: '54.250.200.10:6000', version: '0.6.0', last_seen: '2m ago' }
          ] 
      } 
  };
  return null;
};

// Helper: Normalize Stats
const normalizeStats = (versionRes: any, statsRes: any, ip: string, port: string, isSeed: boolean) => {
    if (!versionRes?.result) return null;

    const r = statsRes?.result || {}; 
    const safeStats = {
        cpu_percent: parseFloat((r.cpu_percent ?? 0).toFixed(2)),
        ram_used: r.ram_used ?? 0,
        ram_total: r.ram_total ?? (16 * 1024 * 1024 * 1024),
        uptime: r.uptime ?? 0,
        packets_received: r.packets_received ?? 0,
        packets_sent: r.packets_sent ?? 0,
    };
    
    const safeMeta = {
        total_bytes: r.file_size ?? 0,
        total_pages: r.current_index ?? 0 
    };

    return {
      id: `${ip}:${port}`,
      rank: 0, 
      name: isSeed ? 'Local pNode (Seed)' : `Peer ${ip}`,
      pubkey: isSeed ? 'Localhost' : `${ip}:${port}`,
      version: versionRes.result.version,
      ip: ip,
      status: 'Active',
      uptime: 100,
      latency: isSeed ? '1ms' : Math.floor(Math.random() * 80 + 20) + 'ms',
      stats: safeStats,
      metadata: safeMeta,
      geo: { lat: 0, lng: 0, country: 'Unknown' } 
    };
};

export async function GET() {
  const nodesList: any[] = [];
  
  // 1. CRAWL SEED NODE
  const seedUrl = new URL(SEED_NODE_URL);
  let [seedVersion, seedStats, seedPods] = await Promise.all([
    rpcRequest(seedUrl.hostname, seedUrl.port, 'get-version'),
    rpcRequest(seedUrl.hostname, seedUrl.port, 'get-stats'),
    rpcRequest(seedUrl.hostname, seedUrl.port, 'get-pods')
  ]);

  const isSimulationMode = !seedVersion;
  
  if (isSimulationMode) {
    seedVersion = getFallbackResponse('get-version');
    seedStats = getFallbackResponse('get-stats');
    seedPods = getFallbackResponse('get-pods');
  }

  const seedNode = normalizeStats(seedVersion, seedStats, seedUrl.hostname, seedUrl.port, true);
  if (seedNode) {
    seedNode.rank = 1;
    // Local seed always stays put
    seedNode.geo = { lat: 28.6, lng: 77.2, country: 'Local' }; 
    nodesList.push(seedNode);
  }

  // 2. DISCOVER PEERS
  let peersToCrawl: string[] = [];
  if (seedPods?.result?.pods) {
    peersToCrawl = seedPods.result.pods
        .map((p: any) => p.address)
        .slice(0, MAX_PEERS_TO_CRAWL);
  }

  // 3. RECURSIVE CRAWL
  const peerPromises = peersToCrawl.map(async (address) => {
     const [ip, portStr] = address.split(':');
     const port = portStr || '6000';

     let [pVer, pStats, geo] = await Promise.all([
        rpcRequest(ip, port, 'get-version'),
        rpcRequest(ip, port, 'get-stats'),
        getGeoLocation(ip)
     ]);

     if (isSimulationMode) {
         pVer = getFallbackResponse('get-version');
         pStats = getFallbackResponse('get-stats');
         
         // HARDCODED MAP for Simulation IPs (Looks much better than random)
         if (ip.startsWith('173')) geo = { lat: 51.16, lng: 10.45, countryCode: 'DE' }; // Germany
         else if (ip.startsWith('142')) geo = { lat: 37.09, lng: -95.71, countryCode: 'US' }; // US
         else if (ip.startsWith('13')) geo = { lat: 20.59, lng: 78.96, countryCode: 'IN' }; // India
         else if (ip.startsWith('54')) geo = { lat: 36.20, lng: 138.25, countryCode: 'JP' }; // Japan
     }

     const node = normalizeStats(pVer, pStats, ip, port, false);
     
     // STABLE GEO FALLBACK
     // If API fails or isSimulationMode doesn't catch it, use Math based on IP
     const stable = getStableGeo(ip);

     if (node) {
        node.geo = {
            lat: geo?.lat || stable.lat,
            lng: geo?.lon || geo?.lng || stable.lng,
            country: geo?.countryCode || geo?.country || 'Unknown'
        };
        return node;
     }
     
     return {
        id: address,
        name: `Peer ${ip}`,
        pubkey: address,
        version: 'Unknown',
        ip: ip,
        status: 'Unreachable',
        uptime: 0,
        latency: 'Timeout',
        // Still stable even if unreachable
        geo: { lat: stable.lat, lng: stable.lng, country: 'Unknown' },
        stats: { cpu_percent: 0, ram_used: 0 }
     };
  });

  const discoveredPeers = await Promise.all(peerPromises);
  
  discoveredPeers.forEach((peer, i) => {
    peer.rank = i + 2;
    nodesList.push(peer);
  });

  // 4. AGGREGATE
  const totalStorageBytes = nodesList.reduce((acc, node) => acc + (node.metadata?.total_bytes || 0), 0);
  const avgCpu = nodesList.reduce((acc, node) => acc + (node.stats?.cpu_percent || 0), 0) / (nodesList.length || 1);

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return NextResponse.json({
    stats: {
      totalNodes: nodesList.length,
      activeNodes: nodesList.filter(n => n.status === 'Active').length,
      totalStorage: formatBytes(totalStorageBytes),
      avgCpu: parseFloat(avgCpu.toFixed(2))
    },
    nodes: nodesList
  });
}