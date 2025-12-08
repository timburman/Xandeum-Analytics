"use client";

import { useState } from "react"; // Import useState
import { useNodes, Node } from "@/hooks/useNodes"; 
import Header from "@/components/layout/Header";
import StatsGrid from "@/components/stats/StatsGrid";
import NodeMap from "@/components/map/NodeMap";
import NodeTable from "@/components/table/NodeTable";
import NodeInspector from "@/components/inspector/NodeInspector"; // Import the new Inspector
import LiveTerminal from "@/components/terminal/LiveTerminal";

export default function Dashboard() {
  const { nodes, stats, logs, isLoading, refetch } = useNodes();
  
  // State for the selected node
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onRefresh={refetch} isRefreshing={isLoading} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StatsGrid stats={stats} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="lg:col-span-2">
            <NodeMap nodes={nodes} />
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm h-full flex flex-col justify-center">
              <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Network Health
              </h3>
              <LiveTerminal logs={logs}/>
              <div className="space-y-6">
                {/* Status Row */}
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Global Status</span>
                  <span className="text-green-500 font-medium bg-green-500/10 px-3 py-1 rounded-full text-xs">
                    OPERATIONAL
                  </span>
                </div>

                {/* Nodes Row */}
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Total Peers</span>
                  <span className="font-mono text-xl font-bold">{nodes.length}</span>
                </div>

                {/* Storage Row (Replaces Epoch) */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-mono font-medium text-foreground">
                      {stats.totalStorage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <h2 className="text-2xl font-bold mb-4">Node Explorer</h2>
          {/* Pass the handler to the table */}
          <NodeTable nodes={nodes} onNodeSelect={setSelectedNode} />
        </section>

        {/* Render the Inspector */}
        <NodeInspector 
          node={selectedNode} 
          isOpen={!!selectedNode} 
          onClose={() => setSelectedNode(null)} 
        />
      </main>
    </div>
  );
}