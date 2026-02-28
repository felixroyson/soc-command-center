/* eslint-disable react-refresh/only-export-components */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import type {
  Alert,
  Incident,
  BruteForceAttempt,
  VulnerabilityScan,
  MalwareScan,
} from "@/types/soc";

import {
  generateRandomAlert,
  generateRandomIncident,
  generateRandomBruteForce,
} from "@/lib/mockData";

import {
  correlateBruteForce,
  correlateMalware,
} from "@/lib/correlationEngine";

import { useTimeline } from "@/contexts/TimelineContext";

/* ======================================================
   TYPES
====================================================== */
interface Settings {
  simulationMode: boolean;
  criticalAlertSound: boolean;
  autoBlockBruteForce: boolean;
  autoQuarantineMalware: boolean;
}

interface Metrics {
  totalAlerts: number;
  criticalIncidents: number;
  blockedIPs: number;
  quarantinedFiles: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface SimulationContextType {
  alerts: Alert[];
  incidents: Incident[];
  bruteForceAttempts: BruteForceAttempt[];
  vulnerabilityScans: VulnerabilityScan[];
  malwareScans: MalwareScan[];
  liveEvents: string[];

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  addAlert: (a: Alert) => void;
  clearAlerts: () => void;

  addIncident: (i: Incident) => void;
  resolveIncident: (id: string) => void;
  reopenIncident: (id: string) => void;

  addBruteForceAttempt: (a: BruteForceAttempt) => void;
  blockIP: (ip: string) => void;

  addVulnerabilityScan: (s: VulnerabilityScan) => void;

  addMalwareScan: (s: MalwareScan) => void;
  quarantineFile: (id: string) => void;

  metrics: Metrics;
}

/* ======================================================
   CONTEXT
====================================================== */
const SimulationContext =
  createContext<SimulationContextType | undefined>(undefined);

/* ======================================================
   PROVIDER
====================================================== */
export function SimulationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addEvent } = useTimeline();

  /* ---------------- STATE ---------------- */
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [bruteForceAttempts, setBruteForceAttempts] =
    useState<BruteForceAttempt[]>([]);
  const [vulnerabilityScans, setVulnerabilityScans] =
    useState<VulnerabilityScan[]>([]);
  const [malwareScans, setMalwareScans] =
    useState<MalwareScan[]>([]);
  const [liveEvents] = useState<string[]>([]);

  const [settings, setSettings] = useState<Settings>({
    simulationMode: false,
    criticalAlertSound: false,
    autoBlockBruteForce: false,
    autoQuarantineMalware: false,
  });

  const simulationTimer = useRef<NodeJS.Timeout | null>(null);

  /* ======================================================
     CORE ACTIONS
  ====================================================== */
  const addBruteForceAttempt = useCallback(
    (attempt: BruteForceAttempt) => {
      setBruteForceAttempts((prev) => {
        const existing = prev.find(
          (a) => a.attackerIP === attempt.attackerIP
        );

        // Update existing IP entry
        if (existing) {
          return prev.map((a) =>
            a.attackerIP === attempt.attackerIP
              ? {
                  ...a,
                  failedAttempts: attempt.failedAttempts,
                  severity: attempt.severity,
                  lastSeen: attempt.lastSeen,
                  status:
                    a.status === "blocked"
                      ? "blocked"
                      : attempt.status,
                }
              : a
          );
        }

        // New attacker IP
        return [attempt, ...prev];
      });

      addEvent({
        id: `TL-BF-${Date.now()}`,
        type: "BRUTE_FORCE",
        severity: attempt.severity.toUpperCase() as Metrics["threatLevel"],
        title: `Brute force from ${attempt.attackerIP}`,
        timestamp: new Date(),
        source: attempt.targetService,
      });

      const incident = correlateBruteForce(attempt);
      if (incident) {
        setIncidents((prev) => [incident, ...prev]);

        addEvent({
          id: `TL-INC-${incident.id}`,
          type: "INCIDENT",
          severity: incident.severity.toUpperCase() as Metrics["threatLevel"],
          title: incident.title,
          timestamp: incident.createdAt,
          source: "Correlation Engine",
        });
      }
    },
    [addEvent]
  );

  const addMalwareScan = useCallback(
    (scan: MalwareScan) => {
      setMalwareScans((prev) => [scan, ...prev]);

      addEvent({
        id: `TL-MAL-${scan.id}`,
        type: "MALWARE",
        severity: scan.risk.toUpperCase() as Metrics["threatLevel"],
        title: `Malware detected: ${scan.filename}`,
        timestamp: scan.timestamp,
        source: "Malware Engine",
      });

      const incident = correlateMalware(scan);
      if (incident) {
        setIncidents((prev) => [incident, ...prev]);
      }
    },
    [addEvent]
  );

  /* ======================================================
     SIMULATION ENGINE
  ====================================================== */
  useEffect(() => {
    if (!settings.simulationMode) {
      if (simulationTimer.current) {
        clearInterval(simulationTimer.current);
      }
      return;
    }

    simulationTimer.current = setInterval(() => {
      const roll = Math.random();

      if (roll < 0.5) {
        setAlerts((prev) => [generateRandomAlert(), ...prev]);
        return;
      }

      if (roll < 0.7) {
        setIncidents((prev) => [generateRandomIncident(), ...prev]);
        return;
      }

      addBruteForceAttempt(generateRandomBruteForce());
    }, 3000);

    return () => {
      if (simulationTimer.current) {
        clearInterval(simulationTimer.current);
      }
    };
  }, [settings.simulationMode, addBruteForceAttempt]);

  /* ======================================================
     METRICS (UNCHANGED LOGIC)
  ====================================================== */
  const threatLevel: Metrics["threatLevel"] = (() => {
    const criticalAlerts = alerts.filter(
      (a) => a.severity === "critical"
    ).length;

    if (criticalAlerts > 5) return "CRITICAL";
    if (criticalAlerts > 2) return "HIGH";
    if (alerts.length > 10) return "MEDIUM";
    return "LOW";
  })();

  const metrics: Metrics = {
    totalAlerts: alerts.length,
    criticalIncidents: incidents.filter(
      (i) => i.severity === "critical" && i.status === "open"
    ).length,
    blockedIPs: bruteForceAttempts.filter(
      (b) => b.status === "blocked"
    ).length,
    quarantinedFiles: malwareScans.filter(
      (m) => m.quarantined
    ).length,
    threatLevel,
  };

  /* ======================================================
     PROVIDER VALUE
  ====================================================== */
  return (
    <SimulationContext.Provider
      value={{
        alerts,
        incidents,
        bruteForceAttempts,
        vulnerabilityScans,
        malwareScans,
        liveEvents,

        settings,
        updateSettings: (s) =>
          setSettings((prev) => ({ ...prev, ...s })),

        addAlert: (a) => setAlerts((prev) => [a, ...prev]),
        clearAlerts: () => setAlerts([]),

        addIncident: (i) => setIncidents((prev) => [i, ...prev]),
        resolveIncident: () => {},
        reopenIncident: () => {},

        addBruteForceAttempt,
        blockIP: (ip) =>
          setBruteForceAttempts((prev) =>
            prev.map((a) =>
              a.attackerIP === ip
                ? { ...a, status: "blocked" }
                : a
            )
          ),

        addVulnerabilityScan: (s) =>
          setVulnerabilityScans((prev) => [s, ...prev]),

        addMalwareScan,
        quarantineFile: (id) =>
          setMalwareScans((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, quarantined: true } : m
            )
          ),

        metrics,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

/* ======================================================
   HOOK
====================================================== */
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error(
      "useSimulation must be used within SimulationProvider"
    );
  }
  return context;
}
