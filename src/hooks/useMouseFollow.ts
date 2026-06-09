"use client";

import { useEffect, useRef } from "react";

export function useMouseFollow() {
  const mouse = useRef({ x: 0, y: 0 });
  const isMobile = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current =
        typeof window !== "undefined" &&
        (window.innerWidth < 768 ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile.current) return;
      // Normalize mouse to [-1, 1] relative to viewport center
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return { mouse, isMobile };
}
