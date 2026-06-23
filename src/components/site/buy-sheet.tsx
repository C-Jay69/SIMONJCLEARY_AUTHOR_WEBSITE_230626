"use client";

import * as React from "react";
import Link from "next/link";
import { BookText, ExternalLink, Headphones, PenLine, Store } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BUY_LINKS, NEWSLETTER_HREF, type BuyLinks } from "@/components/site/buy-links";
import { cn } from "@/lib/utils";

type Retailer = {
  key: keyof BuyLinks;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If true, the link is internal (anchor) and shouldn't open in a new tab. */
  internal?: boolean;
};

const RETAILERS: Retailer[] = [
  {
    key: "amazon",
    label: "Amazon",
    description: "Hardcover · Kindle",
    icon: Store,
  },
  {
    key: "bookshop",
    label: "Bookshop.org",
    description: "Supports indie bookstores",
    icon: BookText,
  },
  {
    key: "audible",
    label: "Audible",
    description: "Audiobook",
    icon: Headphones,
  },
  {
    key: "signed",
    label: "Signed copy",
    description: "Direct from Simon — drops via the list",
    icon: PenLine,
    internal: true,
  },
];

type BuySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  /** If true, show only a "Notify me" CTA (forthcoming titles). */
  forthcoming?: boolean;
  /** If true, include the "Signed copy" option (featured only). */
  includeSigned?: boolean;
};

export function BuySheet({
  open,
  onOpenChange,
  title,
  subtitle,
  forthcoming = false,
  includeSigned = false,
}: BuySheetProps) {
  const links = BUY_LINKS[title];

  const retailers = React.useMemo<Retailer[]>(() => {
    if (forthcoming) return [];
    if (!links) return [];
    return RETAILERS.filter((r) => (r.key === "signed" ? includeSigned : true));
  }, [forthcoming, links, includeSigned]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="gap-2 border-b px-6 pb-5 pt-6">
          <span className="case-label text-accent/90">
            {forthcoming ? "// FORTHCOMING" : "// ORDER"}
          </span>
          <SheetTitle className="font-serif text-2xl font-semibold tracking-tight">
            {title}
          </SheetTitle>
          {subtitle && (
            <SheetDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {subtitle}
            </SheetDescription>
          )}
        </SheetHeader>

        {forthcoming ? (
          <div className="flex flex-col gap-5 px-6 py-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              This title isn&apos;t on sale yet. Join the dispatch to be first
              in line for release news, signed-copy drops, and the occasional
              Baltimore dispatch.
            </p>
            <Button
              asChild
              className="h-11 w-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => onOpenChange(false)}
            >
              <Link href={NEWSLETTER_HREF}>Notify me when it&apos;s out</Link>
            </Button>
            <p className="text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              No spam · Unsubscribe anytime
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-4 py-5">
            {retailers.map((r) => {
              const href = links?.[r.key] ?? "#";
              const isInternal = r.internal;
              return (
                <Link
                  key={r.key}
                  href={href}
                  {...(isInternal
                    ? { onClick: () => onOpenChange(false) }
                    : {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                  className={cn(
                    "group flex items-center gap-4 rounded-md border border-border/60 bg-card/40 px-4 py-4",
                    "transition-colors hover:border-accent/60 hover:bg-accent/10"
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/40 text-foreground/80 transition-colors group-hover:bg-accent/20 group-hover:text-accent">
                    <r.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-base font-medium text-foreground">
                      {r.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.description}
                    </span>
                  </span>
                  {!isInternal && (
                    <ExternalLink
                      className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}

            <Separator className="my-3" />

            <p className="px-1 text-xs leading-relaxed text-muted-foreground">
              Buying through these links supports independent retailers and
              keeps Simon writing. Signed copies ship in seasonal drops.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
