import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

const publicUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: "Gen Alpha House",
  description: "A sourced field guide to Gen Alpha, mapped across distinct boys’ and girls’ rooms.",
  applicationName: "Gen Alpha House",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Gen Alpha House",
    description: "Two rooms. Eighteen familiar objects. Fifty-four sourced connections to the Gen Alpha Intelligence Lab.",
    images: ["/gen-alpha-girls-bedroom.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
