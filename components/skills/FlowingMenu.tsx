"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { skills } from "@/data/portfolio";
import { useMediaQuery } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SkillItem {
  name: string;
  url: string;
}

interface MenuItemProps {
  text: string;
  items: SkillItem[];
  showOverlay: boolean;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function MenuItem({ text, items, showOverlay }: MenuItemProps) {
  const id = slug(text);
  const panelId = `skills-panel-${id}`;
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [repetitions, setRepetitions] = useState(3);

  // The looping logo marquee is a hover-device flourish. Size it to the viewport.
  useEffect(() => {
    if (!showOverlay) return;
    const calculate = () => {
      const part = marqueeInnerRef.current?.querySelector<HTMLElement>(
        ".flowing-menu__marquee-part",
      );
      if (part && part.offsetWidth > 0) {
        setRepetitions(Math.ceil(window.innerWidth / part.offsetWidth) + 2);
      }
    };
    calculate();
    const timer = setTimeout(calculate, 300);
    window.addEventListener("resize", calculate, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculate);
    };
  }, [items, showOverlay]);

  // gsap.context cleans the loop when the row unmounts or the flag flips.
  useEffect(() => {
    if (!showOverlay) return;
    const inner = marqueeInnerRef.current;
    const part = inner?.querySelector<HTMLElement>(".flowing-menu__marquee-part");
    if (!inner || !part || part.offsetWidth === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        x: -part.offsetWidth,
        duration: (part.offsetWidth / 200) * 6,
        ease: "none",
        repeat: -1,
      });
    }, inner);

    return () => ctx.revert();
  }, [showOverlay, repetitions]);

  return (
    <div className={`flowing-menu__item${isOpen ? " is-open" : ""}`}>
      <h3 className="m-0">
        <button
          type="button"
          className="flowing-menu__item-link"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span>{text}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flowing-menu__item-arrow"
            aria-hidden="true"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </h3>

      {/* The real content: reachable by keyboard, screen reader and touch.
          0fr → 1fr animates to content height without measuring in JS. */}
      <div id={panelId} className={`flowing-menu__panel${isOpen ? " is-open" : ""}`}>
        <div>
          <ul className="flowing-menu__panel-list">
            {items.map((skill) => (
              <li key={skill.name} className="flowing-menu__panel-chip">
                {/* Logo is decoration next to the name, so it stays out of the
                    accessibility tree rather than reading "React image". */}
                <img
                  src={skill.url}
                  alt=""
                  width={20}
                  height={20}
                  loading="lazy"
                  decoding="async"
                />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hover flourish — decorative duplicate of the list above */}
      {showOverlay && (
        <div className="flowing-menu__marquee" aria-hidden="true">
          <div className="flowing-menu__marquee-inner" ref={marqueeInnerRef}>
            {Array.from({ length: repetitions }).map((_, i) => (
              <div className="flowing-menu__marquee-part" key={i}>
                {items.map((skill) => (
                  <div key={skill.name} className="flowing-menu__icon-box">
                    <img
                      src={skill.url}
                      alt=""
                      className="flowing-menu__icon"
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="flowing-menu__icon-text">{skill.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlowingMenu() {
  const hasHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = usePrefersReducedMotion();
  const showOverlay = hasHover && !reducedMotion;

  return (
    <section aria-labelledby="skills-list-heading" className="border-t border-black/10">
      <h3 id="skills-list-heading" className="sr-only">
        Tools and technologies by category
      </h3>
      <ul className="flowing-menu list-none m-0 p-0">
        {skills.map((category) => (
          <li key={category.category}>
            <MenuItem
              text={category.category}
              items={category.items}
              showOverlay={showOverlay}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
