"use client";

import { useState } from "react"; // Import useState
import { useNodes, Node } from "@/hooks/useNodes"; 
import Header from "@/components/layout/Header";
import StatsGrid from "@/components/stats/StatsGrid";
import NodeMap from "@/components/map/NodeMap";
import NodeTable from "@/components/table/NodeTable";
import NodeInspector from "@/components/inspector/NodeInspector"; // Import the new Inspector
import LiveTerminal from "@/components/terminal/LiveTerminal";
import VersionDonut from "@/components/stats/VersionDonut";

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
          
          {/* Left Column: Map 
              h-full ensures it stretches to match the height of the Right Column automatically 
          */}
          <div className="lg:col-span-2 h-full min-h-[500px]"> 
            <NodeMap nodes={nodes} />
          </div>

          {/* Right Column: Natural Height Stack */}
          <div className="space-y-4 flex flex-col">
             
             {/* 1. Network Health Card (Auto Height) */}
             <div className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Network Health
                  </h3>
                  <span className="bg-green-500/10 text-green-500 text-[10px] font-mono px-2 py-0.5 rounded border border-green-500/20">
                    OPERATIONAL
                  </span>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="p-2 rounded-lg bg-secondary/30 border border-border">
                      <div className="text-muted-foreground text-[10px] mb-0.5">Total Peers</div>
                      <div className="font-mono text-lg font-bold">{nodes.length}</div>
                   </div>
                   <div className="p-2 rounded-lg bg-secondary/30 border border-border">
                      <div className="text-muted-foreground text-[10px] mb-0.5">Storage Used</div>
                      <div className="font-mono text-lg font-bold text-foreground">
                         {stats.totalStorage}
                      </div>
                   </div>
                </div>

                {/* Donut Chart - FIXED HEIGHT (Prevents cutoff) */}
                <div className="h-[180px] w-full relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <VersionDonut nodes={nodes} />
                   </div>
                </div>
             </div>

             {/* 2. Live Terminal - FIXED HEIGHT (Compact but readable) */}
             <div className="h-[250px] min-h-0">
                <LiveTerminal logs={logs} />
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