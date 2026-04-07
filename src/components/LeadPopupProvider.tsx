"use client";

import { createContext, useContext, useState } from "react";
import LeadPopup from "./LeadPopup";

const LeadPopupContext = createContext<{ open: () => void; openWithPlan: (plan: string) => void }>({ open: () => {}, openWithPlan: () => {} });

export function useLeadPopup() {
  return useContext(LeadPopupContext);
}

export function LeadPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  function handleOpen() {
    setSelectedPlan("");
    setIsOpen(true);
  }

  function handleOpenWithPlan(plan: string) {
    setSelectedPlan(plan);
    setIsOpen(true);
  }

  return (
    <LeadPopupContext.Provider value={{ open: handleOpen, openWithPlan: handleOpenWithPlan }}>
      {children}
      <LeadPopup isOpen={isOpen} onClose={() => setIsOpen(false)} defaultPlan={selectedPlan} />
    </LeadPopupContext.Provider>
  );
}
