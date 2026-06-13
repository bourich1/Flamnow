"use client";
import React from "react";
import { motion } from "motion/react";

import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role, rating = 5 }, i) => (
              <div className="p-10 rounded-3xl border border-white/5 bg-[#121212] shadow-lg shadow-[#ED3F27]/5 max-w-xs w-full" key={i}>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= rating ? 'fill-[#FF9F0A] text-[#FF9F0A]' : 'fill-transparent text-white/20'}`} 
                    />
                  ))}
                </div>
                <div className="text-white-base/80 text-sm leading-relaxed">{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium text-white-base tracking-tight leading-5 text-sm">{name}</div>
                    <div className="leading-5 opacity-60 text-white-base/60 text-xs tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
