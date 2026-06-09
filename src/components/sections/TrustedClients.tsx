"use client";

import React from "react";
import { motion } from "framer-motion";

interface TrustedClientsProps {
  clients?: string[];
}

export default function TrustedClients({ clients = [] }: TrustedClientsProps) {
  if (clients.length === 0) return null;

  // Double the marquee items for smooth looping
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="relative bg-bg-base py-space-md border-t border-b border-white/5 overflow-hidden select-none">
      {/* Visual fading overlays on left and right */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

      <div className="flex w-max">
        {/* Scrolling marquee */}
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: marqueeItems.length > 4 ? marqueeItems.length * 2.5 : 12,
            repeat: Infinity,
          }}
          className="flex items-center gap-space-2xl whitespace-nowrap pr-space-2xl"
        >
          {marqueeItems.map((client, idx) => (
            <div key={idx} className="flex items-center gap-space-lg">
              <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white/20 hover:text-primary-base transition-colors duration-300">
                {client}
              </span>
              <span className="h-2 w-2 rounded-full bg-primary-base/40" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
