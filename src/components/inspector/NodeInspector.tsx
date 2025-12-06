import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node } from "@/hooks/useNodes";
import { Activity, Server, Clock, Shield } from "lucide-react";

interface NodeInspectorProps {
  node: Node | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NodeInspector({ node, isOpen, onClose }: NodeInspectorProps) {
  if (!node) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-card">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">
              {node.rank ? `#${node.rank}` : 'Unknown'}
            </Badge>
            <Badge 
              className={node.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
            >
              {node.status}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-bold">{node.name}</SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">
            {node.pubkey}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Uptime</span>
                </div>
                <div className="text-xl font-bold">{node.uptime.toFixed(1)}%</div>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Server className="h-4 w-4" />
                  <span className="text-xs">Latency</span>
                </div>
                <div className="text-xl font-bold">{node.latency}</div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" /> Technical Details
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">{node.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-mono">{node.ip}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Gossip Port</span>
                  <span className="font-mono">8001 (Default)</span>
                </div>
              </div>
            </div>

            {/* Developer Raw Data */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" /> Raw Gossip Data
              </h3>
              <div className="p-4 rounded-lg bg-black/50 border border-border font-mono text-[10px] text-muted-foreground overflow-x-auto">
                <pre>{JSON.stringify(node, null, 2)}</pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}