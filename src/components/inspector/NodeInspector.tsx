import { NodeData } from '@/services/mockData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown, Copy, Check, ExternalLink, Globe } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';

interface NodeInspectorProps {
  node: NodeData | null;
  open: boolean;
  onClose: () => void;
}

export const NodeInspector = ({ node, open, onClose }: NodeInspectorProps) => {
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!node) return null;

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Generate vote success rate history data
  const voteSuccessHistory = Array.from({ length: 10 }, (_, i) => ({
    epoch: 513 + i,
    rate: Math.max(0, Math.min(100, node.voteSuccessRate + (Math.random() - 0.5) * 10)),
  }));

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-semibold">{node.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">Node Inspector</p>
            </div>
            <Badge
              className={cn(
                'text-sm',
                node.status === 'active'
                  ? 'bg-success text-success-foreground'
                  : 'bg-destructive text-destructive-foreground'
              )}
            >
              {node.status === 'active' ? 'Active' : 'Delinquent'}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Health Status Indicator */}
          <div className="flex items-center justify-center">
            <div
              className={cn(
                'relative w-32 h-32 rounded-full flex items-center justify-center',
                node.status === 'active' ? 'glow-success' : 'glow-destructive'
              )}
            >
              <div
                className={cn(
                  'w-28 h-28 rounded-full flex flex-col items-center justify-center border-4',
                  node.status === 'active'
                    ? 'border-success bg-success/10'
                    : 'border-destructive bg-destructive/10'
                )}
              >
                <span className="text-3xl font-bold font-mono">
                  {node.uptimeScore.toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground mt-1">Uptime</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <span className="text-2xl font-bold text-success font-mono">
                {node.apy > 0 ? `${node.apy.toFixed(1)}%` : '—'}
              </span>
              <p className="text-xs text-muted-foreground mt-1">APY</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <span className="text-2xl font-bold font-mono">
                {node.voteSuccessRate.toFixed(1)}%
              </span>
              <p className="text-xs text-muted-foreground mt-1">Vote Success</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <span className="text-2xl font-bold font-mono">
                {node.storageCapacity}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Storage (GB)</p>
            </div>
          </div>

          {/* Active Stake Chart */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Active Stake by Epoch
            </h3>
            <div className="rounded-lg border border-border bg-card p-4">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={node.stakeHistory}>
                  <defs>
                    <linearGradient id="stakeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="epoch" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} SOL`, 'Stake']}
                    labelFormatter={(label) => `Epoch ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="stake"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#stakeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vote Success Rate Chart */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Vote Success Rate
            </h3>
            <div className="rounded-lg border border-border bg-card p-4">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={voteSuccessHistory}>
                  <XAxis 
                    dataKey="epoch" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Vote Success']}
                    labelFormatter={(label) => `Epoch ${label}`}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Node Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Node Details
            </h3>
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Public Key</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs text-right max-w-[180px] truncate">
                    {node.pubKey}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(node.pubKey, 'pubKey')}>
                    {copiedField === 'pubKey' ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Vote Account</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs text-right max-w-[180px] truncate">
                    {node.voteAccount}
                  </code>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(node.voteAccount, 'voteAccount')}>
                    {copiedField === 'voteAccount' ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Website</span>
                <a 
                  href={node.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {node.website.replace('https://', '')}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="font-mono text-sm">v{node.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm">
                  {getCountryFlag(node.countryCode)} {node.country}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IP Address</span>
                <span className="font-mono text-sm text-muted-foreground">
                  {node.ipAddress.replace(/\.\d+$/, '.***')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Seen</span>
                <span className="text-sm">
                  {new Date(node.lastSeen).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Raw Gossip Data */}
          <Collapsible open={isJsonOpen} onOpenChange={setIsJsonOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between py-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Raw Gossip Data
                </h3>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform',
                    isJsonOpen && 'rotate-180'
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-lg border border-border bg-secondary p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(node.gossipData, null, 2)}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Actions */}
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <a
                href={`https://explorer.solana.com/address/${node.pubKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
