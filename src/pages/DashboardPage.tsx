import { useEffect, useState } from "react";
import { checkBackend } from "@/lib/api";
import { useSimulation } from "@/contexts/SimulationContext";

import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";

import {
  Bell,
  AlertTriangle,
  ShieldOff,
  FileX,
  Activity,
  TrendingUp,
  Clock,
  Server
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { metrics, liveEvents, alerts, settings } = useSimulation();

  /* --------------------------------
     Backend heartbeat
  -------------------------------- */
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "down"
  >("checking");

  useEffect(() => {
    checkBackend()
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("down"));
  }, []);

  /* --------------------------------
     KPI configuration
  -------------------------------- */
  const kpiCards = [
    {
      label: "Total Alerts",
      value: metrics.totalAlerts,
      icon: Bell,
      color: "text-severity-info",
      bgColor: "bg-severity-info/10",
    },
    {
      label: "Critical Incidents",
      value: metrics.criticalIncidents,
      icon: AlertTriangle,
      color: "text-severity-critical",
      bgColor: "bg-severity-critical/10",
    },
    {
      label: "Blocked IPs",
      value: metrics.blockedIPs,
      icon: ShieldOff,
      color: "text-severity-high",
      bgColor: "bg-severity-high/10",
    },
    {
      label: "Quarantined Files",
      value: metrics.quarantinedFiles,
      icon: FileX,
      color: "text-severity-medium",
      bgColor: "bg-severity-medium/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================
          Header
      ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Security Operations Center Overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Backend status */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm",
              backendStatus === "checking" &&
                "border-border text-muted-foreground",
              backendStatus === "connected" &&
                "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
              backendStatus === "down" &&
                "border-severity-critical/40 bg-severity-critical/10 text-severity-critical"
            )}
          >
            <Server className="w-4 h-4" />
            {backendStatus === "checking" && "Backend: Checking"}
            {backendStatus === "connected" && "Backend: Connected"}
            {backendStatus === "down" && "Backend: Down"}
          </div>

          {/* Simulation mode */}
          {settings.simulationMode && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">
                Live Simulation
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          KPI Cards
      ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <GlassCard key={kpi.label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {kpi.value}
                  </p>
                </div>
                <div className={cn("p-3 rounded-xl", kpi.bgColor)}>
                  <Icon className={cn("w-6 h-6", kpi.color)} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* ======================================================
          Threat Level Gauge
      ====================================================== */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Threat Level Indicator
          </h2>
          <span
            className={cn(
              "text-xl font-bold",
              metrics.threatLevel === "CRITICAL" && "text-severity-critical",
              metrics.threatLevel === "HIGH" && "text-severity-high",
              metrics.threatLevel === "MEDIUM" && "text-severity-medium",
              metrics.threatLevel === "LOW" && "text-severity-low"
            )}
          >
            {metrics.threatLevel}
          </span>
        </div>

        <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-severity-low/30" />
            <div className="flex-1 bg-severity-medium/30" />
            <div className="flex-1 bg-severity-high/30" />
            <div className="flex-1 bg-severity-critical/30" />
          </div>

          <div
            className={cn(
              "absolute top-0 left-0 h-full transition-all duration-500 rounded-full",
              metrics.threatLevel === "CRITICAL" &&
                "w-full bg-severity-critical glow-critical",
              metrics.threatLevel === "HIGH" &&
                "w-3/4 bg-severity-high",
              metrics.threatLevel === "MEDIUM" &&
                "w-1/2 bg-severity-medium",
              metrics.threatLevel === "LOW" && "w-1/4 bg-severity-low"
            )}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>LOW</span>
          <span>MEDIUM</span>
          <span>HIGH</span>
          <span>CRITICAL</span>
        </div>
      </GlassCard>

      {/* ======================================================
          Alerts + Live Stream
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Alerts
            </h2>
            <span className="text-sm text-muted-foreground">
              {alerts.length} total
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No alerts yet. Enable simulation mode in settings.
              </p>
            ) : (
              alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {alert.type}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert.source}
                    </p>
                  </div>
                  <SeverityBadge severity={alert.severity} />
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Live Event Stream */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Live Event Stream
            </h2>
            {settings.simulationMode && (
              <div className="w-2 h-2 rounded-full bg-severity-low animate-pulse" />
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-sm">
            {liveEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No events yet. Enable simulation mode in settings.
              </p>
            ) : (
              liveEvents.map((event, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 rounded bg-secondary/30 text-muted-foreground",
                    index === 0 &&
                      "bg-primary/10 text-foreground animate-slide-in"
                  )}
                >
                  {event}
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
