import { Server, Shield, HardDrive, Award, ChevronRight } from "lucide-react";
import { NodeStatusBadge } from "./NodeStatusBadge";
import { cn } from "@/lib/utils";

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
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <button
      onClick={() => onClick(node)}
      className={cn(
        "group relative w-full text-left transition-all duration-200",
        "glass-card rounded-xl p-5 hover:border-primary/40"
      )}
    >
      {/* Rank badge */}
      <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">#{node.rank}</span>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center">
            <Server className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-mono text-sm text-foreground truncate max-w-[140px]">
              {node.pubkey.slice(0, 8)}...{node.pubkey.slice(-6)}
            </p>
            <p className="text-xs text-muted-foreground">{node.region}</p>
          </div>
        </div>
        <NodeStatusBadge status={node.status} />
      </div>

      {/* Trust Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Trust Score
          </span>
          <span className={cn("text-lg font-bold", getScoreColor(node.trustScore))}>
            {node.trustScore}
          </span>
        </div>
        <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              node.trustScore >= 90 ? "bg-success" : node.trustScore >= 70 ? "bg-warning" : "bg-destructive"
            )}
            style={{ width: `${node.trustScore}%` }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2 rounded-lg bg-muted/20">
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <HardDrive className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider">Storage</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{node.storage}</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/20">
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Award className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider">Version</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{node.version}</p>
        </div>
      </div>

      {/* Badges */}
      {node.badges.length > 0 && (
        <div className="flex items-center gap-2">
          {node.badges.map((badge) => (
            <span
              key={badge}
              className="text-sm"
              title={badge}
            >
              {getBadgeIcon(badge)}
            </span>
          ))}
        </div>
      )}

      {/* Hover indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-5 w-5 text-primary" />
      </div>
    </button>
  );
};
