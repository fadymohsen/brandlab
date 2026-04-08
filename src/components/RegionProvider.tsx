"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Region = "EG" | "INT";

const RegionContext = createContext<Region>("EG");

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<Region>("EG");

  useEffect(() => {
    // Always call the API for a fresh IP check (handles VPN/network changes)
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => {
        if (data.region === "EG" || data.region === "INT") {
          setRegion(data.region);
        }
      })
      .catch(() => {
        // On error, try reading the cookie as fallback
        const match = document.cookie.match(/(?:^|; )region=(EG|INT)/);
        if (match) {
          setRegion(match[1] as Region);
        }
      });
  }, []);

  return (
    <RegionContext.Provider value={region}>{children}</RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
