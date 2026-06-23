"use client";

import * as React from "react";
import { Check, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LANGUAGES, useLangStore, useT, type Lang } from "@/lib/i18n";

export function LangSwitcher() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Before mount, always show EN to match the server-rendered HTML.
  const effectiveLang = mounted ? lang : "en";
  const current = LANGUAGES.find((l) => l.code === effectiveLang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-md border border-border/50 px-2.5 text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          aria-label={t("lang.switch")}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-widest">
            {current.flag}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px]"
        sideOffset={8}
      >
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3",
              effectiveLang === l.code && "text-accent"
            )}
          >
            <span className="flex items-center gap-2.5">
              <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                {l.flag}
              </span>
              <span className="text-sm">{l.label}</span>
            </span>
            {effectiveLang === l.code && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
