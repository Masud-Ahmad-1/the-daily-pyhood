import type { Metadata, Viewport } from "next";
import { Cinzel_Decorative, Playfair_Display } from "next/font/google";
import CopyrightProtection from "@/components/copyright-protection";
import AuthProvider from "@/components/auth-provider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1816",
};

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Daily Pyhood | জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা",
  description:
    "The Daily Pyhood - জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা। সর্বশেষ জাদুভিত্তিক সংবাদ, ওয়ান্টেড পোস্টার এবং ইন্টারেক্টিভ মন্ত্র পান।",
  keywords: [
    "Daily Pyhood",
    "হ্যারি পটার",
    "জাদুভিত্তিক সংবাদ",
    "বাংলা পত্রিকা",
    "pyhood.com",
  ],
  icons: {
    icon: "/assets/hogwarts_sketch.png",
  },
  openGraph: {
    title: "The Daily Pyhood | জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা",
    description: "জাদুভিত্তিক বিশ্বের সর্বশেষ সংবাদ, ওয়ান্টেড পোস্টার এবং ইন্টারেক্টিভ মন্ত্র।",
    siteName: "The Daily Pyhood",
    type: "website",
    images: ["/assets/hogwarts_sketch.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Daily Pyhood | জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা",
    description: "জাদুভিত্তিক বিশ্বের সর্বশেষ সংবাদ পড়ুন।",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&family=UnifrakturMaguntia&family=Spectral:ital,wght@0,300;0,400;0,600;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${cinzelDecorative.variable} ${playfairDisplay.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <CopyrightProtection />
        </AuthProvider>
      </body>
    </html>
  );
}