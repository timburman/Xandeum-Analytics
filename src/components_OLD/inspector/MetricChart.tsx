"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

interface MetricChartProps {
  currentValue: number;
  color?: string;
  label: string;
}

export function MetricChart({ currentValue, color = "#22c55e", label }: MetricChartProps) {
  // Generate "Fake History" that ends at the real current value
  // This creates a realistic looking curve for the demo
  const data = useMemo(() => {
    const points = 15;
    const history = [];
    let val = currentValue;
    
    // Work backwards from current value
    for (let i = 0; i < points; i++) {
      history.unshift({ i, value: Math.max(0, val) });
      // Random variance of +/- 5% for the previous point
      val = val + (Math.random() * 10 - 5); 
    }
    return history;
  }, [currentValue]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="h-[60px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['auto', 'auto']} hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${label})`}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}