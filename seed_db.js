const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const defaultServices = [
  {
    id: "branding",
    title: "Branding",
    tagline: "Define your fire.",
    description: "We build modern, bulletproof brand systems that capture attention, command authority, and secure market loyalty.",
    features: [
      "Market Intelligence & Positioning",
      "Visual Identity (Logo, Fonts, Colors)",
      "Brand Voice & Editorial Guidelines",
      "Brand Launch & Playbooks"
    ],
    benefits: [
      "Establishes ownable market authority",
      "Commands premium pricing opportunities",
      "Increases customer lifetime value (LTV)"
    ],
    metric_label: "Brand Recognition Boost",
    metric_value: "+140%",
    color: "#ED3F27"
  },
  {
    id: "paid-ads",
    title: "Paid Ads",
    tagline: "Stoke the flames of growth.",
    description: "We deploy ROI-driven digital advertising campaigns across channels, fusing copywriting with attribution metrics.",
    features: [
      "Omnichannel Campaign Strategy",
      "Paid Media Optimization (Meta, Google, TikTok)",
      "Performance Creative & Ad Copy",
      "Advanced Conversion Tracking"
    ],
    benefits: [
      "Secures profitable customer acquisitions",
      "Drives immediate conversion velocity",
      "Eliminates media spend attribution leak"
    ],
    metric_label: "Average Campaign ROI",
    metric_value: "4.8x",
    color: "#00E5FF"
  },
  {
    id: "content-creation",
    title: "Content Creation",
    tagline: "Narratives that spark movement.",
    description: "Premium cinematic videography, motion graphics, and visual assets designed specifically for modern attention spans.",
    features: [
      "Cinematic Brand Videos",
      "Short-form Social Content Reels",
      "3D Motion Graphics & Animation",
      "Product Photography & Renders"
    ],
    benefits: [
      "Increases ad scroll-stopper hold rates",
      "Fosters high social shares and saves",
      "Elevates brand narrative assets"
    ],
    metric_label: "Engagement Rate Increase",
    metric_value: "+220%",
    color: "#BF5AF2"
  },
  {
    id: "website-design",
    title: "Website Design",
    tagline: "Your digital flagship.",
    description: "Immersive, lightning-fast digital experiences that merge cutting-edge tech with conversion-oriented UX.",
    features: [
      "Custom UI/UX Prototypes",
      "Next.js & React Frontend Coding",
      "Micro-animations & 3D WebGL",
      "Conversion Rate Optimization (CRO)"
    ],
    benefits: [
      "Accelerates frontend page load times",
      "Improves lead and sales conversion loops",
      "Boosts organic search visibility and rank"
    ],
    metric_label: "Load Time Reduction",
    metric_value: "85%",
    color: "#E2F13C"
  },
  {
    id: "social-media",
    title: "Social Media Management",
    tagline: "Turn attention into community.",
    description: "Organic social positioning, community architecture, and creator collaborations that build brand advocates.",
    features: [
      "Social Media Management & Setup",
      "Creator & Influencer Partnerships",
      "Community Growth Systems",
      "Real-time Viral Loop Auditing"
    ],
    benefits: [
      "Fosters active brand advocate communities",
      "Scales organic brand word-of-mouth",
      "Secures creator partnership pipelines"
    ],
    metric_label: "Audience Growth Velocity",
    metric_value: "3.2x",
    color: "#FF9F0A"
  }
];

