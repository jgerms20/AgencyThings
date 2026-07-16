import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen Alpha Intelligence Lab",
  description:
    "A bold, insight-first briefing on the forces shaping Gen Alpha culture.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
