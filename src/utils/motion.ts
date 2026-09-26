import gsap from "gsap";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor has asked the OS to minimise animation.
 *
 * Every GSAP entrance in the app moves elements from an offset position, and
 * the hero runs a yoyo tween forever. On a phone that is a permanent
 * compositing cost, and for some visitors it is a genuine accessibility
 * problem, so `withMotion` bails out before starting a tween.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Runs `setup` inside a GSAP context, but only when motion is welcome.
 *
 * The returned function is always safe to call as a cleanup, so components can
 * return it directly from `useLayoutEffect` without branching.
 */
export function withMotion(
  scope: Element | null,
  setup: () => void
): () => void {
  if (prefersReducedMotion()) return () => undefined;
  const ctx = gsap.context(setup, scope ?? undefined);
  return () => ctx.revert();
}
