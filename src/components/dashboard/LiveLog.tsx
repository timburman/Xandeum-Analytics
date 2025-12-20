"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, RefreshCw } from "lucide-react";

interface LiveLogProps {
  logs: string[];
}

export default function LiveLog({ logs }: LiveLogProps) {
  return (
    <div className="h-full flex flex-col glass-card border border-border bg-black/40 backdrop-blur-md rounded-xl overflow-hidden min-h-0">
      
      {/* Header */}
      <div className="p-3 border-b border-border/50 bg-secondary/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <Terminal className="h-4 w-4 text-primary" />
           <span className="text-xs font-mono font-semibold text-primary uppercase">Live Crawler</span>
        </div>
        <RefreshCw className="h-3 w-3 text-muted-foreground animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      {/* Log Area - Crucial: flex-1 and min-h-0 prevents expansion */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 scrollbar-hide">
          {logs.map((log, i) => (
            <div key={i} className="text-muted-foreground/80 border-l-2 border-transparent hover:border-primary pl-2 transition-all truncate">
              <span className="text-secondary opacity-50 mr-2">{">"}</span>
              {log}
            </div>
          ))}
          {logs.length === 0 && <span className="text-muted-foreground animate-pulse">Initializing feed...</span>}
        </div>
      </div>
    </div>
  );
}