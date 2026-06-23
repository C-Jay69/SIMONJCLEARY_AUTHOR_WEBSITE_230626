"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PUBLICIST_EMAIL = "agent@simonjcleary.com";

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className }: ContactFormProps) {
  const t = useT();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Your name is required");
      return;
    }
    if (!form.email.trim() || !EMAIL_RE.test(form.email.trim())) {
      toast.error("A valid email is required");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Don't leave us hanging — add a message");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      toast.success(t("contact.success"), {
        description: t("contact.successDesc"),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(t("contact.error"), {
        description: err instanceof Error ? err.message : t("contact.errorDesc"),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="// CONTACT"
      title={t("contact.title")}
      intro={t("contact.intro")}
      className={className}
    >
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 lg:col-span-7"
          noValidate
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ct-name" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {t("contact.name")}
              </Label>
              <Input
                id="ct-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ct-email" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {t("contact.email")}
              </Label>
              <Input
                id="ct-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@somewhere.net"
                className="h-11"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ct-subject" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {t("contact.subject")}
            </Label>
            <Input
              id="ct-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="What's this about?"
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ct-message" className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              {t("contact.message")}
            </Label>
            <Textarea
              id="ct-message"
              name="message"
              required
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Write it like you mean it…"
              className="min-h-32"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="h-11 w-full rounded-md bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            {submitting ? (
              <>{t("contact.sending")}</>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                {t("contact.button")}
              </>
            )}
          </Button>
        </form>

        <aside className="lg:col-span-5">
          <div className="flex h-full flex-col gap-5 rounded-md border border-border/60 bg-card/30 p-6">
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                For rights, press & events
              </span>
              <p className="mt-2 font-serif text-lg leading-relaxed text-foreground/90">
                Contact Simon&apos;s publicist:
              </p>
              <a
                href={`mailto:${PUBLICIST_EMAIL}`}
                className="mt-1 inline-block font-mono text-sm text-accent underline-offset-4 hover:underline"
              >
                {PUBLICIST_EMAIL}
              </a>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                (fictional)
              </p>
            </div>
            <div className="mt-auto border-t border-border/40 pt-4">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                Response time
              </span>
              <p className="mt-1 text-sm text-foreground/80">
                Simon reads everything. Most replies come within a week;
                publicist inquiries usually faster.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
