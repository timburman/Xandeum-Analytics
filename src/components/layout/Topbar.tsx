"use client";

import { Button } from "@/components/ui/button";
import { Wallet, Activity, Server, Database, Zap } from "lucide-react";
import { useNodes } from "@/hooks/useNodes"; // Import the hook
import { useState, useEffect } from "react";

export const Topbar = () => {
  const { stats: realStats } = useNodes();
  const [tps, setTps] = useState(2400);

  // Simulate live TPS fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setTps(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Map Real Data to the UI Config
  const stats = [
    { 
        label: "TPS", 
        value: tps.toLocaleString(), 
        icon: Zap 
    },
    { 
        label: "Active Nodes", 
        value: realStats.activeNodes.toLocaleString(), 
        icon: Server 
    },
    { 
        label: "Storage", 
        value: realStats.totalStorage, 
        icon: Database 
    },
    { 
        label: "Epoch", 
        value: "428", // Static for now
        icon: Activity 
    },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="flex h-full items-center justify-between px-6">
        
        {/* Global Stats Ticker */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 min-w-max">
              <stat.icon className="h-4 w-4 text-primary animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet Connect */}
        <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow-primary/20">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
};

export default Topbar;