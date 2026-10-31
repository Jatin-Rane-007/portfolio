import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import Providers from "./providers";
import { personal } from "@/data/portfolio";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_TITLE = "Jatin Rane — Frontend Engineer · React · React Native";
const SITE_DESCRIPTION =
  "Frontend engineer with production experience shipping React Native (iOS/Android) and React/TypeScript products. Specialist in real-time systems, cross-platform development, and compliance-critical flows. Open to frontend roles.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Jatin Rane",
    "Frontend Engineer",
    "React Native Developer",
    "Expo",
    "React Developer",
    "TypeScript",
    "iOS Android Developer",
    "Supabase",
    "Nadiad Gujarat",
  ],
  authors: [{ name: "Jatin Rane", url: personal.github }],
  alternates: { canonical: "/" },
  // PWA icon set from the brand kit; favicon.ico, icon.svg and apple-icon.png
  // sit in app/ and are wired by the App Router file convention.
  manifest: "/site.webmanifest",
  icons: {
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Jatin Rane — Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  jobTitle: personal.title,
  email: `mailto:${personal.email}`,
  telephone: personal.phone,
  url: personal.github,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nadiad",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  sameAs: [personal.github, personal.linkedin],
  worksFor: { "@type": "Organization", name: "Groovy Web" },
  knowsAbout: [
    "React",
    "React Native",
    "TypeScript",
    "Expo",
    "Next.js",
    "Supabase",
    "Real-time systems",
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
      className={`${inter.variable} ${syne.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          // Static, trusted object rendered once on the server.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
