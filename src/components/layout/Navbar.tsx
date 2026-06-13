"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import { createClient } from "@/lib/supabase/client";
import MobileMenu from "./MobileMenu";
import MagneticButton from "../ui/MagneticButton";


const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState("Flamnow");
  const pathname = usePathname();
  const { setCursorType } = useCursor();

  useEffect(() => {
    const supabase = createClient();
    async function loadBrand() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "general_settings")
          .single();
        if (data?.value && (data.value as any).siteName) {
          setSiteName((data.value as any).siteName);
        }
      } catch (err) {
        console.error("Error loading brand name:", err);
      }
    }
    loadBrand();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [pathname, isOpen]);

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;


  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-bg-base/80 py-4 backdrop-blur-md border-b border-white/5"
            : "bg-transparent py-8"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-1.5"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
          >
            <div className="flex items-center">
              <img 
                src="/logo-light.png" 
                alt={siteName || "Flamnow Logo"} 
                className="h-8 md:h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {menuLinks.slice(1).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-semibold uppercase tracking-widest text-white transition-colors duration-300 hover:text-[#ED3F27] ${
                    isActive ? "text-[#ED3F27]" : "text-white/70"
                  }`}
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#ED3F27]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Contact CTA & Burger Toggle */}
          <div className="flex items-center gap-4 md:gap-6">

            
            <div className="hidden md:block">
              <MagneticButton
                href="/contact"
                className="rounded-full bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#ED3F27] hover:text-white transition-colors duration-300"
              >
                Let&apos;s Stoke
              </MagneticButton>
            </div>

            {/* Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="group relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#ED3F27]"
              aria-label="Toggle menu"
              onMouseEnter={() => setCursorType("hover")}
              onMouseLeave={() => setCursorType("default")}
            >
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  isOpen ? "translate-y-2 rotate-45 bg-[#ED3F27]" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  isOpen ? "scale-0 opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-white transition-all duration-300 ${
                  isOpen ? "-translate-y-2 -rotate-45 bg-[#ED3F27]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Modular Mobile Menu Overlay */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
