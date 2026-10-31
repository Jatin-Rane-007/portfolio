"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/scroll";

/**
 * Pointer-following dot with a lagging ring.
 *
 * Only mounted concerns: fine pointers (never touch), and only while the cursor
 * actually moves — the rAF loop parks itself once the ring settles instead of
 * spinning forever. The hover growth is a CSS `scale` on an inner element, so
 * the position transform written here never fights with it and no layout
 * property (width/height/margin) is animated.
 */
export default function CursorFollower() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: -100, y: -100 };
    const lag = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const flag = (on: boolean) => {
      const wc = on ? "transform" : "auto";
      dot.style.willChange = wc;
      ring.style.willChange = wc;
    };

    const show = (on: boolean) => {
      visible = on;
      dot.style.opacity = on ? "1" : "0";
      ring.style.opacity = on ? "1" : "0";
      if (!on) ring.classList.remove("is-active");
    };

    const frame = () => {
      raf = 0;
      place(dot, target.x, target.y);

      const dx = target.x - lag.x;
      const dy = target.y - lag.y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        place(ring, target.x, target.y);
        lag.x = target.x;
        lag.y = target.y;
        flag(false); // parked: drop the compositing hint until the next move
        if (!visible) show(false);
        return;
      }

      lag.x += dx * 0.14;
      lag.y += dy * 0.14;
      place(ring, lag.x, lag.y);
      kick();
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) show(true);
      flag(true);
      kick();
    };

    const onLeaveDocument = () => {
      show(false);
      kick();
    };

    // One delegated listener pair instead of one per link — survives any DOM change.
    const interactive = (e: PointerEvent) =>
      (e.target as HTMLElement | null)?.closest?.("a, button, [role='button'], summary");

    const onOver = (e: PointerEvent) => {
      if (interactive(e)) ring.classList.add("is-active");
    };
    const onOut = (e: PointerEvent) => {
      if (interactive(e)) ring.classList.remove("is-active");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveDocument);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("pointerleave", onLeaveDocument);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <>
      {/* Dot — sits exactly under the pointer (negative margins are static) */}
      <div
        ref={dotRef}
        className="cursor-follower top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-white rounded-full opacity-0"
        style={{ zIndex: 9998 }}
        aria-hidden="true"
      />
      {/* Ring — lags, and scales up over interactive targets via .is-active */}
      <div
        ref={ringRef}
        className="cursor-follower top-0 left-0 w-10 h-10 -ml-5 -mt-5 opacity-0"
        style={{ zIndex: 9997 }}
        aria-hidden="true"
      >
        <span className="cursor-ring block h-full w-full rounded-full border border-white/50" />
      </div>
    </>
  );
}
