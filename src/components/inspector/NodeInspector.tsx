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
import { Activity, Server, Database, Cpu, Network } from "lucide-react";

interface NodeInspectorProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NodeInspector({ node, isOpen, onClose }: NodeInspectorProps) {
  if (!node) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* FIX: Added sm:max-w-md and w-[90vw] to ensure it fits on all screens */}
      <SheetContent className="w-[90vw] sm:max-w-md border-l border-border bg-card shadow-2xl overflow-hidden flex flex-col h-full">
        <SheetHeader className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              #{node.rank}
            </Badge>
            <Badge 
              className={node.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
            >
              {node.status}
            </Badge>
          </div>
          <SheetTitle className="text-xl font-bold truncate pr-4">{node.name}</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all text-muted-foreground">
            {node.pubkey}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pb-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Uptime</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {node.uptime.toFixed(1)}%
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Network className="h-4 w-4" />
                  <span className="text-xs">Latency</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {node.latency}
                </div>
              </div>
            </div>

            {/* Hardware Stats (From pRPC 'get_stats') */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Cpu className="h-4 w-4" /> System Resources
              </h3>
              <div className="rounded-lg border border-border bg-card p-3 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CPU Load</span>
                    <span className="font-mono font-medium">12%</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Memory</span>
                    <span className="font-mono font-medium">4.2 / 16 GB</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Disk Usage</span>
                    <span className="font-mono font-medium">1.1 TB</span>
                 </div>
              </div>
            </div>

            {/* Storage Info (From pRPC 'get_stats') */}
            <div className="space-y-3">
               <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Database className="h-4 w-4" /> Xandeum Storage
              </h3>
               <div className="rounded-lg border border-border bg-card p-3 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Capacity</span>
                    <span className="font-mono font-medium">10 TB</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pages Stored</span>
                    <span className="font-mono font-medium">1,240,592</span>
                 </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Server className="h-4 w-4" /> Network Info
              </h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Version</span>
                  <span className="font-mono text-foreground">{node.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>IP Address</span>
                  <span className="font-mono text-foreground">{node.ip}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>pRPC Port</span>
                  <span className="font-mono text-foreground">6000</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}