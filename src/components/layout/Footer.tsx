"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCursor } from "@/context/CursorContext";
import MagneticButton from "../ui/MagneticButton";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/design-system", label: "Tokens" },
  { href: "/contact", label: "Contact" },
];
import { createClient } from "@/lib/supabase/client";

export default function Footer() {
  const { setCursorType } = useCursor();
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
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "Twitter" }
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
                if (val.linkedin && val.linkedin !== "#") arr.push({ href: val.linkedin, label: "LinkedIn" });
                if (val.twitter && val.twitter !== "#") arr.push({ href: val.twitter, label: "Twitter" });
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
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  const renderLogoText = () => {
    const upper = siteName.toUpperCase();
    if (upper === "FLAMNOW") {
      return (
        <>
          FLAM<span className="text-[#ED3F27]">NOW</span>
        </>
      );
    }
    if (upper.endsWith("NOW") && siteName.length > 3) {
      const first = siteName.slice(0, -3);
      const last = siteName.slice(-3);
      return (
        <>
          {first}<span className="text-[#ED3F27]">{last}</span>
        </>
      );
    }
    return siteName;
  };

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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 h-72 w-[600px] rounded-full bg-[#ED3F27]/5 blur-[100px] pointer-events-none" />

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
                <span className="text-3xl font-black tracking-tighter text-white">
                  {renderLogoText()}
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ED3F27]"></span>
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
          <p>© {new Date().getFullYear()} FLAMNOW Agency Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
