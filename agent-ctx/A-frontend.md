---
Task ID: A
Agent: full-stack-developer (frontend)
Task: Build the complete noir author website frontend (layout, theme, page, components).

Work Log:
- Read /home/z/my-project/worklog.md in full (535 lines) — anchored on §0 (brand), §1 (books + excerpt), §2 (bio + press), §3–8 (journal/events/case-file/story-lab/newsletter/contact), §12 (DESIGN SYSTEM), §13 (file ownership), §14 (non-negotiables).
- Ran the fullstack init script; confirmed the dev server (Next.js 16.1.3 Turbopack) is running on port 3000.
- Created the design system in `src/app/globals.css`:
  - Kept `@import "tailwindcss"`, `@import "tw-animate-css"`, and `@custom-variant dark`.
  - `@theme inline` block mapping color tokens + the three font vars (`--font-sans`, `--font-serif`, `--font-mono`) → `--font-inter`, `--font-fraunces`, `--font-jetbrains`.
  - `:root` block carries the LIGHT / warm-paper tokens (oklch values straight from §12) + `--ash: oklch(0.6 0.004 75)` + `--grain-opacity: 0.04`.
  - `.dark` block carries the NOIR tokens + `--ash: oklch(0.4 0.004 75)` + `--grain-opacity: 0.05`.
  - Base layer: smooth scroll on html, `scroll-margin-top: 5rem` on `section[id]`, body bg/fg, ember selection color, custom slim scrollbar, visible ember focus rings.
  - Utilities: `.ember-hairline`, `.case-label`, `.redact`, `.drop-cap` (Fraunces, accent-colored, float-left), `.grain-overlay` (SVG turbulence data-URI, mix-blend overlay), `.vignette-overlay`, `.text-glow-ember`, `.shimmer` + `@keyframes shimmer`, `.animate-marquee` + `.marquee-mask`.
  - `@media (prefers-reduced-motion: reduce)` disables all transitions/animations and smooth scroll.
- Wrote `src/app/layout.tsx`:
  - Three next/font/google fonts wired: Inter → `--font-inter`, Fraunces (axes: opsz, SOFT, WONK) → `--font-fraunces`, JetBrains_Mono → `--font-jetbrains`. Fraunces had to be configured as a variable font (no `weight` array) — initial config broke the dev build; fixed.
  - `metadata` with title "Simon J Cleary — Noir Novelist", description from §0, openGraph with `/images/books/ghosts-in-the-ash.jpg`, Twitter card, keywords, icon.
  - Body className pulls all three font variables + `font-sans antialiased bg-background text-foreground`.
  - Wraps children in `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange />` so dark is the default and there's no system-flash.
  - Renders `<Grain />` (grain+vignette overlay, fixed, z-39/40, pointer-events-none — below z-50 modals) and sonner `<Toaster position="bottom-right" richColors closeButton />`.
- Wrote `src/app/page.tsx` as an async Server Component:
  - Imports `db` from `@/lib/db` and Prisma types `Book`, `JournalPost`, `EventItem`, `PressItem` from `@prisma/client`.
  - `Promise.all`s four queries (`db.book?.findMany` ordered by seriesIndex asc, `db.journalPost?.findMany` ordered by date desc, `db.eventItem?.findMany` ordered by date asc, `db.pressItem?.findMany`). Each is wrapped in a `safeQuery` try/catch that returns `[]` on error and logs to console. Uses optional chaining + `?? Promise.resolve([])` so the page renders even before the schema is pushed (returns [] gracefully if `db.book` is undefined).
  - Serializes every `Date` field to ISO strings (and `null` for missing `releaseDate`) before passing to client components — `serializeBook`, `serializeJournal`, `serializeEvent`, `serializePress`.
  - Locates the featured Ghosts book and passes its excerpt + title to `ExcerptSection`.
  - Root wrapper: `<div className="flex min-h-screen flex-col">`. Sticky `<SiteHeader />` then `<main id="main" className="flex-1">` containing the section components in the exact §12 order, then `<SiteFooter className="mt-auto" />`.
