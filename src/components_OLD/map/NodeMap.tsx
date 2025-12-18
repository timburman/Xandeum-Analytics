"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

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
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="font-semibold text-lg drop-shadow-md">Network Topology</h3>
        <p className="text-xs text-muted-foreground drop-shadow-md">
          {markers.length} Active pNodes
        </p>
      </div>

      {/* Container must be relative and full size */}
      <div className="flex-1 w-full h-full bg-blue-950/20 absolute inset-0">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ 
            scale: 140, // Large scale to fill view
            center: [0, 20] // Center slightly north to fit layout
          }}
          // CRITICAL FIX: Force SVG to fill container completely
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
              <circle r={8} fill="hsl(var(--primary) / 0.3)" />
              <circle r={4} fill="hsl(var(--primary))" />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}