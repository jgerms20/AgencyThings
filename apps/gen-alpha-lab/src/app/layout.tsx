import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen Alpha Intelligence Lab",
  description:
    "A findings-first cultural field guide to Gen Alpha, with direct evidence, owned media, and interview intake.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
