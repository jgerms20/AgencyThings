import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "The Hydration Refresh", description: "A living cultural-intelligence desk for the moments shaping hydration, sport, and culture." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
