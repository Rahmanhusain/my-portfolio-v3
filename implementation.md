# Portfolio Website — Implementation Spec

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + GSAP (ScrollTrigger + Lenis for smooth scroll)
**Theme:** Black & white, minimal
**Reference inspiration:** majd-portfolio.framer.website (structure only — build original design, don't copy assets/copy)

> Replace all `[PLACEHOLDER]` values with real content before launch. This doc is written so an AI code editor (Cursor / Claude Code / Copilot) can implement it section by section.

---

## 1. Project Setup

```bash
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir --import-alias "@/*"
cd portfolio
npm install gsap @gsap/react lenis
npm install next-seo next-sitemap
npm install clsx
```

- Node 18+, Next.js 14 App Router.
- Use `next/font` for typography (see §3).
- Use `next/image` for every image (required for SEO/perf).

---

## 2. Folder Structure

```
src/
  app/
    layout.tsx                # root layout, fonts, Lenis provider, metadata
    page.tsx                  # composes all sections
    sitemap.ts                # dynamic sitemap (next-sitemap or native)
    robots.ts
    blog/
      page.tsx                # blog index
      [slug]/page.tsx         # individual post, generateStaticParams + generateMetadata
  components/
    layout/
      Header.tsx
      Footer.tsx
      SmoothScrollProvider.tsx   # Lenis + GSAP ScrollTrigger sync
    sections/
      Hero.tsx
      About.tsx
      Services.tsx
      Projects.tsx
      Testimonials.tsx
      BlogPreview.tsx
      Contact.tsx
    ui/
      TechIconWheel.tsx        # the rotating icon wheel described in §5
      ProjectCard.tsx
      TestimonialCard.tsx
      MagneticButton.tsx
      SectionHeading.tsx
  lib/
    gsap.ts                   # gsap.registerPlugin(ScrollTrigger), config
    seo.ts                    # shared metadata builder
    data/
      projects.ts
      testimonials.ts
      services.ts
      posts.ts
  styles/
    globals.css
public/
  icons/                      # tech logos as SVG (react.svg, nextjs.svg, node.svg, mongodb.svg, etc.)
  og-image.png
  favicon.ico
```

---

## 3. Design System (Black & White Minimal)

**Tailwind config tokens:**
```js
colors: {
  bg: '#0A0A0A',        // near-black background
  surface: '#141414',   // card backgrounds
  fg: '#FAFAFA',        // primary text (off-white, not pure white)
  muted: '#8A8A8A',     // secondary text
  border: '#242424',
  invert: '#FFFFFF',    // pure white for accents/CTAs
}
```
- No color accent — hierarchy comes from **weight, size, spacing, and opacity**, not hue.
- Typography: one grotesk/sans display font for headings (e.g. `Neue Montreal`, `General Sans`, or `Inter Tight` via `next/font/google` as a safe default), and a plain sans (Inter) for body.
- Big type scale: hero headline ~clamp(3rem, 8vw, 7rem), tight line-height (0.95–1.05), negative letter-spacing on large headings.
- Generous whitespace: section padding `py-32` desktop / `py-20` mobile.
- Thin 1px hairline borders (`border-border`) instead of shadows — keeps it flat/minimal.
- Buttons: outline style, invert fill on hover (bg-fg text-bg transition).

---

## 4. Smooth Scrolling (Lenis + GSAP ScrollTrigger)

Create `components/layout/SmoothScrollProvider.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis>();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
```

Wrap `{children}` in `app/layout.tsx` with this provider. This is what makes the whole page (not just the hero) feel smooth — same mechanism the reference Framer site uses.

`lib/gsap.ts`:
```ts
'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
export { gsap, ScrollTrigger };
```

---

## 5. Hero Section — Tech Icon Wheel (no static hero image)

**Concept:** Instead of a hero photo, render a **vertical or circular "wheel" of tech-stack icons** (React, Next.js, Node, MongoDB, TypeScript, Tailwind, etc.) that auto-rotates continuously, and **flips/reveals differently as the user scrolls** — but stays pinned in the same position on screen (doesn't move with scroll, only its rotation/state changes).

### 5.1 Layout
- Hero is a 2-column grid on desktop: left = headline + subtext + CTA, right = the icon wheel. On mobile, wheel goes above or below text, smaller scale.
- Wheel container is a fixed-size circle (e.g. 420px desktop / 240px mobile), icons arranged evenly around the circumference (like a clock face), each in its own small circular/rounded-square tile with a hairline border.

### 5.2 Icon data
`lib/data/techStack.ts`:
```ts
export const techStack = [
  { name: 'React', icon: '/icons/react.svg' },
  { name: 'Next.js', icon: '/icons/nextjs.svg' },
  { name: 'Node.js', icon: '/icons/node.svg' },
  { name: 'MongoDB', icon: '/icons/mongodb.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Tailwind CSS', icon: '/icons/tailwind.svg' },
  { name: 'GraphQL', icon: '/icons/graphql.svg' },
  { name: 'Docker', icon: '/icons/docker.svg' },
  // add/remove as needed — keep icons monochrome (white/black) to match theme
];
```
Use monochrome SVG versions of each logo (recolor via `fill: currentColor` or CSS filter) so they match the black/white theme — don't use brand-colored logos, they'll clash.

### 5.3 Auto-rotation (continuous, idle animation)
In `components/ui/TechIconWheel.tsx`, position each icon with trig:
```tsx
const radius = 200; // px
const angleStep = (2 * Math.PI) / techStack.length;

techStack.map((tech, i) => {
  const angle = i * angleStep;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return (
    <div key={tech.name} className="wheel-icon" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <img src={tech.icon} alt={tech.name} width={40} height={40} />
    </div>
  );
});
```
Animate the **whole wheel wrapper** with a slow infinite GSAP rotation, and **counter-rotate each icon** so the icons themselves always stay upright (classic "orbit" trick):

```ts
useGSAP(() => {
  const wheelTl = gsap.timeline({ repeat: -1 });
  wheelTl.to(wheelRef.current, { rotate: 360, duration: 24, ease: 'none' });

  // counter-rotate icons so logos don't spin upside down
  gsap.to('.wheel-icon img', { rotate: -360, duration: 24, repeat: -1, ease: 'none' });
}, []);
```

### 5.4 Scroll-triggered "flip", pinned in place
This is the key interaction: as the user scrolls past the hero, the wheel should **flip (3D rotateY or rotateX)** as a reaction to scroll progress, but the wheel's *position* stays pinned (doesn't translate/move up the page) until the hero section has fully scrolled past.

```ts
useGSAP(() => {
  ScrollTrigger.create({
    trigger: heroSectionRef.current,
    start: 'top top',
    end: 'bottom top',
    pin: wheelWrapperRef.current,   // pins the wheel in place while scrolling through hero
    pinSpacing: false,
    scrub: 1,
    onUpdate: (self) => {
      gsap.to(wheelWrapperRef.current, {
        rotateY: self.progress * 180,   // flips as you scroll
        duration: 0.3,
        overwrite: 'auto',
      });
    },
  });
}, []);
```
- `pin: true` (or pinning the wheel element specifically) keeps it fixed on screen while the hero is in view.
- `rotateY` driven by scroll `progress` gives the "flip" effect tied to scroll position, layered on top of the continuous idle rotation from §5.3.
- Add `perspective: 1000px` on the wheel's parent container in CSS so the 3D flip renders correctly:
  ```css
  .wheel-perspective { perspective: 1200px; }
  .wheel-flip { transform-style: preserve-3d; }
  ```
- On mobile, disable the pin (`ScrollTrigger.matchMedia` to turn off pin under 768px) — keep just the idle auto-rotation, since pinning on small viewports usually feels janky.

### 5.5 Draggable rotation (drag to spin, auto-resumes)
The wheel should also be **manually rotatable by drag** (mouse or touch), on top of its automatic idle spin. Use GSAP's `Draggable` plugin bound to rotation:

```bash
npm install gsap  # Draggable is included in the core gsap package
```

```ts
import { Draggable } from 'gsap/Draggable';
gsap.registerPlugin(Draggable);

useGSAP(() => {
  const idleTween = gsap.to(wheelRef.current, { rotate: 360, duration: 24, repeat: -1, ease: 'none' });

  Draggable.create(wheelRef.current, {
    type: 'rotation',
    inertia: true,               // flings and decelerates naturally on release
    onDragStart: () => idleTween.pause(),
    onDragEnd: () => {
      // resume idle auto-rotation from wherever the drag left off, after a short delay
      gsap.delayedCall(1.5, () => idleTween.restart(true).progress(0).invalidate());
    },
  });
}, []);
```
- `type: 'rotation'` lets the user grab and spin the wheel like a dial; `inertia: true` (requires the free `InertiaPlugin`, bundled with GSAP's Club/Bonus plugins — if unavailable, omit `inertia` and it'll still drag-rotate without momentum).
- Pause the idle tween while dragging so they don't fight each other; resume idle auto-spin a beat after the user lets go.
- Keep the counter-rotation on individual icons (§5.3) active at all times so logos stay upright whether the spin is idle or drag-driven.
- On touch devices, `Draggable` handles touch events natively — no extra config needed.
- The scroll-triggered flip (§5.4) is a separate transform (`rotateY`) from the drag rotation (`rotate`/Z-axis), so they can run simultaneously without conflict — one spins the wheel flat, the other flips it in 3D.

### 5.6 Reduced motion
Wrap all GSAP hero animations in a check:
```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) { /* run animations */ }
```

---

## 6. Sections Breakdown

### Hero (`Hero.tsx`)
- Eyebrow text: `[PLACEHOLDER: "Available for freelance"]`
- H1: `[Your Name]`
- Subheading: `[Your Title — e.g. "Full-Stack Developer building fast, accessible web products"]`
- CTA buttons: "View Work" (scrolls to Projects), "Get in Touch" (scrolls to Contact)
- Right side: `<TechIconWheel />`

### About/Bio (`About.tsx`)
- Layout: 2-column on desktop — text (bio) on one side, **personal photo** on the other (this is where the "hero-style" image lives now, not in the Hero section — Hero stays image-free with just the icon wheel per §5).
  - Image slot: `[PLACEHOLDER: /public/about-photo.jpg]`, use `next/image` with `fill` inside an aspect-ratio-locked container (e.g. `aspect-[4/5]`), `object-cover`, grayscale filter (`filter: grayscale(100%)`) to match the black & white theme, optionally a hairline border/frame.
  - The user will source/crop this photo themselves — component just needs the image slot wired up and styled.
- Short bio paragraph, `[PLACEHOLDER copy]`
- Stats row (years experience, projects shipped, clients) — optional, placeholder numbers
- GSAP: simple fade/slide-up on scroll using `ScrollTrigger` + `gsap.from(el, { y: 40, opacity: 0, scrollTrigger: { trigger: el, start: 'top 80%' } })`; optionally a subtle parallax on the photo (`gsap.to(imgRef, { y: -30, scrollTrigger: { scrub: true } })`)

### Services (`Services.tsx`)
- Grid of 3–4 cards: `[Service 1 — e.g. "Web Development"]`, `[Service 2]`, `[Service 3]`, `[Service 4]`
- Each: icon/number, title, 1-line description
- Stagger-in via `gsap.from('.service-card', { y: 30, opacity: 0, stagger: 0.15, scrollTrigger: {...} })`

### Featured Projects (`Projects.tsx`)
- 3–4 `ProjectCard` components: title, short description, tech tags, image (next/image), link
- Data-driven from `lib/data/projects.ts` — placeholder entries to be replaced with real project details, screenshots, and links
- Optional: horizontal scroll or simple stacked cards with scroll-triggered reveal

### Testimonials (`Testimonials.tsx`)
- 2–3 `TestimonialCard`: quote, name, role/company, avatar (placeholder initials if no photo)
- Simple fade/slide-in stagger, same pattern as Services

### Blog/Thoughts (`BlogPreview.tsx` + `app/blog/`)
- Preview: 3 latest posts (title, date, excerpt, read-time)
- Full blog uses MDX or a headless CMS later — for now, static array in `lib/data/posts.ts`
- Each post page (`app/blog/[slug]/page.tsx`) needs its own `generateMetadata` for SEO (title, description, OG image)

### Contact (`Contact.tsx`)
- Form fields: Name, Email, Message
- Client-side validation; submit via a Next.js Route Handler (`app/api/contact/route.ts`) that sends email via Resend/Nodemailer — `[PLACEHOLDER: wire up provider + API key in .env.local]`
- Also list direct email + social links (GitHub, LinkedIn, X/Twitter) — `[PLACEHOLDER links]`

---

## 7. SEO Implementation (must-have, not optional)

### 7.1 Metadata
`app/layout.tsx`:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://[PLACEHOLDER-DOMAIN].com'),
  title: {
    default: '[Your Name] — [Your Title]',
    template: '%s | [Your Name]',
  },
  description: '[PLACEHOLDER: 150–160 char summary of who you are and what you do]',
  openGraph: {
    title: '[Your Name] — [Your Title]',
    description: '[PLACEHOLDER]',
    url: 'https://[PLACEHOLDER-DOMAIN].com',
    siteName: '[Your Name]',
    images: ['/og-image.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Your Name] — [Your Title]',
    description: '[PLACEHOLDER]',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};
```
Each blog post uses `generateMetadata()` to produce unique title/description/OG image per post — never reuse root metadata for post pages.

### 7.2 Structured Data (JSON-LD)
Add a `<script type="application/ld+json">` in `layout.tsx` with `Person` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Your Name]",
  "jobTitle": "[Your Title]",
  "url": "https://[PLACEHOLDER-DOMAIN].com",
  "sameAs": [
    "https://github.com/[PLACEHOLDER]",
    "https://linkedin.com/in/[PLACEHOLDER]"
  ]
}
```
Add `BlogPosting` schema per blog post.

### 7.3 Sitemap & Robots
`app/sitemap.ts`:
```ts
import { MetadataRoute } from 'next';
import { posts } from '@/lib/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/blog'].map((path) => ({
    url: `https://[PLACEHOLDER-DOMAIN].com${path}`,
    lastModified: new Date(),
  }));
  const postRoutes = posts.map((p) => ({
    url: `https://[PLACEHOLDER-DOMAIN].com/blog/${p.slug}`,
    lastModified: p.updatedAt,
  }));
  return [...staticRoutes, ...postRoutes];
}
```
`app/robots.ts`:
```ts
import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://[PLACEHOLDER-DOMAIN].com/sitemap.xml',
  };
}
```

### 7.4 Performance/SEO hygiene checklist
- All images via `next/image` with explicit `width`/`height` or `fill` + `sizes` — no layout shift.
- Self-host fonts via `next/font` (no render-blocking Google Fonts `<link>`).
- Semantic HTML: one `<h1>` (hero name), `<h2>` per section title, landmark tags (`<header>`, `<main>`, `<section>`, `<footer>`).
- All interactive icons/buttons have `aria-label`s; tech icons in the wheel have descriptive `alt` text.
- Lighthouse targets: Performance ≥ 90, SEO ≥ 100, Accessibility ≥ 95.
- `next-sitemap` or native `sitemap.ts`/`robots.ts` (above) — pick one, don't duplicate.
- Set up Google Search Console + submit sitemap after deploy.
- Add `favicon.ico`, `apple-touch-icon.png`, `manifest.json` for PWA basics.

---

## 8. Animation Summary (GSAP usage map)

| Element | Trigger | Effect |
|---|---|---|
| Tech icon wheel | On mount, infinite | Continuous rotation, icons counter-rotated upright |
| Tech icon wheel | Scroll through hero | Pinned in place, `rotateY` flip scrubbed to scroll progress |
| Section headings | Scroll into view (`start: top 80%`) | Fade + slide up (`y: 40 → 0`, `opacity: 0 → 1`) |
| Service cards / testimonial cards | Scroll into view | Staggered fade + slide (`stagger: 0.15`) |
| Project cards | Scroll into view | Fade + slight scale (`scale: 0.96 → 1`) |
| Nav on scroll | `ScrollTrigger` on body scroll | Header background solidifies/shrinks after scrolling past hero |
| Buttons | Hover | Simple CSS transition (invert bg/fg) — no GSAP needed |

All scroll-based triggers should use `gsap.context()` or the `useGSAP()` hook (from `@gsap/react`) inside each component so animations are scoped and cleaned up properly on unmount — critical in Next.js App Router with client components.

---

## 9. Environment & Deployment

`.env.local`:
```
NEXT_PUBLIC_SITE_URL=https://[PLACEHOLDER-DOMAIN].com
RESEND_API_KEY=[PLACEHOLDER]
CONTACT_EMAIL=[PLACEHOLDER]
```
- Deploy on Vercel (zero-config for Next.js).
- Connect custom domain, verify HTTPS.
- After deploy: submit sitemap to Google Search Console, run Lighthouse + PageSpeed Insights, fix any CLS/LCP flags from the hero wheel animation (ensure it doesn't block LCP — lazy-mount GSAP timelines after hydration).

---

## 10. Build Order (recommended sequence for the AI code editor)

1. Scaffold project + Tailwind theme tokens (§2–3)
2. Root layout + metadata + SmoothScrollProvider (§4, §7.1)
3. Hero section with static (non-animated) icon wheel layout first — get positions right
4. Layer in GSAP idle rotation, then scroll-pin + flip (§5.3–5.4)
5. About, Services, Testimonials sections with scroll-reveal pattern
6. Projects section + data file
7. Blog index + `[slug]` page + JSON-LD per post
8. Contact form + API route
9. Sitemap, robots, JSON-LD on layout (§7.2–7.3)
10. Accessibility + Lighthouse pass, then deploy
