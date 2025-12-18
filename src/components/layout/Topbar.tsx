import { Button } from "@/components/ui/button";
import { Wallet, Activity, Server, Database, Zap } from "lucide-react";

const stats = [
  { label: "TPS", value: "2,847", icon: Zap },
  { label: "Active Nodes", value: "1,234", icon: Server },
  { label: "Storage", value: "847 PB", icon: Database },
  { label: "Epoch", value: "428", icon: Activity },
];

export const Topbar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-full items-center justify-between px-6">
        {/* Global Stats Ticker */}
        <div className="flex items-center gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-primary" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet Connect */}
        <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
};
