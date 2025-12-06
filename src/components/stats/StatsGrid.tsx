import { StatCard } from './StatCard';
import { Activity, HardDrive, Layers, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
// Import the interface so TypeScript knows what "stats" looks like
import { NetworkStats } from '@/hooks/useNodes';

interface StatsGridProps {
  stats: NetworkStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  // If stats are empty/zero, we assume it's loading or initial state
  if (!stats || stats.totalNodes === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  // We interpret the data we have to fill the cards
  // Note: We estimate "Storage" based on node count for now since the RPC doesn't give a total yet.
  const estimatedStorage = (stats.totalNodes * 12.5).toFixed(1); 

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Nodes"
        value={stats.totalNodes}
        subtitle={`${stats.activeValidators} validators`}
        icon={Activity}
      />
      <StatCard
        title="Est. Network Storage"
        value={`${estimatedStorage} PB`}
        subtitle="Across all pNodes"
        icon={HardDrive}
      />
      <StatCard
        title="Current Epoch"
        value={stats.epoch}
        subtitle="Solana Epoch"
        icon={Layers}
      />
      <StatCard
        title="Network Status"
        value={stats.networkLoad || "Normal"}
        subtitle="Load Level"
        icon={Zap}
      />
    </div>
  );
}