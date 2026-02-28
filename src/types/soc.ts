export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Alert {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  severity: Severity;
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: 'open' | 'resolved';
  eventCount: number;
  createdAt: Date;
  description: string;
  affectedAssets: string[];
  assignee?: string;
}

export interface BruteForceAttempt {
  id: string;
  attackerIP: string;
  failedAttempts: number;
  lastSeen: Date;
  severity: Severity;
  status: 'active' | 'blocked';
  targetService: string;
}

export interface VulnerabilityResult {
  port: number;
  service: string;
  risk: Severity;
  description: string;
  recommendedAction: string;
}

export interface VulnerabilityScan {
  id: string;
  target: string;
  profile: 'fast' | 'balanced' | 'deep';
  timestamp: Date;
  openPorts: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  results: VulnerabilityResult[];
}

export interface MalwareScan {
  id: string;
  filename: string;
  verdict: 'clean' | 'malicious' | 'suspicious';
  risk: Severity;
  reason: string;
  timestamp: Date;
  quarantined: boolean;
  fileSize: string;
  hash: string;
}
