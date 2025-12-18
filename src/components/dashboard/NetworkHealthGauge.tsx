"use client";
import { useEffect, useState } from "react";

interface NetworkHealthGaugeProps {
  health: number;
}

export const NetworkHealthGauge = ({ health }: NetworkHealthGaugeProps) => {
  const [animatedHealth, setAnimatedHealth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedHealth(health), 100);
    return () => clearTimeout(timer);
  }, [health]);

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (animatedHealth / 100) * circumference;

  const getHealthColor = () => {
    if (health >= 80) return "text-secondary";
    if (health >= 50) return "text-primary";
    return "text-destructive";
  };

  const getHealthStatus = () => {
    if (health >= 80) return "Excellent";
    if (health >= 50) return "Moderate";
    return "Critical";
  };

  return (
    <div className="glass-card rounded-xl p-6 h-full">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">Network Health</h3>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          {/* Secondary track */}
          <circle
            cx="88"
            cy="88"
            r="70"
            fill="none"
            stroke="url(#healthGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(24, 85%, 55%)" />
              <stop offset="100%" stopColor="hsl(170, 55%, 40%)" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            {animatedHealth}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{getHealthStatus()}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
          <span className="text-xs text-muted-foreground">Avg Latency</span>
          <span className="text-sm font-semibold text-foreground">24ms</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
          <span className="text-xs text-muted-foreground">Uptime</span>
          <span className="text-sm font-semibold text-secondary">99.9%</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
          <span className="text-xs text-muted-foreground">Finality</span>
          <span className="text-sm font-semibold text-foreground">400ms</span>
        </div>
      </div>
    </div>
  );
};
