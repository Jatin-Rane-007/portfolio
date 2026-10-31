"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AvailabilityBadgeProps {
  isAvailable?: boolean;
}

export default function AvailabilityBadge({
  isAvailable = true,
}: AvailabilityBadgeProps) {
  const reducedMotion = usePrefersReducedMotion();

  // Sits below the fixed header: at the very top it collided with the logo.

  return (
    <motion.p
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.3 }}
      className="absolute top-[5.25rem] left-[var(--gutter)] md:top-[5.5rem] z-20 flex items-center gap-2.5 m-0"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {isAvailable && !reducedMotion && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isAvailable ? "bg-emerald-400" : "bg-white/45"
          }`}
        />
      </span>
      <span className="eyebrow text-muted-on-dark">
        {isAvailable ? "Available for work" : "Not available"}
      </span>
    </motion.p>
  );
}
