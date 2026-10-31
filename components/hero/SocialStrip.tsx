"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { socials } from "@/data/portfolio";

type SocialLabel = "GitHub" | "LinkedIn" | "Email";

function Icon({ label }: { label: SocialLabel }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  if (label === "GitHub") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <line x1="2" y1="9" x2="6" y2="9" />
        <line x1="4" y1="4" x2="4" y2="20" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

const fade = (delay: number, reduced: boolean) =>
  reduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.7, delay, ease: "easeOut" as const },
      };

export default function SocialStrip() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.aside
      {...fade(0.5, reducedMotion)}
      aria-label="Elsewhere online"
      /* Centred on the right edge rather than parked in the corner, which the
         spinning CTA owns; inset-y-0 + justify-center avoids a translate that the
         fade's own transform would overwrite. */
      className="hidden lg:flex flex-col items-center justify-center gap-4 absolute right-0 xl:right-4 inset-y-0"
      style={{ zIndex: 20 }}
    >
      {socials.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          className="tap group flex flex-col items-center gap-1.5 text-muted-on-dark hover:text-white transition-colors duration-300"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <Icon label={label as SocialLabel} />
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.18em]">
            {label}
          </span>
        </a>
      ))}
      <span className="w-px h-8 bg-white/25" aria-hidden="true" />
    </motion.aside>
  );
}

export function MobileSocialStrip() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.nav
      {...fade(0.6, reducedMotion)}
      aria-label="Elsewhere online"
      className="flex items-center gap-1"
    >
      {socials.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          className="tap flex items-center justify-center w-11 h-11 text-muted-on-dark hover:text-white active:text-white transition-colors duration-300"
        >
          <Icon label={label as SocialLabel} />
        </a>
      ))}
    </motion.nav>
  );
}
