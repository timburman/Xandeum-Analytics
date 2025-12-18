import { Server, HardDrive, Activity, Tag } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  accentColor: "primary" | "secondary" | "accent"; // Added 'accent' for Orange support
}

const StatCard = ({ title, value, change, changeType, icon, accentColor }: StatCardProps) => {
  const changeColor = {
    positive: "text-emerald-400",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  const bgStyles = {
    primary: "bg-primary/10 text-primary shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]",
    secondary: "bg-secondary/10 text-secondary shadow-[0_0_15px_-3px_hsl(var(--secondary)/0.3)]",
    accent: "bg-accent/10 text-accent shadow-[0_0_15px_-3px_hsl(var(--accent)/0.3)]",
  }[accentColor];

  return (
    <div className="glass-card border border-border/50 bg-card/40 backdrop-blur-md rounded-xl p-5 group hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2 tracking-tight">{value}</p>
          <p className={`text-xs mt-1 font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${bgStyles}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface StatsCardsProps {
  totalStorage: string;
  activeNodes: number;
  avgScore: number;
}

export const StatsCards = ({ totalStorage, activeNodes, avgScore }: StatsCardsProps) => {
  // Calculate dynamic health status
  const healthStatus = avgScore > 80 ? "positive" : avgScore > 50 ? "neutral" : "negative";
  const healthText = avgScore > 80 ? "Optimal" : avgScore > 50 ? "Stable" : "Degraded";

  const stats: StatCardProps[] = [
    {
      title: "Active pNodes",
      value: activeNodes.toString(),
      change: "● Live Network",
      changeType: "positive",
      icon: <Server className="h-5 w-5" />,
      accentColor: "primary", // Teal
    },
    {
      title: "Committed Storage",
      value: totalStorage,
      change: "Verified Capacity",
      changeType: "positive",
      icon: <HardDrive className="h-5 w-5" />,
      accentColor: "secondary", // Purple
    },
    {
      title: "Network Score",
      value: `${avgScore}/100`,
      change: `Condition: ${healthText}`,
      changeType: healthStatus,
      icon: <Activity className="h-5 w-5" />,
      accentColor: "accent", // Orange (Critical Metric)
    },
    {
      title: "Target Version",
      value: "v0.7.3",
      change: "Alpha Ready",
      changeType: "neutral",
      icon: <Tag className="h-5 w-5" />,
      accentColor: "primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;