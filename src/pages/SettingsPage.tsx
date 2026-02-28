import { useSimulation } from '@/contexts/SimulationContext';
import { GlassCard } from '@/components/GlassCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Activity, Volume2, Shield, FileX } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useSimulation();

  const settingsItems = [
    {
      id: 'simulationMode',
      label: 'Simulation Mode',
      description: 'Enable live event generation for demo purposes. New alerts, incidents, and events will be automatically generated.',
      icon: Activity,
      value: settings.simulationMode,
      onChange: (checked: boolean) => updateSettings({ simulationMode: checked }),
    },
    {
      id: 'criticalAlertSound',
      label: 'Critical Alert Sound',
      description: 'Play an audio notification when critical alerts are detected. Disabled by default.',
      icon: Volume2,
      value: settings.criticalAlertSound,
      onChange: (checked: boolean) => updateSettings({ criticalAlertSound: checked }),
    },
    {
      id: 'autoBlockBruteForce',
      label: 'Auto-block Brute Force IPs',
      description: 'Automatically block IP addresses that exceed the brute force threshold.',
      icon: Shield,
      value: settings.autoBlockBruteForce,
      onChange: (checked: boolean) => updateSettings({ autoBlockBruteForce: checked }),
    },
    {
      id: 'autoQuarantineMalware',
      label: 'Auto-quarantine Malware',
      description: 'Automatically quarantine files detected as malicious or suspicious.',
      icon: FileX,
      value: settings.autoQuarantineMalware,
      onChange: (checked: boolean) => updateSettings({ autoQuarantineMalware: checked }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure SOC-X behavior and preferences</p>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {settingsItems.map((item) => (
          <GlassCard key={item.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label htmlFor={item.id} className="text-base font-medium text-foreground cursor-pointer">
                    {item.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                id={item.id}
                checked={item.value}
                onCheckedChange={item.onChange}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Info Card */}
      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">About SOC-X</h3>
            <p className="text-sm text-muted-foreground mt-1">
              SOC-X is a real-time Security Operations Center dashboard designed for security analysts. 
              This is a demo version with simulated data for evaluation purposes.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-secondary rounded">Version 1.0.0</span>
              <span className="px-2 py-1 bg-secondary rounded">Demo Mode</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
