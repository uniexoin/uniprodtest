import type { Metadata } from "next";
import { Suspense } from "react";
import { Fira_Sans, Space_Grotesk, Playfair_Display, DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { GlobalProfileSidebar } from "@/components/global-profile-sidebar";
import { CacheManager } from "@/components/cache-manager";
import { PushNotificationProvider } from "@/components/push-notification-provider";
import { UniExoProvider } from "@/components/providers/uniexo-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { IntelligencePulse } from "@/components/intelligence-pulse";
import { OnboardingGuide } from "@/components/onboarding-guide";
import { SuccessAnimationOverlay } from "@/components/success-animation-overlay";
import { GlobalLoaderOverlay } from "@/components/global-loader-overlay";

/* ── Typography System: 6 Google Fonts ─────────────────────── */

// 1. Body / Navigation / UI (default)
const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// 2. Section Headings (h2–h3)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// 3. Hero / Page Titles (h1)
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

// 4. Captions / Badges / Labels
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// 5. Data / Monospace (prices, dates, IDs)
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// 6. KPI / Accent Numbers (stat counters, big numbers)
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "UniExo - All-in-One Multi-Service Platform",
    template: "%s | UniExo"
  },
  description: "Experience the premium adaptive UI of UniExo. Rent elite vehicles, find verified stays & rooms, trade used marketplace products, and book professional campus laundry services instantly.",
  keywords: [
    "UniExo", "UniExo Platform", "Campus Rentals", "PG Accommodation", "Hostel Search", 
    "Campus Vehicle Rental", "Student Marketplace", "Campus Laundry", "Verified Rooms"
  ],
  authors: [{ name: "UniExo Team", url: "https://uniexo.in" }],
  creator: "UniExo Team",
  metadataBase: new URL("https://uniexo.in"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "UniExo - All-in-One Multi-Service Platform",
    description: "Experience the premium adaptive UI of UniExo. Vehicles, Houses, Laundry, and Marketplace.",
    url: "https://uniexo.in",
    siteName: "UniExo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniExo - All-in-One Multi-Service Platform",
    description: "Experience the premium adaptive UI of UniExo. Vehicles, Houses, Laundry, and Marketplace.",
  },
};

export const viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaSans.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${sora.variable} antialiased min-h-screen flex flex-col font-[family-name:var(--font-fira)]`}
      >
        <Providers>
          <UniExoProvider>
            <CacheManager />
            <IntelligencePulse />
            <OnboardingGuide />
            <Navbar />
            <GlobalProfileSidebar />
            <SuccessAnimationOverlay />
            <Suspense fallback={null}>
              <GlobalLoaderOverlay />
            </Suspense>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <Toaster 
              position="bottom-right" 
              closeButton 
              toastOptions={{
                classNames: {
                  success: 'border-primary bg-black text-primary shadow-[0_0_15px_rgba(139,0,74,0.4)]',
                  error: 'border-red-500 bg-black text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
                  toast: 'border bg-black/90 backdrop-blur-md rounded-lg font-medium tracking-wide',
                  closeButton: 'bg-zinc-800 hover:bg-zinc-700 text-white border-none'
                },
                duration: 4000,
              }} 
            />
            <PushNotificationProvider />
          </UniExoProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
        <Script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>

        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wmpm3c7d45");
          `}
        </Script>
      </body>
    </html>
  );
}
