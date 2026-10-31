"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// The server has no media features to read, so the prerender always takes the
// animated branch. Answering `false` here is what makes hydration match.
function getServerSnapshot() {
  return false;
}

/**
 * Live `prefers-reduced-motion` read that is safe to branch markup on.
 *
 * framer-motion's `useReducedMotion` answers the media query on the very first
 * client render, while the prerendered HTML always carries the animated branch.
 * Every entrance in this portfolio picks its `initial` state from that flag, so
 * the two trees disagree and React throws a hydration error for exactly the
 * visitors who asked for reduced motion, then rebuilds the whole page.
 *
 * `useSyncExternalStore` hydrates with the server snapshot and re-reads after
 * commit, so the still branch lands one frame later — before any movement a
 * vestibular-sensitive visitor could notice has had a chance to play.
 *
 * Keep using framer-motion's hook where the flag is only read inside an effect;
 * nothing there renders, so nothing can mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
