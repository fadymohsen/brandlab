"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Region = "EG" | "INT";

const RegionContext = createContext<Region>("EG");

function getRegionFromCookie(): Region | null {
  const match = document.cookie.match(/(?:^|; )region=(EG|INT)/);
  return match ? (match[1] as Region) : null;
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  // Read cookie immediately for instant region (set by middleware)
  const [region, setRegion] = useState<Region>("EG");

  useEffect(() => {
    // Cookie is set by middleware on every request — read it first
    const cookieRegion = getRegionFromCookie();
    if (cookieRegion) {
      setRegion(cookieRegion);
      return;
    }

    // Fallback: call API if cookie is missing (e.g. first visit before middleware ran)
    fetch("/api/region")
      .then((res) => res.json())
      .then((data) => {
        if (data.region === "EG" || data.region === "INT") {
          setRegion(data.region);
        }
      })
      .catch(() => {
        // Default to INT if everything fails
        setRegion("INT");
      });
  }, []);

  return (
    <RegionContext.Provider value={region}>{children}</RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
