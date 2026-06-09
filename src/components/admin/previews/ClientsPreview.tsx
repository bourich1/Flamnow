'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ClientsPreviewProps {
  clients: string[]
}

export default function ClientsPreview({ clients }: ClientsPreviewProps) {
  // To make a continuous marquee, double the list if it's not empty
  const marqueeItems = [...clients, ...clients]

  return (
    <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 overflow-hidden relative shadow-2xl w-full max-w-md mx-auto text-left">
      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#ED3F27] mb-4">
        Marquee Marquee Ticker Preview
      </h4>

      {clients.length === 0 ? (
        <div className="h-24 flex items-center justify-center text-center border border-dashed border-white/10 rounded-2xl">
          <span className="text-xs text-white/30 font-mono">No brand names added yet.</span>
        </div>
      ) : (
        <div className="relative py-6 border-y border-white/5 overflow-hidden select-none bg-[#0b0b0b]">
          {/* Fading side overlays */}
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[#0b0b0b] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-[#0b0b0b] to-transparent z-10 pointer-events-none" />

          <div className="flex w-max">
            <motion.div
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                ease: 'linear',
                duration: marqueeItems.length > 4 ? marqueeItems.length * 2.5 : 10,
                repeat: Infinity,
              }}
              className="flex items-center gap-8 whitespace-nowrap pr-8"
            >
              {marqueeItems.map((name, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-black uppercase tracking-widest text-white/30 hover:text-[#ED3F27] transition-colors duration-200">
                    {name}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ED3F27]/50" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
