"use client";

import { useState, useMemo } from "react";
import { SearchAndFilterBar } from "@/components/nodes/SearchAndFilterBar";
import { NodeCard } from "@/components/nodes/NodeCard";
import { NodeInspector } from "@/components/nodes/NodeInspector";
import { NexusNode } from "@/hooks/useNodes";

// Helper to format bytes
const formatStorage = (bytes: number) => {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  return `${(bytes / 1e6).toFixed(1)} MB`;
};

interface NodeListProps {
  nodes: NexusNode[];
}

export default function NodeList({ nodes }: NodeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null); // Use NexusNode type
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Filter Logic
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        searchQuery === "" ||
        node.pubkey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.ip.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        node.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [nodes, searchQuery, statusFilter]);

  const handleNodeClick = (originalNode: NexusNode) => {
    // FIX: We set the FULL NexusNode object, preserving 'geo' and 'stats'
    setSelectedNode(originalNode);
    setInspectorOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto flex-1">
             <SearchAndFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />
        </div>
        
        {/* Quick Stats Pills */}
        <div className="flex items-center gap-4 text-xs font-medium bg-secondary/20 p-2 rounded-lg border border-border">
          <span className="flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-foreground">{nodes.filter(n => n.status === "Active").length} Active</span>
          </span>
          <div className="h-4 w-px bg-border" />
          <span className="flex items-center gap-1.5 px-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{nodes.filter(n => n.status !== "Active").length} Syncing</span>
          </span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filteredNodes.map((node, index) => (
          <div
            key={node.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <NodeCard 
                // Visual Props (Simplified)
                node={{
                    id: node.id,
                    rank: node.rank,
                    pubkey: node.pubkey,
                    trustScore: node.reputationScore,
                    storage: formatStorage(node.storage.committed),
                    version: node.version,
                    status: node.status.toLowerCase(),
                    region: node.geo?.country || "Unknown",
                    badges: node.isAlphaReady ? ["Alpha Ready"] : [],
                    uptime: node.uptime
                }} 
                // FIX: Pass the ORIGINAL node to the handler, ignoring the card's internal click data
                onClick={() => handleNodeClick(node)} 
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNodes.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-secondary/5">
          <p className="text-muted-foreground">No nodes found matching filters</p>
        </div>
      )}

      {/* Slide-out Inspector */}
      <NodeInspector
        node={selectedNode}
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
}