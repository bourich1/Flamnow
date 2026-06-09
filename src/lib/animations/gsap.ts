import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins only in the browser context to prevent SSR issues in Next.js
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set default settings
  gsap.defaults({
    ease: "power2.out",
    duration: 0.8,
  });
}

export { gsap, ScrollTrigger };
export default gsap;
