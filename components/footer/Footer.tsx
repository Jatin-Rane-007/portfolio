"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useRef } from "react";
import { personal } from "@/data/portfolio";
import { JrMark, Wordmark } from "@/components/brand/Logo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    } as const,
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
} as const;

// Reduced motion: same labels, identical states, so nothing propagates a tween.
const STILL_CONTAINER = { hidden: { opacity: 1 }, visible: { opacity: 1 } };
const STILL_ITEM = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

const linkClass =
  "tap font-sans text-xs md:text-sm font-medium uppercase tracking-wide w-fit text-muted-on-dark hover:text-white transition-colors duration-300 underline-offset-4 decoration-[0.5px] hover:underline";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const year = new Date().getFullYear();

  const colophon = [
    "Built with: Next.js / React / TypeScript / GSAP",
    "Typeface: Syne / Inter",
    "Deployed on: Vercel",
  ];

  const container = reducedMotion ? STILL_CONTAINER : containerVariants;
  const item = reducedMotion ? STILL_ITEM : itemVariants;

  return (
    <footer
      ref={footerRef}
      className="bg-black text-white font-sans pt-12 md:pt-20 min-h-[100dvh] flex flex-col border-t border-white/10"
      aria-label="Site footer"
    >
      {/* Info grid */}
      <motion.div
        className="shell w-full grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-12 shrink-0"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Column 1: Identification */}
        <motion.div variants={item} className="flex flex-col gap-1">
          <h3 className="eyebrow mb-5 text-faint-on-dark">Identification</h3>
          <p className="text-sm font-medium uppercase tracking-wide leading-relaxed">
            {personal.name}
          </p>
          <p className="text-sm font-medium uppercase tracking-wide leading-relaxed text-muted-on-dark">
            {personal.title}
          </p>
          <p className="text-sm font-medium uppercase tracking-wide leading-relaxed text-muted-on-dark">
            {personal.location}
          </p>
        </motion.div>

        {/* Column 2: Channels */}
        <motion.div variants={item} className="flex flex-col gap-1">
          <h3 className="eyebrow mb-5 text-faint-on-dark">Channels</h3>
          <div className="flex flex-col gap-1">
            <a href={`mailto:${personal.email}`} className={linkClass}>
              Email ↗
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn ↗
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub ↗
            </a>
            <a href={personal.resumeUrl} download className={linkClass}>
              Resume ↓
            </a>
          </div>
        </motion.div>

        {/* Column 3: Colophon + Year */}
        <motion.div
          variants={item}
          className="flex flex-col justify-between gap-8 md:h-full"
        >
          <div className="flex flex-col gap-1">
            <h3 className="eyebrow mb-5 text-faint-on-dark">Colophon</h3>
            {colophon.map((line) => (
              <p
                key={line}
                className="text-xs md:text-sm font-medium uppercase tracking-wide text-muted-on-dark"
              >
                {line}
              </p>
            ))}
          </div>
          <p className="m-0 eyebrow text-faint-on-dark">© {year} {personal.name}</p>
        </motion.div>
      </motion.div>

      {/* Giant branding lockup — the delivered wordmark, not re-typeset type:
          the brand spec forbids setting the name in a webfont, and the fixed
          artwork brings its own Aura surname and Spark pixel. */}
      <motion.div
        style={reducedMotion ? undefined : { opacity: textOpacity, scale: textScale }}
        className="w-full flex-1 flex flex-col justify-center items-center gap-3 md:gap-5 overflow-hidden select-none pb-4 px-[var(--gutter)]"
        aria-hidden="true"
      >
        <JrMark height={54} title="" className="text-[var(--logo-aura)]" />
        <Wordmark
          theme="dark"
          height={120}
          labelled={false}
          className="w-full max-w-[1200px] h-auto max-h-[20vh]"
        />
      </motion.div>
    </footer>
  );
}
