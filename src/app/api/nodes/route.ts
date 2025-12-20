import { NextResponse } from 'next/server';
import http from 'http';

// CONFIG
const SEED_NODE_URL = 'http://127.0.0.1:6000/rpc';
// Increase this if you want more peers, but keep it low to avoid rate limits
const MAX_PEERS_TO_CRAWL = 6; 

// Helper: Standard pRPC Request (with AbortController)
function rpcRequest(ip: string, port: string, method: string): Promise<any> {
  return new Promise((resolve) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
          controller.abort();
      }, 3000); // 3s Timeout for RPC

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
        signal: controller.signal,
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          clearTimeout(timeoutId);
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          } else { resolve(null); }
        });
      });

      req.on('error', () => { clearTimeout(timeoutId); resolve(null); });
      req.write(postData);
      req.end();
    } catch (e) { resolve(null); }
  });
}

// Helper: Geo Location (With Strict Timeout)
async function getGeoLocation(ip: string) {
  if (ip === '127.0.0.1' || ip === 'localhost') return { lat: 20, lon: 0, country: 'Local' };
  try {
    const controller = new AbortController();
    // CRITICAL FIX: 1.5s timeout for Geo API to prevent hanging
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon,countryCode`, {
        signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) return null;
    return await res.json();
  } catch (e) { return null; }
}

// Helper: Deterministic Geo
function getStableGeo(ip: string) {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
        hash = ((hash << 5) - hash) + ip.charCodeAt(i);
        hash |= 0;
    }
    const lat = ((Math.abs(hash) % 110) - 50); 
    const lng = ((Math.abs(hash >> 1) % 320) - 160);
    return { lat, lng };
}

// Helper: Normalize Stats
const normalizeStats = (rawNode: any, ip: string, port: string, isSeed: boolean) => {
    // Map v0.7.3 fields (root level) or v0.6.0 (nested stats)
    const stats = rawNode.stats || rawNode; 
    
    const totalStorage = stats.storage_committed ?? (100 * 1024 * 1024 * 1024); 
    const usedStorage = stats.storage_used ?? 0;

    const safeStats = {
        cpu_percent: parseFloat((stats.cpu_percent ?? 0).toFixed(2)),
        ram_used: stats.ram_used ?? 0,
        ram_total: stats.ram_total ?? (16 * 1024 * 1024 * 1024),
        uptime: stats.uptime ?? 0,
        packets_received: stats.packets_received ?? 0,
        packets_sent: stats.packets_sent ?? 0,
    };
    
    const safeMeta = {
        total_bytes: totalStorage,
        total_pages: Math.floor(usedStorage / 1024 / 1024)
    };

    // Fix: Handle rawNode.pubkey being undefined or empty
    const pubkey = rawNode.pubkey || `${ip}:${port}`;

    return {
      id: pubkey,
      rank: 0, 
      name: isSeed ? 'Local pNode (Seed)' : `Peer ${ip}`,
      pubkey: pubkey,
      version: rawNode.version ? rawNode.version.split('-')[0] : 'Unknown',
      ip: ip,
      status: 'Active',
      uptime: 100,
      latency: isSeed ? '1ms' : Math.floor(Math.random() * 80 + 20) + 'ms',
      stats: safeStats,
      metadata: safeMeta,
      geo: { lat: 0, lng: 0, country: 'Unknown' } 
    };
};

// --- SIMULATION DATA ---
const getFallbackResponse = (method: string) => {
  if (method === 'get-version') return { result: { version: '0.7.3 (Simulation)' } };
  
  if (method === 'get-pods-with-stats') return { 
      result: { 
          pods: [
              { address: '173.212.207.32:9001', pubkey: 'SimKeyDE', version: '0.7.3', storage_committed: 500e9, storage_used: 120e9, uptime: 50000 },
              { address: '142.250.190.46:9001', pubkey: 'SimKeyUS', version: '0.7.3', storage_committed: 1000e9, storage_used: 400e9, uptime: 12000 },
              { address: '13.235.100.20:9001', pubkey: 'SimKeyIN', version: '0.7.3', storage_committed: 250e9, storage_used: 50e9, uptime: 3000 },
              { address: '54.250.200.10:9001', pubkey: 'SimKeyJP', version: '0.7.3', storage_committed: 500e9, storage_used: 450e9, uptime: 90000 }
          ] 
      } 
  };
  return null;
};

export async function GET() {
  try {
      const seedUrl = new URL(SEED_NODE_URL);
      
      console.log(`📡 API: Connecting to ${SEED_NODE_URL}...`);

      // 1. FAST PATH
      const fastPathRes = await rpcRequest(seedUrl.hostname, seedUrl.port, 'get-pods-with-stats');
      
      let rawNodes = [];

      if (fastPathRes?.result?.pods) {
        console.log("API: Connected via Fast Path");
        rawNodes = fastPathRes.result.pods;
        
        // Add Local Node info manually
        const localVer = await rpcRequest(seedUrl.hostname, seedUrl.port, 'get-version');
        if (localVer?.result) {
             rawNodes.unshift({
                 address: '127.0.0.1:6000',
                 pubkey: 'Localhost',
                 version: localVer.result.version,
                 storage_committed: 100e9, 
                 storage_used: 0,
                 uptime: 0
             });
        }
      } else {
        console.warn("API: Connection failed/timeout. Using SIMULATION.");
        const simRes = getFallbackResponse('get-pods-with-stats');
        if (simRes) rawNodes = simRes.result.pods;
      }

      // 2. PROCESSING
      console.log(`API: Processing ${rawNodes.length} nodes...`);
      const uniqueNodesMap = new Map();

      // Limit concurrent Geo processing to avoid hanging
      const nodesToProcess = rawNodes.slice(0, 10); // Only process first 10 for speed

      const processedPromises = nodesToProcess.map(async (raw: any) => {
         let ip = raw.address ? raw.address.split(':')[0] : '127.0.0.1';
         const port = raw.rpc_port || '6000';
         
         // GEO-LOCATION
         let geo = null;
         if (ip === '127.0.0.1') {
             geo = { lat: 28.6, lng: 77.2, country: 'Local' };
         } else {
             const apiGeo = await getGeoLocation(ip);
             if (apiGeo) {
                 geo = { lat: apiGeo.lat, lng: apiGeo.lon, country: apiGeo.countryCode };
             } else {
                 const s = getStableGeo(ip);
                 geo = { lat: s.lat, lng: s.lng, country: 'Unknown' };
             }
         }
         
         // Simulation Hardcoded Geo
         if (raw.pubkey === 'SimKeyDE') geo = { lat: 51.16, lng: 10.45, country: 'DE' };
         if (raw.pubkey === 'SimKeyUS') geo = { lat: 37.09, lng: -95.71, country: 'US' };

         const norm = normalizeStats(raw, ip, port, raw.pubkey === 'Localhost');
         norm.geo = geo;
         
         return norm;
      });

      const processedNodes = await Promise.all(processedPromises);

      // DEDUPLICATION
      processedNodes.forEach(node => {
          if (!uniqueNodesMap.has(node.pubkey)) {
              uniqueNodesMap.set(node.pubkey, node);
          }
      });

      const finalNodesList = Array.from(uniqueNodesMap.values());
      finalNodesList.forEach((n: any, i) => n.rank = i + 1);

      // 3. AGGREGATE
      const totalStorageBytes = finalNodesList.reduce((acc: number, node: any) => acc + (node.metadata?.total_bytes || 0), 0);
      const avgCpu = 0; 

      const formatBytes = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      console.log("API: Done. Sending response.");

      return NextResponse.json({
        stats: {
          totalNodes: finalNodesList.length,
          activeNodes: finalNodesList.length,
          totalStorage: formatBytes(totalStorageBytes),
          avgCpu: 0
        },
        nodes: finalNodesList
      });
  } catch (error) {
      console.error("API CRITICAL ERROR:", error);
      // Fallback to empty so UI doesn't hang
      return NextResponse.json({
        stats: { totalNodes: 0, activeNodes: 0, totalStorage: '0 B', avgCpu: 0 },
        nodes: []
      });
  }
}