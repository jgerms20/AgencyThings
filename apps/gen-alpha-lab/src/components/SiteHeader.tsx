import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type SiteHeaderProps = {
  active?: "overview" | "people" | "library";
};

const links = [
  { id: "overview", label: "Overview", href: "/" },
  { id: "people", label: "People", href: "/people" },
  { id: "library", label: "Library", href: "/library" }
] as const;

export default function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Gen Alpha Intelligence Lab home">
        Gen Alpha Intelligence Lab
      </Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => (
          <Link
            aria-current={active === link.id ? "page" : undefined}
            href={link.href}
            key={link.id}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
