import { useState } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { GlassCard } from '@/components/GlassCard';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Download, Bell } from 'lucide-react';
import { Alert } from '@/types/soc';

export default function AlertsPage() {
  const { alerts, clearAlerts } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const exportAlerts = () => {
    const data = JSON.stringify(alerts, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Security alert management console</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAlerts} disabled={alerts.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={clearAlerts} disabled={alerts.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'critical', 'high', 'medium', 'low', 'info'].map((severity) => (
              <Button
                key={severity}
                variant={severityFilter === severity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter(severity)}
                className="capitalize"
              >
                {severity}
              </Button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Alerts List */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">No alerts found</p>
              <p className="text-sm">Enable simulation mode in settings to generate alerts</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredAlerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  return (
    <div className="p-4 hover:bg-secondary/30 transition-colors animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-foreground truncate">{alert.type}</h3>
            <SeverityBadge severity={alert.severity} />
          </div>
          <p className="text-sm text-muted-foreground truncate">{alert.description}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">{alert.source}</span>
          <span>{alert.timestamp.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
