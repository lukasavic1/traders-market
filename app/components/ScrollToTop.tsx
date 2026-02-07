"use client";

import { useEffect } from "react";

/**
 * On full page load or refresh, keep the page at the top and prevent
 * the browser from restoring a previous scroll position.
 */
export function ScrollToTop() {
  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh/navigation
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Scroll to top on mount (handles refresh and initial load)
    window.scrollTo(0, 0);
  }, []);
  return null;
}
