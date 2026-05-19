import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes.
 * Uses `prefers-reduced-motion` so scroll behavior stays non-animated when requested.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Defensively guard window APIs to prevent TypeError crashes in JSDOM tests or SSR
    const prefersReducedMotion =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({
        top: 0,
        left: 0,
        // Respect vestibular / motion settings; keep non-animated scroll otherwise.
        behavior: prefersReducedMotion ? 'instant' : 'auto',
      });
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
