"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Region = "EG" | "INT";

const RegionContext = createContext<Region>("EG");

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<Region>("EG");

  useEffect(() => {
    // Check cookie first for instant value
    const match = document.cookie.match(/(?:^|; )region=(EG|INT)/);
    if (match) {
      setRegion(match[1] as Region);
      return;
    }

    // Otherwise call API to detect region
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => {
        if (data.region === "EG" || data.region === "INT") {
          setRegion(data.region);
        }
      })
      .catch(() => {
        // Default stays as EG
      });
  }, []);

  return (
    <RegionContext.Provider value={region}>{children}</RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
