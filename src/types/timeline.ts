/* ==============================
   Unified SOC Timeline Event
============================== */
export type TimelineEvent = {
  id: string;
  type:
    | "ALERT"
    | "INCIDENT"
    | "BRUTE_FORCE"
    | "MALWARE"
    | "VULNERABILITY";

  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  timestamp: Date;

  source?: string;
};
