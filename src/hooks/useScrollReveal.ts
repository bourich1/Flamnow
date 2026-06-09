import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";
import { animateSlideUp } from "@/lib/animations/helpers";
import { RefObject } from "react";

interface ScrollRevealOptions extends gsap.TweenVars {
  start?: string;
}

/**
 * React hook to trigger a premium slide-up and fade-in scroll animation.
 * Automatically cleans up ScrollTrigger instances on component unmount.
 * 
 * @param ref Ref object pointing to the element to animate.
 * @param options GSAP TweenVars configuration.
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options?: ScrollRevealOptions
) {
  useGSAP(
    () => {
      if (!ref.current) return;
      animateSlideUp(ref.current, {
        trigger: ref.current,
        start: options?.start || "top 85%",
        ...options,
      });
    },
    { scope: ref, dependencies: [] }
  );
}
