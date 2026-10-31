"use client";

import { motion } from "framer-motion";
import FlowingMenu from "./FlowingMenu";
import { philosophy } from "@/data/portfolio";

/**
 * The skills surface. Rendered in flow on mobile / reduced motion, and inside
 * the expanding portal on wide screens — same markup either way, so the content
 * never depends on the animation having run.
 */
export default function SkillsPhilosophy() {
  return (
    <div className="bg-white text-black font-sans flex flex-col justify-center min-h-[100dvh] py-16 md:py-8">
      {/* Quote */}
      <div className="shell w-full py-8 md:py-4 bg-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-5 gap-y-8 gap-x-12"
        >
          <div className="md:col-span-1">
            <h2
              id="skills-heading"
              className="eyebrow text-faint-on-light"
            >
              Skills &amp; Philosophy
            </h2>
          </div>

          <div className="md:col-span-4">
            <blockquote
              className="m-0 font-display font-black uppercase leading-[1.02] tracking-tight"
              style={{
                // Sized so the whole surface still fits one viewport at lg, where
                // it is revealed inside the expanding portal (which clips).
                fontSize: "clamp(1.5rem, 3.6vw, 3.5rem)",
              }}
            >
              &ldquo;{philosophy.quote}&rdquo;
            </blockquote>
            <p className="mt-5 font-sans text-sm text-faint-on-light font-medium tracking-wide">
              — {philosophy.author}
            </p>

            <p className="mt-8 font-sans text-base text-muted-on-light leading-relaxed max-w-lg">
              For me, that means owning cross-platform edge cases, building
              real-time messaging systems that degrade gracefully, and writing
              compliance flows that actually work in production.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Skills */}
      <div className="w-full mt-6">
        <FlowingMenu />
      </div>
    </div>
  );
}
