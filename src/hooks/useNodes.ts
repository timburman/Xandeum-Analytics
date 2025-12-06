import { useQuery } from '@tanstack/react-query';
import { fetchNodes, fetchNetworkStats, fetchNodeById } from '@/services/mockData';

const REFRESH_INTERVAL = 30000; // 30 seconds

export const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: fetchNodes,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL - 5000,
  });
};

export const useNetworkStats = () => {
  return useQuery({
    queryKey: ['networkStats'],
    queryFn: fetchNetworkStats,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: REFRESH_INTERVAL - 5000,
  });
};

export const useNode = (id: string | null) => {
  return useQuery({
    queryKey: ['node', id],
    queryFn: () => (id ? fetchNodeById(id) : null),
    enabled: !!id,
    refetchInterval: REFRESH_INTERVAL,
  });
};
