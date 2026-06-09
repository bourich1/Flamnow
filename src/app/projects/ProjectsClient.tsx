"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";

const categories = [
  "All",
  "Branding",
  "Digital",
  "Campaigns",
  "Production",
];

interface ProjectsClientProps {
  initialProjects: any[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
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
      {/* Background Glow */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#ED3F27]/5 blur-[150px] pointer-events-none" />

      <Container className="mx-auto max-w-7xl relative z-10">
        {/* Page Header */}
        <div className="flex flex-col gap-6 mb-16 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ED3F27]">OUR PORTFOLIO</span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-tight font-display">
            CREATIVE ANOMALIES.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl font-sans">
            A comprehensive index of fluid visual identities, high-conversion campaigns, and cutting-edge digital creations engineered to rewrite industry standards.
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
                  layoutId="projectsPageActiveTab"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const coverImg = project.cover_image || project.coverImage || "/placeholder.jpg";
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
                  className="group relative flex flex-col bg-surface-base border border-white/5 rounded-card overflow-hidden transition-all duration-500 hover:border-white/10 cursor-pointer"
                  onMouseEnter={() => {
                    setCursorType("text");
                    setCursorText("VIEW");
                  }}
                  onMouseLeave={() => {
                    setCursorType("default");
                    setCursorText("");
                  }}
                >
                  {/* Visual Accent Glow on Hover */}
                  <div
                    className="absolute inset-0 -z-10 bg-radial transition-all duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Cover Image Container */}
                  <div className="relative h-[260px] sm:h-[340px] w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] to-transparent z-10" />
                    <Image
                      src={coverImg}
                      alt={`${project.client} Cover mockup`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={project.id === "volt-audio" || project.id === "vortex-pay"}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-10 flex flex-col gap-6 relative z-20">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                        style={{
                          color: brandColor,
                          borderColor: `${brandColor}30`,
                          backgroundColor: `${brandColor}10`,
                        }}
                      >
                        {project.category}
                      </span>
                      <span className="text-xs text-white/40 font-mono font-bold uppercase">
                        {project.year}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-display group-hover:text-[#ED3F27] transition-colors duration-200 mt-2">
                      {project.title}
                    </h2>

                    <p className="text-white/60 text-sm leading-relaxed max-w-xl font-sans">
                      {project.description}
                    </p>

                    {/* Card Bottom CTA */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#ED3F27] transition-colors duration-300">
                        Explore Case Study
                      </span>
                      <div className="h-10 w-10 rounded-full border border-white/10 group-hover:border-[#ED3F27] flex items-center justify-center transition-all duration-300 bg-white/5">
                        <ArrowUpRight className="h-5 w-5 text-white group-hover:text-[#ED3F27] transition-all duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Action Link overlay */}
                  <Link href={`/projects/${project.id}`} className="absolute inset-0 z-30" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}
