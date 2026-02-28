import type {
  BruteForceAttempt,
  MalwareScan,
  VulnerabilityScan,
  Incident,
} from "@/types/soc";

/* ==============================
   Brute Force Correlation
============================== */
export function correlateBruteForce(
  attempt: BruteForceAttempt
): Incident | null {
  if (attempt.failedAttempts >= 5) {
    return {
      id: `INC-BF-${Date.now()}`,
      title: `Brute Force Attack from ${attempt.attackerIP}`,
      severity: attempt.severity, // already lowercase & valid
      status: "open",
      eventCount: attempt.failedAttempts,
      createdAt: new Date(),
      description: `Detected ${attempt.failedAttempts} failed login attempts targeting ${attempt.targetService}.`,
      affectedAssets: [attempt.targetService],
    };
  }

  return null;
}

/* ==============================
   Malware Correlation
============================== */
export function correlateMalware(
  scan: MalwareScan
): Incident | null {
  // frontend MalwareScan.risk is lowercase
  if (scan.risk === "high" || scan.risk === "critical") {
    return {
      id: `INC-MAL-${Date.now()}`,
      title: `Malware Detected: ${scan.filename}`,
      severity: scan.risk,
      status: "open",
      eventCount: 1,
      createdAt: new Date(),
      description: `Malware classified as ${scan.risk}. Reason: ${scan.reason}`,
      affectedAssets: [scan.filename],
    };
  }

  return null;
}
