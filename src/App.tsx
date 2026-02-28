import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TimelineProvider } from "@/contexts/TimelineContext";
import { SimulationProvider } from "@/contexts/SimulationContext";
import { InvestigationProvider } from "@/contexts/InvestigationContext";

import { LoginPage } from "@/components/LoginPage";
import { DashboardLayout } from "@/components/DashboardLayout";

import DashboardPage from "@/pages/DashboardPage";
import AlertsPage from "@/pages/AlertsPage";
import IncidentsPage from "@/pages/IncidentsPage";
import BruteForcePage from "@/pages/BruteForcePage";
import VulnerabilitiesPage from "@/pages/VulnerabilitiesPage";
import MalwarePage from "@/pages/MalwarePage";
import SettingsPage from "@/pages/SettingsPage";
import InvestigationPage from "@/pages/InvestigationPage";
import NotFound from "@/pages/NotFound";

/* ==============================
   React Query Client
============================== */
const queryClient = new QueryClient();

/* ==============================
   Protected Route
============================== */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

/* ==============================
   Routes
============================== */
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><IncidentsPage /></ProtectedRoute>} />
      <Route path="/brute-force" element={<ProtectedRoute><BruteForcePage /></ProtectedRoute>} />
      <Route path="/vulnerabilities" element={<ProtectedRoute><VulnerabilitiesPage /></ProtectedRoute>} />
      <Route path="/malware" element={<ProtectedRoute><MalwarePage /></ProtectedRoute>} />
      <Route path="/investigation" element={<ProtectedRoute><InvestigationPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* ==============================
   Root App
============================== */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TimelineProvider>
            <SimulationProvider>
              <InvestigationProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </InvestigationProvider>
            </SimulationProvider>
          </TimelineProvider>
        </AuthProvider>

        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
