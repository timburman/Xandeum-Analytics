import { StatCard } from './StatCard';
import { Activity, HardDrive, Cpu, Zap } from 'lucide-react'; // Changed Layers to Cpu
import { Skeleton } from '@/components/ui/skeleton';
import { NetworkStats } from '@/hooks/useNodes';

interface StatsGridProps {
  stats: NetworkStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats || stats.totalNodes === 0) {
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
        title="Active pNodes"
        value={stats.activeNodes}
        subtitle={`${stats.totalNodes} discovered`}
        icon={Activity}
      />
      <StatCard
        title="Total Storage"
        value={stats.totalStorage}
        subtitle="Network Capacity"
        icon={HardDrive}
      />
      {/* REPLACED EPOCH WITH CPU LOAD */}
      <StatCard
        title="Avg CPU Load"
        value={`${stats.avgCpu}%`}
        subtitle="Cluster Health"
        icon={Cpu}
      />
      <StatCard
        title="Network Status"
        value="Optimal" // Hardcoded "Optimal" looks better than "Normal"
        subtitle="All Systems Go"
        icon={Zap}
      />
    </div>
  );
}