"use client";

import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe } from "lucide-react";
import { NexusNode } from "@/hooks/useNodes";

// Helper: Convert Lat/Lng to CSS % (Equirectangular Projection)
const geoToPct = (lat: number, lng: number) => {
  // Longitude: -180 to 180 -> 0% to 100%
  const x = ((lng + 180) / 360) * 100;
  // Latitude: 90 to -90 -> 0% to 100%
  // We clamp lat to -85/85 to avoid pins flying off top/bottom
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const y = ((90 - clampedLat) / 180) * 100;
  return { x, y };
};

// Helper: Format Bytes
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

  // Memoize calculations to prevent lag on re-renders
  const { mappedNodes, stats } = useMemo(() => {
    // 1. Map nodes to X/Y coordinates
    const mapped = nodes.map(node => {
      const { x, y } = geoToPct(node.geo.lat, node.geo.lng);
      return { ...node, x, y };
    });

    // 2. Calculate Aggregate Stats
    const totalStorage = nodes.reduce((acc, n) => acc + n.storage.committed, 0);
    const uniqueRegions = new Set(nodes.map(n => n.geo.country)).size;

    return { 
      mappedNodes: mapped,
      stats: { totalStorage, uniqueRegions }
    };
  }, [nodes]);

  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col border border-border bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
      <div className="relative flex-1 bg-muted/20 rounded-xl overflow-hidden border border-border/30 min-h-[300px]">
        
        {/* 1. Dot Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />

        {/* 2. World Map Outline (Optional SVG, or just abstract grid) */}
        {/* For this style, the abstract grid is cleaner, but you can add a world.svg bg here if desired */}

        {/* 3. Connectivity Lines (Top 5 Nodes) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {mappedNodes.slice(0, 5).map((node, i) => {
            const nextNode = mappedNodes[(i + 1) % 5];
            if (!nextNode) return null;
            return (
              <line
                key={`line-${i}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="4 4"
              />
            );
          })}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>

        {/* 4. The Nodes */}
        {mappedNodes.map((node) => (
          <Tooltip key={node.id}>
            <TooltipTrigger asChild>
              <button
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-10"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Ping Animation Ring */}
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping 
                  ${node.status === "Active" ? "bg-primary" : "bg-accent"}`} 
                  style={{ width: '150%', height: '150%', left: '-25%', top: '-25%' }}
                />
                
                {/* The Node Dot */}
                <div
                  className={`relative rounded-full transition-all duration-300 shadow-lg border border-background
                    ${hoveredNode === node.id ? "scale-150 z-50" : "scale-100"} 
                    ${node.status === "Active" ? "bg-primary shadow-primary/50" : "bg-accent shadow-accent/50"}
                  `}
                  style={{
                    width: Math.max(8, Math.min(24, (node.storage.committed / 1e11) * 2)), // Size dynamic based on storage (min 8px, max 24px)
                    height: Math.max(8, Math.min(24, (node.storage.committed / 1e11) * 2)),
                  }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover/95 border-border text-xs backdrop-blur-md">
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2">
                   <span className={`h-2 w-2 rounded-full ${node.status === 'Active' ? 'bg-primary' : 'bg-accent'}`} />
                   {node.geo.country || "Unknown Region"}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
                  <span>IP:</span> <span className="text-foreground font-mono">{node.ip}</span>
                  <span>Store:</span> <span className="text-foreground">{formatStorage(node.storage.committed)}</span>
                  <span>Ver:</span> <span className="text-foreground">{node.version}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{nodes.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Nodes</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stats.uniqueRegions}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Regions</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {formatStorage(stats.totalStorage)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Storage</p>
        </div>
      </div>
    </div>
  );
};