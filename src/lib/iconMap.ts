import {
  Flame,
  Crosshair,
  Clapperboard,
  Globe,
  Share2,
  Sparkles,
  Search,
  MailOpen,
  BarChart3,
  Megaphone,
  PenTool,
  Camera,
  Palette,
  Rocket,
  Code,
  Zap,
  Heart,
  Star,
  Target,
  Lightbulb,
  Music,
  Video,
  Headphones,
  ShoppingBag,
  Smartphone,
  Monitor,
  Mic,
  Newspaper,
  BookOpen,
  Compass,
  Award,
  Crown,
  Diamond,
  Feather,
  Gift,
  Map,
  Layers,
  Send,
  type LucideIcon,
} from "lucide-react";

// ──────────────────────────────────────────────────
// Central icon registry used by:
//   • ServicesClient (public pages)
//   • ServiceCardPreview (admin preview)
//   • Admin Services Editor (icon picker)
// ──────────────────────────────────────────────────

export interface IconEntry {
  name: string;
  label: string;
  component: LucideIcon;
  tags: string[]; // for search/filtering in the picker
}

export const ICON_REGISTRY: IconEntry[] = [
  // ── Brand & Identity ──
  { name: "Flame", label: "Flame", component: Flame, tags: ["brand", "fire", "hot"] },
  { name: "Sparkles", label: "Sparkles", component: Sparkles, tags: ["brand", "magic", "shine"] },
  { name: "Crown", label: "Crown", component: Crown, tags: ["brand", "premium", "royal"] },
  { name: "Diamond", label: "Diamond", component: Diamond, tags: ["brand", "luxury", "gem"] },
  { name: "Award", label: "Award", component: Award, tags: ["brand", "trophy", "win"] },
  { name: "Star", label: "Star", component: Star, tags: ["brand", "rating", "favorite"] },
  { name: "Heart", label: "Heart", component: Heart, tags: ["brand", "love", "like"] },
  { name: "Palette", label: "Palette", component: Palette, tags: ["design", "art", "color"] },
  { name: "Feather", label: "Feather", component: Feather, tags: ["writing", "light", "elegant"] },

  // ── Marketing & Ads ──
  { name: "Crosshair", label: "Crosshair", component: Crosshair, tags: ["ads", "target", "focus"] },
  { name: "Target", label: "Target", component: Target, tags: ["ads", "goal", "aim"] },
  { name: "Megaphone", label: "Megaphone", component: Megaphone, tags: ["ads", "announce", "campaign"] },
  { name: "Rocket", label: "Rocket", component: Rocket, tags: ["launch", "growth", "fast"] },
  { name: "Zap", label: "Zap", component: Zap, tags: ["energy", "speed", "electric"] },
  { name: "Send", label: "Send", component: Send, tags: ["message", "email", "push"] },
  { name: "TrendingUp", label: "Trending Up", component: BarChart3, tags: ["growth", "analytics", "stats"] },

  // ── Content & Media ──
  { name: "Clapperboard", label: "Clapperboard", component: Clapperboard, tags: ["video", "film", "production"] },
  { name: "Video", label: "Video", component: Video, tags: ["video", "stream", "record"] },
  { name: "Camera", label: "Camera", component: Camera, tags: ["photo", "image", "picture"] },
  { name: "Music", label: "Music", component: Music, tags: ["audio", "sound", "song"] },
  { name: "Headphones", label: "Headphones", component: Headphones, tags: ["audio", "podcast", "listen"] },
  { name: "Mic", label: "Microphone", component: Mic, tags: ["voice", "podcast", "record"] },
  { name: "Newspaper", label: "Newspaper", component: Newspaper, tags: ["news", "press", "article"] },
  { name: "BookOpen", label: "Book Open", component: BookOpen, tags: ["content", "read", "blog"] },
  { name: "PenTool", label: "Pen Tool", component: PenTool, tags: ["write", "design", "copy"] },

  // ── Digital & Web ──
  { name: "Globe", label: "Globe", component: Globe, tags: ["web", "world", "internet"] },
  { name: "Code", label: "Code", component: Code, tags: ["dev", "web", "programming"] },
  { name: "Monitor", label: "Monitor", component: Monitor, tags: ["screen", "web", "desktop"] },
  { name: "Smartphone", label: "Smartphone", component: Smartphone, tags: ["mobile", "app", "phone"] },
  { name: "Layers", label: "Layers", component: Layers, tags: ["stack", "design", "multi"] },

  // ── Social & Communication ──
  { name: "Share2", label: "Share", component: Share2, tags: ["social", "share", "network"] },
  { name: "MailOpen", label: "Email", component: MailOpen, tags: ["email", "newsletter", "inbox"] },
  { name: "Search", label: "Search", component: Search, tags: ["seo", "find", "discover"] },

  // ── Strategy & Growth ──
  { name: "Lightbulb", label: "Lightbulb", component: Lightbulb, tags: ["idea", "strategy", "innovation"] },
  { name: "Compass", label: "Compass", component: Compass, tags: ["direction", "navigation", "strategy"] },
  { name: "Map", label: "Map", component: Map, tags: ["roadmap", "journey", "plan"] },
  { name: "Gift", label: "Gift", component: Gift, tags: ["offer", "reward", "promo"] },
  { name: "ShoppingBag", label: "Shopping Bag", component: ShoppingBag, tags: ["ecommerce", "store", "buy"] },
];

// Quick lookup by icon name string → LucideIcon component
const iconByName: Record<string, LucideIcon> = ICON_REGISTRY.reduce(
  (acc, entry) => {
    acc[entry.name] = entry.component;
    return acc;
  },
  {} as Record<string, LucideIcon>
);

/**
 * Resolve an icon name string (stored in Supabase `icon_name` column)
 * to an actual Lucide component. Falls back to `Sparkles`.
 */
export function getIconByName(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return iconByName[name] ?? Sparkles;
}
