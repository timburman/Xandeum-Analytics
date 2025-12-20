"use client";

import { Activity } from "lucide-react";

interface NetworkHealthGaugeProps {
  score: number;
}

export default function NetworkHealthGauge({ score }: NetworkHealthGaugeProps) {
  // SVG Math for a semi-circle gauge
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Color Logic
  const color = score > 80 ? "#10b981" : score > 50 ? "#f59e0b" : "#ef4444";
  const text = score > 80 ? "Optimal" : score > 50 ? "Stable" : "Degraded";

  return (
    <div className="h-full glass-card border border-border bg-card/50 backdrop-blur-md rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Header */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
         <Activity className="h-4 w-4" style={{ color }} />
         <span className="text-xs font-semibold uppercase text-muted-foreground">Network Health</span>
      </div>

      {/* The Gauge */}
      <div className="relative h-40 w-40 flex items-center justify-center mt-4">
        <svg className="transform -rotate-90 w-full h-full">
          {/* Track */}
          <circle
            cx="80" cy="80" r="70"
            stroke="currentColor" strokeWidth="12" fill="transparent"
            className="text-secondary/20"
          />
          {/* Indicator */}
          <circle
            cx="80" cy="80" r="70"
            stroke={color} strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{score}</span>
          <span className="text-sm font-medium" style={{ color }}>{text}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
         <p className="text-xs text-muted-foreground">Consensus Consistency</p>
      </div>
    </div>
  );
}