const defaultProjects = [
  {
    id: "volt-audio",
    title: "Rewriting the Sound of Electric Power",
    client: "Volt Audio",
    category: "Branding",
    year: "2025",
    tagline: "A sonic identity and branding revolution for premium electric vehicles.",
    description: "Rebranding a leading electric audio engineering startup. We created a high-voltage visual system, custom sonic signatures, and launched a multi-sensory marketing campaign.",
    long_description: "Volt Audio develops premium sound systems specifically tuned for the unique acoustics of high-end electric vehicles. They needed a brand identity that was as sophisticated and cutting-edge as their audio technology. We crafted a sonic-first visual brand, fusing fluid waveforms with strict geometric typography to convey high-fidelity power.",
    challenge: "Volt Audio had state-of-the-art technology but felt dated. Their marketing wasn't connecting with EV manufacturers or audiophiles who demand premium sensory experiences. They needed to move from an engineering supplier to an aspirational lifestyle brand.",
    solution: "We rebuilt the brand architecture from the ground up, designing a responsive logo system inspired by acoustic resonance. We paired this with a high-contrast dark theme (#111111) and hot orange/red energy accents (#ED3F27) to represent heat, electricity, and creative passion.",
    results: [
      "Acquired 3 major EV integration partnerships within 6 months of rebranding",
      "+300% increase in social media engagement and audiophile forum discussions",
      "Brand recognition scored 85% higher in consumer test panels post-launch"
    ],
    tags: ["Brand Identity", "Sonic Branding", "Visual Design", "EV Partnerships"],
    color: "#ED3F27",
    accent_color: "rgba(237, 63, 39, 0.1)",
    cover_image: "/volt_cover.png"
  },
  {
    id: "vortex-pay",
    title: "Making Finance Move Like Water",
    client: "Vortex Pay",
    category: "Digital",
    year: "2026",
    tagline: "Designing a fluid, ultra-responsive digital transaction flagship.",
    description: "Crafting a brand new web platform and visual campaign for a next-gen, zero-fee global payments gateway. We designed the user journey, developed the Next.js frontend, and orchestrated the viral launch.",
    long_description: "Vortex Pay simplifies borderless payments for freelancers and digital creators. The market is saturated with complicated fintech, so they wanted a product that felt incredibly smooth, fast, and light. We developed an interactive marketing website that visualizes transaction speed through high-fidelity, interactive CSS and SVG simulations.",
    challenge: "Traditional fintech websites are dry and data-heavy, leading to high bounce rates. Vortex Pay needed to communicate speed, security, and extreme simplicity while showcasing their dashboard.",
    solution: "We created a WebGL-infused, scroll-driven interactive experience. The user flows from sending a payment to a global partner in real-time, visualized through neon light paths crossing the screen, leading to a dynamic conversion form.",
    results: [
      "250,000+ early-access waitlist sign-ups in 3 weeks",
      "Average session duration increased from 42 seconds to 3.5 minutes",
      "Bounce rate decreased by 55% compared to their legacy landing page"
    ],
    tags: ["UX/UI Design", "Next.js WebApp", "Interactive Design", "Fintech Marketing"],
    color: "#00E5FF",
    accent_color: "rgba(0, 229, 255, 0.1)",
    cover_image: "/vortex_cover.png"
  },
  {
    id: "ignite-sports",
    title: "Fueling the Next Generation of Runners",
    client: "Ignite Sports",
    category: "Campaigns",
    year: "2025",
    tagline: "A fearless, high-impact marketing campaign that swept across urban running cultures.",
    description: "An omnichannel marketing campaign for Ignite's new carbon-plated racing shoe. We created cinematic social video assets, interactive city running challenges, and strategic influencer takeovers.",
    long_description: "Ignite Sports launched their most advanced running shoe yet, the CarbonFly. We designed a campaign centered around the raw emotion of running: the pain, the sweat, and the breakthrough. The campaign was titled 'Fear No Distance' and featured dark, high-contrast urban imagery contrasting with bright neon flashes.",
    challenge: "The carbon-plate running market is dominated by legacy giant brands. Ignite needed a campaign that stood out on social media platforms, targeting elite local run crews and urban athletes directly.",
    solution: "We combined hyper-local storytelling with a digital hub. We filmed run crews in Berlin, Tokyo, and London, creating high-energy reels, and created a Strava integrated campaign where runners could unlock custom NFT gear based on their weekly mileage.",
    results: [
      "12,000,000+ impressions across TikTok and Instagram Reels",
      "Initial production run of CarbonFly shoes sold out in 48 hours",
      "Strava challenge had over 50,000 active runners log 500,000 km collectively"
    ],
    tags: ["Ad Campaign", "Video Production", "Social Integration", "Influencer Strategy"],
    color: "#E2F13C",
    accent_color: "rgba(226, 241, 60, 0.1)",
    cover_image: "/ignite_cover.png"
  },
  {
    id: "nexus-vr",
    title: "Step into the Hyperreal",
    client: "Nexus Labs",
    category: "Production",
    year: "2026",
    tagline: "Cinematic launch video and visual assets for the world's lightest mixed-reality headset.",
    description: "Fusing high-end 3D CGI rendering, sound design, and live-action cinematography to introduce a paradigm-shifting spatial computer. We produced the launch trailer and all digital marketing assets.",
    long_description: "Nexus Labs needed a visual masterpiece to introduce Nexus VR to global tech audiences. They wanted a commercial that didn't just show the device, but simulated what it feels like to step inside spatial computing. We modeled the headset in 3D, animated its internal optics, and mixed it with custom orchestrations.",
    challenge: "Visualizing mixed reality is notoriously difficult in 2D video. Most product videos look like generic sci-fi. We needed to show the actual interaction design, spatial depth, and human emotion in a beautiful 2-minute journey.",
    solution: "We created a story about seamless workflow and artistic creation. We utilized macro lens cinematography to capture physical expressions and transitioned into massive 3D environments that burst outward from the user's headset, rendering dynamic spatial interfaces in real time.",
    results: [
      "Over 4.5 million views on YouTube within a week of release",
      "Featured on major tech and design blogs including Behance and DesignMilk",
      "Direct preorder conversion rate of 3.4% directly from the launch video page"
    ],
    tags: ["3D Animation", "Commercial Production", "Spatial Sound Design", "Visual Effects"],
    color: "#BF5AF2",
    accent_color: "rgba(191, 90, 242, 0.1)",
    cover_image: "/nexus_cover.png"
  }
];

