from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

import time
import json
import random
import socket
import ipaddress
import hashlib
from datetime import datetime, timezone


# ======================================================
# APPLICATION SETUP
# ======================================================
app = Flask(__name__)
CORS(app)


# ======================================================
# GLOBAL CONSTANTS
# ======================================================
SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

EVENT_MESSAGES = [
    "Suspicious Login Attempt",
    "Brute Force Detected",
    "Port Scan Detected",
    "Malware Signature Matched",
    "SQL Injection Attempt",
    "Data Exfiltration Attempt",
]

ENTITIES = [
    "8.8.8.8",
    "10.0.0.5",
    "mail-server",
    "api-gateway",
    "waf-proxy",
]

COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    80: "HTTP",
    443: "HTTPS",
    3306: "MySQL",
    3389: "RDP",
}

KNOWN_MALICIOUS_HASHES = {
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": "EICAR-Test-File",
    "44d88612fea8a8f36de82e1278abb02f": "WannaCry-Sample",
}

SUSPICIOUS_EXTENSIONS = [".exe", ".dll", ".scr", ".bat", ".ps1"]
SUSPICIOUS_KEYWORDS = ["crack", "keygen", "patch", "loader", "hack"]


# ======================================================
# REAL-TIME EVENT STREAM (SSE)
# ======================================================
def event_stream():
    """Continuously emit simulated SOC events"""
    while True:
        event = {
            "timestamp": time.time(),
            "severity": random.choice(SEVERITIES),
            "message": random.choice(EVENT_MESSAGES),
            "entity": random.choice(ENTITIES),
        }
        yield f"data: {json.dumps(event)}\n\n"
        time.sleep(3)


@app.route("/api/events/stream")
def stream_events():
    return Response(
        event_stream(),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


# ======================================================
# INVESTIGATION HELPERS
# ======================================================
def analyze_ip(ip: str):
    score = 0
    reasons = []

    ip_obj = ipaddress.ip_address(ip)

    if ip_obj.is_private:
        score += 1
        reasons.append("Private IP range")

    if ip_obj.is_global:
        score += 2
        reasons.append("Public routable IP")

    if ip_obj.is_reserved or ip_obj.is_multicast:
        score += 3
        reasons.append("Reserved or multicast IP range")

    return score, reasons


def analyze_domain(domain: str):
    score = 0
    reasons = []

    try:
        resolved_ip = socket.gethostbyname(domain)
        score += 2
        reasons.append(f"DNS resolved ({resolved_ip})")
    except socket.gaierror:
        score += 4
        reasons.append("Domain does not resolve")

    if any(keyword in domain.lower() for keyword in [
        "login", "secure", "verify", "account", "update"
    ]):
        score += 2
        reasons.append("Suspicious keyword in domain")

    if domain.count("-") >= 3:
        score += 1
        reasons.append("Excessive hyphens in domain")

    return score, reasons


def calculate_risk(score: int) -> str:
    if score >= 6:
        return "CRITICAL"
    if score >= 4:
        return "HIGH"
    if score >= 2:
        return "MEDIUM"
    return "LOW"


# ======================================================
# INVESTIGATION API
# ======================================================
@app.route("/api/investigate", methods=["POST"])
def investigate():
    payload = request.get_json(silent=True) or {}
    value = payload.get("value", "").strip()

    if not value:
        return jsonify({"error": "Invalid input"}), 400

    try:
        ipaddress.ip_address(value)
        entity_type = "IP Address"
        score, reasons = analyze_ip(value)
    except ValueError:
        entity_type = "Domain"
        score, reasons = analyze_domain(value)

    return jsonify({
        "value": value,
        "type": entity_type,
        "risk": calculate_risk(score),
        "confidence": f"{min(95, 60 + score * 7)}%",
        "related_alerts": score,
        "related_incidents": max(0, score - 1),
        "analysis_reasons": reasons,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })


# ======================================================
# HEALTH CHECK
# ======================================================
@app.route("/api/health")
def health():
    return jsonify({"status": "SOC-X backend running"})


# ======================================================
# ALERT GENERATION
# ======================================================
@app.route("/api/alerts/generate", methods=["POST"])
def generate_alert():
    payload = request.get_json(silent=True) or {}
    return jsonify({
        "timestamp": time.time(),
        "severity": payload.get("severity", "MEDIUM"),
        "message": payload.get("message", "Suspicious activity detected"),
        "entity": payload.get("entity", "unknown"),
    })


# ======================================================
# BRUTE FORCE DETECTION
# ======================================================
failed_logins = {}


@app.route("/api/bruteforce/login", methods=["POST"])
def brute_force_login():
    payload = request.get_json(silent=True) or {}

    ip = payload.get("ip")
    username = payload.get("username", "unknown")
    success = payload.get("success", False)

    # Optional (keeps old behavior if not sent)
    threshold = int(payload.get("threshold", 5))
    window_seconds = int(payload.get("window", 120))

    if not ip:
        return jsonify({"error": "IP required"}), 400

    now = time.time()

    failed_logins.setdefault(ip, [])
    failed_logins[ip] = [
        t for t in failed_logins[ip] if now - t <= window_seconds
    ]

    if not success:
        failed_logins[ip].append(now)

    attempts = len(failed_logins[ip])

    alert = None
    if attempts >= threshold:
        alert = {
            "type": "Brute Force Attack",
            "severity": "HIGH" if attempts < threshold * 2 else "CRITICAL",
            "source": ip,
            "description": f"{attempts} failed login attempts for {username}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    return jsonify({
        "ip": ip,
        "attempts": attempts,
        "alert": alert,
    })



