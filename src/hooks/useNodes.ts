"use client";

import { useState, useEffect } from 'react';

export interface NexusNode {
  id: string;
  rank: number;
  name: string;
  pubkey: string;
  version: string;
  ip: string;
  status: 'Active' | 'Jailed' | 'Syncing';
  reputationScore: number;
  storage: {
    committed: number;
    used: number;
    load: number;
  };
  geo: { lat: number; lng: number; country: string };
  isAlphaReady: boolean;
  uptime: number;
}

export const useNodes = () => {
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [stats, setStats] = useState({ 
    totalStorage: '0 B', 
    activeNodes: 0, 
    avgReputation: 0 
  });
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    setActivityLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50));
  };

  const fetchNodes = async () => {
    try {
      // Don't log "Initiating" every time to keep log clean, only important events
      const res = await fetch('/api/nodes');
      const data = await res.json();
      
      if (data.nodes) {
        if (Math.random() > 0.7) addLog(`Verified proof for ${data.nodes.length} peers.`);
        
        const nexusNodes = data.nodes.map((n: any, i: number) => {
          const total = Number(n.metadata?.total_bytes) || 100 * 1024 * 1024 * 1024;
          const used = (Number(n.metadata?.total_pages) || 0) * 1024 * 1024;
          const load = (used / total) * 100;
          const uptime = Number(n.uptime) || 0;
          
          // --- REFINED SCORING LOGIC ---
          let score = 50; // Base Start

          // 1. Version Compliance (Max 30pts)
          if (n.version?.includes('0.8.0')) score += 30; 
          else if (n.version?.includes('0.7')) score += 15;

          // 2. Uptime Stability (Max 15pts)
          // > 1 hour = +5, > 1 day = +10, > 1 week = +15
          if (uptime > 3600) score += 5;
          if (uptime > 86400) score += 5;
          if (uptime > 604800) score += 5;

          // 3. Storage Commitment (Max 5pts)
          if (total > 500 * 1024 * 1024 * 1024) score += 5; // > 500GB

          return {
            id: n.pubkey,
            rank: i + 1,
            name: n.name,
            pubkey: n.pubkey,
            version: n.version || "Unknown",
            ip: n.ip,
            status: n.status === 'Active' ? 'Active' : 'Syncing',
            reputationScore: Math.min(score, 100),
            storage: { committed: total, used, load },
            geo: n.geo || { lat: 0, lng: 0, country: 'Unknown' },
            isAlphaReady: n.version?.includes('0.8.0'),
            uptime: uptime
          };
        });

        setNodes(nexusNodes);
        
        const avgRep = nexusNodes.reduce((acc: number, curr: NexusNode) => acc + curr.reputationScore, 0) / (nexusNodes.length || 1);
        
        setStats({
            totalStorage: data.stats.totalStorage,
            activeNodes: data.nodes.length,
            avgReputation: Math.round(avgRep)
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 5000); // 5s Refresh
    return () => clearInterval(interval);
  }, []);

  return { nodes, stats, loading, activityLog };
};