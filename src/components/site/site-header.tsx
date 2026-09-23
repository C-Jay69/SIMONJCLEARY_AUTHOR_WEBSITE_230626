"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LangSwitcher } from "@/components/site/lang-switcher";
import { useT } from "@/lib/i18n";

const NAV_KEYS = [
  { key: "nav.novels", href: "#novels" },
  { key: "nav.about", href: "#about" },
  { key: "nav.journal", href: "#journal" },
  { key: "nav.events", href: "#events" },
] as const;

const SHATTERED_CITY_HREF = "/the-shattered-city";

export function SiteHeader() {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string>("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isSubpage = Boolean(pathname && pathname !== "/");
  const onShatteredCity = Boolean(
    pathname && pathname.startsWith("/the-shattered-city")
  );

  // Section anchors only exist on the homepage. From any subpage, prefix
  // them with "/" so they resolve to the homepage sections instead of dying.
  const anchorHref = (href: string) =>
    href.startsWith("#") && isSubpage ? `/${href}` : href;

  const navItems = NAV_KEYS.map((n) => ({
    ...n,
    label: t(n.key),
    href: anchorHref(n.href),
  }));

  // Free-chapter CTA: on the Shattered City page the opening is in-page.
  const ctaHref = onShatteredCity ? "#chapter-one" : "#newsletter";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightweight active-section highlight via IntersectionObserver.
  React.useEffect(() => {
    const sections = navItems
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [t, isSubpage]);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/65"
          : "border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* Wordmark + logo */}
        <Link
          href={isSubpage ? "/" : "#top"}
          className="group flex items-center gap-2.5"
          aria-label="Simon J Cleary — home"
        >
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-full ring-1 ring-accent/30 transition-transform group-hover:scale-105 sm:h-9 sm:w-9"
          />
          <span className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
            SIMON J CLEARY
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive = !isSubpage && active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-accent"
                  />
                )}
              </Link>
            );
          })}
          <Link
            href={SHATTERED_CITY_HREF}
            className="relative ml-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-gold"
          >
            {t("nav.shatteredCity")}
            <span
              aria-hidden="true"
              className="rounded-sm border border-gold/40 px-1 py-0.5 font-mono text-[0.5rem] uppercase tracking-widest text-gold"
            >
              {t("nav.new")}
            </span>
          </Link>
        </nav>

        {/* Right rail */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden h-9 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex"
          >
            <Link href={ctaHref}>{t("nav.freeChapter")}</Link>
          </Button>
          <LangSwitcher />
          <ThemeToggle />
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-md"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="font-serif text-xl tracking-tight">
                  {t("nav.menu")}
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile primary"
                className="flex flex-col gap-1 px-4 py-4"
              >
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href={SHATTERED_CITY_HREF}
                    className="flex items-center justify-between rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-gold/10 hover:text-gold"
                  >
                    {t("nav.shatteredCity")}
                    <span
                      aria-hidden="true"
                      className="rounded-sm border border-gold/40 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-widest text-gold"
                    >
                      {t("nav.new")}
                    </span>
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto px-4 pb-6">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link href={ctaHref}>{t("nav.readChapterFree")}</Link>
                  </Button>
                </SheetClose>
                <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {t("nav.noSpam")}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}