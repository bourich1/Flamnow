import { gsap } from "./gsap";

/**
 * Fades and slides an element in when it enters the viewport.
 */
export const animateSlideUp = (
  element: gsap.TweenTarget,
  options?: gsap.TweenVars & { trigger?: gsap.DOMTarget; start?: string }
) => {
  const { trigger, start = "top 85%", ...rest } = options || {};
  
  return gsap.fromTo(element, 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: "play none none none",
          }
        : undefined,
      ...rest,
    }
  );
};

/**
 * Interpolates numeric text from a start value to an end value on scroll.
 */
export const animateCounter = (
  element: HTMLElement,
  options?: {
    startVal?: number;
    endVal: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    trigger?: gsap.DOMTarget;
  }
) => {
  const { startVal = 0, endVal, duration = 2.5, prefix = "", suffix = "", trigger } = options || {};
  const obj = { value: startVal };

  return gsap.to(obj, {
    value: endVal,
    duration,
    ease: "power2.out",
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 90%",
          toggleActions: "play none none none",
        }
      : undefined,
    onUpdate: () => {
      // Format number with commas
      const formatted = Math.floor(obj.value).toLocaleString();
      element.innerText = `${prefix}${formatted}${suffix}`;
    },
  });
};

/**
 * Animates a timeline line progress height on scroll (scrubbed).
 */
export const animateLineProgress = (
  element: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  options?: gsap.TweenVars & { start?: string; end?: string }
) => {
  const { start = "top 70%", end = "bottom 70%", ...rest } = options || {};

  return gsap.fromTo(
    element,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub: true,
      },
      ...rest,
    }
  );
};

/**
 * Reveals text characters using a clipping mask.
 */
export const animateTextReveal = (
  element: gsap.TweenTarget,
  options?: gsap.TweenVars & { trigger?: gsap.DOMTarget; start?: string }
) => {
  const { trigger, start = "top 85%", ...rest } = options || {};

  return gsap.fromTo(element,
    { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 30 },
    {
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      y: 0,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: trigger
        ? {
            trigger,
            start,
            toggleActions: "play none none none",
          }
        : undefined,
      ...rest,
    }
  );
};
