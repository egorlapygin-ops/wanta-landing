"use client";

import { scrollToSection } from "@/lib/utils";
import { landingContent } from "@/content/landingContent";

export function Footer() {
  const { logo, tagline, links, copyright, credits } = landingContent.footer;

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-lg font-semibold text-foreground hover:opacity-80 text-left"
            >
              {logo}
            </button>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              {tagline}
            </p>
          </div>
          <nav className="flex flex-wrap gap-6" aria-label="Футер навигация">
            {links.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">{copyright}</p>
          <p className="mt-1 text-sm text-muted-foreground">{credits}</p>
        </div>
      </div>
    </footer>
  );
}
