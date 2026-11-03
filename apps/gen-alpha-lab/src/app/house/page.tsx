import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import HouseExperience from "@/components/HouseExperience";
import "./house.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--house-font-display" });
const body = Inter({ subsets: ["latin"], variable: "--house-font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--house-font-mono" });

export const metadata: Metadata = {
  title: "The House | Gen Alpha Intelligence Lab",
  description: "Walk through two composite rooms and open the Gen Alpha research behind everyday objects.",
  openGraph: { images: ["/house/gen-alpha-girls-bedroom.png"] },
};

export default function HousePage() {
  return <div className={`${display.variable} ${body.variable} ${mono.variable}`}><HouseExperience /></div>;
}
