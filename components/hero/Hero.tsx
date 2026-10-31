"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { personal } from "@/data/portfolio";
import { useSectionScroll } from "@/lib/scroll";
import { Wordmark } from "@/components/brand/Logo";
import AvailabilityBadge from "./AvailabilityBadge";
import SocialStrip, { MobileSocialStrip } from "./SocialStrip";
import SpinningCTA from "./SpinningCTA";
import CursorFollower from "./CursorFollower";

export default function Hero() {
  const goToSection = useSectionScroll();
  const reducedMotion = usePrefersReducedMotion();

  const entrance = (delay = 0) =>
    reducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      className="relative min-h-[100dvh] bg-black flex flex-col px-[var(--gutter)] pt-20 pb-8 md:pt-16 md:pb-16 overflow-hidden"
      style={{ zIndex: 20 }}
      aria-labelledby="hero-heading"
    >
      {/* Indigo floor light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 80%, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Interactive cursor — fine pointers only */}
      <CursorFollower />

      <AvailabilityBadge isAvailable={personal.availableForWork} />

      {/* Desktop vertical social strip */}
      <SocialStrip />

      {/* Spinning CTA */}
      <SpinningCTA />

      {/* Headline block. Desktop is bottom-anchored (mt-auto) and the slack up
          top is occupied by the social rail, the spinning CTA and the cursor
          light; a phone has none of those, so there the gap is capped and the
          breathing room falls below the content instead of above the message. */}
      <div className="z-10 mt-[12vh] md:mt-auto pt-16 md:pt-0 mb-6 md:mb-8">
        <motion.div {...entrance(0.1)} className="w-fit">
          {/* Tablet + phone CTA — the desktop equivalent is the spinning ring */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#contact");
            }}
            className="group relative overflow-hidden border border-white/25 px-5 py-3.5 flex items-center gap-3 w-fit mb-6 lg:hidden"
          >
            <span
              className="absolute inset-0 bg-white -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0"
              aria-hidden="true"
            />
            <span className="relative text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-black group-focus-visible:text-black z-10">
              Get in touch
            </span>
            <svg
              className="relative w-3 h-3 text-white z-10 transition-colors duration-300 group-hover:text-black group-focus-visible:text-black"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M1 6h10M6 1l5 5-5 5" />
            </svg>
          </a>

          <h1
            id="hero-heading"
            className="font-display font-extrabold leading-[0.9] tracking-[-0.03em] text-white uppercase text-left"
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              // Syne extrabold uppercase is ~12× the font size per line here
              // ("PRODUCTION-" measures 1204px at 100px), and the string breaks
              // after the hyphen — so this scale is what keeps the longest
              // segment inside the gutter at 360px and at 1920px.
              fontSize: "clamp(1.7rem, 7vw, 8.5rem)",
            }}
          >
            {/* Below 640px the nav carries the mark only, so the delivered
                wordmark moves down into the headline (kit responsive rule).
                It stays inside the h1: the heading's accessible name is the
                image's alt text plus the title that follows. */}
            <Wordmark
              theme="dark"
              height={26}
              className="mb-4 md:hidden"
              labelled
            />
            <span
              className="hidden md:block font-sans font-bold normal-case tracking-[0.02em] text-muted-on-dark mb-4 md:mb-6"
              style={{ fontSize: "clamp(0.875rem, 2.2vw, 1.5rem)" }}
            >
              {personal.name}
              <span className="text-faint-on-dark"> · {personal.title}</span>
            </span>
            {personal.heroHeadline[0]}
            <br />
            {personal.heroHeadline[1]}
          </h1>
        </motion.div>
      </div>

      {/* Bottom row: subtitle + resume */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-12 w-full gap-6 md:gap-4">
        <motion.div
          {...(reducedMotion
            ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay: 0.45, ease: "easeOut" as const },
              })}
          className="col-span-1 md:col-span-6 lg:col-span-5"
        >
          <p className="font-sans text-[0.8125rem] md:text-[0.9375rem] font-normal text-muted-on-dark leading-relaxed tracking-wide max-w-sm">
            {personal.heroSubtitle}
          </p>
        </motion.div>

        <motion.div
          {...(reducedMotion
            ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay: 0.55, ease: "easeOut" as const },
              })}
          className="col-span-1 md:col-span-6 lg:col-span-7 flex flex-col items-start md:items-end gap-5 lg:pr-[178px]"
        >
          {/* Phone/tablet social rail — desktop gets the vertical strip */}
          <div className="lg:hidden">
            <MobileSocialStrip />
          </div>

          <a
            href={personal.resumeUrl}
            download
            className="tap group inline-flex items-center gap-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-on-dark hover:text-white transition-colors duration-300"
            aria-label="Download Jatin Rane's resume as a document"
          >
            Download Resume
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M6 1v8M2 7l4 4 4-4M2 11h8" />
            </svg>
          </a>
        </motion.div>
      </div>

    </section>
  );
}
