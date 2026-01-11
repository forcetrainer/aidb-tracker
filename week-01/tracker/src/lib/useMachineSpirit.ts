"use client";

import { useState, useCallback, useRef } from "react";
import { SPIRIT_MESSAGES } from "@/components/MachineSpirit";

type SpiritMessage = { text: string; color: "green" | "amber" };

interface MachineState {
  isOpen: boolean;
  messages: SpiritMessage[];
  header: string;
}

export function useMachineSpirit() {
  const [state, setState] = useState<MachineState>({
    isOpen: false,
    messages: [],
    header: "MACHINE SPIRIT RESPONSE",
  });
  const hasGreetedRef = useRef(false);

  const showDialog = useCallback((messages: SpiritMessage[], header?: string) => {
    setState({
      isOpen: true,
      messages,
      header: header || "MACHINE SPIRIT RESPONSE",
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  // === Public API ===

  const greet = useCallback(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    showDialog(SPIRIT_MESSAGES.greeting(), "SYSTEM INITIALIZATION");
  }, [showDialog]);

  const sanctify = useCallback((riteNumber: number, riteTitle: string) => {
    showDialog(SPIRIT_MESSAGES.sanctify(riteNumber, riteTitle), "SANCTIFICATION CONFIRMED");
  }, [showDialog]);

  const unsanctify = useCallback((riteNumber: number) => {
    showDialog(SPIRIT_MESSAGES.unsanctify(riteNumber), "STATUS UPDATE");
  }, [showDialog]);

  const accessDataShrine = useCallback((riteTitle: string) => {
    showDialog(SPIRIT_MESSAGES.accessDataShrine(riteTitle), "DATA-SHRINE ACCESS");
  }, [showDialog]);

  const allComplete = useCallback(() => {
    showDialog(SPIRIT_MESSAGES.allComplete(), "++ MISSION COMPLETE ++");
  }, [showDialog]);

  const showProgress = useCallback((completed: number) => {
    showDialog(SPIRIT_MESSAGES.progressUpdate(completed), "PROGRESS REPORT");
  }, [showDialog]);

  return {
    isOpen: state.isOpen,
    messages: state.messages,
    header: state.header,
    closeDialog,
    greet,
    sanctify,
    unsanctify,
    accessDataShrine,
    allComplete,
    showProgress,
  };
}
