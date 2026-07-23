"use client";

import { useCallback, useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";
import LocationSelectionModal from "./LocationSelectionModal";

type SplashGateProps = {
  children: React.ReactNode;
};

type EntryPhase = "boot" | "splash" | "location" | "ready";

/**
 * Entry experience: Splash → Location Selection Modal → site.
 * Does not alter page layouts — only gates first paint.
 */
export default function SplashGate({ children }: SplashGateProps) {
  const [phase, setPhase] = useState<EntryPhase>("boot");

  useEffect(() => {
    const splashSeen = sessionStorage.getItem("piazzo-splash-seen") === "1";
    const locationSet = sessionStorage.getItem("piazzo-location") !== null;

    if (!splashSeen) {
      setPhase("splash");
      return;
    }
    if (!locationSet) {
      setPhase("location");
      return;
    }
    setPhase("ready");
  }, []);

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem("piazzo-splash-seen", "1");
    setPhase("location");
  }, []);

  const handleLocationComplete = useCallback(
    (selection: { mode: string; label: string }) => {
      sessionStorage.setItem("piazzo-location", JSON.stringify(selection));
      setPhase("ready");
    },
    [],
  );

  if (phase === "boot") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#121212]" aria-hidden />
    );
  }

  const blocking = phase === "splash" || phase === "location";

  return (
    <>
      {phase === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} durationMs={1750} />
      )}
      {phase === "location" && (
        <LocationSelectionModal
          open
          onComplete={handleLocationComplete}
        />
      )}
      <div
        className={
          blocking
            ? "pointer-events-none min-h-full opacity-0"
            : "min-h-full opacity-100 transition-opacity duration-500 ease-out"
        }
        aria-hidden={blocking}
      >
        {children}
      </div>
    </>
  );
}
