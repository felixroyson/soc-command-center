import { useInvestigation } from "@/contexts/InvestigationContext";
import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ShieldAlert, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvestigationPage() {
  const { result } = useInvestigation();

  if (!result) {
    return (
      <GlassCard className="p-6">
        <p className="text-muted-foreground">
          No investigation data yet.  
          Use the global investigation bar above.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===============================
          Entity Overview
      =============================== */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldAlert className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Entity Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Field label="Value" value={result.value} />
          <Field label="Type" value={result.type} />
          <Field label="Confidence" value={result.confidence} />
          <Field
            label="Risk"
            value={<SeverityBadge severity={mapSeverity(result.risk)} />
}
          />
        </div>
      </GlassCard>

      {/* ===============================
          Related Alerts
      =============================== */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-severity-high" />
          <h2 className="text-lg font-semibold text-foreground">
            Related Alerts
          </h2>
        </div>

        {result.related_alerts === 0 ? (
          <p className="text-muted-foreground">
            No correlated alerts found.
          </p>
        ) : (
          <p className="text-foreground">
            {result.related_alerts} alerts correlated with this entity.
          </p>
        )}
      </GlassCard>

      {/* ===============================
          Related Incidents
      =============================== */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-severity-medium" />
          <h2 className="text-lg font-semibold text-foreground">
            Related Incidents
          </h2>
        </div>

        {result.related_incidents === 0 ? (
          <p className="text-muted-foreground">
            No correlated incidents found.
          </p>
        ) : (
          <p className="text-foreground">
            {result.related_incidents} incidents correlated with this entity.
          </p>
        )}
      </GlassCard>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-medium text-foreground")}>{value}</p>
    </div>
  );
}
function mapSeverity(
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
): "low" | "medium" | "high" | "critical" {
  return risk.toLowerCase() as
    | "low"
    | "medium"
    | "high"
    | "critical";
}
