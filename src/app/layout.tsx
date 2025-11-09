import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtisanHub - Marketplace Seniman Indonesia",
  description:
    "Platform marketplace terpercaya untuk menghubungkan seniman berbakat dengan klien yang membutuhkan jasa kreatif.",
  keywords: [
    "ArtisanHub",
    "marketplace",
    "seniman",
    "klien",
    "Indonesia",
    "kreatif",
    "proyek",
  ],
  authors: [{ name: "ArtisanHub Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ArtisanHub - Marketplace Seniman Indonesia",
    description:
      "Platform marketplace terpercaya untuk menghubungkan seniman berbakat dengan klien",
    url: "https://artisanhub.com",
    siteName: "ArtisanHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtisanHub - Marketplace Seniman Indonesia",
    description: "Platform marketplace terpercaya untuk seniman dan klien",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  );
}
