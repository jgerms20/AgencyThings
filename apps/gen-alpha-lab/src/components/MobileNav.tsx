"use client";

import { Menu, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NavigationItem<Id extends string = string> = {
  id: Id;
  label: string;
  href: Route;
};

type MobileNavProps<Id extends string> = {
  active?: Id;
  links: readonly NavigationItem<Id>[];
};

export default function MobileNav<Id extends string>({ active, links }: MobileNavProps<Id>) {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };

    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="mobile-nav-toggle"
        onClick={() => setOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        {open ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
      </button>

      {open ? (
        <nav aria-label="Mobile navigation" className="mobile-nav-panel" id="mobile-navigation-panel">
          <div className="mobile-nav-list">
            {links.map((link, index) => (
              <Link
                aria-current={active === link.id ? "page" : undefined}
                href={link.href}
                key={link.id}
                onClick={() => setOpen(false)}
                ref={index === 0 ? firstLinkRef : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
