"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import SkillsPhilosophy from "./SkillsPhilosophy";
import { useMediaQuery } from "@/lib/scroll";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// The seed rectangle, before it expands into the full-viewport portal.
const SEED_W = 320;
const SEED_H = 200;

/**
 * Skills portal: a line drops from the deck above, and a small framed rectangle
 * expands into the skills surface as you scroll.
 *
 * Two shipped versions:
 * - base (mobile / reduced motion): the section simply flows. Nothing to
 *   measure, nothing to pin, content always reachable.
 * - lg+: a sticky stage scrubs the draw + expand with GSAP.
 */
export default function VectorBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isWide = useMediaQuery("(min-width: 1024px)");
  const enhanced = isWide && !reducedMotion;

  useEffect(() => {
    if (!enhanced) return;

    const ctx = gsap.context(() => {
      const line = lineRef.current;
      const portal = portalRef.current;
      const inner = innerRef.current;
      if (!line || !portal || !inner) return;

      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(portal, { autoAlpha: 1, scaleX: 1, scaleY: 1, xPercent: -50, yPercent: -50 });
      gsap.set(inner, { xPercent: -50, yPercent: -50 });

      // A proxy drives the box scale and the child's counter-scale from one
      // progress value, so text stays crisp instead of stretching.
      const grow = { p: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top -140%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(line, { scaleY: 1, duration: 0.4 }, 0)
        .fromTo(portal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.15)
        .to(grow, { p: 1, duration: 0.6, ease: "power2.inOut", onUpdate: apply }, 0.4);

      function apply() {
        const scaleX = 1 + grow.p * (window.innerWidth / SEED_W - 1);
        const scaleY = 1 + grow.p * (window.innerHeight / SEED_H - 1);
        gsap.set(portal, { scaleX, scaleY });
        gsap.set(inner, { scale: 1 / ((scaleX + scaleY) / 2) });
        gsap.set(portal, {
          borderColor: `rgba(99,102,241,${Math.max(0, 1 - grow.p / 0.45)})`,
        });
      }
    }, sectionRef);

    // Syne lands after first paint, changing text height.
    if (document.fonts?.status === "loading") {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, [enhanced]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative bg-white text-black"
      aria-labelledby="skills-heading"
      style={enhanced ? { height: "220dvh" } : undefined}
    >
      {enhanced ? (
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          {/* Dropping line — a 1px rule scaled on the compositor, not an SVG path.
              Offset by half a pixel instead of -translate-x-1/2, so GSAP owns the
              transform and the two never fight over it. */}
          <div
            ref={lineRef}
            className="absolute top-0 w-px bg-accent/70"
            style={{ left: "calc(50% - 0.5px)", height: `calc(50dvh - ${SEED_H / 2}px)` }}
            aria-hidden="true"
          />

          {/* Seed → portal */}
          <div
            ref={portalRef}
            className="absolute left-1/2 top-1/2 overflow-hidden bg-white"
            style={{
              width: `${SEED_W}px`,
              height: `${SEED_H}px`,
              border: "1px solid rgba(99,102,241,1)",
            }}
          >
            <div
              ref={innerRef}
              className="absolute left-1/2 top-1/2 h-[100dvh] w-[100vw]"
            >
              <SkillsPhilosophy />
            </div>
          </div>
        </div>
      ) : (
        <SkillsPhilosophy />
      )}
    </section>
  );
}
