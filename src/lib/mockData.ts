import { Alert, Incident, BruteForceAttempt, Severity } from '@/types/soc';

const alertTypes = [
  'Suspicious Login Attempt',
  'Malware Detected',
  'Port Scan Detected',
  'DDoS Attack',
  'SQL Injection Attempt',
  'XSS Attack Detected',
  'Unauthorized Access',
  'Data Exfiltration',
  'Privilege Escalation',
  'Ransomware Activity',
];

const sources = [
  '192.168.1.100',
  '10.0.0.50',
  '172.16.0.25',
  '203.0.113.42',
  '198.51.100.15',
  'firewall-01',
  'ids-sensor-02',
  'waf-proxy',
  'endpoint-agent',
  'mail-gateway',
];

const severities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

export function generateRandomAlert(): Alert {
  const severityWeights = [0.1, 0.2, 0.3, 0.25, 0.15];
  let random = Math.random();
  let severityIndex = 0;
  for (let i = 0; i < severityWeights.length; i++) {
    random -= severityWeights[i];
    if (random <= 0) {
      severityIndex = i;
      break;
    }
  }

  return {
    id: `ALR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    source: sources[Math.floor(Math.random() * sources.length)],
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    severity: severities[severityIndex],
    description: `Automated detection of suspicious activity from monitored source.`,
  };
}

const incidentTitles = [
  'Potential Data Breach',
  'Ransomware Outbreak',
  'Compromised User Account',
  'Network Intrusion',
  'Insider Threat Detected',
  'Supply Chain Attack',
  'Zero-Day Exploitation',
  'Phishing Campaign',
];

export function generateRandomIncident(): Incident {
  const severityWeights = [0.15, 0.25, 0.35, 0.25];
  let random = Math.random();
  let severityIndex = 0;
  for (let i = 0; i < severityWeights.length; i++) {
    random -= severityWeights[i];
    if (random <= 0) {
      severityIndex = i;
      break;
    }
  }

  return {
    id: `INC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    title: incidentTitles[Math.floor(Math.random() * incidentTitles.length)],
    severity: severities[severityIndex],
    status: 'open',
    eventCount: Math.floor(Math.random() * 50) + 1,
    createdAt: new Date(),
    description: 'Security incident requiring immediate investigation and response.',
    affectedAssets: [
      sources[Math.floor(Math.random() * sources.length)],
      sources[Math.floor(Math.random() * sources.length)],
    ],
  };
}

const attackerIPs = [
  '45.33.32.156',
  '93.184.216.34',
  '104.131.107.52',
  '185.199.108.153',
  '142.250.185.46',
  '31.13.66.35',
  '23.210.248.15',
];

export function generateRandomBruteForce(): BruteForceAttempt {
  return {
    id: `BF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    attackerIP: attackerIPs[Math.floor(Math.random() * attackerIPs.length)],
    failedAttempts: Math.floor(Math.random() * 20) + 3,
    lastSeen: new Date(),
    severity: Math.random() > 0.5 ? 'high' : 'medium',
    status: 'active',
    targetService: ['SSH', 'RDP', 'FTP', 'SMTP', 'HTTP'][Math.floor(Math.random() * 5)],
  };
}

export function generateVulnerabilityResults(profile: 'fast' | 'balanced' | 'deep') {
  const portCount = profile === 'fast' ? 5 : profile === 'balanced' ? 10 : 20;
  const results = [];
  
  const services = [
    { port: 22, service: 'SSH', risk: 'low' as Severity, desc: 'OpenSSH 8.4 running', action: 'Keep updated' },
    { port: 80, service: 'HTTP', risk: 'medium' as Severity, desc: 'Nginx 1.18 - HTTP enabled', action: 'Enable HTTPS' },
    { port: 443, service: 'HTTPS', risk: 'low' as Severity, desc: 'TLS 1.3 configured', action: 'Monitor certificate expiry' },
    { port: 3306, service: 'MySQL', risk: 'high' as Severity, desc: 'MySQL 5.7 exposed externally', action: 'Restrict to internal network' },
    { port: 21, service: 'FTP', risk: 'critical' as Severity, desc: 'FTP without encryption', action: 'Disable FTP, use SFTP' },
    { port: 23, service: 'Telnet', risk: 'critical' as Severity, desc: 'Telnet service active', action: 'Disable immediately' },
    { port: 25, service: 'SMTP', risk: 'medium' as Severity, desc: 'Open relay detected', action: 'Configure authentication' },
    { port: 445, service: 'SMB', risk: 'high' as Severity, desc: 'SMBv1 enabled', action: 'Disable SMBv1' },
    { port: 3389, service: 'RDP', risk: 'high' as Severity, desc: 'RDP exposed to internet', action: 'Use VPN gateway' },
    { port: 5432, service: 'PostgreSQL', risk: 'medium' as Severity, desc: 'Accepts external connections', action: 'Add firewall rules' },
  ];

  for (let i = 0; i < Math.min(portCount, services.length); i++) {
    results.push({
      port: services[i].port,
      service: services[i].service,
      risk: services[i].risk,
      description: services[i].desc,
      recommendedAction: services[i].action,
    });
  }

  return results;
}

export function generateMalwareSample() {
  const samples = [
    { filename: 'invoice_2024.pdf.exe', verdict: 'malicious' as const, risk: 'critical' as Severity, reason: 'Known ransomware signature detected (Ryuk variant)' },
    { filename: 'setup.exe', verdict: 'suspicious' as const, risk: 'high' as Severity, reason: 'Unsigned executable with network activity' },
    { filename: 'document.docx', verdict: 'clean' as const, risk: 'low' as Severity, reason: 'No threats detected' },
    { filename: 'update.bat', verdict: 'malicious' as const, risk: 'high' as Severity, reason: 'Contains obfuscated PowerShell commands' },
    { filename: 'image.jpg', verdict: 'clean' as const, risk: 'info' as Severity, reason: 'Standard image file' },
    { filename: 'crack_tool.exe', verdict: 'malicious' as const, risk: 'critical' as Severity, reason: 'Trojan.GenericKD detected' },
  ];

  const sample = samples[Math.floor(Math.random() * samples.length)];
  
  return {
    id: `MAL-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ...sample,
    timestamp: new Date(),
    quarantined: false,
    fileSize: `${Math.floor(Math.random() * 5000) + 100} KB`,
    hash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
  };
}
