"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// Basic world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface NodeMapProps {
  nodes: any[];
}

export default function NodeMap({ nodes }: NodeMapProps) {
  const markers = useMemo(() => {
    return nodes
      .filter(n => n.geo && n.geo.lat !== undefined)
      .map(n => ({
        name: n.name,
        coordinates: [n.geo.lng, n.geo.lat],
        status: n.status
      }));
  }, [nodes]);

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-0 h-[400px] flex flex-col relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="font-semibold text-lg drop-shadow-md">Network Topology</h3>
        <p className="text-xs text-muted-foreground drop-shadow-md">
          {markers.length} Active pNodes
        </p>
      </div>

      <div className="flex-1 w-full h-full bg-blue-950/20">
        <ComposableMap
          projection="geoMercator"
          // INCREASED SCALE to fill more space
          projectionConfig={{ scale: 140 }}
          // FORCE FULL WIDTH/HEIGHT
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  // DARKER MAP COLORS for contrast
                  fill="hsl(var(--secondary))"
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(var(--primary))", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((marker, i) => (
            <Marker key={i} coordinates={marker.coordinates as [number, number]}>
              {/* Larger, glowing dots */}
              <circle r={8} fill="hsl(var(--primary) / 0.3)" />
              <circle r={4} fill="hsl(var(--primary))" />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}