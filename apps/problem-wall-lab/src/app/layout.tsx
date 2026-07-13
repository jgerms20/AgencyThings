import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Problem Wall | Joshua's AgencyThings",
  description: "A weekly problem discovery, B.U.R.S.T. scoring, shortlist, and review workspace."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
