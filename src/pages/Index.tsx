"use client";
import  useState  from 'react';
import  Header  from '@/components/layout/Header';
import  StatsGrid  from '@/components/stats/StatsGrid';
import  NodeMap  from '@/components/map/NodeMap';
import  NodeTable  from '@/components/table/NodeTable';
import  NodeInspector  from '@/components/inspector/NodeInspector';
import { NodeData } from '@/services/mockData';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Command Center Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Command Center</h2>
          <StatsGrid />
        </section>

        {/* Map Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Global Node Distribution</h2>
          <NodeMap />
        </section>

        {/* Node Ledger Section */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-4">Node Ledger</h2>
          <NodeTable onNodeSelect={setSelectedNode} />
        </section>
      </main>

      {/* Inspector Slide-over */}
      <NodeInspector
        node={selectedNode}
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default Index;
