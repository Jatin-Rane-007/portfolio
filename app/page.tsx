"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import Navigation from "@/components/navigation/Navigation";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import SelectedWorks from "@/components/works/SelectedWorks";
import OpenSource from "@/components/works/OpenSource";
import VectorBridge from "@/components/skills/VectorBridge";
import Stats from "@/components/stats/Stats";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";

export default function Home() {
  const footerContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: footerContainerRef,
    offset: ["start end", "end end"],
  });

  // Parallax footer: starts above and moves to natural position.
  // Under reduced motion the footer simply sits where it belongs.
  const footerY = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <div className="min-h-[100dvh] relative" style={{ background: "#0a0a0a" }}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Navigation — fixed, z-50 */}
      <Navigation />

      <main id="main">
        {/* ============================================================
            HERO — full viewport, scrolls away
            ============================================================ */}
        <Hero />

        {/* ============================================================
            ABOUT — mobile: normal flow so nothing is clipped.
            md+: a fixed layer under the spacer, revealed as the hero peels
            away. Same markup, one breakpoint, no JS branch.
            ============================================================ */}
        {/* In-flow anchor: its document offset is where the About layer sits at
            both breakpoints, so nav can resolve #about reliably. */}
        <span id="about" aria-hidden="true" />
        <div className="relative z-0 bg-white md:fixed md:inset-0">
          <About />
        </div>
        <div
          className="hidden md:block h-[100dvh] w-full pointer-events-none"
          aria-hidden="true"
        />

        {/* ============================================================
            CONTENT STACK — scrolls above the fixed About layer
            ============================================================ */}
        <div className="relative z-20 w-full bg-transparent">
          <div className="bg-black text-white relative z-20">
            <SelectedWorks />
          </div>

          {/* Open source shelf — public repos, still part of the work story */}
          <div className="bg-black text-white relative z-20">
            <OpenSource />
          </div>

          {/* VectorBridge → Skills portal */}
          <div className="bg-white text-black relative z-20">
            <VectorBridge />
          </div>

          {/* Stats — black section */}
          <div className="bg-black text-white relative z-20">
            <Stats />
          </div>

          {/* Contact — white section, scrolls over footer */}
          <div className="relative z-20 bg-white text-black">
            <Contact />
          </div>
        </div>
      </main>

      {/* ============================================================
          PARALLAX FOOTER REVEAL
          ============================================================ */}
      {/* Height comes from the footer itself: a fixed 100dvh wrapper would clip
          the stacked mobile columns. The translate is still clipped at the top,
          which is what makes the reveal read as parallax. */}
      <div
        ref={footerContainerRef}
        className="relative z-0 w-full overflow-hidden bg-black text-white"
      >
        <motion.div
          style={reducedMotion ? undefined : { y: footerY }}
          className="h-full w-full"
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
