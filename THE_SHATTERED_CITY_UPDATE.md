# The Shattered City — Website Update

A new responsive novel page has been added at:

`/the-shattered-city`

## Included

- Cover-led copper, ember, wet-steel, and weathered-gold visual system
- Responsive cinematic hero section
- Adult science-fantasy positioning
- Story introduction
- Sophia / Kiera / Zoey power cards
- Full Chapter 1 reading experience
- Open Graph and X/Twitter metadata using the cover image
- Navigation link from the main site header
- New book card in the existing Books section
- Reduced-motion compatibility inherited from the main site

## Main files

- `src/app/the-shattered-city/page.tsx`
- `src/content/shattered-city-chapter-one.ts`
- `public/images/books/the-shattered-city.png`
- `src/app/globals.css`
- `src/components/site/site-header.tsx`
- `src/components/site/books-section.tsx`

## Verification

- Production build completed successfully.
- The Next.js production build completed successfully. A repository-wide `tsc` check still reports pre-existing errors in the websocket examples and an admin chapter route; none originate in the new page files.
- `/the-shattered-city` returns HTTP 200.
- Route is statically pre-rendered.

The existing homepage requires its configured production `DATABASE_URL` to populate database-backed sections. That credential is intentionally not present in this workspace; the new novel page itself does not require a database.
