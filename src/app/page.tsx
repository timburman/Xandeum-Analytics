"use client";

import { useState } from "react"; // Import useState
import { useNodes, Node } from "@/hooks/useNodes"; 
import Header from "@/components/layout/Header";
import StatsGrid from "@/components/stats/StatsGrid";
import {NodeMap} from "@/components/map/NodeMap";
import NodeTable from "@/components/table/NodeTable";
import NodeInspector from "@/components/inspector/NodeInspector"; // Import the new Inspector

export default function Dashboard() {
  const { nodes, stats, isLoading, refetch } = useNodes();
  
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
             <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm h-full">
                <h3 className="font-semibold mb-4 text-lg">Network Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-500 font-medium flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      {stats.networkLoad || 'Operational'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">P-Nodes Online</span>
                    <span className="font-mono">{nodes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Epoch</span>
                    <span className="font-mono">{stats.epoch}</span>
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