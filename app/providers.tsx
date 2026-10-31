"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollValue = {
  reducedMotion: boolean;
  /** Scroll to a target (selector or absolute Y), off on touch / reduced motion */
  scrollTo: (target: string | number, offset?: number) => void;
};

const SmoothScrollContext = createContext<SmoothScrollValue>({
  reducedMotion: false,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Smooth wheel is a desktop nicety. On touch, Lenis's synthetic inertia fights
 * native scrolling (and rubber-band / pull-to-refresh), so we leave touch alone.
 */
const isTouchPrimary = () =>
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Held in a ref, not state: booting Lenis must not re-render the whole tree.
  const lenisRef = useRef<Lenis | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || isTouchPrimary()) return;

    const scroll = new Lenis({
      // Driven from GSAP's ticker below — a second rAF loop is the usual cause
      // of jitter and desynced ScrollTrigger pins.
      autoRaf: false,
      smoothWheel: true,
      duration: 1.05,
      wheelMultiplier: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Never set a scrollerProxy here: Lenis scrolls the document.
    });

    scroll.on("scroll", ScrollTrigger.update);

    // gsap.ticker passes seconds; lenis.raf wants milliseconds.
    const tick = (time: number) => scroll.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    lenisRef.current = scroll;

    return () => {
      gsap.ticker.remove(tick);
      lenisRef.current = null;
      scroll.destroy();
    };
  }, []);

  const scrollTo = useCallback(
    (target: string | number, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          duration: reducedMotion ? 0 : 1.2,
          immediate: reducedMotion,
        });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: reducedMotion ? "auto" : "smooth" });
      } else {
        document.querySelector(target)?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [reducedMotion],
  );

  const value = useMemo<SmoothScrollValue>(
    () => ({ reducedMotion, scrollTo }),
    [reducedMotion, scrollTo],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScrollContext.Provider value={value}>
        {children}
      </SmoothScrollContext.Provider>
    </QueryClientProvider>
  );
}
