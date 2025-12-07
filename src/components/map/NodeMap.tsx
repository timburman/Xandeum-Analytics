"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useNodes } from "@/hooks/useNodes";

// Basic world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface NodeMapProps {
  nodes: any[]; // Accepting the nodes passed from page.tsx
}

export function NodeMap({ nodes }: NodeMapProps) {
  // Filter only nodes that have valid coordinates
  const markers = useMemo(() => {
    return nodes
      .filter(n => n.geo && n.geo.lat !== undefined)
      .map(n => ({
        name: n.name,
        coordinates: [n.geo.lng, n.geo.lat], // D3 uses [lon, lat]
        status: n.status
      }));
  }, [nodes]);

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 h-[400px] flex flex-col relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="font-semibold text-lg">Network Topology</h3>
        <p className="text-xs text-muted-foreground">
          {markers.length} pNodes visualized
        </p>
      </div>

      <div className="flex-1 w-full h-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 100 }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(var(--secondary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(var(--secondary))", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((marker, i) => (
            <Marker key={i} coordinates={marker.coordinates as [number, number]}>
              <circle r={6} fill="hsl(var(--primary) / 0.3)" />
              <circle r={3} fill="hsl(var(--primary))" />
            </Marker>
          ))}
        </ComposableMap>
      </div>
      
      {/* Decorative overlay for "Cyberpunk" feel */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}