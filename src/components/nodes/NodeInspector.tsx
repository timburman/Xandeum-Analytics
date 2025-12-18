"use client";

import { useState } from "react";
import { X, Shield, Server, Wifi, Globe, Clock, Calculator, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NodeStatusBadge } from "./NodeStatusBadge";
import { NodeData } from "./NodeCard";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface NodeInspectorProps {
  node: NodeData | null;
  open: boolean;
  onClose: () => void;
}

const uptimeData = [
  { time: "00:00", value: 100 },
  { time: "04:00", value: 99.8 },
  { time: "08:00", value: 99.9 },
  { time: "12:00", value: 100 },
  { time: "16:00", value: 99.7 },
  { time: "20:00", value: 99.9 },
  { time: "24:00", value: 100 },
];

const storageData = [
  { time: "Mon", value: 12 },
  { time: "Tue", value: 14 },
  { time: "Wed", value: 13 },
  { time: "Thu", value: 16 },
  { time: "Fri", value: 18 },
  { time: "Sat", value: 17 },
  { time: "Sun", value: 19 },
];

export const NodeInspector = ({ node, open, onClose }: NodeInspectorProps) => {
  const [stakeAmount, setStakeAmount] = useState("");

  if (!node) return null;

  const estimatedRewards = stakeAmount ? (parseFloat(stakeAmount) * 0.082).toFixed(2) : "0.00";

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground">Node Inspector</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Node Header with Big Score */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Server className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <NodeStatusBadge status={node.status} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-5xl font-bold ${getScoreColor(node.trustScore)}`}>
                {node.trustScore}
              </span>
              <span className="text-xl text-muted-foreground">/100</span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Trust Score • Rank #{node.rank}
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Staking Calculator */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Staking Calculator
          </h4>
          <div className="glass-card rounded-lg p-4">
            <div className="mb-3">
              <label className="text-xs text-muted-foreground mb-1 block">Stake Amount (XAND)</label>
              <Input
                type="number"
                placeholder="Enter XAND amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-xs text-muted-foreground">Estimated Annual Rewards</span>
              <span className="text-lg font-bold text-primary">{estimatedRewards} XAND</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Based on current APY of 8.2%
            </p>
          </div>
        </div>

        {/* Telemetry Charts */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Telemetry</h4>
          <div className="grid gap-4">
            <div className="glass-card rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Uptime (24h)</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 45%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 45%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[99, 100]} hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 15%, 20%)", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(210, 20%, 92%)" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(160, 45%, 45%)" fill="url(#uptimeGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Storage Growth (7d)</p>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={storageData}>
                  <defs>
                    <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(175, 50%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(175, 50%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 15%, 20%)", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(210, 20%, 92%)" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(175, 50%, 45%)" fill="url(#storageGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hardware Specs */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Hardware Specs</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Server className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider">Version</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{node.version}</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Wifi className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider">IP</span>
              </div>
              <p className="text-sm font-semibold text-foreground font-mono">192.168.1.***</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Globe className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider">ISP</span>
              </div>
              <p className="text-sm font-semibold text-foreground">AWS</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wider">Uptime</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{node.uptime}%</p>
            </div>
          </div>
        </div>

        {/* PubKey */}
        <div className="mt-6 p-3 rounded-lg bg-muted/20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Public Key</p>
          <p className="text-xs font-mono text-foreground break-all">{node.pubkey}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
