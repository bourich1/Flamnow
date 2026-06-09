"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/design-system", label: "Tokens" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "Behance" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { setCursorType, setCursorText } = useCursor();

  // Disable scroll when overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuVariants = {
    initial: {
      x: "100%",
    },
    animate: {
      x: 0,
      transition: {
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const navLinksVariants = {
    initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const linkVariants = {
    initial: { y: 80, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-0 right-0 z-45 h-screen w-full md:w-[600px] bg-[#111111] border-l border-white/5 px-8 py-24 md:p-24 flex flex-col justify-between"
        >
          {/* Ambient visual background glow */}
          <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-[#ED3F27]/10 blur-[120px] pointer-events-none" />

          {/* Links Stagger Container */}
          <motion.div
            variants={navLinksVariants}
            className="flex flex-col gap-6 md:gap-8 mt-12"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Navigation</p>
            {menuLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="overflow-hidden">
                  <motion.div variants={linkVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`text-4xl md:text-6xl font-black uppercase tracking-tight transition-colors duration-300 hover:text-[#ED3F27] flex items-center gap-4 ${
                        isActive ? "text-[#ED3F27]" : "text-white"
                      }`}
                      onMouseEnter={() => {
                        setCursorType("text");
                        setCursorText("GO");
                      }}
                      onMouseLeave={() => {
                        setCursorType("default");
                        setCursorText("");
                      }}
                    >
                      {link.label}
                      {isActive && (
                        <span className="h-3 w-3 rounded-full bg-[#ED3F27]" />
                      )}
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Coordinates footer inside overlay */}
          <div className="flex flex-col gap-8">
            <div className="h-[1px] w-full bg-border" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Say Hello</p>
                <a
                  href="mailto:hello@flamnow.com"
                  className="text-sm text-white hover:text-[#ED3F27] transition-colors duration-200"
                >
                  hello@flamnow.com
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Follow Us</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="text-xs text-white/60 hover:text-[#ED3F27] transition-colors duration-200"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
