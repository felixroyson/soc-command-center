import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./DashboardPage";
import AlertsPage from "./AlertsPage";
import IncidentsPage from "./IncidentsPage";
import BruteForcePage from "./BruteForcePage";
import VulnerabilitiesPage from "./VulnerabilitiesPage";
import MalwarePage from "./MalwarePage";
import SettingsPage from "./SettingsPage";
import InvestigationPage from "./InvestigationPage";
import NotFound from "./NotFound";

const Index = () => {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Core Pages */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/incidents" element={<IncidentsPage />} />
      <Route path="/brute-force" element={<BruteForcePage />} />
      <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
      <Route path="/malware" element={<MalwarePage />} />
      <Route path="/settings" element={<SettingsPage />} />

      {/* 🔍 Investigation */}
      <Route path="/investigation" element={<InvestigationPage />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
