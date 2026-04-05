"use client";

import { createContext, useContext, useState } from "react";
import LeadPopup from "./LeadPopup";

const LeadPopupContext = createContext<{ open: () => void }>({ open: () => {} });

export function useLeadPopup() {
  return useContext(LeadPopupContext);
}

export function LeadPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LeadPopupContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <LeadPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </LeadPopupContext.Provider>
  );
}
