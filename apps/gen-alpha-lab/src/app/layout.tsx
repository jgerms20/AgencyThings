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

const themeBootScript = `try{var t=localStorage.getItem("gen-alpha-lab-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        {children}
      </body>
    </html>
  );
}
