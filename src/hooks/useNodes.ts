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
  geo?: {
    lat: number;
    lng: number;
    country: string;
  };
}

export interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
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
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-49), { timestamp, message, type }]);
  };

  const fetchNodes = async () => {
    try {
      addLog("Starting crawl cycle...", 'info');
      addLog("Querying Seed Node: 127.0.0.1:6000", 'info');

      const response = await fetch('/api/nodes');
      const data = await response.json();
      
      if (data.nodes) {
        setNodes(data.nodes);
        setStats(data.stats);

        addLog(`Seed Node online (v${data.nodes[0]?.version})`, 'success');

        if (data.nodes.length > 1) {
            addLog(`Discovered ${data.nodes.length - 1} peers in gossip map`, 'success');
            data.nodes.slice(1).forEach((n: any) => {
                if (n.status === 'Active') {
                     addLog(`Peer ${n.ip} -> Active (Latency: ${n.latency})`, 'info');
                } else {
                     addLog(`Peer ${n.ip} -> Unreachable (Timeout)`, 'error');
                }
            });
        }
      }
    } catch (error) {
      addLog("Crawler agent connection failed", 'error');
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

  return { nodes, stats, logs, isLoading, refetch: fetchNodes };
};