# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # start dev server (Next.js on :3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, eslint.config.mjs)
```

No test framework is configured. `implementation.md` is the original build spec — useful context but not a source of truth; the code has diverged.

## Architecture

**Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (via `@tailwindcss/postcss`), GSAP + `@gsap/react` + Lenis. `@/*` path alias maps to the repo root (not `src/`).

**Route groups own their chrome.** `app/` uses four route groups, each with its own `layout.tsx`:

- `app/(home)/` — homepage. Uses the client-side `Header.tsx` and wraps content in `SmoothScrollProvider`.
- `app/(blog)/` — `/blog` and `/blog/[slug]`. Uses `HeaderServerComp.tsx` and no Lenis wrapper.
- `app/(services)/` — `/services` and `/services/[slug]`. Same pattern as blog.
- `app/(contact)/` — `/contact`. Same pattern as blog.

`app/not-found.tsx` sits outside every group, so it brings its own `HeaderServerComp` + `Footer`.

The root `app/layout.tsx` handles fonts, global JSON-LD (`Person` + `WebSite` + `ProfessionalService`), the skip link, and the two always-mounted client islands (`BookingModalProvider`, `StickyCta`). When adding a new top-level page, decide which route group's chrome and scroll behavior it needs — do not add a new Header/Footer.

**Only the homepage animates with JavaScript.** This is the load-bearing rule for the whole design.

- `app/(home)/` sections are `'use client'` and animate with GSAP + Lenis.
- Every other route stays a Server Component. Its motion comes from the CSS interaction layer at the bottom of `app/globals.css` — scroll-driven reveals (`.reveal`, `.stagger`), marquees (`.marquee`), hover choreography (`.glow-card`, `.bloom-card`, `.link-sweep`, `.arrow-slide`), ambient backgrounds (`.aurora`, `.grid-bg`), and the JS-free `ScrollProgress` / `BackToTop` components.

Everything in that layer is progressive enhancement: the resting state is the visible, usable one, and animation only ever applies inside `@supports (animation-timeline: …)` plus `prefers-reduced-motion: no-preference`. Never set `opacity: 0` outside those guards — a browser without scroll-timeline support would hide the content permanently. Verify a change by scrolling each route and asserting no `.reveal` element is stuck below `opacity: 0.9` while fully in the viewport.

**Colour lives in one place: the `@theme` block in `app/globals.css`.** The site is a warm-paper light theme built from semantic tokens — `bg`, `surface`, `raised`, `fg`, `strong`, `muted`, `subtle`, `border`, `faint`. Components use `text-muted` / `border-border` / `bg-raised`; there are no hardcoded hex utility classes left, so re-theming (including back to dark) means editing that block alone.

Two rules that are easy to break:
- `faint` is for hairlines and decorative glyphs. It does **not** pass contrast as text — use `subtle` (the lightest legal text tone, 4.5:1) or darker.
- Overlays must darken, not lighten: `bg-black/[0.05]`, never `bg-white/[0.05]`.

Verify colour changes with an actual contrast pass, and composite alpha when you do — Tailwind's opacity modifiers (`bg-raised/60`) compute to `lab()`, and naively parsing those channels as RGB reports almost-white as almost-black.

**Buttons pick a variant, not a colour.** `MagneticButton` (and `BookingTrigger`, which wraps it) takes `variant="outline" | "solid"`. Do not pass `text-…`/`bg-…` overrides through `className` to make a button look primary: Tailwind emits utilities in a fixed order, so the override isn't guaranteed to beat the base class, and the result is a white-on-white button.

**Conversion surfaces are shared components, not per-page markup.** `CtaBand` closes every server-rendered route, `StickyCta` follows the visitor everywhere except `/contact`, and `AvailabilityPill` carries the scarcity signal. All of them read from `lib/site.ts`.

**Smooth scroll is home-only, and it owns ScrollTrigger.** `components/layout/SmoothScrollProvider.tsx` (client) sets up Lenis, wires it into GSAP's ticker, and installs a `ScrollTrigger.scrollerProxy` on `document.documentElement`. It also implements a custom hash-jump routine that polls for `ScrollTrigger.getAll().length` to stabilize before scrolling — this is what makes deep-linking to a section (e.g. `/#contact`) land correctly after all child sections have registered their triggers. If you add a section that registers a ScrollTrigger on mount, it will Just Work with this hash-jump; don't try to fight it with your own scroll logic.

**GSAP setup lives in one place.** Import GSAP and its plugins from `@/lib/gsap` — never from `gsap` directly. That module handles the `registerPlugin(ScrollTrigger, Draggable)` call behind a `typeof window` guard so SSR doesn't blow up. Any new plugin must be registered there.

**Scroll-reveal is a shared hook.** `lib/useScrollReveal.ts` is the standard fade/slide-up-on-scroll primitive. It respects `prefers-reduced-motion` (clears props instead of animating) and uses `gsap.context()` scoped to a container ref for cleanup. Prefer this over hand-rolled `ScrollTrigger.create` calls unless you need a non-reveal effect (pin, scrub, etc.).

**Content is JSON-authored, not MDX.** Blog posts and services are plain JSON files in `content/posts/` and `content/services/`, hydrated through `lib/data/posts.ts` and `lib/data/services.ts`. Adding a new post or service requires two steps:
1. Create `content/<type>/<slug>.json` (filename should match the `slug` field — note two existing services already violate this: `business-email-setup.json` has slug `custom-email-setup`, and `e-commerce-solutions.json` has slug `b2b-ecommerce-solutions`. The `slug` field is what builds the URL, so key any script off that, not the filename).
2. Import and register it in the corresponding `lib/data/*.ts` array.

Services carry two separate keyword fields, and mixing them up looks broken: `keywords` is long-tail SEO phrases for metadata, `tags` is two-to-three-word chips rendered beside the title in `ServiceList`.

Rich body content uses the typed `ContentBlock` union in `lib/content-blocks.tsx` (`h2`, `h3`, `p`, `ul`, `ol`, `code`, `image`, `table`, `hr`). Blocks are flat — no nesting. `renderBlock()` is the only renderer. Full schema and field reference: `content/CONTENT_GUIDE.md`.

`h2`/`h3` blocks get an `id` from `headingSlug()`, and `TableOfContents` builds its jump links from `extractHeadings()` using that same function. If you change one, change both — or the anchors silently break.

**SEO surface is generated, not hand-written.** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, and `app/manifest.ts` all use Next's file-based metadata conventions. `posts.ts` sorts newest-first by `updatedAt` so `sitemap.ts` and the homepage preview can both `slice(0, n)`. Per-post and per-service pages use `generateMetadata()` — never fall back to root metadata for detail pages.

Structured data is a linked graph, not a pile of loose blobs. The root layout declares `#person`, `#website`, and `#business`; every page-level node references those by `@id` (`author: { '@id': …/#person }`) instead of re-describing the entity. Each route also emits its own `BreadcrumbList`. Keep exactly one `h1` per page.

**`lib/site.ts` is the single source of truth for contact details.** Email, phone, and WhatsApp are exported as ready-made `mailto` / `telHref` / `whatsappHref`. Never hardcode them in a component — inconsistent NAP data across pages is an SEO problem, and this file exists because the site previously had two different emails and two different phone numbers in circulation.

**Contact form is stubbed.** `app/api/contact/route.ts` validates input but doesn't send email yet (Resend wiring is commented out). If touching contact flow, note the `RESEND` / `CONTACT_EMAIL` env vars it expects.
