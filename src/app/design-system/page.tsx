"use client";

import React, { useState } from "react";
import { useCursor } from "@/context/CursorContext";
import { Sparkles, Copy, Check } from "lucide-react";

const colorTokens = [
  { name: "Background", variable: "bg-bg-base", hex: "#111111", desc: "Main app canvas base dark theme." },
  { name: "Surface", variable: "bg-surface-base", hex: "#171717", desc: "Default layout container cards & backgrounds." },
  { name: "Surface Secondary", variable: "bg-surface-sec", hex: "#1E1E1E", desc: "Highlight states, menu boxes & elements." },
  { name: "Primary", variable: "bg-primary-base", hex: "#ED3F27", desc: "Core agency accent red representation." },
  { name: "White", variable: "bg-white-base", hex: "#FFFFFF", desc: "High contrast readability text & accents." },
];

const radiusTokens = [
  { name: "Buttons", class: "rounded-btn", value: "999px", desc: "Applied on interactive pills and anchors." },
  { name: "Inputs", class: "rounded-input", value: "16px", desc: "Applied on form textareas & input containers." },
  { name: "Cards", class: "rounded-card", value: "24px", desc: "Standard grid card and item blocks." },
  { name: "Large Cards", class: "rounded-card-lg", value: "32px", desc: "Heavy containers, sliders & primary panels." },
];

const spacingTokens = [
  { token: "space-xs", px: "8px", label: "xs (1x)" },
  { token: "space-sm", px: "16px", label: "sm (2x)" },
  { token: "space-md", px: "24px", label: "md (3x)" },
  { token: "space-lg", px: "32px", label: "lg (4x)" },
  { token: "space-xl", px: "40px", label: "xl (5x)" },
  { token: "space-2xl", px: "48px", label: "2xl (6x)" },
  { token: "space-3xl", px: "56px", label: "3xl (7x)" },
  { token: "space-4xl", px: "64px", label: "4xl (8x)" },
  { token: "space-6xl", px: "96px", label: "6xl (12x)" },
  { token: "space-8xl", px: "128px", label: "8xl (16x)" },
];

