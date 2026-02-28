/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";
import type { TimelineEvent } from "@/types/timeline";

/* ==============================
   Types
============================== */
interface TimelineContextType {
  events: TimelineEvent[];
  addEvent: (event: TimelineEvent) => void;
  clearTimeline: () => void;
}

/* ==============================
   Context
============================== */
const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

/* ==============================
   Provider
============================== */
export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const addEvent = (event: TimelineEvent) => {
    setEvents((prev) => [event, ...prev]);
  };

  const clearTimeline = () => {
    setEvents([]);
  };

  return (
    <TimelineContext.Provider value={{ events, addEvent, clearTimeline }}>
      {children}
    </TimelineContext.Provider>
  );
}

/* ==============================
   Hook
============================== */
export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error("useTimeline must be used inside TimelineProvider");
  }
  return ctx;
}
