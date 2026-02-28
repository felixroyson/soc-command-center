import { ShieldAlert } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

/* -----------------------------
   Shared Investigation Type
----------------------------- */
export type InvestigationResultData = {
  value: string;
  type: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: string;
  related_alerts: number;
  related_incidents: number;
};

/* -----------------------------
   Result Card
----------------------------- */
export function InvestigationResult({
  data,
}: {
  data: InvestigationResultData;
}) {
  return (
    <GlassCard className="p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <ShieldAlert className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">
          Investigation Result
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <Field label="Value" value={data.value} />
        <Field label="Type" value={data.type} />
        <Field label="Risk" value={data.risk} color={riskColor(data.risk)} />
        <Field label="Confidence" value={data.confidence} />
        <Field label="Related Alerts" value={data.related_alerts} />
        <Field label="Related Incidents" value={data.related_incidents} />
      </div>
    </GlassCard>
  );
}

/* -----------------------------
   Helpers
----------------------------- */
function Field({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-medium", color)}>{value}</p>
    </div>
  );
}

function riskColor(risk: string) {
  if (risk === "CRITICAL") return "text-severity-critical";
  if (risk === "HIGH") return "text-severity-high";
  if (risk === "MEDIUM") return "text-severity-medium";
  return "text-severity-low";
}
