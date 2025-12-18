"use client";

import { useState, useEffect } from 'react';

// 1. Define the Shape required by the new Nexus UI
export interface NexusNode {
  id: string;
  rank: number;
  name: string;
  pubkey: string;
  version: string;
  ip: string;
  status: 'Active' | 'Jailed' | 'Syncing';
  reputationScore: number; // 0-100
  storage: {
    committed: number; // Bytes
    used: number; // Bytes
    load: number; // %
  };
  geo: { lat: number; lng: number; country: string };
  isAlphaReady: boolean; // Badge logic
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

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/nodes'); // Calls our Next.js Crawler
      const data = await res.json();
      
      if (data.nodes) {
        // 2. Transform Backend Data -> Nexus UI Format
        const nexusNodes = data.nodes.map((n: any, i: number) => {
          // Safety checks for storage numbers
          const total = n.metadata?.total_bytes || 100 * 1024 * 1024 * 1024; // Default 100GB
          const used = (n.metadata?.total_pages || 0) * 1024 * 1024; // Approx 1MB per page
          const load = (used / total) * 100;
          
          // Reputation Calculation (The "Staking Logic")
          let score = 50; // Base Score
          
          // Version Bonus (30pts)
          if (n.version?.startsWith('0.7.3')) score += 30;
          else if (n.version?.startsWith('0.7')) score += 15;
          
          // Uptime Bonus (20pts) - Mock logic if uptime is raw seconds
          if (n.uptime > 50000) score += 20;
          
          // Storage Bonus (Whale Factor)
          if (total > 500 * 1024 * 1024 * 1024) score += 10; // >500GB

          return {
            id: n.pubkey,
            rank: i + 1,
            name: n.name,
            pubkey: n.pubkey,
            version: n.version,
            ip: n.ip,
            status: n.status === 'Active' ? 'Active' : 'Syncing',
            reputationScore: Math.min(score, 100),
            storage: { 
                committed: total, 
                used: used, 
                load: load 
            },
            geo: n.geo || { lat: 0, lng: 0, country: 'Unknown' },
            isAlphaReady: n.version?.startsWith('0.7.3'), // Airdrop Badge Criteria
            uptime: n.uptime
          };
        });

        setNodes(nexusNodes);
        
        // Calculate Aggregates
        const avgRep = nexusNodes.reduce((acc: number, curr: NexusNode) => acc + curr.reputationScore, 0) / (nexusNodes.length || 1);
        
        setStats({
            totalStorage: data.stats.totalStorage,
            activeNodes: data.nodes.length,
            avgReputation: Math.round(avgRep)
        });
      }
    } catch (e) {
      console.error("Failed to fetch nodes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNodes, 30000);
    return () => clearInterval(interval);
  }, []);

  return { nodes, stats, loading, refresh: fetchNodes };
};