"use client";

import { useState, useEffect } from "react";


export interface PNodeStats {
  cpu_percent: number;
  ram_used: number;
  ram_total: number;
  uptime: number;
  packets_received: number;
  packets_sent: number;
  active_streams: number;
}

export interface PNodeMetaData {
  total_bytes: number;
  total_pages: number;
  last_updated: number;
}

export interface Node {
  id: string;
  rank: number;
  name: string;
  pubkey: string;
  version: string;
  ip: string;
  status: 'Active' | 'Unreachable';
  lastseen?: string;
  uptime: number;
  latency: string;
  stats?: PNodeStats;
  metadata?: PNodeMetaData;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  totalStorage: string;
  avgCpu: number;
}

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [stats, setStats] = useState<NetworkStats>({
    totalNodes: 0,
    activeNodes: 0,
    totalStorage: '0 GB',
    avgCpu: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchNodes = async () => {
    try {
      const response = await fetch('/api/nodes');
      const data = await response.json();
      
      if (data.nodes) {
        setNodes(data.nodes);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch pNode data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 10000); // Poll every 10s (Realtime!)
    return () => clearInterval(interval);
  }, []);

  return { nodes, stats, isLoading, refetch: fetchNodes };
};