const defaultClients = [
  { name: "Volt Audio" },
  { name: "Vortex Pay" },
  { name: "Ignite Sports" },
  { name: "Nexus Labs" },
  { name: "Apex Media" },
  { name: "Echo Sound" }
];

const defaultTestimonials = [
  {
    id: "t1",
    name: "Marcus Thorne",
    role: "VP of Global Marketing",
    company: "Volt Audio",
    quote: "Flamnow didn't just design a new logo. They reshaped our entire identity and gave us the confidence to claim our spot as a premium brand. Their design process was fearless, strategic, and executed with absolute precision.",
    metric: "+300%",
    metric_label: "Social Engagement Boost"
  },
  {
    id: "t2",
    name: "Sarah Chen",
    role: "Co-Founder & COO",
    company: "Vortex Pay",
    quote: "The team at Flamnow are creative athletes. They operate at extreme speeds without sacrificing quality. The interactive landing page they built has directly converted hundreds of thousands of waitlist members. They are our secret weapon.",
    metric: "250K+",
    metric_label: "Waitlist Signups in 3 Weeks"
  },
  {
    id: "t3",
    name: "Elena Rostova",
    role: "Brand Director",
    company: "Ignite Sports",
    quote: "Working with Flamnow was intense and exhilarating. They pushed us outside our comfort zones, and the results speak for themselves. The 'Fear No Distance' campaign captured the running community's imagination and sold out our production run.",
    metric: "48 Hrs",
    metric_label: "Total Sell-out Time"
  },
  {
    id: "t4",
    name: "David Vance",
    role: "Chief Creative Officer",
    company: "Nexus Labs",
    quote: "Most agencies struggle with mixed reality concepts because they try to make them look too techy. Flamnow made it look human, poetic, and premium. The launch trailer they produced is a piece of art that redefined how we sell spatial computing.",
    metric: "4.5M",
    metric_label: "YouTube Views in 7 Days"
  }
];

const defaultFaqs = [
  {
    question: "How fast does Flamnow execute projects?",
    answer: "We work in structured sprints. A standard brand identity and Next.js landing page takes 3-4 weeks. A comprehensive campaign blueprint with visual content production takes 6-8 weeks."
  },
  {
    question: "Do you build backends for web products?",
    answer: "We specialize in high-end frontend experiences using Next.js. We configure the client journeys and connect with your internal backend developers to hook up authentication, databases, and APIs."
  },
  {
    question: "What is your attribution methodology?",
    answer: "We do not rely on generic dashboards. We configure server-side tracking and analytics tags to trace exactly where your conversions originate, giving you an audited view of campaign performance."
  },
  {
    question: "Do you offer ongoing retainer models?",
    answer: "Yes. Our Enterprise Inferno model functions on a monthly retainer, dedicating a core crew (creative director, developer, art lead) to stoke your brand campaigns month over month."
  }
];

