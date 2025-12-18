"use client";

import { useNodes } from "@/hooks/useNodes";
import {DashboardLayout} from "@/components/layout/DashboardLayout";
import {GlobalStorageMap} from "@/components/dashboard/GlobalStorageMap";
import StatsCards from "@/components/dashboard/StatsCards";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// Removed NodeList import

export default function NexusDashboard() {
  const { nodes, stats } = useNodes();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 animate-in fade-in duration-500">
        
        {/* Top Stats */}
        <StatsCards 
          totalStorage={stats.totalStorage} 
          activeNodes={stats.activeNodes} 
          avgScore={stats.avgReputation} 
        />

        {/* Main Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Map Section - Now takes full width since we removed the gauge for space */}
          <div className="min-h-[500px] rounded-xl overflow-hidden border border-border bg-card/50">
             <GlobalStorageMap nodes={nodes} /> 
          </div>
        </div>

        {/* Call to Action for Nodes Page */}
        <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-primary/5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inspect Individual Validators</h3>
            <p className="text-sm text-muted-foreground">View detailed reputation scores, version compliance, and storage metrics.</p>
          </div>
          <Link href="/nodes">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              View All Nodes <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}