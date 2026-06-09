const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.error('Failed to parse .env file:', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceKey);

const newSettings = [
  {
    key: "why_flamnow_value_props",
    value: [
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
    ],
    description: "Why Flamnow section value propositions"
  },
  {
    key: "process_steps",
    value: [
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
    ],
    description: "Methodology process steps"
  },
  {
    key: "about_values",
    value: [
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
    ],
    description: "About page core philosophy values"
  },
  {
    key: "pricing_packages",
    value: [
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
    ],
    description: "Pricing packages details"
  }
];

async function migrate() {
  console.log("Upserting new site content parameters into site_settings...");
  for (const item of newSettings) {
    const { error } = await supabase.from("site_settings").upsert(item);
    if (error) {
      console.error(`❌ Error upserting ${item.key}:`, error);
    } else {
      console.log(`✅ Upserted ${item.key} successfully.`);
    }
  }
  console.log("Migration complete!");
}

migrate().catch(console.error);
