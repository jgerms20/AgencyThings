import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen Alpha Intelligence Lab",
  description:
    "A findings-first cultural field guide to Gen Alpha, with topic lenses, direct evidence, owned media, and a rich library.",
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
