"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileNav, { type NavigationItem } from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";

type NavigationId = "overview" | "insights" | "influencers" | "spaces" | "reach-them" | "gender" | "compare" | "summary" | "library";

type SiteHeaderProps = { active?: NavigationId };

const links: readonly NavigationItem<NavigationId>[] = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "insights", label: "Insights", href: "/insights" },
  { id: "influencers", label: "Influencers", href: "/influencers" },
  { id: "spaces", label: "Spaces", href: "/spaces" },
  { id: "reach-them", label: "Marketing 101", href: "/reach-them" },
  { id: "gender", label: "Gender lens", href: "/gender" },
  { id: "compare", label: "Compare", href: "/compare" },
  { id: "summary", label: "Summary", href: "/summary" },
  { id: "library", label: "Library", href: "/library" }
];

function navigationIdForPath(pathname: string): NavigationId | undefined {
  return links.find((link) => link.href === "/" ? pathname === "/" : pathname.startsWith(`${link.href}/`) || pathname === link.href)?.id;
}

export default function SiteHeader({ active }: SiteHeaderProps) {
  const [routeActive, setRouteActive] = useState<NavigationId>();
  const current = active ?? routeActive;

  useEffect(() => {
    const updateActiveRoute = () => setRouteActive(navigationIdForPath(window.location.pathname));
    updateActiveRoute();
    window.addEventListener("popstate", updateActiveRoute);
    return () => window.removeEventListener("popstate", updateActiveRoute);
  }, []);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Gen Alpha Intelligence Lab home">
        Gen Alpha Intelligence Lab
      </Link>
      <nav aria-label="Primary navigation" className="primary-nav">
        {links.map((link) => (
          <Link
            aria-current={current === link.id ? "page" : undefined}
            href={link.href}
            key={link.id}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
      <MobileNav active={current} links={links} />
    </header>
  );
}
