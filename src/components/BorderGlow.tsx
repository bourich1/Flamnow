"use client";

import React, { useRef } from "react";
import "./BorderGlow.css";

interface BorderGlowProps {
  children: React.ReactNode;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  glowRadius?: string;
  glowIntensity?: number;
  coneSpread?: string;
  animated?: boolean;
  colors?: string[];
  className?: string;
  style?: React.CSSProperties;
}

const BorderGlow = ({
  children,
  edgeSensitivity = 50,
  glowColor = "rgba(237, 63, 39, 0.8)", // matches Flamnow primary color
  backgroundColor = "rgba(23, 23, 23, 0.4)",
  borderRadius = "24px",
  glowRadius = "250px",
  glowIntensity = 1,
  coneSpread = "80%",
  animated = false,
  colors = [],
  className = "",
  style = {}
}: BorderGlowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate gradient style string to avoid dynamic construction on every mousemove
  let gradientStyle = "";
  if (colors && colors.length > 0) {
    if (colors.length === 1) {
      gradientStyle = `radial-gradient(circle var(--glow-radius) at var(--mouse-x) var(--mouse-y), ${colors[0]} 0%, transparent var(--cone-spread))`;
    } else {
      const colorStops = colors.map((c, idx) => {
        const percent = (idx / (colors.length - 1)) * 50; // Map colors within the first 50%
        return `${c} ${percent}%`;
      }).join(", ");
      gradientStyle = `radial-gradient(circle var(--glow-radius) at var(--mouse-x) var(--mouse-y), ${colorStops}, transparent var(--cone-spread))`;
    }
  } else {
    gradientStyle = `radial-gradient(circle var(--glow-radius) at var(--mouse-x) var(--mouse-y), ${glowColor} 0%, transparent var(--cone-spread))`;
  }

  // Optimized: We mutate style variables directly on the DOM element's style property
  // to prevent triggering React state updates/renders on every cursor movement.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Proximity to any edge of the element
    const distToLeft = x;
    const distToRight = rect.width - x;
    const distToTop = y;
    const distToBottom = rect.height - y;
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

    const sensitivityFactor = edgeSensitivity > 0
      ? Math.max(0, Math.min(1, 1 - minDist / edgeSensitivity))
      : 1;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
    el.style.setProperty("--glow-intensity", `${sensitivityFactor * glowIntensity}`);
  };

  const handleMouseEnter = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--glow-intensity", `${glowIntensity}`);
  };

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--glow-intensity", "0");
    el.style.setProperty("--mouse-x", "-1000px");
    el.style.setProperty("--mouse-y", "-1000px");
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`border-glow-wrapper ${animated ? "animated-glow" : ""} ${className}`}
      style={{
        "--mouse-x": "-1000px",
        "--mouse-y": "-1000px",
        "--glow-color": colors[0] || glowColor,
        "--glow-background": gradientStyle,
        "--bg-color": backgroundColor,
        "--border-radius": borderRadius,
        "--glow-radius": glowRadius,
        "--glow-intensity": "0",
        "--edge-sensitivity": `${edgeSensitivity}px`,
        "--cone-spread": coneSpread,
        ...style
      } as React.CSSProperties}
    >
      <div className="border-glow-glow" />
      <div 
        className="border-glow-inner" 
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
