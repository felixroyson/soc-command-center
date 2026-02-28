import { createContext, useContext, useState } from "react";
import type { InvestigationResultData } from "@/components/InvestigationResult";
type InvestigationContextType = {
  result: InvestigationResultData | null;
  setResult: (data: InvestigationResultData | null) => void;
};

const InvestigationContext = createContext<InvestigationContextType | undefined>(
  undefined
);

export function InvestigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [result, setResult] = useState<InvestigationResultData | null>(null);

  return (
    <InvestigationContext.Provider value={{ result, setResult }}>
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const ctx = useContext(InvestigationContext);
  if (!ctx) {
    throw new Error(
      "useInvestigation must be used inside InvestigationProvider"
    );
  }
  return ctx;
}
