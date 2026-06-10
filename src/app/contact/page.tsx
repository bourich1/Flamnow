"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import MagneticButton from "@/components/ui/MagneticButton";
import { Send, CheckCircle, Mail, MapPin, Phone, Sparkles, MessageCircle, ArrowUpRight, Loader2, Info } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

import { createClient } from "@/lib/supabase/client";

const budgetRanges = [
  "< $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
];

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  ),
  instagram: (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  twitter: (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  behance: (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M22 10.028h-6v1.36h6zm-12.775-6.028c-2.316 0-4.084 1.256-4.084 4.123 0 2.923 1.956 4.398 4.282 4.398 2.502 0 4.116-1.503 4.116-4.321 0-2.836-1.89-4.2-4.314-4.2zm.053 6.643c-1.391 0-2.222-.888-2.222-2.433 0-1.501.764-2.392 2.128-2.392 1.34 0 2.133.864 2.133 2.392 0 1.545-.758 2.433-2.039 2.433zm-9.278-6.143h3.585c1.478 0 2.464.715 2.464 2.007 0 1.054-.691 1.705-1.71 1.905 1.29.215 2.016 1.009 2.016 2.24 0 1.488-1.155 2.331-2.756 2.331h-3.599zm3.327 3.513c.691 0 1.155-.306 1.155-.918 0-.585-.445-.873-1.155-.873h-1.585v1.791zm.268 3.57c.725 0 1.256-.32 1.256-.999 0-.649-.516-.949-1.256-.949h-1.851v1.948zm20.405-5.556c-1.865 0-3.327.915-3.327 3.125 0 2.106 1.365 3.094 3.327 3.094 1.411 0 2.399-.485 3.003-1.152l-1.045-.898c-.461.428-1.07.691-1.833.691-.979 0-1.637-.47-1.748-1.385h4.793c.094-2.399-.958-3.475-3.17-3.475zm-1.558 2.22c.164-.813.758-1.29 1.558-1.29.771 0 1.353.477 1.465 1.29z"/>
    </svg>
  )
};

export default function ContactPage() {
  const { setCursorType } = useCursor();
  const [coreServices, setCoreServices] = useState<string[]>([]);
  const [contacts, setContacts] = useState({
    email: "hello@flamnow.com",
    phone: "+44 (0) 20 7946 0958",
    address: "22 Flame Avenue",
    city: "Shoreditch, London",
    zip: "EC2A 3PR",
    whatsappUrl: "https://wa.me/442079460958"
  });
  const [socials, setSocials] = useState<Record<string, string>>({
    instagram: "#",
    linkedin: "#",
    twitter: "#"
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const pageLoadTimeRef = useRef<number>(0);

  useEffect(() => {
    pageLoadTimeRef.current = Date.now();
    
    const supabase = createClient();
    async function loadContactData() {
      try {
        const { data: sData } = await supabase.from("services").select("title").order("title");
        if (sData) setCoreServices(sData.map(s => s.title));

        const { data: stData } = await supabase.from("site_settings").select("*");
        if (stData) {
          stData.forEach(item => {
            if (item.key === "general_settings") {
              const val = item.value as any;
              setContacts({
                email: val.contactEmail || "hello@flamnow.com",
                phone: val.contactPhone || "+44 (0) 20 7946 0958",
                address: val.address || "22 Flame Avenue",
                city: val.city ? `${val.city}${val.state ? `, ${val.state}` : ""}` : "Shoreditch, London",
                zip: val.zip || "EC2A 3PR",
                whatsappUrl: val.whatsapp_url || `https://wa.me/${(val.contactPhone || "").replace(/\D/g, "")}`
              });
            } else if (item.key === "social_links") {
              const val = item.value as any;
              if (Array.isArray(val)) {
                const socMap: Record<string, string> = {};
                val.forEach((s: any) => {
                  socMap[s.name.toLowerCase()] = s.href;
                });
                setSocials(prev => ({ ...prev, ...socMap }));
              } else {
                setSocials({
                  instagram: val.instagram || "#",
                  linkedin: val.linkedin || "#",
                  twitter: val.twitter || "#"
                });
              }
            }
          });
        }
      } catch (err) {
        console.error("Error loading contact configurations:", err);
      }
    }
    loadContactData();
  }, []);

  const renderSocialsList = () => {
    return Object.entries(socials)
      .filter(([, href]) => href && href !== "#")
      .map(([name, href]) => {
        const key = name.toLowerCase();
        const svg = socialIcons[key] || socialIcons.linkedin;
        return (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10.5 w-10.5 rounded-full border border-white/10 hover:border-[#ED3F27] bg-white/5 hover:bg-[#ED3F27]/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
            title={name.charAt(0).toUpperCase() + name.slice(1)}
          >
            {svg}
          </a>
        );
      });
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitError("Name, email, and message description are required.");
      return;
    }

    if (selectedServices.length === 0) {
      setSubmitError("Please select at least one service category.");
      return;
    }

    if (!selectedBudget) {
      setSubmitError("Please select a budget range.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        services: selectedServices,
        budget: selectedBudget,
        message: message.trim(),
        website: website,
        clientLoadTime: pageLoadTimeRef.current
      });

      if (result.error) {
        setSubmitError(result.error);
      } else {
        setFormSubmitted(true);
      }
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-6 md:px-12 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-1/4 -z-10 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-[#ED3F27]/5 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Coordinates & Instant Messaging CTAs */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32 h-fit">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ED3F27]">STOKE THE FIRES</span>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-tight font-display">
                CONNECT NOW.
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-md font-sans">
                Ready to scale your community, design a digital flagship, or dominate paid ads? Select your parameters and trigger the ignition.
              </p>
            </div>

            {/* Direct Coordinates */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-8 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 font-mono">DIRECT COORDINATES</p>
              
              {/* Email */}
              <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-200">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ED3F27]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Direct Mail</p>
                  <a
                    href={`mailto:${contacts.email}`}
                    className="text-sm font-bold hover:text-[#ED3F27] transition-colors duration-200"
                    onMouseEnter={() => setCursorType("hover")}
                    onMouseLeave={() => setCursorType("default")}
                  >
                    {contacts.email}
                  </a>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-center gap-4 text-white/70">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ED3F27]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Agency Hotline</p>
                  <a
                    href={`tel:${contacts.phone}`}
                    className="text-sm font-bold hover:text-[#ED3F27] transition-colors duration-200"
                    onMouseEnter={() => setCursorType("hover")}
                    onMouseLeave={() => setCursorType("default")}
                  >
                    {contacts.phone}
                  </a>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-center gap-4 text-white/70">
                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ED3F27]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">HQ Address</p>
                  <p className="text-sm font-bold">{contacts.address}, {contacts.city}</p>
                </div>
              </div>
            </div>

            {/* WHATSAPP CTA CARD */}
            <div className="bg-green-500/[0.03] border border-green-500/10 rounded-card p-6 flex flex-col gap-4 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-green-500/5 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 text-green-400">
                <MessageCircle className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">REAL-TIME CHAT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase text-white font-display mb-1">Stoke via WhatsApp</h3>
                <p className="text-white/50 text-xs leading-relaxed font-sans max-w-sm">
                  Need to move faster? Reach out to our lead growth strategist directly on WhatsApp to discuss your timeline immediately.
                </p>
              </div>
              <a
                href={contacts.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-[10px] py-3 px-6 transition-all duration-300 w-full md:w-fit self-start"
                onMouseEnter={() => setCursorType("hover")}
                onMouseLeave={() => setCursorType("default")}
              >
                <span>Instant Message</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono">CHANNEL RADARS</p>
              <div className="flex flex-wrap gap-3">
                {renderSocialsList()}
              </div>
            </div>

          </div>

          {/* Right Column: Premium Form / Submission State */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-card p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                >
                  {/* Honeypot field (hidden from users, accessible to screen readers/bots) */}
                  <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                    <label htmlFor="website">Do not fill this website url field if you are a human</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  
                  {/* Name & Email Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-white/5 border border-white/10 rounded-input px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300 font-sans"
                        onMouseEnter={() => setCursorType("hover")}
                        onMouseLeave={() => setCursorType("default")}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="bg-white/5 border border-white/10 rounded-input px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300 font-sans"
                        onMouseEnter={() => setCursorType("hover")}
                        onMouseLeave={() => setCursorType("default")}
                      />
                    </div>
                  </div>

                  {/* Phone & Company Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="bg-white/5 border border-white/10 rounded-input px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300 font-sans"
                        onMouseEnter={() => setCursorType("hover")}
                        onMouseLeave={() => setCursorType("default")}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="My Organization"
                        className="bg-white/5 border border-white/10 rounded-input px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300 font-sans"
                        onMouseEnter={() => setCursorType("hover")}
                        onMouseLeave={() => setCursorType("default")}
                      />
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                      Which Services do you require? * (Select all that apply)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {coreServices.map((service) => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                              isSelected
                                ? "bg-[#ED3F27] border-[#ED3F27] text-white"
                                : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                            }`}
                            onMouseEnter={() => setCursorType("hover")}
                            onMouseLeave={() => setCursorType("default")}
                          >
                            {service}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Ranges Selection */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                      What is your estimated budget? *
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {budgetRanges.map((range) => {
                        const isSelected = selectedBudget === range;
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => setSelectedBudget(range)}
                            className={`px-5 py-2.5 text-xs font-semibold rounded-full border transition-all duration-300 ${
                              isSelected
                                ? "bg-[#ED3F27] border-[#ED3F27] text-white"
                                : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                            }`}
                            onMouseEnter={() => setCursorType("hover")}
                            onMouseLeave={() => setCursorType("default")}
                          >
                            {range}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message/Detail Field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">
                      Project Insights
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your timeline, business goals, or current obstacles..."
                      className="bg-white/5 border border-white/10 rounded-input px-5 py-4 text-white text-sm focus:outline-none focus:border-[#ED3F27] focus:ring-1 focus:ring-[#ED3F27] transition-all duration-300 resize-none font-sans"
                      onMouseEnter={() => setCursorType("hover")}
                      onMouseLeave={() => setCursorType("default")}
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-start gap-3 mt-4">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-4">
                    <MagneticButton
                      onClick={handleSubmit}
                      className="w-full rounded-full bg-[#ED3F27] hover:bg-white text-white hover:text-black font-bold uppercase tracking-widest text-xs py-4.5 flex items-center justify-center gap-2 group transition-colors duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <span>Triggering Ignition...</span>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <span>Stoke Campaign</span>
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </MagneticButton>
                  </div>

                </motion.form>
              ) : (
                <motion.div
                  key="submit-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-6"
                >
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-1.5 text-[#ED3F27] mb-1.5">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-widest font-mono">SPARK CAPTURED</span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight font-display">
                      YOUR FIRE IS QUEUED.
                    </h2>
                    
                    <div className="text-white/60 text-sm max-w-md mx-auto leading-relaxed mt-4 flex flex-col gap-3 font-sans border-t border-b border-white/5 py-6">
                      <p>
                        Thank you, <strong className="text-white">{name}</strong>. Our strategy team is preparing a customized brief for <strong className="text-white">{company}</strong>.
                      </p>
                      <p className="text-xs text-white/40">
                        We have sent a confirmation to <strong className="text-white/70">{email}</strong> and will follow up within 24 hours at <strong className="text-white/70">{phone}</strong>.
                      </p>
                    </div>
                  </div>

                  <MagneticButton
                    onClick={() => {
                      setFormSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setCompany("");
                      setMessage("");
                      setSelectedServices([]);
                      setSelectedBudget("");
                    }}
                    className="rounded-full bg-white text-black hover:bg-[#ED3F27] hover:text-white font-bold uppercase tracking-widest text-[10px] px-8 py-3.5 mt-4 transition-all duration-300"
                  >
                    Stoke Another
                  </MagneticButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
