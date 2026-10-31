"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { projects } from "@/data/portfolio";
import ScrollStackCard from "./ScrollStackCard";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Cards pile up with a small vertical offset so the stack edge stays visible. */
const STICK_TOP = "calc(12dvh + var(--stack-i, 0) * 14px)";

export default function SelectedWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion: the CSS sticky deck stays (it is layout, not animation),
    // the scrubbed scale and the rotating arc are dropped.
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".deck-slot");

      // Each card settles out of the deck as the next one climbs over it:
      // transform + opacity only, so every frame stays on the compositor.
      cards.slice(0, -1).forEach((slot, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.fromTo(
          slot,
          { scale: 1, yPercent: 0 },
          {
            scale: 0.955,
            yPercent: -2.5,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top 12dvh",
              scrub: 0.6,
            },
          },
        );
      });

      // Kinetic arc: rotates with the deck's scroll progress, desktop only.
      const wheel = wheelRef.current;
      if (wheel && window.matchMedia("(min-width: 768px)").matches) {
        gsap.set(wheel, { autoAlpha: 0, transformOrigin: "50% 100%" });
        gsap.fromTo(
          wheel,
          { rotation: 0 },
          {
            rotation: 26,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 60%",
              // Stop with the deck, not the section: the runway after the last
              // card would otherwise leave a clipped arc floating in the gap.
              end: "bottom bottom",
              scrub: 1,
              onEnter: () => gsap.set(wheel, { autoAlpha: 1 }),
              onEnterBack: () => gsap.set(wheel, { autoAlpha: 1 }),
              onLeave: () => gsap.set(wheel, { autoAlpha: 0 }),
              onLeaveBack: () => gsap.set(wheel, { autoAlpha: 0 }),
            },
          },
        );
      }
    }, rootRef);

    // Syne loads async; re-measure once it lands so trigger ends stay true.
    if (document.fonts?.status === "loading") {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="work"
      className="bg-black text-white relative"
      aria-labelledby="work-heading"
    >
      <div className="w-full h-[22dvh] md:h-[28dvh] lg:h-[42dvh] border-b border-white/10 overflow-hidden flex items-center relative z-10 bg-black">
        <div className="marquee-selected-works" aria-hidden="true">
          <div className="marquee-selected-works__track">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="marquee-selected-works__segment">
                <span className="marquee-selected-works__text">
                  Selected Works
                </span>
                <span className="marquee-selected-works__dash">—</span>
              </div>
            ))}
          </div>
        </div>
        {/* The marquee is decoration; the heading is the accessible name. */}
        <h2
          id="work-heading"
          className="absolute bottom-4 left-[var(--gutter)] text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-faint-on-dark"
        >
          Client work in production
        </h2>
      </div>

      {/* Stacked deck: CSS sticky carries the structure (works on touch, with or
          without JS), GSAP only adds the settle-out scale. */}
      <div className="deck px-[var(--gutter)] py-12 md:py-16">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="deck-slot sticky"
            style={
              {
                top: STICK_TOP,
                "--stack-i": index,
                zIndex: 10 + index,
              } as React.CSSProperties
            }
          >
            <ScrollStackCard project={project} index={index} />
          </div>
        ))}
        {/* Runway so the last card can be read before the section ends */}
        <div className="h-[60dvh] pointer-events-none" aria-hidden="true" />
      </div>

      {/* Kinetic arc */}
      <div
        ref={wheelRef}
        className="pointer-events-none hidden md:block"
        style={{
          position: "fixed",
          bottom: "-16dvh",
          left: 0,
          width: "100vw",
          zIndex: 0,
          visibility: "hidden",
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 3000 1500"
          className="w-full h-auto"
          style={{ overflow: "visible" }}
        >
          <path
            id="arc-path"
            d="M 400,1500 A 1100,1100 0 0,1 2600,1500"
            fill="none"
            stroke="none"
          />
          {[
            { text: "ANALYZE", offset: "15%" },
            { text: "·", offset: "27%" },
            { text: "DESIGN", offset: "38%" },
            { text: "·", offset: "50%" },
            { text: "BUILD", offset: "62%" },
            { text: "·", offset: "73%" },
            { text: "DELIVER", offset: "85%" },
          ].map((item, i) => (
            <text
              key={i}
              fill="rgba(99,102,241,0.14)"
              style={{
                // SVG text inherits from <body>, so the display face has to be
                // restated here (var() only works in style, not in an attribute)
                fontFamily: "var(--font-syne, sans-serif)",
                fontWeight: 800,
                fontSize: item.text === "·" ? "80px" : "120px",
              }}
              dy={item.text === "·" ? "-10" : "0"}
            >
              <textPath href="#arc-path" startOffset={item.offset} textAnchor="middle">
                {item.text}
              </textPath>
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
