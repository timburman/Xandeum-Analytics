"use client";

import { useNodes } from "@/hooks/useNodes";
import {DashboardLayout} from "@/components/layout/DashboardLayout";
import {GlobalStorageMap} from "@/components/dashboard/GlobalStorageMap";
import StatsCards from "@/components/dashboard/StatsCards";
import LiveLog from "@/components/dashboard/LiveLog";
import NetworkHealthGauge from "@/components/dashboard/NetworkHealthGauge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NexusDashboard() {
  const { nodes, stats, activityLog } = useNodes();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 animate-in fade-in duration-500">
        
        {/* Top Stats */}
        <StatsCards 
          totalStorage={stats.totalStorage} 
          activeNodes={stats.activeNodes} 
          avgScore={stats.avgReputation} 
        />

        {/* 3-Column Layout: Health | Map | Log */}
        {/* Fixed height of 450px so everything aligns perfectly */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[450px]">
          
          {/* Left: Network Health (1 Column) */}
          <div className="lg:col-span-1 min-h-0">
             <NetworkHealthGauge score={stats.avgReputation} />
          </div>

          {/* Middle: Map (2 Columns) - Topology */}
          <div className="lg:col-span-2 min-h-0 rounded-xl border border-border bg-card/50 overflow-hidden relative">
             <GlobalStorageMap nodes={nodes} /> 
          </div>

          {/* Right: Live Log (1 Column) */}
          <div className="lg:col-span-1 min-h-0">
             <LiveLog logs={activityLog} />
          </div>

        </div>

        {/* Footer CTA */}
        <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-primary/5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Validator Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Inspect all {nodes.length} nodes for reputation scores and rewards.</p>
          </div>
          <Link href="/nodes">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm font-medium">
              View All Nodes <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}