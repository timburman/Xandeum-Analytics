import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node } from "@/hooks/useNodes";
import { Activity, Server, Database, Cpu, Network, HardDrive } from "lucide-react";
import { MetricChart } from "./MetricChart";

interface NodeInspectorProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
}


const formatRam = (bytes: number) => {
  if (!bytes) return '0 GB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

export default function NodeInspector({ node, isOpen, onClose }: NodeInspectorProps) {
  if (!node) return null;

  const stats = node.stats || {};
  const meta = node.metadata || {};

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-md border-l border-border bg-card shadow-2xl overflow-hidden flex flex-col h-full">
        <SheetHeader className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">#{node.rank}</Badge>
            <Badge className={node.status === 'Active' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
              {node.status}
            </Badge>
          </div>
          <SheetTitle className="text-xl font-bold truncate pr-4">{node.name}</SheetTitle>
          <SheetDescription className="font-mono text-xs text-muted-foreground">
            {node.ip} • v{node.version}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-10">
            
            {/* 1. VISUAL CHARTS (The new feature) */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Cpu className="h-4 w-4" /> Live Performance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* CPU CHART */}
                <div className="p-3 rounded-lg border border-border bg-card overflow-hidden relative">
                  <div className="absolute top-3 right-3 z-10 font-mono font-bold text-xl">
                    {stats.cpu_percent ?? 0}%
                  </div>
                  <MetricChart 
                    label="CPU Load" 
                    currentValue={stats.cpu_percent ?? 0} 
                    color="#f59e0b" // Amber color
                  />
                </div>

                {/* RAM CHART */}
                <div className="p-3 rounded-lg border border-border bg-card overflow-hidden relative">
                   <div className="absolute top-3 right-3 z-10 font-mono font-bold text-lg">
                    {formatRam(stats.ram_used)}
                   </div>
                   <MetricChart 
                    label="RAM Usage" 
                    currentValue={(stats.ram_used ?? 0) / (1024 * 1024 * 1024)} 
                    color="#3b82f6" // Blue color
                  />
                </div>
              </div>
            </div>

            {/* 2. Storage Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Database className="h-4 w-4" /> Xandeum Storage
              </h3>
              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Pages</span>
                    <Badge variant="secondary" className="font-mono">
                      {meta.total_pages?.toLocaleString() || '0'}
                    </Badge>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="font-mono font-medium">
                       {/* You can define formatBytes helper here or import it */}
                       {(meta.total_bytes / (1024*1024*1024)).toFixed(2)} GB
                    </span>
                 </div>
              </div>
            </div>

            {/* 3. Network Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Network className="h-4 w-4" /> Network Traffic
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <span className="text-xs text-muted-foreground">Packets In</span>
                    <div className="font-mono font-medium mt-1">
                       {stats.packets_received?.toLocaleString() || 0}
                    </div>
                 </div>
                 <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <span className="text-xs text-muted-foreground">Packets Out</span>
                    <div className="font-mono font-medium mt-1">
                       {stats.packets_sent?.toLocaleString() || 0}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}