# ======================================================
# VULNERABILITY SCANNER
# ======================================================
@app.route("/api/vulnerability/scan", methods=["POST"])
def vulnerability_scan():
    payload = request.get_json(silent=True) or {}
    target = payload.get("target")

    if not target:
        return jsonify({"error": "Target required"}), 400

    findings = []

    for port, service in COMMON_PORTS.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)

        try:
            if sock.connect_ex((target, port)) == 0:
                severity = "LOW"
                if port in (21, 23):
                    severity = "HIGH"
                elif port in (3306, 3389):
                    severity = "CRITICAL"

                findings.append({
                    "port": port,
                    "service": service,
                    "severity": severity,
                    "description": f"{service} port {port} is open",
                })
        finally:
            sock.close()

    critical_findings = [
        f for f in findings if f["severity"] in ("HIGH", "CRITICAL")
    ]

    alert = None
    if critical_findings:
        alert = {
            "type": "Vulnerability Detected",
            "severity": (
                "CRITICAL"
                if any(f["severity"] == "CRITICAL" for f in critical_findings)
                else "HIGH"
            ),
            "source": target,
            "description": f"{len(critical_findings)} high-risk open ports detected",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }

    return jsonify({
        "target": target,
        "findings": findings,
        "alert": alert,
    })


# ======================================================
# MALWARE ANALYSIS
# ======================================================
@app.route("/api/malware/analyze", methods=["POST"])
def malware_analyze():
    filename = ""
    filehash = ""

    # ---------- FILE UPLOAD ----------
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "File missing"}), 400

        filename = secure_filename(file.filename).lower()
        filehash = hashlib.sha256(file.read()).hexdigest()

    # ---------- JSON PAYLOAD ----------
    elif request.is_json:
        payload = request.get_json(silent=True) or {}
        filename = payload.get("filename", "").lower()
        filehash = payload.get("hash", "").lower()

        if not filename and not filehash:
            return jsonify({"error": "Filename or hash required"}), 400
    else:
        return jsonify({"error": "Unsupported Content-Type"}), 415

    score = 0
    reasons = []

    if filehash in KNOWN_MALICIOUS_HASHES:
        score += 6
        reasons.append(
            f"Known malware hash: {KNOWN_MALICIOUS_HASHES[filehash]}"
        )

    if any(filename.endswith(ext) for ext in SUSPICIOUS_EXTENSIONS):
        score += 2
        reasons.append("Executable file type")

    if any(keyword in filename for keyword in SUSPICIOUS_KEYWORDS):
        score += 3
        reasons.append("Suspicious keyword in filename")

    if filehash and len(set(filehash)) > 20:
        score += 1
        reasons.append("High entropy hash (possible packing)")

    return jsonify({
        "filename": filename or "unknown",
        "hash": filehash or "N/A",
        "risk": calculate_risk(score),
        "confidence": f"{min(95, 60 + score * 6)}%",
        "score": score,
        "analysis_reasons": reasons,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })


# ======================================================
# SERVER ENTRYPOINT
# ======================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
