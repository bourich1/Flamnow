import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/context/CursorContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const seo = {
    title: "Flamnow | Creative Marketing Agency",
    description: "We design bold brand systems, build high-performance digital flagships, and orchestrate campaigns that stoke market growth.",
    keywords: ["creative agency", "marketing agency", "brand strategy", "web design", "campaign management", "branding", "growth marketing", "digital flagship"]
  };

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "seo_settings")
      .single();

    if (data?.value) {
      const val = data.value as any;
      if (val.title) seo.title = val.title;
      if (val.description) seo.description = val.description;
      if (val.keywords) seo.keywords = val.keywords;
    }
  } catch (err) {
    console.error("Error generating dynamic metadata:", err);
  }

  const siteBrand = seo.title.split("|")[0].trim();

  return {
    title: {
      default: seo.title,
      template: `%s | ${siteBrand}`
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Flamnow Creative" }],
    metadataBase: new URL("https://flamnow.com"),
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "https://flamnow.com",
      siteName: siteBrand,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${siteBrand} Creative Agency`
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og-image.png"],
      creator: `@${siteBrand.toLowerCase()}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body select-none scroll-smooth">
        <CursorProvider>
          <AnalyticsTracker />
          <CustomCursor />
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </CursorProvider>
      </body>
    </html>
  );
}
