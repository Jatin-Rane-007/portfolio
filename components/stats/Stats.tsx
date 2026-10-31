"use client";

import { useEffect, useRef } from "react";
import { stats } from "@/data/portfolio";

interface SwissItemProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SwissItem({ value, suffix, label, description }: SwissItemProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  /**
   * The markup ships the real number, so it is correct before JS runs and stays
   * correct when motion is reduced. The count-up only ever overwrites textContent
   * (no per-frame React render), and the heading is labelled by the final value so
   * assistive tech never hears a number mid-flight.
   */
  useEffect(() => {
    const box = boxRef.current;
    const num = numRef.current;
    if (!box || !num) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let started = false;

    // The suffix is a static sibling; only the digits are rewritten.
    if (reduced) return;

    const run = () => {
      started = true;
      const duration = 1400;
      const startTime = performance.now();
      const tick = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        num.textContent = Math.floor(eased * value).toLocaleString();
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(box);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={boxRef} className="flex flex-col items-start">
      <span className="eyebrow mb-4 text-faint-on-dark">{label}</span>

      <h3
        className="mb-5 font-display font-bold leading-none tracking-tight text-white tabular"
        aria-label={`${value.toLocaleString()}${suffix} ${label}`}
        style={{
          fontSize: "clamp(3.5rem, 14vw, 7.5rem)",
        }}
      >
        <span ref={numRef}>{value.toLocaleString()}</span>
        {suffix}
      </h3>

      <p className="max-w-xs text-sm leading-6 text-muted-on-dark">{description}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      className="w-full bg-black text-white py-24 md:py-36"
      aria-label="Stats and achievements"
    >
      <div className="shell">
        {/* Section header */}
        <div className="mb-16 md:mb-28">
          <h2 className="eyebrow text-faint-on-dark">By the Numbers</h2>
        </div>

        {/* Swiss grid */}
        <div className="grid grid-cols-1 gap-x-20 gap-y-16 md:grid-cols-2 md:gap-y-32">
          {stats.map((stat) => (
            <SwissItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