- Built all `src/components/site/*` components:
  - `theme-provider.tsx` — thin next-themes wrapper.
  - `grain.tsx` — the fixed grain + vignette overlay (rendered once in layout).
  - `theme-toggle.tsx` — Sun/Moon button using next-themes `useTheme`, mounted-guard to avoid hydration mismatch, aria-label.
  - `section.tsx` — `<Section id eyebrow title intro align width>` helper; renders a framer-motion `<motion.section>` with `whileInView` fade-up (opacity 0→1, y 20→0, 0.6s easeOut, once, -80px margin) gated by `useReducedMotion`. Mono eyebrow + ember hairline + Fraunces title + optional intro.
  - `buy-links.ts` — the BUY_LINKS constant map keyed by book title + NEWSLETTER_HREF.
  - `types.ts` — serializable Book / JournalPost / EventItem / PressItem types (Date fields → string, releaseDate → string | null).
  - `site-header.tsx` — sticky, blurred-bg-on-scroll, "SIMON J CLEARY" wordmark, desktop nav (Books/About/Journal/Events/Savage Engine), ember "Free Chapter" CTA → #newsletter, `<ThemeToggle />`, mobile menu via shadcn Sheet. IntersectionObserver-driven active-section highlight (with smooth scroll handled by the html `scroll-behavior: smooth` + section `scroll-margin-top`).
  - `hero.tsx` — split 2-col on md+. Left: `// THE NEW MIKE SAVAGE NOVEL` eyebrow, giant Fraunces `text-[clamp(2.75rem,8vw,5.75rem)]` headline "Ghosts in the Ash", tagline in serif italic, hook paragraph, primary "Buy the book" (opens BuySheet for Ghosts) + secondary "Read Chapter 1 free" (#newsletter), then the Julia Spencer-Fleming blurb in serif italic + mono source. Right: real book cover in `aspect-[2/3]` with `rotate-[1.5deg]`, ember radial glow blur, `shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)]`, ring-1 ring-white/10. Background: faint oversized "SAVAGE" (`text-[24vw] text-foreground/[0.025]`) + radial ember wash.
  - `press-strip.tsx` — full-width marquee of the 6 press items, duplicated for seamless loop, edge-masked, `animate-marquee` (38s linear). Each card: large serif quote + mono source line. Returns null if no items.
  - `buy-sheet.tsx` — controlled shadcn Sheet (right side). Lists Amazon / Bookshop.org / Audible / Signed-copy (with the signed-copy linking to #newsletter internally). Forthcoming books get a "Notify me" CTA instead. Includes a short note.
  - `books-section.tsx` — wraps Section with `eyebrow="// THE BOOKS"`, title "The Mike Savage Series", intro. Renders 4 book cards. Each card has the cover in `aspect-[2/3]` with `shadow-2xl` + ring, status badges (ember "NEW" for featured, "FORTHCOMING" outline for the next book), series-index + year, title, italic tagline, clamped description, and a Buy/Notify-me button. Generated covers get an absolute bottom overlay (mono ember "A MIKE SAVAGE NOVEL", Fraunces title, mono "SIMON J CLEARY"). The Ghosts cover is rendered as-is. Plain `<img>` with `onError` to hide the image so the gradient fallback still reads as a cover.
  - `about-section.tsx` — author photo (the real `/images/author-simon-cleary.jpg`) in `aspect-[4/5]` with ember glow + Fraunces bio paragraphs + a vitals grid (15 yrs court reporter, former City Paper, Macavity nominee, Fells Point, Marlowe the cat) + social links (Twitter/X, Instagram, Goodreads, Substack, all `#`).
  - `excerpt-section.tsx` — Section `eyebrow="// CHAPTER ONE"`, title "An excerpt from <book>". Renders the Chapter 1 opening (passed in via the Ghosts book row's `excerpt`, with the §1 text as fallback) split on `\n\n` into Fraunces paragraphs with generous leading, the first paragraph getting the `.drop-cap` class. "Read the rest — free" CTA → #newsletter.
  - `case-file-section.tsx` — Section `eyebrow="// CASE FILE 003"`, title "Mike Savage". Stamped dossier card with mono labels (Name, Badge, Precinct, Years, the thing he won't say out loud [with one word wrapped in `.redact` to redact it], Carry, Home, Quirk), Confidential + BPD Homicide rotated stamps, "Updated / Status: Active" footer. Adjacent "Baltimore: The Map" panel listing the 6 locations with book references.
  - `story-lab.tsx` — the AI showcase. Three single-select ToggleGroups (Setting × 5, Hour × 3, Mood × 4) with the exact options from §6, an ember "Generate passage" button. On click fetches `/api/story-lab` with `{ setting, hour, mood }`, shows a shimmer skeleton + cycling loading line ("The engine is listening to the rain…"), then renders the passage in Fraunces serif prose with the mono disclaimer line below. Error path shows a sonner toast. Re-generate is supported.
  - `journal-section.tsx` — Section `eyebrow="// THE DISPATCH"`, title "Journal". List of posts; each row is a button that opens a shadcn Dialog with the full body (split on `\n\n` into paragraphs in a ScrollArea). Date formatted with date-fns `format(parseISO(date), "MMM d, yyyy")`, category as an ember outline Badge, read time as "{n} min read".
  - `events-section.tsx` — Section `eyebrow="// APPEARANCES"`, title "Events". Splits upcoming vs past on the `past` flag. Upcoming: highlights the first (next) event with an ember ring + tinted bg. Each event has a stacked date block (month + day), type Badge, full date in mono, title, venue with MapPin icon, and external link opens in a new tab. Past events render as a smaller muted list.
  - `newsletter-form.tsx` — Section `eyebrow="// FREE CHAPTER"`, title "Read Chapter 1 of Ghosts in the Ash — free." Form: name (optional) + email (required) + ember "Send me Chapter 1" button. Client-side email regex validation, fetches `/api/newsletter/subscribe`, success state replaces the form with a "Check your inbox — Chapter 1 is on its way." confirmation panel, sonner toast on error. Right column: "What you'll get" card with the three benefits.
  - `contact-form.tsx` — Section `eyebrow="// CONTACT"`, title "Get in touch." Form: name, email, subject, message + ember "Send message" button. Client-side validation, fetches `/api/contact`, success toast + reset on success. Right column: publicist contact (agent@simonjcleary.com, marked fictional) + response time note.
  - `site-footer.tsx` — wordmark, "Noir novelist of the haunted city." bio line, footer nav, socials, "© 2026 Simon J Cleary · Site set in Fraunces & Inter", and the "Made with rain and ash." easter egg.
- Lint: `bun run lint` passes clean (no errors, no warnings) after fixing three `react/jsx-no-comment-textnodes` cases by wrapping `// PRAISE` / `// Index` / `// Elsewhere` strings in `{"..."}`.
- Verified the dev server returns 200, the rendered HTML contains every key section + CTA, next-themes injects its init script so dark is applied before paint (no FOUC), and the page renders gracefully before the DB is seeded (empty arrays → BooksSection / PressStrip / JournalSection / EventsSection return null; Hero / About / Excerpt / Case File / Story Lab / Newsletter / Contact / Footer all render from constants).

Design decisions / deviations from the brief:
- `enableSystem={false}` (the brief allowed either) so the site is unambiguously dark by default and the Sun/Moon toggle is a real two-state switch between noir and paper.
- Used Fraunces axes `["opsz", "SOFT", "WONK"]` (no `weight`) — Fraunces is a variable font on Google Fonts and next/font rejects mixing `axes` with an explicit `weight` array.
- Wrapped each DB query in a `safeQuery` helper that uses `db.<model>?.findMany(...) ?? Promise.resolve([])` so the page renders even before the backend agent pushes the new Prisma schema. After `db:push` + `db:generate`, the same code returns real data with no changes needed.
- Active-section highlight is implemented (not skipped) via IntersectionObserver — feels essential for a sticky single-page nav.
- The BookCover overlay for generated covers uses `bg-gradient-to-t from-black/85` so the title is legible over any art. The Ghosts cover (real image) is rendered as-is with no overlay, per the brief.
- All framer-motion usage is gated by `useReducedMotion()`; the global `@media (prefers-reduced-motion: reduce)` rule also kills transitions/animations as a belt-and-braces measure.

Stage Summary:
- Files created:
  - src/app/layout.tsx (replaced scaffold)
  - src/app/globals.css (replaced scaffold)
  - src/app/page.tsx (replaced scaffold)
  - src/components/site/theme-provider.tsx
  - src/components/site/grain.tsx
  - src/components/site/theme-toggle.tsx
  - src/components/site/section.tsx
  - src/components/site/buy-links.ts
  - src/components/site/types.ts
  - src/components/site/site-header.tsx
  - src/components/site/hero.tsx
  - src/components/site/press-strip.tsx
  - src/components/site/buy-sheet.tsx
  - src/components/site/books-section.tsx
  - src/components/site/about-section.tsx
  - src/components/site/excerpt-section.tsx
  - src/components/site/case-file-section.tsx
  - src/components/site/story-lab.tsx
  - src/components/site/journal-section.tsx
  - src/components/site/events-section.tsx
  - src/components/site/newsletter-form.tsx
  - src/components/site/contact-form.tsx
  - src/components/site/site-footer.tsx
- Section order on `/` (matches §12):
  1. SiteHeader (sticky)
  2. Hero (#top)
  3. PressStrip (marquee)
  4. BooksSection (#books)
  5. AboutSection (#about)
  6. ExcerptSection (#excerpt)
  7. CaseFileSection (#casefile)
  8. StoryLab (#engine)
  9. JournalSection (#journal)
  10. EventsSection (#events)
  11. NewsletterForm (#newsletter)
  12. ContactForm (#contact)
  13. SiteFooter (mt-auto)
- Caveats for integration/verification:
  - The page renders correctly with empty data today. Once the orchestrator runs `bun run db:push` + `bun run db:generate` + `bun run prisma:seed`, the Books / Press / Journal / Events sections will populate with real data and the Excerpt section will pull the Chapter 1 opening from the Ghosts book row's `excerpt` field.
  - API routes (`/api/newsletter/subscribe`, `/api/contact`, `/api/story-lab`) are owned by the backend agent. The frontend fetches them with the exact bodies from §10.
  - The 3 generated book covers (`/public/images/books/the-long-dark-pier.jpg`, `ash-and-iron.jpg`, `the-hollow-tide.jpg`) and the author photo are already on disk (Task C image agent already produced them). The Ghosts cover is the real provided image. If any generated cover is missing or fails to load, the `<img onError>` hides it and the gradient + CSS overlay still read as a cover.
  - `bun run lint` passes clean. The dev server returns 200 with no runtime errors. next-themes defaultTheme="dark" + the injected init script means the page paints in noir on first load (no FOUC).
