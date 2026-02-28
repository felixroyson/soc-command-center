import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { InvestigationBar } from "./InvestigationBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* ================================
            TOP HEADER (GLOBAL CONTROLS)
        ================================ */}
        <header
          className="
            fixed top-0 left-0 right-0 lg:left-64 h-16 z-30
            bg-background/80 backdrop-blur-md
            border-b border-border
            flex items-center px-4 lg:px-8
          "
        >
          <div className="ml-auto">
            <InvestigationBar />
          </div>
        </header>

        {/* ================================
            PAGE CONTENT
        ================================ */}
        <main className="flex-1 pt-16 px-4 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
