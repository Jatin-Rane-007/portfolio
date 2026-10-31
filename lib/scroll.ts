"use client";

import { useCallback, useEffect, useState } from "react";
import { useSmoothScroll } from "@/app/providers";

/**
 * Nav targets resolve to an absolute document offset instead of
 * `scrollIntoView()`, because some sections are positioned (fixed peel layer,
 * scaled portal) where `scrollIntoView` is a no-op — which made those nav links
 * look dead. The element carrying `id="<section>"` is always the in-flow anchor
 * for that section.
 */
export function useSectionScroll() {
  const { scrollTo } = useSmoothScroll();

  return useCallback(
    (href: string) => {
      const id = href.replace(/^#/, "");
      const el = document.getElementById(id);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY;
      // Clear the fixed header, tighter on phones.
      const headerPad = window.innerWidth < 768 ? 16 : 24;
      scrollTo(Math.max(0, top - headerPad), 0);

      // Keep the URL honest without triggering a second browser scroll.
      history.replaceState(null, "", `#${id}`);
    },
    [scrollTo],
  );
}

/** Live media query read. `false` on the server, so styles stay mobile first. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