const defaultTeam = [
  {
    id: "m1",
    name: "Alex Sterling",
    role: "Founder & Creative Director",
    bio: "Over 12 years of architecting brand systems and marketing campaigns that disrupt markets. Believes that if a brand doesn't provoke an emotion, it doesn't exist.",
    specialty: "Creative Direction & Brand Architecture",
    instagram: "#",
    linkedin: "#"
  },
  {
    id: "m2",
    name: "Tasha Karr",
    role: "Head of Strategy & Growth",
    bio: "A performance strategist who merges cultural insights with data attribution. Spends her time transforming customer psychology into scalable revenue loops.",
    specialty: "Growth Hacking & Market Intelligence",
    instagram: "#",
    linkedin: "#"
  },
  {
    id: "m3",
    name: "Viktor Vane",
    role: "Lead Interactive Engineer",
    bio: "Obsessed with creating immersive digital products that push web standards. Specialized in Next.js, Framer Motion, and high-performance WebGL animations.",
    specialty: "Frontend Architecture & Creative Tech",
    instagram: "#",
    linkedin: "#"
  },
  {
    id: "m4",
    name: "Zoe Moreno",
    role: "Art Director & Video Producer",
    bio: "Cinematographer and designer dedicated to capturing motion and aesthetics. Translates abstract brand guidelines into striking cinematic content.",
    specialty: "Commercial Production & CGI Animation",
    instagram: "#",
    linkedin: "#"
  }
];

const defaultHeroContent = {
  badge: "Fearless Creative Agency",
  title_1: "We Ignite",
  title_stroke: "Untamed",
  title_2: "Growth.",
  description: "We reject lukewarm marketing formulas. Flamnow designs bold brand systems, installs speed-optimized web flagships, and launches attribution campaigns for category leaders.",
  primary_btn_text: "Let's Stoke",
  primary_btn_url: "/contact",
  secondary_btn_text: "Our Chronicles",
  secondary_btn_url: "/projects",
  speed_card_title: "Flagship App",
  speed_card_value: "Load Speed: 0.4s",
  speed_card_sub: "VITALS 100%",
  roi_card_title: "Campaign ROI",
  roi_card_value: "Attributed: 4.8x",
  ctr_card_title: "Ads Performance",
  ctr_card_value: "CTR Rate: 6.2%",
  ctr_card_sub: "+22% ABOVE BM"
};

const defaultResultsStats = [
  {
    id: "views",
    label: "Views Generated",
    displayVal: "12.8M+",
    rawVal: "12800000",
    prefix: "",
    suffix: "M+",
    iconName: "Eye",
    color: "#ED3F27",
    detail: "Aggregated views across video campaigns and viral reels."
  },
  {
    id: "followers",
    label: "Followers Gained",
    displayVal: "850K+",
    rawVal: "850000",
    prefix: "",
    suffix: "K+",
    iconName: "Users",
    color: "#00E5FF",
    detail: "Organic audience expansion across client social profiles."
  },
  {
    id: "campaigns",
    label: "Campaigns Managed",
    displayVal: "120+",
    rawVal: "120",
    prefix: "",
    suffix: "+",
    iconName: "FolderKanban",
    color: "#BF5AF2",
    detail: "High-attribution multi-channel digital ad launches."
  },
  {
    id: "revenue",
    label: "Revenue Influenced",
    displayVal: "$48M+",
    rawVal: "48000000",
    prefix: "$",
    suffix: "M+",
    iconName: "DollarSign",
    color: "#E2F13C",
    detail: "Sales spikes attributed directly to our campaign models."
  }
];

const defaultContactCta = {
  title: "READY TO STOKE",
  subtitle: "THE FLAMES?",
  description: "Let's design a brand system, build a conversion flagship, or launch campaigns that disrupt your category. No commitments, just pure creative strategy.",
  button_text: "Stoke the Fire",
  button_url: "/contact",
  label: "Launch Project"
};

