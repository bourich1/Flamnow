"use client";

import React from "react";
import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  tag: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  tag,
  title,
  description,
  className = "",
  align = "left",
}: SectionHeaderProps) {
  const alignClasses = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 max-w-3xl ${alignClasses} ${className}`}>
      {/* Tagline */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-xs font-bold uppercase tracking-widest text-[#ED3F27]"
      >
        {tag}
      </motion.span>

      {/* Headline Text Reveal */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
        <TextReveal text={title} />
      </h2>

      {/* Optional Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="text-white/50 text-sm sm:text-base leading-relaxed mt-2"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
