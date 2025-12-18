"use client";

import { useNodes } from "@/hooks/useNodes";
import {DashboardLayout} from "@/components/layout/DashboardLayout";
import NodeList from "@/components/nodes/NodeList";

export default function NodesPage() {
  const { nodes, loading } = useNodes();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Node Explorer
          </h1>
          <p className="text-muted-foreground">
            Search, filter, and inspect all {nodes.length} active validators on the network.
          </p>
        </div>

        {/* The Full List */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden p-6">
           {loading ? (
             <div className="text-center py-20 text-muted-foreground">Loading network topology...</div>
           ) : (
             <NodeList nodes={nodes} />
           )}
        </div>

      </div>
    </DashboardLayout>
  );
}