const defaultGeneralSettings = {
  siteName: "Flamnow",
  contactEmail: "hello@flamnow.com",
  contactPhone: "+44 (0) 20 7946 0958",
  address: "22 Flame Avenue, Shoreditch",
  city: "London",
  zip: "EC2A 3PR",
  whatsapp_url: "https://wa.me/442079460958"
};

const defaultSocialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Twitter", href: "https://twitter.com" },
  { name: "Behance", href: "https://behance.net" }
];

const defaultSeoSettings = {
  title: "Flamnow | Creative Marketing Agency",
  description: "We design bold brand systems, build high-performance digital flagships, and orchestrate campaigns that stoke market growth.",
  keywords: ["creative agency", "marketing agency", "brand strategy", "web design", "campaign management", "branding", "growth marketing", "digital flagship"]
};

const defaultWhyFlamnowValueProps = [
  {
    iconName: "Flame",
    num: "01",
    title: "Category Distorters",
    desc: "We reject typical template guidelines and boring copy. We design brand identities that assert visual authority, making your competition irrelevant."
  },
  {
    iconName: "Rocket",
    num: "02",
    title: "Speed Athletes",
    desc: "We ship assets at sprint speed. We build next-gen Next.js sites and cinematic videography in weeks, keeping you ahead of fast-moving markets."
  },
  {
    iconName: "BarChart3",
    num: "03",
    title: "Attributed Value",
    desc: "We back our aesthetics with numbers. We configure custom marketing tags to verify exactly how our work fuels your bottom-line expansion."
  }
];

const defaultProcessSteps = [
  {
    num: "01",
    title: "Discovery",
    tagline: "Auditing & Research",
    desc: "We analyze competitor footprints, extract consumer psychographic patterns, and find market gaps. We establish a clear discovery sheet before outlining brand coordinates."
  },
  {
    num: "02",
    title: "Strategy",
    tagline: "Positioning & Vectors",
    desc: "We map out brand architecture, outline media campaigns, select channels, and define attribution metrics. This forms the strategic blueprint for the entire campaign."
  },
  {
    num: "03",
    title: "Creation",
    tagline: "Engineering & Assets",
    desc: "We build. From geometric Clash Display identities and cinematic product videos to coding responsive Next.js applications and copywriting conversion assets."
  },
  {
    num: "04",
    title: "Launch",
    tagline: "Deployment & Tracking",
    desc: "We push live. We activate server-side analytics tracking, launch omnichannel campaigns across platforms, and seed initial influencer networks to stoke conversion loops."
  },
  {
    num: "05",
    title: "Optimization",
    tagline: "Scaling & Attribution",
    desc: "We optimize. By running continuous A/B test experiments, auditing tracking attributions, and modifying ad bids, we expand your ROI and scale market share."
  }
];

const defaultAboutValues = [
  {
    iconName: "Compass",
    title: "Bold Convictions",
    desc: "We reject lukewarm compromise. We research target psychology to frame original, opinionated identities that capture long-term market authority."
  },
  {
    iconName: "Zap",
    title: "High-Fidelity Speed",
    desc: "We work in fast sprints. We build Next.js interfaces and produce cinematic campaign media in weeks, not months."
  },
  {
    iconName: "HeartHandshake",
    title: "Numeric Honesty",
    desc: "Aesthetics must perform. We install server-side tag attribution pipelines to prove exactly how our creations fuel your conversions."
  }
];

