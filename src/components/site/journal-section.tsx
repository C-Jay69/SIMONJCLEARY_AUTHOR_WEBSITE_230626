"use client";

import * as React from "react";
import { ArrowUpRight, Clock } from "lucide-react";

import { Section } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { JournalPost } from "@/components/site/types";
import { useT } from "@/lib/i18n";
import { formatDateShort } from "@/lib/date-utils";

type JournalSectionProps = {
  posts: JournalPost[];
};

function JournalRow({ post }: { post: JournalPost }) {
  const [open, setOpen] = React.useState(false);
  const t = useT();
  const paragraphs = post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group grid w-full grid-cols-1 gap-3 border-b border-border/50 py-6 text-left transition-colors",
            "hover:bg-accent/[0.04] sm:grid-cols-[140px_1fr_auto] sm:gap-6 sm:px-2"
          )}
        >
          <div className="flex flex-col gap-2">
            <time
              dateTime={post.date}
              className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground"
            >
              {formatDateShort(post.date)}
            </time>
            <Badge
              variant="outline"
              className="w-fit border-accent/40 text-accent"
            >
              {post.category}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {post.excerpt}
            </p>
            <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readMinutes} {t("journal.minRead")}
            </span>
          </div>

          <div className="hidden items-center sm:flex">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 px-6 pb-5 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <time
              dateTime={post.date}
              className="font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground"
            >
              {formatDateShort(post.date)}
            </time>
            <Badge
              variant="outline"
              className="border-accent/40 text-accent"
            >
              {post.category}
            </Badge>
            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {post.readMinutes} min
            </span>
          </div>
          <DialogTitle className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full journal entry: {post.excerpt}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <article className="flex flex-col gap-5 px-6 py-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-serif text-base leading-relaxed text-foreground/90 sm:text-lg sm:leading-relaxed"
              >
                {p}
              </p>
            ))}
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function JournalSection({ posts }: JournalSectionProps) {
  const t = useT();
  if (!posts.length) return null;

  return (
    <Section
      id="journal"
      eyebrow={t("journal.eyebrow")}
      title={t("journal.title")}
      intro={t("journal.intro")}
    >
      <div className="mt-8 flex flex-col">
        {posts.map((post) => (
          <JournalRow key={post.id} post={post} />
        ))}
      </div>
    </Section>
  );
}
