"use client";

import * as React from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterFormProps = {
  className?: string;
};

export function NewsletterForm({ className }: NewsletterFormProps) {
  const t = useT();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error(t("newsletter.emailRequired"), {
        description: t("newsletter.emailRequiredDesc"),
      });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      toast.error(t("newsletter.emailInvalid"), {
        description: t("newsletter.emailInvalidDesc"),
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, name: name.trim() || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setDone(true);
      toast.success("You're on the list", {
        description: "Chapter 1 of Ghosts in the Ash is on its way to your inbox.",
      });
    } catch (err) {
      toast.error("Couldn't subscribe", {
        description: err instanceof Error ? err.message : "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section
      id="newsletter"
      eyebrow="// FREE CHAPTER"
      title={t("newsletter.title")}
      intro={t("newsletter.intro")}
      className={className}
    >
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          {done ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col gap-4 rounded-md border border-accent/40 bg-accent/[0.06] p-6 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-semibold tracking-tight">
                  {t("newsletter.success")}
                </h3>
              </div>
              <p className="font-serif text-lg leading-relaxed text-foreground/90">
                {t("newsletter.successDesc")}
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {t("nav.noSpam")}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDone(false);
                  setEmail("");
                  setName("");
                }}
              >
                {t("newsletter.sendAnother")}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nl-name" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {t("newsletter.name")}
                </Label>
                <Input
                  id="nl-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("newsletter.namePlaceholder")}
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nl-email" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {t("newsletter.email")}
                </Label>
                <Input
                  id="nl-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.net"
                  className="h-11"
                  aria-required="true"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-11 w-full rounded-md bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
              >
                {submitting ? (
                  <>{t("newsletter.sending")}</>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {t("newsletter.button")}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="flex h-full flex-col gap-4 rounded-md border border-border/60 bg-card/30 p-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                What you'll get
              </span>
            </div>
            <ul className="flex flex-col gap-3 text-sm text-foreground/85">
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{t("newsletter.whatYouGet.opening")}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{t("newsletter.whatYouGet.dispatch")}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>{t("newsletter.whatYouGet.signed")}</span>
              </li>
            </ul>
            <p className="mt-auto font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              We read everything. We never sell your email.
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
