"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  "All",
  "Branding",
  "Digital",
  "Campaigns",
  "Production",
];

interface WorkClientProps {
  initialProjects: any[];
}

export default function WorkClient({ initialProjects }: WorkClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { setCursorType, setCursorText } = useCursor();

  const filteredProjects = activeCategory === "All"
    ? initialProjects
    : initialProjects.filter((p) => p.category === activeCategory);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[#ED3F27]/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Page Header */}
        <div className="flex flex-col gap-6 mb-16 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ED3F27]">Portfolio</span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-tight">
            SELECTED CHRONICLES.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            A curated index of creative systems, digital experiences, and commercial narratives designed to outperform the ordinary.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-300 rounded-full ${
                activeCategory === cat ? "text-[#ED3F27]" : "text-white/60 hover:text-white"
              }`}
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("default")}
            >
              {cat}
              {activeCategory === cat && (
                <motion.span
                  layoutId="workActiveTab"
                  className="absolute inset-0 -z-10 rounded-full bg-white/5 border border-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Showcase Grid */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const accentColor = project.accent_color || project.accentColor || "#ED3F27";
              const brandColor = project.color || "#ED3F27";

              return (
                <motion.div
                  layout
                  key={project.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group relative flex flex-col justify-between min-h-[380px] md:h-[520px] bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/20 cursor-pointer"
                  onMouseEnter={() => {
                    setCursorType("text");
                    setCursorText("VIEW");
                  }}
                  onMouseLeave={() => {
                    setCursorType("default");
                    setCursorText("");
                  }}
                >
                  {/* Visual Accent Layer */}
                  <div
                    className="absolute inset-0 -z-10 bg-radial transition-all duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Card Top */}
                  <div className="flex justify-between items-center text-xs text-white/50 font-bold uppercase tracking-widest">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>

                  {/* Card Graphic/Center */}
                  <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                    <div
                      className="h-40 w-40 rounded-full flex items-center justify-center border transition-all duration-700 group-hover:scale-110"
                      style={{
                        borderColor: brandColor,
                        boxShadow: `0 0 25px -5px ${brandColor}`,
                      }}
                    >
                      <div
                        className="h-20 w-20 rounded-full"
                        style={{
                          backgroundColor: brandColor,
                          filter: "blur(6px)",
                          opacity: 0.35,
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-col gap-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border self-start"
                      style={{
                        color: brandColor,
                        borderColor: `${brandColor}30`,
                        backgroundColor: `${brandColor}10`,
                      }}
                    >
                      {project.category}
                    </span>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-[#ED3F27] transition-colors duration-300">
                      {project.title}
                    </h2>
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                      <p className="text-sm text-white/50 group-hover:text-white/80 transition-colors duration-300">
                        {project.tagline}
                      </p>
                      <div className="h-10 w-10 rounded-full border border-white/10 group-hover:border-white/40 flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight className="h-5 w-5 text-white group-hover:text-[#ED3F27] transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Action Link overlay */}
                  <Link href={`/work/${project.id}`} className="absolute inset-0 z-10" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