const defaultPricingPackages = [
  {
    name: "Startup Spark",
    price: "$7,500",
    term: "per project",
    desc: "Establish a fearless visual identity and clean digital base to enter the market.",
    features: [
      "Brand Audit & Competitor Review",
      "Visual Identity Assets (Logo, Fonts, Colors)",
      "High-Performance Next.js Landing Page",
      "Paid Ad Campaign Scaffolding & Audiences",
      "Custom Attribution Setup"
    ],
    cta: "Ignite Startup",
    popular: false
  },
  {
    name: "Brand Flare",
    price: "$15,000",
    term: "per project",
    desc: "A comprehensive overhaul of your identity, marketing platform, and lead funnels.",
    features: [
      "Bespoke Brand Architecture & Guidelines",
      "Custom 5-page Interactive Next.js App",
      "High-Conversion Copywriting & Storyboards",
      "Cinematic Launch Trailer & Campaign Assets",
      "Attribution, Analytics & Retargeting Pipelines"
    ],
    cta: "Deploy Flare",
    popular: true
  },
  {
    name: "Enterprise Inferno",
    price: "Custom",
    term: "retainer model",
    desc: "Ongoing high-end creative, engineering, and performance scaling for market leaders.",
    features: [
      "Dedicated Creative Director & Core Crew",
      "Immersive Flagship Web Apps with WebGL",
      "High-volume Content & Motion Graphic Engine",
      "Omnichannel Campaign Management & Growth Loops",
      "Weekly Attribution Auditing & Market Intel"
    ],
    cta: "Contact Partners",
    popular: false
  }
];

async function seed() {
  console.log("Seeding started...");

  // Clear existing content to prevent conflicts
  await supabase.from("services").delete().neq("id", "");
  await supabase.from("projects").delete().neq("id", "");
  await supabase.from("clients").delete().neq("name", "");
  await supabase.from("testimonials").delete().neq("id", "");
  await supabase.from("faqs").delete().neq("question", "");
  await supabase.from("team_members").delete().neq("id", "");
  await supabase.from("site_settings").delete().neq("key", "");

  // Seed Services
  const { error: sError } = await supabase.from("services").insert(defaultServices);
  if (sError) console.error("Error seeding services:", sError);
  else console.log("Seeded services!");

  // Seed Projects
  const { error: pError } = await supabase.from("projects").insert(defaultProjects);
  if (pError) console.error("Error seeding projects:", pError);
  else console.log("Seeded projects!");

  // Seed Clients
  const { error: cError } = await supabase.from("clients").insert(defaultClients);
  if (cError) console.error("Error seeding clients:", cError);
  else console.log("Seeded clients!");

  // Seed Testimonials
  const { error: tError } = await supabase.from("testimonials").insert(defaultTestimonials);
  if (tError) console.error("Error seeding testimonials:", tError);
  else console.log("Seeded testimonials!");

  // Seed FAQs
  const { error: fError } = await supabase.from("faqs").insert(defaultFaqs);
  if (fError) console.error("Error seeding FAQs:", fError);
  else console.log("Seeded FAQs!");

  // Seed Team Members
  const { error: tmError } = await supabase.from("team_members").insert(defaultTeam);
  if (tmError) console.error("Error seeding team members:", tmError);
  else console.log("Seeded team members!");

  // Seed Site Settings
  const settings = [
    { key: "hero_content", value: defaultHeroContent, description: "Homepage Hero section text and visual metrics parameters" },
    { key: "results_stats", value: defaultResultsStats, description: "Attributed performance metrics counter data" },
    { key: "contact_cta", value: defaultContactCta, description: "Homepage bottom conversion CTA card texts" },
    { key: "general_settings", value: defaultGeneralSettings, description: "Main corporate identity contacts and branding attributes" },
    { key: "social_links", value: defaultSocialLinks, description: "Social networking channels connections" },
    { key: "seo_settings", value: defaultSeoSettings, description: "Search engine optimization defaults for root meta tagging" },
    { key: "feature_flags", value: { maintenanceMode: false, enableCursor: true }, description: "Console switches" },
    { key: "why_flamnow_value_props", value: defaultWhyFlamnowValueProps, description: "Why Flamnow section value propositions" },
    { key: "process_steps", value: defaultProcessSteps, description: "Methodology process timeline steps" },
    { key: "about_values", value: defaultAboutValues, description: "About page core philosophy values list" },
    { key: "pricing_packages", value: defaultPricingPackages, description: "Pricing packages rates and scope deliverables" }
  ];

  for (const item of settings) {
    const { error: stError } = await supabase.from("site_settings").upsert(item);
    if (stError) console.error(`Error seeding site setting ${item.key}:`, stError);
    else console.log(`Seeded site setting ${item.key}!`);
  }

  console.log("Seeding complete!");
}

seed();
