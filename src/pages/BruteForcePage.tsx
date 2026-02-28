import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext";

import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";

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

import { Shield, Search, Ban, AlertTriangle, X } from "lucide-react";
import { reportLoginAttempt } from "@/lib/api";
import { cn } from "@/lib/utils";

import type { BruteForceAttempt, Severity, Incident } from "@/types/soc";

/* ======================================================
   Local Drawer Type (Strict)
====================================================== */

type IncidentDetails = Incident & {
  attackerIP: string;
  timeline: { time: Date; message: string }[];
};

/* ======================================================
   Component
====================================================== */

export default function BruteForcePage() {
  const {
    bruteForceAttempts,
    addBruteForceAttempt,
    blockIP,
    addIncident,
  } = useSimulation();

  /* ---------------- State ---------------- */

  const [threshold, setThreshold] = useState<number>(5);
  const [timeWindow, setTimeWindow] = useState<number>(5);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentDetails | null>(null);

  /* ======================================================
     Helpers
  ====================================================== */

  const calculateSeverity = (attempts: number): Severity => {
    if (attempts >= 10) return "critical";
    if (attempts >= 5) return "high";
    if (attempts >= 3) return "medium";
    return "low";
  };

  const getStatusStyle = (status: "active" | "blocked") => {
    return status === "blocked"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400";
  };

  /* ======================================================
     Detection
  ====================================================== */

  const handleCheckBruteForce = async () => {
    setIsChecking(true);

    try {
      const response = await reportLoginAttempt({
        ip: "1.2.3.4",
        username: "admin",
        success: false,
      });

      if (!response.alert || response.attempts < threshold) return;

      addBruteForceAttempt({
        id: `BF-${Date.now()}`,
        attackerIP: response.ip,
        failedAttempts: response.attempts,
        targetService: "SSH",
        severity: calculateSeverity(response.attempts),
        status: "active",
        lastSeen: new Date(),
      });
    } catch (err) {
      console.error("Detection failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  /* ======================================================
     Actions
  ====================================================== */

  const handleBlockIP = (attempt: BruteForceAttempt) => {
    if (attempt.status === "blocked") return;
    blockIP(attempt.attackerIP);
  };

  const handleCreateIncident = (attempt: BruteForceAttempt) => {
    const baseIncident: Incident = {
      id: `INC-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      title: `Brute Force Attack – ${attempt.attackerIP}`,
      severity: attempt.severity,
      status: "open",
      eventCount: attempt.failedAttempts,
      createdAt: new Date(),
      description: `Detected ${attempt.failedAttempts} failed login attempts targeting ${attempt.targetService}`,
      affectedAssets: [attempt.targetService],
    };

    addIncident(baseIncident);

    const enrichedIncident: IncidentDetails = {
      ...baseIncident,
      attackerIP: attempt.attackerIP,
      timeline: [
        {
          time: attempt.lastSeen,
          message: `${attempt.failedAttempts} failed login attempts observed`,
        },
        {
          time: new Date(),
          message: "Incident created by analyst",
        },
      ],
    };

    setSelectedIncident(enrichedIncident);
  };

  /* ======================================================
     UI Components
  ====================================================== */

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Shield className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-lg">No brute force attempts detected</p>
      <p className="text-sm">Run detection to simulate activity</p>
    </div>
  );

  const AttemptsTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {bruteForceAttempts.map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell className="font-mono">
                {attempt.attackerIP}
              </TableCell>

              <TableCell className="font-bold">
                {attempt.failedAttempts}
              </TableCell>

              <TableCell>{attempt.targetService}</TableCell>

              <TableCell className="text-muted-foreground">
                {attempt.lastSeen.toLocaleTimeString()}
              </TableCell>

              <TableCell>
                <SeverityBadge severity={attempt.severity} />
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs capitalize",
                    getStatusStyle(attempt.status)
                  )}
                >
                  {attempt.status}
                </span>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBlockIP(attempt)}
                    disabled={attempt.status === "blocked"}
                  >
                    <Ban className="w-3 h-3 mr-1" />
                    Block
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCreateIncident(attempt)}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Incident
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  /* ======================================================
     Render
  ====================================================== */

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">
          Brute Force Detection
        </h1>
        <p className="text-muted-foreground">
          Monitor authentication abuse attempts
        </p>
      </header>

      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="grid sm:grid-cols-2 gap-4 flex-1">
            <div>
              <label className="text-sm block mb-2 text-muted-foreground">
                Threshold
              </label>
              <Select
                value={threshold.toString()}
                onValueChange={(v) => setThreshold(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm block mb-2 text-muted-foreground">
                Time Window
              </label>
              <Select
                value={timeWindow.toString()}
                onValueChange={(v) => setTimeWindow(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleCheckBruteForce} disabled={isChecking}>
            <Search className="w-4 h-4 mr-2" />
            {isChecking ? "Checking..." : "Run Detection"}
          </Button>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        {bruteForceAttempts.length === 0 ? (
          <EmptyState />
        ) : (
          <AttemptsTable />
        )}
      </GlassCard>

      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="w-full sm:w-[500px] bg-background h-full p-6 overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedIncident.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedIncident.id}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIncident(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <SeverityBadge severity={selectedIncident.severity} />

            <div className="mt-6 space-y-3 text-sm">
              <p><strong>Attacker IP:</strong> {selectedIncident.attackerIP}</p>
              <p><strong>Attempts:</strong> {selectedIncident.eventCount}</p>
              <p><strong>Affected:</strong> {selectedIncident.affectedAssets.join(", ")}</p>
              <p><strong>Created:</strong> {selectedIncident.createdAt.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}