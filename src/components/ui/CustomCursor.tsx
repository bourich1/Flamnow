"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/CursorContext";

export default function CustomCursor() {
  const { cursorType, cursorText } = useCursor();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Separate motion values for dot and ring to enable trailing effect
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  // Snappy spring config for the inner dot
  const dotXSpring = useSpring(dotX, { damping: 50, stiffness: 800, mass: 0.1 });
  const dotYSpring = useSpring(dotY, { damping: 50, stiffness: 800, mass: 0.1 });

  // Softer, trailing spring config for the outer ring
  const ringXSpring = useSpring(ringX, { damping: 32, stiffness: 280, mass: 0.6 });
  const ringYSpring = useSpring(ringY, { damping: 32, stiffness: 280, mass: 0.6 });

  useEffect(() => {
    // Mark as mounted so we can safely access browser APIs
    setMounted(true);

    // Check if it's a mobile/touch device
    const checkDevice = () => {
      const mobile = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveCursor = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [dotX, dotY, ringX, ringY]);

  // Prevent rendering during SSR and first client paint to avoid hydration mismatch
  // Only render cursor after mount confirms we're on a non-mobile device
  if (!mounted || isMobile || cursorType === "hide") return null;

  // Variants for Outer Ring
  const ringVariants = {
    default: {
      width: 28,
      height: 28,
      backgroundColor: "rgba(237, 63, 39, 0.0)",
      border: "1.5px solid #ED3F27",
    },
    hover: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(4px)",
    },
    text: {
      width: 90,
      height: 90,
      backgroundColor: "#ED3F27",
      border: "0px solid transparent",
      backdropFilter: "none",
    },
    red: {
      width: 44,
      height: 44,
      backgroundColor: "rgba(237, 63, 39, 0.1)",
      border: "1.5px solid #ED3F27",
    }
  };

  // Variants for Inner Dot
  const dotVariants = {
    default: {
      scale: 1,
      backgroundColor: "#ED3F27",
    },
    hover: {
      scale: 0,
      backgroundColor: "#FFFFFF",
    },
    text: {
      scale: 0,
      backgroundColor: "#ED3F27",
    },
    red: {
      scale: 1,
      backgroundColor: "#ED3F27",
    }
  };

  return (
    <>
      {/* 1. Outer Ring (Trails behind with damping physics) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: ringXSpring,
          y: ringYSpring,
        }}
        animate={cursorType}
        variants={ringVariants}
        initial="default"
        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.3 }}
      >
        {cursorType === "text" && cursorText && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* 2. Inner Dot (Sits exactly at cursor point, super snappy) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 h-2 w-2 rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: dotXSpring,
          y: dotYSpring,
        }}
        animate={cursorType}
        variants={dotVariants}
        initial="default"
        transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.1 }}
      />
    </>
  );
}
