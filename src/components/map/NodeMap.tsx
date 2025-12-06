import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNodes } from '@/hooks/useNodes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MAPBOX_TOKEN_KEY = 'xandeum_mapbox_token';

export const NodeMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [token, setToken] = useState(() => localStorage.getItem(MAPBOX_TOKEN_KEY) || '');
  const [isMapReady, setIsMapReady] = useState(false);
  const { data: nodes } = useNodes();

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem(MAPBOX_TOKEN_KEY, newToken);
  };

  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [20, 20],
        pitch: 20,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'hsl(220, 15%, 8%)',
          'high-color': 'hsl(220, 12%, 16%)',
          'horizon-blend': 0.1,
          'star-intensity': 0.15,
        });
        setIsMapReady(true);
      });

      // Slow rotation
      const secondsPerRevolution = 300;
      let userInteracting = false;

      const spinGlobe = () => {
        if (!map.current) return;
        const zoom = map.current.getZoom();
        if (!userInteracting && zoom < 3) {
          const distancePerSecond = 360 / secondsPerRevolution;
          const center = map.current.getCenter();
          center.lng -= distancePerSecond / 60;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      };

      map.current.on('mousedown', () => (userInteracting = true));
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      map.current.on('moveend', spinGlobe);

      const interval = setInterval(spinGlobe, 1000);

      return () => {
        clearInterval(interval);
        map.current?.remove();
        map.current = null;
        setIsMapReady(false);
      };
    } catch (error) {
      console.error('Map initialization failed:', error);
    }
  }, [token]);

  // Update markers when nodes change
  useEffect(() => {
    if (!map.current || !isMapReady || !nodes) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    nodes.forEach((node) => {
      const el = document.createElement('div');
      el.className = 'node-marker';
      el.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${node.status === 'active' ? 'hsl(145, 65%, 42%)' : 'hsl(0, 65%, 50%)'};
        box-shadow: 0 0 10px ${node.status === 'active' ? 'hsl(145, 65%, 42%)' : 'hsl(0, 65%, 50%)'};
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([node.longitude, node.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(`
            <div style="background: hsl(220, 14%, 10%); color: hsl(210, 20%, 92%); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${node.pubKey.slice(0, 8)}...${node.pubKey.slice(-4)}</div>
              <div style="color: hsl(220, 10%, 55%);">${node.country}</div>
              <div style="color: ${node.status === 'active' ? 'hsl(145, 65%, 42%)' : 'hsl(0, 65%, 50%)'}; margin-top: 4px;">
                ${node.status === 'active' ? '● Active' : '○ Delinquent'}
              </div>
            </div>
          `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [nodes, isMapReady]);

  if (!token) {
    return (
      <div className="relative w-full h-[400px] rounded-lg border border-border bg-card flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h3 className="text-lg font-medium text-foreground mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token to display the interactive globe.
            Get one free at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg border border-border overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          Active
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive" />
          Delinquent
        </div>
      </div>
    </div>
  );
};
