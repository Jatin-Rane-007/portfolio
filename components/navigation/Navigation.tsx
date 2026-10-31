"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { personal, navLinks } from "@/data/portfolio";
import { useSectionScroll, useMediaQuery } from "@/lib/scroll";
import { BrandLockup } from "@/components/brand/Logo";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const goToSection = useSectionScroll();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = usePrefersReducedMotion();

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y < 80) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        // Hide-on-scroll-down is a desktop nicety. On a phone it would strand
        // the only menu button off-screen while the user still needs it.
        if (isDesktop) {
          if (y > lastScrollY.current + 5) setIsVisible(false);
          else if (y < lastScrollY.current - 5) setIsVisible(true);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = y;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  // Mobile overlay: a dialog needs Escape, focus entry, and background scroll
  // stopped while it is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsMobileMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousActive?.focus?.();
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback(
    (href: string) => {
      setIsMobileMenuOpen(false);
      goToSection(href);
    },
    [goToSection],
  );

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      <motion.nav
        aria-label="Primary"
        initial={false}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={transition}
        className="fixed top-0 left-0 right-0 z-50 px-[var(--gutter)] py-4 md:py-5 flex items-center justify-between"
        style={{
          background: isScrolled ? "rgba(10, 10, 10, 0.88)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : undefined,
          borderBottom: isScrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
        }}
      >
        <BrandLockup
          theme="dark"
          onClick={(e) => {
            e.preventDefault();
            if (reducedMotion) window.scrollTo(0, 0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8 lg:gap-10 list-none m-0 p-0">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(href);
                }}
                className="inline-flex items-center text-[0.6875rem] lg:text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted-on-dark hover:text-white transition-colors duration-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${personal.email}`}
          className="hidden md:inline-flex items-center text-[0.6875rem] lg:text-[0.75rem] font-bold uppercase tracking-[0.18em] text-white border border-white/25 px-4 py-2.5 hover:bg-white hover:text-black transition-colors duration-300"
          aria-label="Email Jatin Rane to start a conversation"
        >
          Hire Me
        </a>

        {/* Mobile */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="md:hidden flex flex-col items-center justify-center gap-[5px] w-11 h-11 p-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="block w-6 h-[1.5px] bg-white origin-center"
          />
          <motion.span
            animate={
              isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
            }
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="block w-6 h-[1.5px] bg-white"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="block w-6 h-[1.5px] bg-white origin-center"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-start justify-center gap-6 px-[var(--gutter)]"
          >
            <ul className="flex flex-col gap-2 list-none m-0 p-0 w-full">
              {navLinks.map(({ label, href }) => (
                <li key={label} className="w-full">
                  <motion.a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(href);
                    }}
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="block w-full font-display text-[clamp(2rem,11vw,3.5rem)] font-bold uppercase text-white tracking-tight hover:text-muted-on-dark transition-colors duration-300 leading-[1.1]"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 w-full">
              <a
                href={`mailto:${personal.email}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="tap inline-flex text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-muted-on-dark hover:text-white transition-colors"
              >
                {personal.email}
              </a>
              <a
                href={personal.resumeUrl}
                download
                onClick={() => setIsMobileMenuOpen(false)}
                className="tap inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.16em] border border-white/25 px-4 py-3 text-white w-fit hover:bg-white hover:text-black transition-colors duration-300"
              >
                Download resume
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 1v8M2 7l4 4 4-4M2 11h8" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
