"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { experience, education } from "@/data/portfolio";

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [runway, setRunway] = useState(800);

  // The reveal is driven by the first viewport of scroll after the hero.
  useEffect(() => {
    const measure = () => setRunway(window.innerHeight);
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollY } = useScroll();

  /** Scroll-linked reveal for one block, expressed as fractions of the runway. */
  const useScrollStep = (from: number, to: number) => {
    const y = useTransform(scrollY, [runway * from, runway * to], [70, 0]);
    const opacity = useTransform(scrollY, [runway * from, runway * (to - 0.08)], [0, 1]);
    return reducedMotion ? { y: 0, opacity: 1 } : { y, opacity };
  };

  const label = useScrollStep(0, 0.35);
  const edu = useScrollStep(0.08, 0.45);
  const work = useScrollStep(0.18, 0.55);
  const focus = useScrollStep(0.28, 0.65);

  const exp = experience[0];
  const school = education[0];

  const focusAreas = [
    "React Native Mobile Engineering",
    "Cross-Platform iOS & Android",
    "Real-Time Systems & WebSocket",
    "Compliance-Critical Flow Design",
  ];

  return (
    <section
      ref={rootRef}
      className="w-full bg-white text-black font-sans px-[var(--gutter)] py-20 md:py-0 md:h-[100dvh] md:overflow-hidden flex items-center"
      aria-labelledby="about-heading"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-12 w-full max-w-[1600px] mx-auto">
        <motion.h2
          className="md:col-span-3 lg:col-span-3 eyebrow text-faint-on-light"
          style={label}
        >
          <span id="about-heading">Background &amp; Data</span>
        </motion.h2>

        <div className="md:col-span-9 lg:col-span-9">
          <dl className="flex flex-col gap-10 md:gap-12 m-0">
            {/* Education */}
            <motion.div style={edu} className="flex flex-col gap-1.5">
              <dt className="eyebrow text-faint-on-light mb-1">Education</dt>
              <dd className="m-0 flex flex-col gap-1">
                <span
                  className="font-display font-bold leading-tight tracking-tight"
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                  }}
                >
                  {school.institution}
                </span>
                <span className="font-sans text-muted-on-light leading-tight text-[0.9375rem] md:text-[clamp(1rem,1.8vw,1.4rem)]">
                  {school.degree} · {school.period} · CPI {school.cpi}
                </span>
              </dd>
            </motion.div>

            {/* Experience */}
            <motion.div style={work} className="flex flex-col gap-3">
              <dt className="eyebrow text-faint-on-light mb-1">Experience</dt>
              <dd className="m-0 flex flex-col gap-5">
                <div>
                  <span
                    className="font-display font-bold leading-tight tracking-tight block"
                    style={{
                      fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
                    }}
                  >
                    {exp.company}
                  </span>
                  <span className="font-sans text-muted-on-light text-[0.9375rem] block">
                    {exp.role} · {exp.period} · {exp.location}
                  </span>
                </div>
                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                  {exp.clients.map((client) => (
                    <li key={client.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span
                        className="inline-block px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-white"
                        style={{
                          backgroundColor:
                            client.name === "Saayam" ? "#6366f1" : "#8b5cf6",
                        }}
                      >
                        {client.stack}
                      </span>
                      <span className="font-sans text-[0.9375rem] text-muted-on-light">
                        <span className="font-semibold text-foreground">{client.name}</span>
                        {" — "}
                        {client.domain}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>

            {/* Focus */}
            <motion.div style={focus} className="flex flex-col gap-2">
              <dt className="eyebrow text-faint-on-light mb-1">Focus</dt>
              <dd className="m-0">
                <ul className="flex flex-col gap-0.5 m-0 p-0 list-none">
                  {focusAreas.map((item) => (
                    <li
                      key={item}
                      className="font-display font-bold leading-tight tracking-tight text-muted-on-light"
                      style={{
                        fontSize: "clamp(1rem, 2vw, 1.6rem)",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </motion.div>
          </dl>
        </div>
      </div>
    </section>
  );
}
