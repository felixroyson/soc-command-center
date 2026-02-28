import type {
  Alert,
  Incident,
  BruteForceAttempt,
  MalwareScan,
} from "@/types/soc";

export function correlateBruteForce(
  attempt: BruteForceAttempt
): Alert | null {
  if (attempt.failedAttempts >= 5) {
    return {
      id: `ALERT-${Date.now()}`,
      type: "Brute Force Attack",
      severity: "high",
      source: attempt.attackerIP,
      timestamp: new Date(),
      description: `${attempt.failedAttempts} failed logins detected`,
    };
  }
  return null;
}

export function correlateMalware(
  scan: MalwareScan
): Alert | null {
  if (scan.verdict === "malicious") {
    return {
      id: `ALERT-${Date.now()}`,
      type: "Malware Detected",
      severity: scan.risk,
      source: scan.filename,
      timestamp: new Date(),
      description: scan.reason,
    };
  }
  return null;
}
