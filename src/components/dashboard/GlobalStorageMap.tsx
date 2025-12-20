"use client";

import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe } from "lucide-react";
import { NexusNode } from "@/hooks/useNodes";

// Helper: Convert Lat/Lng to CSS % (Standard Equirectangular Projection)
const geoToPct = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const y = ((90 - clampedLat) / 180) * 100;
  return { x, y };
};

const formatStorage = (bytes: number) => {
  if (bytes >= 1e15) return `${(bytes / 1e15).toFixed(1)} PB`;
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  return `${(bytes / 1e6).toFixed(0)} MB`;
};

interface GlobalStorageMapProps {
  nodes: NexusNode[];
}

export function GlobalStorageMap({ nodes }: GlobalStorageMapProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { mappedNodes, stats } = useMemo(() => {
    const mapped = nodes.map(node => {
      // Safety Fallback for missing geo data
      const lat = node.geo?.lat || 0;
      const lng = node.geo?.lng || 0;
      const { x, y } = geoToPct(lat, lng);
      return { ...node, x, y };
    });

    const totalStorage = nodes.reduce((acc, n) => acc + n.storage.committed, 0);
    const uniqueRegions = new Set(nodes.map(n => n.geo?.country || "Unknown")).size;

    return { 
      mappedNodes: mapped,
      stats: { totalStorage, uniqueRegions }
    };
  }, [nodes]);

  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col border border-border bg-card/50 backdrop-blur-sm relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Live Topology
          </h3>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted-foreground">Syncing</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 rounded-xl overflow-hidden border border-border/30 min-h-[300px] bg-black/20">
        
        {/* 1. Grid Background */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        {/* 2. YOUR SVG FILE (Loaded from public/world.svg) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50">
           {/* We use a standard img tag since it is in the public folder */}
           {/* "object-contain" ensures the whole world fits without being cut off */}
           <img 
             src="/world.svg" 
             alt="World Map" 
             className="w-full h-full object-contain filter grayscale invert opacity-40" 
           />
        </div>

        {/* 3. Connectivity Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {mappedNodes.map((node, i) => {
            const target = mappedNodes[(i + 1) % mappedNodes.length];
            if (!target || mappedNodes.length < 2) return null;

            return (
               <line
                  key={`line-${i}`}
                  x1={`${node.x}%`} y1={`${node.y}%`}
                  x2={`${target.x}%`} y2={`${target.y}%`}
                  stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.15"
               />
            );
          })}
        </svg>

        {/* 4. The Nodes */}
        {mappedNodes.map((node) => (
          <Tooltip key={node.id}>
            <TooltipTrigger asChild>
              <button
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-20"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Ping Ring */}
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping 
                  ${node.status === "Active" ? "bg-primary" : "bg-accent"}`} 
                />
                
                {/* Node Dot */}
                <div
                  className={`relative rounded-full transition-all duration-300 shadow-lg border border-background/50
                    ${hoveredNode === node.id ? "scale-150 z-50 bg-white" : "scale-100"} 
                    ${node.status === "Active" ? "bg-primary shadow-primary/40" : "bg-accent shadow-accent/40"}
                  `}
                  style={{
                    width: Math.max(8, Math.min(16, (node.storage.committed / 1e11) * 2)), 
                    height: Math.max(8, Math.min(16, (node.storage.committed / 1e11) * 2)),
                  }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover/95 border-border text-xs backdrop-blur-md z-50">
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2">
                   <span className={`h-1.5 w-1.5 rounded-full ${node.status === 'Active' ? 'bg-primary' : 'bg-accent'}`} />
                   {node.geo?.country || "Unknown"}
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-muted-foreground">
                   <span>Store: {formatStorage(node.storage.committed)}</span>
                   <span>IP: {node.ip}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4 z-10">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{nodes.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Active Peers</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stats.uniqueRegions}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Zones</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {formatStorage(stats.totalStorage)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Capacity</p>
        </div>
      </div>
    </div>
  );
};