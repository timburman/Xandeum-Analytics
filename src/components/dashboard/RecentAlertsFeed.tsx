import { Server, AlertTriangle, CheckCircle, ArrowUpCircle, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "join" | "warning" | "success" | "upgrade";
  message: string;
  time: string;
}

const mockAlerts: Alert[] = [
  { id: "1", type: "join", message: "New node joined from EU-Central", time: "2m ago" },
  { id: "2", type: "success", message: "Epoch 428 finalized successfully", time: "5m ago" },
  { id: "3", type: "upgrade", message: "Node xand...7f2k upgraded to v2.4.1", time: "12m ago" },
  { id: "4", type: "warning", message: "High latency detected in AS-East", time: "18m ago" },
  { id: "5", type: "join", message: "New validator staked 50,000 XAND", time: "25m ago" },
  { id: "6", type: "success", message: "Storage rebalancing completed", time: "32m ago" },
  { id: "7", type: "join", message: "New node joined from US-West", time: "45m ago" },
  { id: "8", type: "upgrade", message: "Protocol upgrade activated", time: "1h ago" },
];

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "join":
      return <Server className="h-4 w-4 text-primary" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-primary" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-secondary" />;
    case "upgrade":
      return <ArrowUpCircle className="h-4 w-4 text-info" />;
  }
};

const getAlertAccent = (type: Alert["type"]) => {
  switch (type) {
    case "join":
      return "border-l-primary";
    case "warning":
      return "border-l-primary";
    case "success":
      return "border-l-secondary";
    case "upgrade":
      return "border-l-info";
  }
};

export const RecentAlertsFeed = () => {
  return (
    <div className="glass-card rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="text-xs text-secondary font-medium">Live</span>
        </div>
      </div>

      <ScrollArea className="h-[360px] pr-2">
        <div className="space-y-2">
          {mockAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg bg-muted/20 border-l-2 ${getAlertAccent(alert.type)} animate-slide-up hover:bg-muted/30 transition-colors`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mt-0.5 p-1.5 rounded-md bg-muted/50">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
