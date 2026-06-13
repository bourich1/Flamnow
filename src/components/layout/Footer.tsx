"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCursor } from "@/context/CursorContext";
import MagneticButton from "../ui/MagneticButton";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
import { createClient } from "@/lib/supabase/client";

export default function Footer() {
  const { setCursorType } = useCursor();
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [siteName, setSiteName] = useState("Flamnow");
  const [contacts, setContacts] = useState({
    email: "hello@flamnow.com",
    phone: "+44 (0) 20 7946 0958",
    address: "22 Flame Avenue",
    city: "Shoreditch, London",
    zip: "EC2A 3PR"
  });
  const [socials, setSocials] = useState([
    { href: "#", label: "Instagram" },
    { href: "#", label: "WhatsApp" },
    { href: "#", label: "Facebook" }
  ]);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    async function loadFooterData() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*");
        
        if (data) {
          data.forEach(item => {
            if (item.key === "general_settings") {
              const val = item.value as any;
              setSiteName(val.siteName || "Flamnow");
              setContacts({
                email: val.contactEmail || "hello@flamnow.com",
                phone: val.contactPhone || "+44 (0) 20 7946 0958",
                address: val.address || "22 Flame Avenue",
                city: val.city ? `${val.city}${val.state ? `, ${val.state}` : ""}` : "Shoreditch, London",
                zip: val.zip || "EC2A 3PR"
              });
            } else if (item.key === "social_links") {
              const val = item.value as any;
              if (Array.isArray(val)) {
                setSocials(val.map((s: any) => ({ href: s.href || "#", label: s.name })));
              } else {
                const arr = [];
                if (val.instagram && val.instagram !== "#") arr.push({ href: val.instagram, label: "Instagram" });
                if (val.whatsapp && val.whatsapp !== "#") arr.push({ href: val.whatsapp, label: "WhatsApp" });
                if (val.facebook && val.facebook !== "#") arr.push({ href: val.facebook, label: "Facebook" });
                if (arr.length > 0) {
                  setSocials(arr);
                }
              }
            }
          });
        }
      } catch (err) {
        console.error("Error loading footer content:", err);
      }
    }
    loadFooterData();

    // Set current year only on client to avoid hydration mismatch with server-rendered dates
    setCurrentYear(new Date().getFullYear());
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;



  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#111111] pt-24 pb-12 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 h-72 w-[350px] md:w-[600px] rounded-full bg-[#ED3F27]/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="group flex items-center gap-1.5 inline-block mb-6"
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
              <p className="text-white/60 max-w-md text-base leading-relaxed mb-8">
                We design bold identities, high-performance campaigns, and premium digital flagships for brands ready to ignite and conquer.
              </p>
            </div>

            {/* Newsletter form */}
            <div className="max-w-md w-full">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Join the spark list</p>
              {subscribed ? (
                <p className="text-[#ED3F27] font-semibold text-sm">Welcome aboard. Get ready for fire updates.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#121212] border border-white/5 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300"
                    onMouseEnter={() => setCursorType("hover")}
                    onMouseLeave={() => setCursorType("default")}
                  />
                  <MagneticButton
                    className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-[#ED3F27] hover:text-white transition-colors duration-300 whitespace-nowrap"
                  >
                    Subscribe
                  </MagneticButton>
                </form>
              )}
            </div>
          </div>

          {/* Nav & Info */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Sitemap */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">Sitemap</p>
              <ul className="flex flex-col gap-2.5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-[#ED3F27] hover:pl-1 transition-all duration-300"
                      onMouseEnter={() => setCursorType("hover")}
                      onMouseLeave={() => setCursorType("default")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">Connect</p>
              <ul className="flex flex-col gap-2.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-[#ED3F27] transition-colors duration-200"
                      onMouseEnter={() => setCursorType("hover")}
                      onMouseLeave={() => setCursorType("default")}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coordinates */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">Headquarters</p>
              <div className="text-sm text-white/60 flex flex-col gap-2">
                <p>{contacts.address}</p>
                <p>{contacts.city}</p>
                <p>{contacts.zip}</p>
                <a
                  href={`mailto:${contacts.email}`}
                  className="text-[#ED3F27] hover:underline mt-2 block"
                  onMouseEnter={() => setCursorType("hover")}
                  onMouseLeave={() => setCursorType("default")}
                >
                  {contacts.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Huge Outlined Text */}
        <div className="select-none mt-20 overflow-hidden w-full border-t border-b border-white/5 py-4">
          <h2
            className="text-[12vw] font-black leading-none text-center tracking-tighter uppercase text-transparent stroke-text"
            style={{
              WebkitTextStroke: "1px var(--border)",
            }}
          >
            {siteName.toUpperCase()}
          </h2>
        </div>

        {/* Copyrights */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/60">
          <p>© {currentYear ?? '2026'} FLAMNOW Agency Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
