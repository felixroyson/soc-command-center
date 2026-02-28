import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSimulation } from "@/contexts/SimulationContext";
import {
  LayoutDashboard,
  Bell,
  FileWarning,
  Shield,
  Bug,
  Biohazard,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ================================
   NAV CONFIG
================================ */
const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/incidents", label: "Incidents", icon: FileWarning },
  { path: "/brute-force", label: "Brute Force", icon: Shield },
  { path: "/vulnerabilities", label: "Vulnerabilities", icon: Bug },
  { path: "/malware", label: "Malware", icon: Biohazard },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const { settings, metrics } = useSimulation();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ================================
          MOBILE TOGGLE BUTTON
      ================================ */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* ================================
          MOBILE OVERLAY
      ================================ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================================
          SIDEBAR
      ================================ */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">

          {/* ================================
              BRAND / STATUS
          ================================ */}
          <div className="border-b border-sidebar-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h1 className="text-xl font-bold">SOC-X</h1>
                <div className="flex items-center gap-1.5">
                  {settings.simulationMode && (
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {settings.simulationMode ? "Live Mode" : "Standby"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================
              NAVIGATION
          ================================ */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              const showAlertBadge =
                path === "/alerts" && metrics.totalAlerts > 0;

              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />

                  <span className="font-medium">{label}</span>

                  {showAlertBadge && (
                    <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                      {metrics.totalAlerts}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* ================================
              THREAT LEVEL
          ================================ */}
          <div className="border-t border-sidebar-border p-4">
            <div className="glass-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Threat Level
                </span>
                <span
                  className={cn(
                    "text-xs font-bold",
                    metrics.threatLevel === "CRITICAL" && "text-severity-critical",
                    metrics.threatLevel === "HIGH" && "text-severity-high",
                    metrics.threatLevel === "MEDIUM" && "text-severity-medium",
                    metrics.threatLevel === "LOW" && "text-severity-low"
                  )}
                >
                  {metrics.threatLevel}
                </span>
              </div>

              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    metrics.threatLevel === "CRITICAL" && "w-full bg-severity-critical",
                    metrics.threatLevel === "HIGH" && "w-3/4 bg-severity-high",
                    metrics.threatLevel === "MEDIUM" && "w-1/2 bg-severity-medium",
                    metrics.threatLevel === "LOW" && "w-1/4 bg-severity-low"
                  )}
                />
              </div>
            </div>
          </div>

          {/* ================================
              LOGOUT
          ================================ */}
          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-foreground"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
