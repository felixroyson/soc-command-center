import { useState } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { GlassCard } from '@/components/GlassCard';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { FileWarning, Check, RotateCcw } from 'lucide-react';
import { Incident } from '@/types/soc';
import { cn } from '@/lib/utils';

export default function IncidentsPage() {
  const { incidents, resolveIncident, reopenIncident } = useSimulation();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const filteredIncidents = incidents.filter((incident) => {
    if (statusFilter === 'all') return true;
    return incident.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Incidents</h1>
          <p className="text-muted-foreground">Incident tracking and resolution</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'open', 'resolved'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <GlassCard className="p-0 overflow-hidden">
        {filteredIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileWarning className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">No incidents found</p>
            <p className="text-sm">Enable simulation mode in settings to generate incidents</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer hover:bg-secondary/30 border-border"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                  <TableCell className="font-medium">{incident.title}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      incident.status === 'open' 
                        ? 'bg-severity-high/20 text-severity-high' 
                        : 'bg-severity-low/20 text-severity-low'
                    )}>
                      {incident.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{incident.eventCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </GlassCard>

      {/* Incident Detail Sheet */}
      <Sheet open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <SheetContent className="bg-card border-border">
          {selectedIncident && (
            <>
              <SheetHeader>
                <SheetTitle className="text-foreground">{selectedIncident.title}</SheetTitle>
                <SheetDescription className="font-mono">{selectedIncident.id}</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <SeverityBadge severity={selectedIncident.severity} />
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    selectedIncident.status === 'open' 
                      ? 'bg-severity-high/20 text-severity-high' 
                      : 'bg-severity-low/20 text-severity-low'
                  )}>
                    {selectedIncident.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                  <p className="text-foreground">{selectedIncident.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Affected Assets</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedAssets.map((asset, index) => (
                      <span key={index} className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Event Count</h4>
                  <p className="text-2xl font-bold text-foreground">{selectedIncident.eventCount}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Created</h4>
                  <p className="text-foreground">{selectedIncident.createdAt.toLocaleString()}</p>
                </div>

                <div className="pt-4 border-t border-border">
                  {selectedIncident.status === 'open' ? (
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        resolveIncident(selectedIncident.id);
                        setSelectedIncident({ ...selectedIncident, status: 'resolved' });
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        reopenIncident(selectedIncident.id);
                        setSelectedIncident({ ...selectedIncident, status: 'open' });
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reopen Incident
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
