import { cn } from "@/lib/utils";

type NodeStatus = "active" | "jailed" | "syncing";

interface NodeStatusBadgeProps {
  status: NodeStatus;
  className?: string;
}

const statusConfig: Record<NodeStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-success/20 text-success border-success/30",
  },
  jailed: {
    label: "Jailed",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  syncing: {
    label: "Syncing",
    className: "bg-warning/20 text-warning border-warning/30",
  },
};

export const NodeStatusBadge = ({ status, className }: NodeStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-glow" />
      {config.label}
    </span>
  );
};
