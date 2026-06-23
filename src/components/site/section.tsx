"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  innerClassName?: string;
  /** Optional max-width token: "default" | "prose" | "wide" */
  width?: "default" | "prose" | "wide";
  children?: React.ReactNode;
  as?: "section" | "div" | "article";
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const widthClass: Record<NonNullable<SectionProps["width"]>, string> = {
  default: "max-w-6xl",
  prose: "max-w-3xl",
  wide: "max-w-7xl",
};

/**
 * Section wrapper for anchored sections of the page.
 * Renders the mono case-file eyebrow, an ember hairline,
 * an optional Fraunces title and intro, then children.
 * Respects prefers-reduced-motion.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  innerClassName,
  width = "default",
  children,
  as = "section",
}: SectionProps) {
  const reduce = useReducedMotion();
  const Comp =
    as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <Comp
      id={id}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      variants={reduce ? undefined : fadeUp}
      className={cn(
        "relative py-20 md:py-28",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-5 sm:px-6 lg:px-8",
          widthClass[width],
          "flex flex-col gap-6",
          alignment,
          innerClassName
        )}
      >
        {(eyebrow || title) && (
          <header
            className={cn(
              "flex flex-col gap-3",
              align === "center" && "items-center"
            )}
          >
            {eyebrow && (
              <div
                className={cn(
                  "flex items-center gap-3",
                  align === "center" && "justify-center"
                )}
              >
                <span className="case-label text-accent/90">{eyebrow}</span>
                <span aria-hidden="true" className="ember-hairline" />
              </div>
            )}
            {title && (
              <h2 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={cn(
                  "max-w-2xl text-base text-muted-foreground sm:text-lg",
                  align === "center" && "mx-auto"
                )}
              >
                {intro}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </Comp>
  );
}
