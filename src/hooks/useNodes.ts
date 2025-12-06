"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export interface Node {
  id: string;
  rank: number;
  name: string;
  pubkey: string;
  version: string;
  ip: string;
  status: 'Active' | 'Standby' | 'Offline';
  uptime: number;
  latency: string;
}

export interface NetworkStats {
  totalNodes: number;
  activeValidators: number;
  networkLoad: string;
  epoch: number;
}

export const useNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [stats, setStats] = useState<NetworkStats>({
    totalNodes: 0,
    activeValidators: 0,
    networkLoad: '-',
    epoch: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchNodes = async () => {
    try {
      const response = await fetch('/api/nodes');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setNodes(data.nodes || []);
      setStats(data.stats || { totalNodes: 0, activeValidators: 0, networkLoad: '-', epoch: 0 });
    } catch (error) {
      console.error('Error fetching nodes:', error);
      // toast.error("Failed to refresh network data"); // Uncomment if you have sonner
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { nodes, stats, isLoading, refetch: fetchNodes };
};