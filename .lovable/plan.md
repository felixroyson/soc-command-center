

# SOC-X — Real-Time Security Operations Center Dashboard

A fully responsive, modern security analyst console with demo authentication, live simulation mode, and a sleek purple-accented dark theme.

---

## 🔐 1. Authentication System
**Login page with demo credentials**

- Professional login screen with SOC-X branding
- Username and password inputs with "Demo credentials" helper text displayed prominently (admin / socx123)
- Client-side authentication with session state persistence
- Inline error handling for wrong credentials
- Smooth transition to dashboard (no page reload)

---

## 🎨 2. Visual Design System
**Dark theme with purple/violet glassmorphism**

- Dark charcoal background with subtle gradients
- Purple/violet accent colors for highlights, buttons, and interactive elements
- Glassmorphism cards with frosted glass effects and soft shadows
- Professional, calm typography with clear hierarchy
- Consistent color-coded severity badges (Critical = red, High = orange, Medium = yellow, Low = green)

---

## 🧭 3. Sidebar Navigation
**Persistent navigation with all 7 sections**

- Collapsible sidebar that persists across views
- Active route highlighting
- Navigation items: Dashboard, Alerts, Incidents, Brute Force, Vulnerabilities, Malware, Settings
- Logout button that returns to login screen
- Mobile-friendly hamburger menu

---

## 📊 4. Dashboard Page
**Central command center with live metrics**

- **KPI Cards**: Total Alerts, Critical Incidents, Blocked IPs, Quarantined Files
- **Threat Level Indicator**: Visual gauge from LOW to CRITICAL
- **Alerts Timeline**: Chart placeholder showing activity over time
- **Live Event Stream**: Append-only feed that updates when simulation mode is active

---

## 🚨 5. Alerts Page
**Alert management console**

- Search bar with filters
- Scrollable alerts list with severity badges
- Each alert shows timestamp, source, type, and severity
- "Clear Alerts" button
- "Export Alerts" button (downloads as JSON/CSV)
- New alerts append at top when simulation is on

---

## 📌 6. Incidents Page
**Incident tracking and resolution**

- Data table with columns: ID, Title, Severity, Status, Event Count
- Click any row to open a side drawer with full details
- Resolve/Reopen action buttons
- Filter by status (Open, Resolved, All)

---

## 🛑 7. Brute Force Detection Page
**Monitor and block brute force attacks**

- **Check Brute Force** button (manual trigger)
- **Threshold selector**: 3 / 5 / 10 failed attempts
- **Time window selector**: 5 min / 15 min
- Results table: Attacker IP, Failed Attempts, Last Seen, Severity, Status
- Actions per row: Block IP, Open Incident

---

## 🧱 8. Vulnerabilities Page
**Vulnerability scanning interface**

- **Target input**: IP or hostname field
- **Scan profile dropdown**: Fast / Balanced / Deep
- **Run Scan** button
- **Scan Summary**: Open ports, High/Medium/Low risk counts
- Results table: Port, Service, Risk Level, Description, Recommended Action

---

## 🦠 9. Malware Analysis Page
**File scanning and quarantine**

- File upload component with drag-and-drop
- "Upload & Scan" button
- Results table: Filename, Verdict (Clean/Malicious/Suspicious), Risk, Reason
- "Generate Test Malware" button to add demo samples
- Quarantine action for suspicious files

---

## ⚙️ 10. Settings Page
**Configuration toggles**

- **Simulation Mode**: Toggle live event generation on/off
- **Critical Alert Sound**: Toggle (off by default)
- **Auto-block brute force IPs**: Toggle
- **Auto-quarantine malware**: Toggle
- Clean toggle switches with labels and descriptions

---

## 🔄 11. Live Simulation Engine
**Optional real-time event generation**

- When Simulation Mode is ON in settings:
  - New alerts slowly append to the Alerts page
  - Live Event Stream on Dashboard updates
  - Occasional incidents are created
  - Metrics update dynamically
- All updates are non-intrusive (append-only, no page reloads)
- Users can disable at any time

---

## 📱 12. Responsive Design
**Works on all devices**

- Desktop: Full sidebar, multi-column layouts
- Tablet: Collapsible sidebar, optimized grid
- Mobile: Hamburger menu, stacked cards, touch-friendly inputs

