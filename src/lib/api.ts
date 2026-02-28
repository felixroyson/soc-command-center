const API_BASE = "http://127.0.0.1:5000";

/* ======================================================
   INTERNAL RESPONSE HANDLER
====================================================== */
async function handleResponse(
  response: Response,
  fallbackError: string
) {
  if (!response.ok) {
    let message = fallbackError;

    try {
      const errorBody = await response.json();
      message = errorBody.error || message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

/* ======================================================
   HEALTH CHECK
====================================================== */
export async function checkBackend() {
  const response = await fetch(`${API_BASE}/api/health`);
  return handleResponse(response, "Backend not reachable");
}

/* ======================================================
   INVESTIGATION
====================================================== */
export async function investigateValue(value: string) {
  const response = await fetch(`${API_BASE}/api/investigate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  return handleResponse(response, "Investigation failed");
}

/* ======================================================
   MALWARE ANALYSIS (FILE UPLOAD)
====================================================== */
export async function analyzeMalware(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/malware/analyze`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response, "Malware analysis failed");
}

/* ======================================================
   BRUTE FORCE DETECTION
====================================================== */
export async function reportLoginAttempt(payload: {
  ip: string;
  username: string;
  success: boolean;
}) {
  const response = await fetch(`${API_BASE}/api/bruteforce/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response, "Brute force API failed");
}

/* ======================================================
   VULNERABILITY SCAN
====================================================== */
export async function runVulnerabilityScan(payload: {
  target: string;
  profile: "fast" | "balanced" | "deep";
}) {
  const response = await fetch(`${API_BASE}/api/vulnerability/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response, "Vulnerability scan failed");
}
