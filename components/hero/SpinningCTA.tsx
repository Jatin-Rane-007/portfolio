"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSectionScroll } from "@/lib/scroll";

/**
 * Shown at lg+ only: below that the boxed "Get in touch" link in the hero takes
 * over, because the ring needs the bottom-right corner to itself. The word ring
 * spins on a CSS keyframe and stops under prefers-reduced-motion (globals.css)
 * without disappearing — its text is this control's visible label. The
 * accessible name is on the link, which resolves #contact through the same
 * scroll path as the nav.
 */
export default function SpinningCTA() {
  const goToSection = useSectionScroll();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
      className="absolute hidden lg:flex items-center justify-center z-20 bottom-8 right-8 lg:right-12"
    >
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          goToSection("#contact");
        }}
        aria-label="Get in touch — go to the contact section"
        className="cta-wrap group relative flex items-center justify-center w-[130px] h-[130px] rounded-full"
      >
        {/* Static ring */}
        <svg
          viewBox="0 0 130 130"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <circle
            cx="65"
            cy="65"
            r="62"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
        </svg>

        {/* Spinning text ring */}
        <svg
          viewBox="0 0 130 130"
          className="cta-ring absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <path
              id="cta-circle-path"
              d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
            />
          </defs>
          <text
            fill="rgba(255,255,255,0.7)"
            fontSize="8"
            fontWeight="700"
            letterSpacing="3.5"
            // next/font hashes the family name, so a literal "Inter" attribute
            // would not load it — the token has to come through style.
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            <textPath href="#cta-circle-path">
              GET IN TOUCH · GET IN TOUCH · GET IN TOUCH ·&nbsp;
            </textPath>
          </text>
        </svg>

        {/* Hover / focus fill — transform only, never scale-0 with layout props */}
        <span
          className="absolute inset-4 rounded-full bg-white scale-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-100 group-focus-visible:scale-100"
          aria-hidden="true"
        />

        {/* Arrow icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 w-5 h-5 text-white transition-colors duration-300 group-hover:text-black group-focus-visible:text-black"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </a>
    </motion.div>
  );
}
