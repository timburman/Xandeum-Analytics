"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMemo } from "react";
import { Node } from "@/hooks/useNodes";

interface VersionDonutProps {
  nodes: Node[];
}

export default function VersionDonut({ nodes }: VersionDonutProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach(n => {
      // Clean up version string (e.g. "0.6.0-beta" -> "0.6.0")
      const v = n.version?.split('-')[0] || "Unknown";
      counts[v] = (counts[v] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name: `v${name}`, value }))
      .sort((a, b) => b.value - a.value); // Sort biggest first
  }, [nodes]);

  const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7'];

  if (nodes.length === 0) return <div className="h-40 flex items-center justify-center text-muted-foreground text-xs">No Data</div>;

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        Consensus Distribution
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.1)" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}