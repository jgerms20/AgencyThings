import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gen Alpha Intelligence Lab",
  description:
    "A living agency research lab for Gen Alpha signals, interviews, sources, and strategic comparisons to Gen Z.",
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
