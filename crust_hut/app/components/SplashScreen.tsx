"use client";

import { useEffect, useMemo, useState } from "react";
import PiazzoLogo from "./PiazzoLogo";

type SplashPhase = "enter" | "hold" | "exit" | "done";

type SplashScreenProps = {
  onComplete?: () => void;
  /** Visible duration before exit begins. Default 1750ms (1.5–2s range). */
  durationMs?: number;
};

type Ember = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  opacity: number;
};

function useEmbers(count: number): Ember[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        delay: `${(i * 0.35) % 4}s`,
        duration: `${5.5 + (i % 5) * 0.7}s`,
        size: 2 + (i % 3),
        opacity: 0.25 + (i % 4) * 0.08,
      })),
    [count],
  );
}

export default function SplashScreen({
  onComplete,
  durationMs = 1750,
}: SplashScreenProps) {
  const [phase, setPhase] = useState<SplashPhase>("enter");
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const embers = useEmbers(14);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    if (mq.matches) {
      const quick = window.setTimeout(() => {
        setPhase("done");
        setVisible(false);
        onComplete?.();
      }, 350);
      return () => window.clearTimeout(quick);
    }

    const exitMs = 450;
    const startExit = window.setTimeout(() => setPhase("exit"), durationMs);
    const finish = window.setTimeout(() => {
      setPhase("done");
      setVisible(false);
      onComplete?.();
    }, durationMs + exitMs);

    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(finish);
    };
  }, [durationMs, onComplete]);

  if (!visible || phase === "done") return null;

  const isExiting = phase === "exit";

  return (
    <div
      className={`splash-root fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#121212] ${
        isExiting ? "splash-root--exit" : "splash-root--enter"
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading PIAZZO"
    >
      {/* Flame-inspired lighting */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="splash-bloom splash-bloom--primary absolute left-1/2 top-[46%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E22B20]/[14%] blur-[100px]" />
        <div className="splash-bloom splash-bloom--secondary absolute left-[20%] top-[70%] h-48 w-48 rounded-full bg-[#E22B20]/[8%] blur-[80px]" />
        <div className="splash-bloom splash-bloom--secondary absolute right-[18%] top-[28%] h-40 w-40 rounded-full bg-[#C41E16]/[10%] blur-[70px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#121212_68%)]" />
      </div>

      {/* Ember particles */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {embers.map((ember) => (
            <span
              key={ember.id}
              className="splash-ember absolute bottom-[-8%] rounded-full bg-[#E22B20]"
              style={{
                left: ember.left,
                width: ember.size,
                height: ember.size,
                opacity: ember.opacity,
                animationDelay: ember.delay,
                animationDuration: ember.duration,
                boxShadow: "0 0 6px rgba(226,43,32,0.55)",
              }}
            />
          ))}
        </div>
      )}

      {/* Centered brand lockup */}
      <div
        className={`splash-content relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center ${
          isExiting ? "splash-content--exit" : "splash-content--enter"
        }`}
      >
        <div className="splash-logo-reveal flex flex-col items-center">
          <div className="splash-mark">
            <PiazzoLogo variant="mark" markSize={80} tone="brand" />
          </div>

          <h1 className="splash-wordmark mt-6 font-[family-name:var(--font-outfit)] text-[2.75rem] font-bold leading-none tracking-[-0.03em] text-white sm:mt-7 sm:text-6xl md:text-7xl">
            PIAZZO
          </h1>

          <div
            className="splash-underline mt-5 h-0.5 w-8 origin-center bg-[#E22B20] sm:mt-6"
            aria-hidden
          />
        </div>

        <p className="splash-tagline mt-6 max-w-sm font-[family-name:var(--font-jakarta)] text-sm font-medium leading-relaxed tracking-[0.04em] text-white/60 sm:mt-7 sm:text-base sm:tracking-[0.06em]">
          Crafted with Fire. Served with Passion.
        </p>

        <div className="splash-loader mt-10 w-full max-w-[112px] sm:mt-12 sm:max-w-[128px]">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div className="splash-loader-bar h-full rounded-full bg-[#E22B20]" />
          </div>
          <span className="sr-only">Loading</span>
        </div>
      </div>
    </div>
  );
}
