import { Server, Shield, HardDrive, Award, ChevronRight, Activity } from "lucide-react";

export interface NodeData {
  id: string;
  rank: number;
  pubkey: string;
  trustScore: number;
  storage: string;
  version: string;
  status: "active" | "jailed" | "syncing";
  region: string;
  badges: string[];
  uptime: number;
}

interface NodeCardProps {
  node: NodeData;
  onClick: (node: NodeData) => void;
}

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case "validator":
      return "🛡️";
    case "early":
      return "⭐";
    case "whale":
      return "🐋";
    case "reliable":
      return "✅";
    default:
      return "🏆";
  }
};

export const NodeCard = ({ node, onClick }: NodeCardProps) => {
  const isHealthy = node.trustScore > 80;
  const glowColor = node.status === "active" 
    ? "shadow-[0_0_10px_rgba(16,185,129,0.6)] bg-emerald-500" // Stronger Green
    : "shadow-none bg-amber-500";

  return (
    <div
      onClick={() => onClick(node)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card/50 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Top Row: Rank & Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="text-primary">#{node.rank}</span>
          <span>{node.pubkey.substring(0, 8)}...</span>
        </span>
        <div className="flex items-center gap-2">
          {/* The Glowing Dot */}
          <div className={`h-2.5 w-2.5 rounded-full ${glowColor} transition-all duration-500`} />
          <span className={`text-xs font-medium uppercase ${node.status === "active" ? "text-emerald-400" : "text-amber-400"}`}>
            {node.status}
          </span>
        </div>
      </div>

      {/* Middle: Score & Storage */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] uppercase text-muted-foreground font-semibold">Trust Score</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield className={`h-4 w-4 ${isHealthy ? "text-primary" : "text-amber-500"}`} />
            <span className="text-lg font-bold text-foreground">{node.trustScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground font-semibold">Storage</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Server className="h-4 w-4 text-secondary" />
            <span className="text-lg font-bold text-foreground">{node.storage}</span>
          </div>
        </div>
      </div>

      {/* Footer: Version & Region */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex gap-2">
          {node.badges.map((badge) => (
            <span key={badge} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          ))}
        </div>
        <span className="text-xs text-muted-foreground bg-secondary/10 px-2 py-1 rounded border border-secondary/20">
          {node.version}
        </span>
      </div>
    </div>
  );
};
