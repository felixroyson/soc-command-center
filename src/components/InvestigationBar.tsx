import { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { investigateValue } from "@/lib/api";
import { useInvestigation } from "@/contexts/InvestigationContext";
import { useSimulation } from "@/contexts/SimulationContext"; // 🔥 APPEND

function isValidInput(value: string) {
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

  const domainRegex =
    /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;

  return ipRegex.test(value) || domainRegex.test(value);
}

export function InvestigationBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setResult } = useInvestigation();
  const { addAlert } = useSimulation(); // 🔥 APPEND

  const handleInvestigate = async () => {
    if (!query.trim()) {
      setError("Input cannot be empty");
      return;
    }

    if (!isValidInput(query)) {
      setError("Enter a valid IP address or domain");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await investigateValue(query);

      setResult(data);

      // 🔥 APPEND: Generate SOC alert from investigation
      addAlert({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: "Investigation Alert",
        description: `Investigation flagged ${data.value} as ${data.risk}`,
        severity: data.risk.toLowerCase(), // matches existing UI
        source: "Investigation Engine",
      });

      navigate("/investigation");
      setQuery("");
    } catch {
      setError("Backend analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Investigate IP / Domain"
            className="h-9 w-72 rounded-md bg-muted/40 pl-9 pr-3
                       text-sm border border-border
                       focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleInvestigate()}
          />
        </div>

        <button
          onClick={handleInvestigate}
          disabled={loading}
          className="h-9 px-4 rounded-md bg-primary
                     text-primary-foreground text-sm font-medium
                     hover:bg-primary/90 transition
                     flex items-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Analyze
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