export default function DesignSystemPage() {
  const { setCursorType } = useCursor();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="bg-bg-base min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-20 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Flamnow Standards
          </span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white-base leading-tight">
            Design Tokens.
          </h1>
          <p className="text-white-base/60 text-lg leading-relaxed">
            The foundation of our brand personality: Bold, Fearless, Creative, Modern, and Premium. These values translate into design constants used uniformly across our pages.
          </p>
        </div>

        {/* Section 1: Colors */}
        <div className="border-t border-white-base/10 pt-16 mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white-base mb-8">01 / Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {colorTokens.map((color) => (
              <div
                key={color.hex}
                className="bg-surface-base border border-white-base/5 rounded-card p-6 flex flex-col justify-between h-[280px]"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <div>
                  <div className={`h-24 w-full rounded-card ${color.variable} border border-white-base/5 mb-4`} />
                  <h3 className="text-lg font-bold text-white-base uppercase tracking-tight">{color.name}</h3>
                  <p className="text-white-base/50 text-xs mt-2 leading-relaxed">{color.desc}</p>
                </div>
                <div className="flex justify-between items-center border-t border-white-base/5 pt-4 mt-4">
                  <span className="font-mono text-xs text-white-base/60">{color.hex}</span>
                  <button
                    onClick={() => copyToClipboard(color.hex)}
                    className="text-white-base/40 hover:text-primary-base transition-colors duration-200"
                    aria-label="Copy color hex"
                  >
                    {copiedText === color.hex ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Typography */}
        <div className="border-t border-white-base/10 pt-16 mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white-base mb-8">02 / Typography</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Display Font */}
            <div className="lg:col-span-6 flex flex-col gap-6 bg-surface-base border border-white-base/5 rounded-card-lg p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-base">Headings & Titles</span>
              <h3 className="text-3xl font-black text-white-base uppercase tracking-tight font-display">Clash Display</h3>
              <p className="text-white-base/50 text-sm leading-relaxed">
                Clash Display is a geometric display typeface featuring high-impact visual proportions and tracking, creating bold narratives.
              </p>
              
              <div className="flex flex-col gap-4 mt-6 border-t border-white-base/5 pt-6">
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Display Extrabold</p>
                  <p className="text-4xl sm:text-5xl font-black text-white-base uppercase font-display tracking-tight">STOKE THE FIRE</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Display Bold</p>
                  <p className="text-3xl font-bold text-white-base uppercase font-display tracking-tight">SELECTED ARCHIVES</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Display Medium</p>
                  <p className="text-xl font-medium text-white-base uppercase font-display tracking-tight">Startup Spark Package</p>
                </div>
              </div>
            </div>

            {/* Body Font */}
            <div className="lg:col-span-6 flex flex-col gap-6 bg-surface-base border border-white-base/5 rounded-card-lg p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-base">General UI & Body Copy</span>
              <h3 className="text-3xl font-black text-white-base uppercase tracking-tight font-body">Inter</h3>
              <p className="text-white-base/50 text-sm leading-relaxed">
                Inter is a highly optimized sans-serif typeface designed for user interfaces, offering legibility across all viewport devices.
              </p>

              <div className="flex flex-col gap-6 mt-6 border-t border-white-base/5 pt-6 font-body">
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Body Medium (Semi-bold)</p>
                  <p className="text-base font-semibold text-white-base leading-relaxed">
                    We combine bold visual positioning with advanced attribution.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Body Regular</p>
                  <p className="text-sm font-normal text-white-base/70 leading-relaxed">
                    In a crowded digital arena, standing out is no longer enough. You must burn into your audience&apos;s memory. We engineer digital products that perform.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white-base/40 uppercase mb-2">Body Light</p>
                  <p className="text-xs font-light text-white-base/60 leading-relaxed">
                    © {new Date().getFullYear()} FLAMNOW Agency Ltd. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Radii */}
        <div className="border-t border-white-base/10 pt-16 mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white-base mb-8">03 / Radius</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {radiusTokens.map((radius) => (
              <div
                key={radius.name}
                className="bg-surface-base border border-white-base/5 rounded-card p-6 flex flex-col justify-between h-[240px]"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white-base uppercase tracking-tight">{radius.name}</h3>
                    <span className="font-mono text-xs text-primary-base bg-primary-base/10 px-2 py-0.5 rounded-full">{radius.value}</span>
                  </div>
                  <p className="text-white-base/50 text-xs leading-relaxed">{radius.desc}</p>
                </div>
                
                {/* Visual spec card using custom radius */}
                <div className={`h-12 w-full bg-surface-sec border border-white-base/5 flex items-center justify-center text-xs text-white-base/40 uppercase tracking-widest ${radius.class}`}>
                  {radius.class}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Spacing (8px system) */}
        <div className="border-t border-white-base/10 pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white-base mb-8">04 / Spacing Scale</h2>
          <div className="bg-surface-base border border-white-base/5 rounded-card-lg p-8">
            <p className="text-white-base/50 text-sm leading-relaxed mb-8 max-w-2xl">
              We operate strictly on an 8px layout grid. This guarantees rhythmic visual flow across cards, paddings, margin offsets, and flex-gap configurations.
            </p>

            <div className="flex flex-col gap-4">
              {spacingTokens.map((space) => (
                <div key={space.token} className="flex items-center gap-4 border-b border-white-base/5 pb-4">
                  <div className="w-40 shrink-0">
                    <p className="font-mono text-xs text-white-base font-bold">{space.token}</p>
                    <p className="text-[10px] text-white-base/40 mt-0.5">{space.label}</p>
                  </div>
                  
                  {/* Visual sizing bar */}
                  <div className="flex-grow bg-white-base/5 h-6 rounded-full overflow-hidden flex items-center pr-4">
                    <div
                      className="bg-primary-base h-full rounded-full"
                      style={{ width: space.px }}
                    />
                    <span className="font-mono text-[10px] text-white-base/50 ml-4 shrink-0">{space.px}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
