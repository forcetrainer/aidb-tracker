"use client";

import { useState, useEffect, useCallback } from "react";
import { Weekend, TrackerState, WeekendScorecard } from "./types";
import { initialWeekends } from "./data";

const STORAGE_KEY = "ai-resolution-tracker";

// Helper to get current mode from cookie
function getMode(): "authenticated" | "demo" | "splash" {
  if (typeof document === "undefined") return "splash";
  if (document.cookie.includes("mode=authenticated")) return "authenticated";
  if (document.cookie.includes("mode=demo")) return "demo";
  // No cookie = splash mode
  return "splash";
}

export function useTracker() {
  const [weekends, setWeekends] = useState<Weekend[]>(initialWeekends);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<"authenticated" | "demo" | "splash">("splash");

  const isDemo = mode === "demo";

  // Load from localStorage on mount (only if authenticated)
  useEffect(() => {
    const currentMode = getMode();
    setMode(currentMode);

    if (currentMode === "authenticated") {
      // Only load saved state if authenticated
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed: TrackerState = JSON.parse(stored);
          setWeekends(parsed.weekends);
        } catch {
          // If parsing fails, use initial data
          setWeekends(initialWeekends);
        }
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever weekends change (only if authenticated)
  useEffect(() => {
    if (isLoaded && mode === "authenticated") {
      const state: TrackerState = {
        weekends,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [weekends, isLoaded, mode]);

  const toggleComplete = useCallback((id: number) => {
    setWeekends((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
  }, []);

  const updateNotes = useCallback((id: number, notes: string) => {
    setWeekends((prev) =>
      prev.map((w) => (w.id === id ? { ...w, notes } : w))
    );
  }, []);

  const updateScorecard = useCallback(
    (id: number, field: keyof WeekendScorecard, value: number) => {
      setWeekends((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, scorecard: { ...w.scorecard, [field]: value } }
            : w
        )
      );
    },
    []
  );

  const completedCount = weekends.filter((w) => w.completed).length;
  const progressPercentage = (completedCount / weekends.length) * 100;

  return {
    weekends,
    isLoaded,
    isDemo,
    toggleComplete,
    updateNotes,
    updateScorecard,
    completedCount,
    progressPercentage,
  };
}
