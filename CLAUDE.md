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

**Route groups own their chrome.** `app/` uses three route groups, each with its own `layout.tsx`:

- `app/(home)/` — homepage. Uses the client-side `Header.tsx` and wraps content in `SmoothScrollProvider`.
- `app/(blog)/` — `/blog` and `/blog/[slug]`. Uses `HeaderServerComp.tsx` (no client hooks) and no Lenis wrapper.
- `app/(services)/` — `/services` and `/services/[slug]`. Same pattern as blog.

The root `app/layout.tsx` only handles fonts, global JSON-LD (`Person` + `WebSite`), and body styling. When adding a new top-level page, decide which route group's chrome and scroll behavior it needs — do not add a new Header/Footer.

**Smooth scroll is home-only, and it owns ScrollTrigger.** `components/layout/SmoothScrollProvider.tsx` (client) sets up Lenis, wires it into GSAP's ticker, and installs a `ScrollTrigger.scrollerProxy` on `document.documentElement`. It also implements a custom hash-jump routine that polls for `ScrollTrigger.getAll().length` to stabilize before scrolling — this is what makes deep-linking to a section (e.g. `/#contact`) land correctly after all child sections have registered their triggers. If you add a section that registers a ScrollTrigger on mount, it will Just Work with this hash-jump; don't try to fight it with your own scroll logic.

**GSAP setup lives in one place.** Import GSAP and its plugins from `@/lib/gsap` — never from `gsap` directly. That module handles the `registerPlugin(ScrollTrigger, Draggable)` call behind a `typeof window` guard so SSR doesn't blow up. Any new plugin must be registered there.

**Scroll-reveal is a shared hook.** `lib/useScrollReveal.ts` is the standard fade/slide-up-on-scroll primitive. It respects `prefers-reduced-motion` (clears props instead of animating) and uses `gsap.context()` scoped to a container ref for cleanup. Prefer this over hand-rolled `ScrollTrigger.create` calls unless you need a non-reveal effect (pin, scrub, etc.).

**Content is JSON-authored, not MDX.** Blog posts and services are plain JSON files in `content/posts/` and `content/services/`, hydrated through `lib/data/posts.ts` and `lib/data/services.ts`. Adding a new post or service requires two steps:
1. Create `content/<type>/<slug>.json` (filename must match the `slug` field).
2. Import and register it in the corresponding `lib/data/*.ts` array.

Rich body content uses the typed `ContentBlock` union in `lib/content-blocks.tsx` (`h2`, `h3`, `p`, `ul`, `ol`, `code`, `image`, `hr`). Blocks are flat — no nesting. `renderBlock()` is the only renderer. Full schema and field reference: `content/CONTENT_GUIDE.md`.

**SEO surface is generated, not hand-written.** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, and `app/manifest.ts` all use Next's file-based metadata conventions. `posts.ts` sorts newest-first by `updatedAt` so `sitemap.ts` and the homepage preview can both `slice(0, n)`. Per-post and per-service pages use `generateMetadata()` — never fall back to root metadata for detail pages.

**Contact form is stubbed.** `app/api/contact/route.ts` validates input but doesn't send email yet (Resend wiring is commented out). If touching contact flow, note the `RESEND` / `CONTACT_EMAIL` env vars it expects.
