import { useState, useMemo } from 'react';
import { Node } from '@/hooks/useNodes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface NodeTableProps {
  nodes: Node[];
  onNodeSelect: (node: Node) => void; // Added this back
}

type SortField = 'uptime' | 'rank';
type SortOrder = 'asc' | 'desc';

export default function NodeTable({ nodes, onNodeSelect }: NodeTableProps) {
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedNodes = useMemo(() => {
    if (!nodes) return [];

    let result = [...nodes];

    // 1. Filter
    if (showActiveOnly) {
      result = result.filter((n) => n.status === 'Active');
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((n) => 
        n.name.toLowerCase().includes(query) || 
        n.ip.includes(query) ||
        n.pubkey.toLowerCase().includes(query)
      );
    }

    // 2. Sort
    result.sort((a, b) => {
      // PRIMARY SORT: Active status always comes first
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;

      // SECONDARY SORT: User selection
      const aValue = sortField === 'rank' ? a.rank : a.uptime;
      const bValue = sortField === 'rank' ? b.rank : b.uptime;
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (Number(aValue) - Number(bValue)) * multiplier;
    });

    return result;
  }, [nodes, showActiveOnly, searchQuery, sortField, sortOrder]);

  if (!nodes) return <Skeleton className="h-[400px] w-full" />;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Node ID or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-80 bg-background/50"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="active-only"
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
            <Label htmlFor="active-only" className="text-sm text-muted-foreground cursor-pointer">
              Active only
            </Label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-white/10">
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Node Identifier</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedNodes.map((node) => (
              <TableRow 
                key={node.id} 
                className="cursor-pointer border-b-white/5 transition-colors hover:bg-white/5 group"
                onClick={() => onNodeSelect(node)}
              >
                <TableCell className="font-mono text-muted-foreground">#{node.rank}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {node.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{node.pubkey.slice(0, 12)}...</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{node.ip}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] opacity-70 border-white/20">
                    {node.version}
                  </Badge>
                </TableCell>
                <TableCell>
                   <Badge
                    variant={node.status === 'Active' ? 'default' : 'secondary'}
                    className={cn(
                      'font-medium',
                      node.status === 'Active' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    )}
                  >
                    {node.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}