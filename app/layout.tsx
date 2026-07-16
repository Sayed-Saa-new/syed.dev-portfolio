import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "app/components/Navbar";
import { siteMetadata } from "app/data/siteMetadata";
import { Footer } from "./components/Footer";
import { BgGradient } from "./components/BgGradient";
import { PageTransition } from "./components/PageTransition";
import { ServiceWorkerRegistrar } from "./components/ServiceWorkerRegistrar";

import { cx } from "./lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default:
      "Syed (Abushaid Islam) — AI Engineer & Full Stack Developer Portfolio",
    template: "%s | Syed — Abushaid Islam",
  },
  description: siteMetadata.description,
  keywords: [
    "Syed",
    "Abushaid Islam",
    "AI Engineer",
    "AI engineer portfolio",
    "Full Stack Developer",
    "full stack developer portfolio",
    "software engineer portfolio",
    "Aegis Authenticator",
    "Supabase developer",
    "Next.js developer",
    "TanStack Start",
    "Bangladeshi software engineer",
  ],
  authors: [{ name: "Abushaid Islam", url: siteMetadata.siteUrl }],
  creator: "Abushaid Islam",
  alternates: { canonical: siteMetadata.siteUrl },
  openGraph: {
    type: "website",
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.headerTitle,
    title:
      "Syed (Abushaid Islam) — AI Engineer & Full Stack Developer",
    description: siteMetadata.description,
    locale: siteMetadata.locale,
    images: [
      {
        url: "/syed_og.webp",
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteMetadata.twitterHandle,
    creator: siteMetadata.twitterHandle,
    title:
      "Syed (Abushaid Islam) — AI Engineer & Full Stack Developer",
    description: siteMetadata.description,
    images: ["/syed_og.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "4GW5hFWsbJa_98tGQoSUIX-OAfhGOfhh7ZLsxEoHqc0",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Syed",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abushaid Islam",
  alternateName: "Syed",
  url: siteMetadata.siteUrl,
  image: `${siteMetadata.siteUrl}/syed_headshot_1.webp`,
  jobTitle: "AI Engineer & Full Stack Developer",
  email: "abushaidislam7@gmail.com",
  sameAs: [siteMetadata.github, siteMetadata.twitter, siteMetadata.facebook],
  knowsAbout: [
    "Artificial Intelligence",
    "Full Stack Development",
    "Authentication Systems",
    "Next.js",
    "Supabase",
    "TypeScript",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-bg-primary ${GeistMono.variable} ${GeistSans.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/syed_headshot_1.webp"
          fetchPriority="high"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans md:max-w-7xl lg:mx-auto lg:flex-row">
        <main
          className={cx(
            "relative flex flex-1 flex-col overflow-x-hidden border-x border-border-primary/50",
          )}
        >
          <Navbar />
          <div className="grid flex-1 grid-cols-1 lg:grid-cols-[32px_1fr_32px]">
            <div className="hidden w-full border-r border-border-primary opacity-75 [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px] lg:block"></div>
            <div className="relative col-span-1 px-3 lg:px-0">
              <BgGradient />
              <PageTransition>{children}</PageTransition>
            </div>
            <div className="hidden w-full border-l border-border-primary opacity-75 [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px] lg:block"></div>
          </div>
          <Footer />
        </main>
        <ServiceWorkerRegistrar />
        <SpeedInsights />
      </body>


      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Script id="vemetric-loader" strategy="afterInteractive">
        {`
          window.vmtrcq = window.vmtrcq || [];
          window.vmtrc = window.vmtrc || ((...args) => window.vmtrcq.push(args));
        `}
      </Script>

      <Script
        src="https://cdn.vemetric.com/main.js"
        data-token="HUO9AbX53v2wkzRu"
        strategy="afterInteractive"
      />
    </html>
  );
}
