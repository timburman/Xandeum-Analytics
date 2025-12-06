import { useState, useMemo } from 'react';
import { useNodes } from '@/hooks/useNodes';
import { NodeData } from '@/services/mockData';
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
import { ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface NodeTableProps {
  onNodeSelect: (node: NodeData) => void;
}

type SortField = 'uptimeScore' | 'storageCapacity' | 'rank';
type SortOrder = 'asc' | 'desc';

export const NodeTable = ({ onNodeSelect }: NodeTableProps) => {
  const { data: nodes, isLoading, dataUpdatedAt } = useNodes();
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('uptimeScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  

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

    // Filter by active status
    if (showActiveOnly) {
      result = result.filter((n) => n.status === 'active');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((n) => n.name.toLowerCase().includes(query));
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (Number(aValue) - Number(bValue)) * multiplier;
    });

    // Add rank
    return result.map((node, index) => ({ ...node, rank: index + 1 }));
  }, [nodes, showActiveOnly, searchQuery, sortField, sortOrder]);

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="active-only"
              checked={showActiveOnly}
              onCheckedChange={setShowActiveOnly}
            />
            <Label htmlFor="active-only" className="text-sm text-muted-foreground">
              Active only
            </Label>
          </div>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('uptimeScore')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Uptime
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('storageCapacity')}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Storage
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>APY</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedNodes.map((node) => (
              <TableRow
                key={node.id}
                className="cursor-pointer transition-colors"
                onClick={() => onNodeSelect(node)}
              >
                <TableCell className="font-mono text-muted-foreground">
                  #{node.rank}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{node.name}</span>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  v{node.version}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-2 w-16 rounded-full bg-secondary overflow-hidden'
                      )}
                    >
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          node.uptimeScore >= 90
                            ? 'bg-success'
                            : node.uptimeScore >= 70
                            ? 'bg-warning'
                            : 'bg-destructive'
                        )}
                        style={{ width: `${node.uptimeScore}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm w-12">
                      {node.uptimeScore.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {node.storageCapacity} GB
                </TableCell>
                <TableCell className="font-mono text-sm text-success">
                  {node.apy > 0 ? `${node.apy.toFixed(2)}%` : '—'}
                </TableCell>
                <TableCell>
                  <span className="text-lg" title={node.country}>
                    {getCountryFlag(node.countryCode)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={node.status === 'active' ? 'default' : 'destructive'}
                    className={cn(
                      'font-medium',
                      node.status === 'active' && 'bg-success text-success-foreground hover:bg-success/80'
                    )}
                  >
                    {node.status === 'active' ? 'Active' : 'Delinquent'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedNodes.length} of {nodes?.length ?? 0} nodes
      </div>
    </div>
  );
};
