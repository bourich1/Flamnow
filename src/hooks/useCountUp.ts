import { useGSAP } from "@gsap/react";
import { animateCounter } from "@/lib/animations/helpers";
import { RefObject } from "react";

/**
 * React hook to automatically trigger numeric count-ups for all child elements
 * with the ".js-counter" class when they scroll into view.
 * 
 * Target attributes on the counter DOM nodes:
 * - data-target-raw: The number to count up to.
 * - data-target-prefix: (Optional) Currency symbols, etc.
 * - data-target-suffix: (Optional) Percentage, volume multipliers, etc.
 * 
 * @param containerRef Ref object pointing to the parent container enclosing the counters.
 */
export function useCountUp(containerRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const counters = containerRef.current.querySelectorAll<HTMLElement>(".js-counter");

      counters.forEach((counter) => {
        const rawTarget = counter.getAttribute("data-target-raw");
        if (!rawTarget) return;

        const endVal = parseFloat(rawTarget);
        if (isNaN(endVal)) return;

        const prefix = counter.getAttribute("data-target-prefix") || "";
        const suffix = counter.getAttribute("data-target-suffix") || "";

        animateCounter(counter, {
          endVal,
          prefix,
          suffix,
          trigger: counter,
        });
      });
    },
    { scope: containerRef, dependencies: [] }
  );
}
