import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext";

import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Bug, Search, Server, AlertCircle } from "lucide-react";

import { generateVulnerabilityResults } from "@/lib/mockData";
import type { VulnerabilityScan } from "@/types/soc";

/* ==============================
   Types
============================== */
type ScanProfile = "fast" | "balanced" | "deep";

/* ==============================
   Component
============================== */
export default function VulnerabilitiesPage() {
  const { vulnerabilityScans, addVulnerabilityScan } = useSimulation();

  const [target, setTarget] = useState("");
  const [profile, setProfile] = useState<ScanProfile>("balanced");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedScan, setSelectedScan] =
    useState<VulnerabilityScan | null>(null);

  /* ==============================
     Run Scan (SIMULATED)
  ============================== */
  const handleRunScan = async () => {
    if (!target.trim()) return;

    setIsScanning(true);

    const scanDuration =
      profile === "fast" ? 1500 : profile === "balanced" ? 3000 : 5000;

    await new Promise((resolve) => setTimeout(resolve, scanDuration));

    const results = generateVulnerabilityResults(profile);

    const scan: VulnerabilityScan = {
      id: `SCAN-${Date.now()}`,
      target: target.trim(),
      profile,
      timestamp: new Date(),
      openPorts: results.length,
      highRisk: results.filter(
        (r) => r.risk === "critical" || r.risk === "high"
      ).length,
      mediumRisk: results.filter((r) => r.risk === "medium").length,
      lowRisk: results.filter(
        (r) => r.risk === "low" || r.risk === "info"
      ).length,
      results,
    };

    addVulnerabilityScan(scan);
    setSelectedScan(scan);
    setIsScanning(false);
  };

  const latestScan = selectedScan || vulnerabilityScans[0];

  /* ==============================
     Render
  ============================== */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Vulnerabilities
        </h1>
        <p className="text-muted-foreground">
          Vulnerability scanning interface
        </p>
      </div>

      {/* Controls */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Target (IP or hostname)
              </label>
              <div className="relative">
                <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.1 or example.com"
                  className="pl-10 bg-secondary/50"
                />
              </div>
            </div>

            {/* Profile */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Scan Profile
              </label>
              <Select
                value={profile}
                onValueChange={(v) => setProfile(v as ScanProfile)}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleRunScan}
            disabled={isScanning || !target.trim()}
          >
            <Search className="w-4 h-4 mr-2" />
            {isScanning ? "Scanning..." : "Run Scan"}
          </Button>
        </div>
      </GlassCard>

      {/* Summary */}
      {latestScan && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Open Ports</p>
            <p className="text-3xl font-bold">{latestScan.openPorts}</p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-sm text-muted-foreground">High Risk</p>
            <p className="text-3xl font-bold text-severity-critical">
              {latestScan.highRisk}
            </p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Medium Risk</p>
            <p className="text-3xl font-bold text-severity-medium">
              {latestScan.mediumRisk}
            </p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Low Risk</p>
            <p className="text-3xl font-bold text-severity-low">
              {latestScan.lowRisk}
            </p>
          </GlassCard>
        </div>
      )}

      {/* Results */}
      <GlassCard className="p-0 overflow-hidden">
        {!latestScan ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Bug className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">No scan results</p>
            <p className="text-sm">
              Enter a target and run a vulnerability scan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="p-4 border-b border-border text-sm text-muted-foreground">
              Target <span className="font-mono">{latestScan.target}</span> •{" "}
              {latestScan.profile} •{" "}
              {latestScan.timestamp.toLocaleString()}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Port</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Recommended Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {latestScan.results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-bold">
                      {r.port}
                    </TableCell>
                    <TableCell>{r.service}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={r.risk} />
                    </TableCell>
                    <TableCell className="truncate max-w-xs">
                      {r.description}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                        <span className="text-sm">
                          {r.recommendedAction}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </GlassCard>

      {/* History */}
      {vulnerabilityScans.length > 1 && (
        <GlassCard className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Previous Scans
          </h3>
          <div className="flex flex-wrap gap-2">
            {vulnerabilityScans.map((scan) => (
              <Button
                key={scan.id}
                size="sm"
                variant={
                  selectedScan?.id === scan.id ? "default" : "outline"
                }
                onClick={() => setSelectedScan(scan)}
              >
                {scan.target} ({scan.profile})
              </Button>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
