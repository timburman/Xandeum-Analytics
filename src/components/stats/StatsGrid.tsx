import { useNetworkStats } from '@/hooks/useNodes';
import { StatCard } from './StatCard';
import { Activity, HardDrive, Layers, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const StatsGrid = () => {
  const { data: stats, isLoading } = useNetworkStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Nodes"
        value={stats?.totalActiveNodes ?? 0}
        subtitle={`of ${stats?.totalNodes ?? 0} total`}
        icon={Activity}
      />
      <StatCard
        title="Network Storage"
        value={`${(stats?.totalStorage ?? 0).toFixed(1)} TB`}
        subtitle="Total capacity"
        icon={HardDrive}
      />
      <StatCard
        title="Current Epoch"
        value={stats?.currentEpoch ?? 0}
        subtitle={`Block #${(stats?.blockHeight ?? 0).toLocaleString()}`}
        icon={Layers}
      />
      <StatCard
        title="Avg Latency"
        value={`${(stats?.averageLatency ?? 0).toFixed(0)} ms`}
        subtitle="Network average"
        icon={Zap}
      />
    </div>
  );
};
