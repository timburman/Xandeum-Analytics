"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface LiveTerminalProps {
  logs: Log[];
}

export default function LiveTerminal({ logs }: LiveTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className="rounded-xl border border-border bg-black/90 backdrop-blur-md h-[300px] flex flex-col overflow-hidden font-mono text-xs shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-green-500">
          <Terminal className="h-4 w-4" />
          <span className="font-semibold">pNode Crawler Log</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>

      {/* Logs Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1.5">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-muted-foreground opacity-50 shrink-0">[{log.timestamp}]</span>
              <span className={`${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-green-400' : 'text-blue-300'
              }`}>
                {log.type === 'success' && '✓ '}
                {log.type === 'error' && '✕ '}
                {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-muted-foreground italic opacity-50">Waiting for crawler agent...</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}