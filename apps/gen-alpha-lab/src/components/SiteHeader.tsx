"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";
import MobileNav, { type NavigationItem } from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import { ChevronDown } from "lucide-react";

type NavigationId = "overview" | "insights" | "humor" | "influencers" | "spaces" | "reach-them" | "gender" | "compare" | "summary" | "library";

type SiteHeaderProps = { active?: NavigationId };

const links: readonly NavigationItem<NavigationId>[] = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "insights", label: "Insights", href: "/insights" },
  { id: "humor", label: "Humor", href: "/humor" as Route },
  { id: "influencers", label: "Influencers", href: "/influencers" },
  { id: "spaces", label: "Spaces", href: "/spaces" },
  { id: "reach-them", label: "Brand playbook", href: "/reach-them" },
  { id: "gender", label: "Gender lens", href: "/gender" },
  { id: "compare", label: "Compare", href: "/compare" },
  { id: "summary", label: "Summary", href: "/summary" },
  { id: "library", label: "Sources", href: "/library" }
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
        {links.filter((link) => ["overview", "insights", "influencers", "spaces", "library"].includes(link.id)).map((link) => (
          <Link
            aria-current={current === link.id ? "page" : undefined}
            href={link.href}
            key={link.id}
          >
            {link.label}
          </Link>
        ))}
        <details className="explore-menu" onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary")?.focus();
          }
        }}>
          <summary>Explore <ChevronDown size={15} aria-hidden="true" /></summary>
          <div>{links.filter((link) => !["overview", "insights", "influencers", "spaces", "library"].includes(link.id)).map((link) => <Link key={link.id} href={link.href} aria-current={current === link.id ? "page" : undefined}>{link.label}</Link>)}</div>
        </details>
      </nav>
      <ThemeToggle />
      <MobileNav active={current} links={links} />
    </header>
  );
}
