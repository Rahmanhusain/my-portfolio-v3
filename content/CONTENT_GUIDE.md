# Content Authoring Guide

This guide covers everything you need to add or edit blog posts, services, and
project case studies. All content lives in the `content/` folder as plain JSON
files — no code changes required unless you are adding a brand-new entry (see
the registration step at the end of each section).

```
content/
├── posts/          ← one JSON file per blog post
├── services/       ← one JSON file per service
├── projects/       ← one JSON file per project case study
└── CONTENT_GUIDE.md
```

---

## Part 1 — Blog Posts

### File location

```
content/posts/<your-slug>.json
```

The filename **must exactly match** the `slug` field inside the file, e.g.
`my-new-post.json` → `"slug": "my-new-post"`.

---

### Full field reference

| Field         | Type              | Required | Notes |
|---------------|-------------------|----------|-------|
| `slug`        | string            | ✅       | URL-safe, lowercase, hyphens only. Must match filename. |
| `title`       | string            | ✅       | Shown as the `<h1>` on the post page and in browser tab. |
| `description` | string            | ✅       | 150–160 chars. Used for meta description, OG, and the card preview. |
| `date`        | string            | ✅       | Human-readable, e.g. `"July 4, 2025"`. Displayed on the page. |
| `updatedAt`   | string            | ✅       | ISO date `"YYYY-MM-DD"`. Used for SEO and sorting (newest-first). |
| `readTime`    | string            | ✅       | e.g. `"6 min read"`. Displayed next to the date. |
| `tags`        | string[]          | ✅       | Short labels shown as pills, e.g. `["React", "SEO"]`. |
| `keywords`    | string[]          | ✅       | SEO keyword phrases, e.g. `["Next.js App Router SEO", "sitemap"]`. |
| `bannerImage` | string            | ✅       | Path from `public/`, e.g. `"/blog/my-banner.jpg"`. Shown full-width at the top of the post. |
| `bannerAlt`   | string            | ✅       | Descriptive alt text for the banner image. |
| `ogImage`     | string            | ⚠️       | Optional. A separate 1200×630 image used **only** as the social share card. Omit it and the banner is used instead. See "Banner vs. share card" below. |
| `ogAlt`       | string            | ⚠️       | Optional. Alt text for `ogImage`. Falls back to `bannerAlt`, then the title. |
| `body`        | ContentBlock[]    | ✅       | Array of content blocks. See Part 4 for all block types. |

---

### Banner vs. share card (`bannerImage` vs. `ogImage`)

These are two different jobs, which is why they are two different fields. The
same split applies to blog posts, services, and projects.

| | `bannerImage` | `ogImage` |
|---|---|---|
| Where it appears | Full-width strip at the top of the page | Nowhere on the site — only in link previews |
| Who sees it | Readers who opened the page | People deciding whether to click, in WhatsApp / LinkedIn / Slack / X |
| Shape | Cropped to a wide strip by the layout | Fixed 1200×630 tile, shown whole |
| Required | ✅ (posts + services) | Optional |

**`ogImage` is optional and falls back to `bannerImage`.** Every entry written
before this field existed keeps working exactly as it did — if you do not set
`ogImage`, the banner is used as the share card, which is the old behaviour.

Set `ogImage` when the banner does not survive being shrunk. A banner is read at
full width on a wide screen; a share card is often rendered as a small
thumbnail in a chat list. Text that is comfortable in the banner is frequently
unreadable in the preview, and a banner cropped to a thin strip leaves the share
card looking empty at the top and bottom. A purpose-built card — bigger type,
tighter crop, the title spelled out — is what fixes that.

The two fields are also used differently behind the scenes: `og:image` and the
Twitter card prefer `ogImage`, while the structured data Google reads
(`schema.org` `image`) prefers `bannerImage`, because that one is supposed to be
the picture actually on the page.

> ### ⚠️ Keep share images under ~300 KB
>
> This applies to whichever image ends up as the share card — `ogImage` if you
> set one, `bannerImage` otherwise.
>
> **WhatsApp refuses to fetch preview images much over 300 KB and silently
> falls back to a bare text row.** Telegram, LinkedIn and Slack are far more
> generous (several MB), so a heavy image looks perfectly fine everywhere you
> are likely to test it and broken on the one platform most clients actually
> use.
>
> 1200×630 is the right *dimension*; it says nothing about file size. A
> screenshot exported straight from a design tool is routinely 1–2 MB. Run it
> through a compressor, or export as JPEG/WebP rather than PNG, before
> uploading. The admin media library flags anything over the limit.
>
> Entries with neither image fall back to the generated card at
> `app/opengraph-image.tsx`, which is ~45 KB and always works.

---

### Sample post JSON

```json
{
  "slug": "my-new-blog-post",
  "title": "My New Blog Post Title",
  "description": "A 150–160 character summary of what this post covers. Written for both readers and search engines.",
  "date": "July 4, 2025",
  "updatedAt": "2025-07-04",
  "readTime": "5 min read",
  "tags": ["Next.js", "Performance"],
  "keywords": ["Next.js performance tips", "web performance optimization"],
  "bannerImage": "/blog/my-new-blog-post.jpg",
  "bannerAlt": "A descriptive sentence about what is shown in the banner image",
  "ogImage": "/blog/my-new-blog-post-og.jpg",
  "ogAlt": "Share card reading 'My New Blog Post Title'",
  "body": [
    {
      "type": "p",
      "text": "Opening paragraph that sets the scene for the article."
    },
    {
      "type": "h2",
      "text": "First Section Heading"
    },
    {
      "type": "p",
      "text": "Body paragraph under the first heading."
    },
    {
      "type": "ul",
      "items": [
        "First bullet point",
        "Second bullet point",
        "Third bullet point"
      ]
    },
    {
      "type": "code",
      "lang": "tsx",
      "code": "export default function Hello() {\n  return <h1>Hello world</h1>;\n}"
    },
    {
      "type": "image",
      "src": "/blog/my-new-blog-post-diagram.jpg",
      "alt": "Diagram showing the component tree",
      "caption": "Optional caption shown below the image"
    },
    {
      "type": "h2",
      "text": "Second Section Heading"
    },
    {
      "type": "p",
      "text": "Closing thoughts."
    }
  ]
}
```

---

### Registering a new post

After creating the JSON file, add it to `lib/data/posts.ts`:

```ts
// 1. Import the file
import myNewPost from '@/content/posts/my-new-blog-post.json';

// 2. Add it to the array (order doesn't matter — array is sorted by updatedAt)
export const posts: Post[] = [
  hydrate(gsapPost     as PostRaw),
  hydrate(seoPost      as PostRaw),
  hydrate(tailwindPost as PostRaw),
  hydrate(myNewPost    as PostRaw),   // ← add this line
].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
```

The post will automatically appear:
- On the `/blog` listing page
- In the homepage blog preview (top 3 by date)
- In the sitemap at `/sitemap.xml`
- At `/blog/<your-slug>`

---

## Part 2 — Services

### File location

```
content/services/<your-slug>.json
```

The filename **must exactly match** the `slug` field inside the file.

---

### Full field reference

| Field         | Type               | Required | Notes |
|---------------|--------------------|----------|-------|
| `number`      | string             | ✅       | Display number, e.g. `"07"`. Shown as an eyebrow label. |
| `slug`        | string             | ✅       | URL-safe, lowercase, hyphens only. Must match filename. |
| `title`       | string             | ✅       | Shown as the `<h1>` and on service cards. |
| `shortDesc`   | string             | ✅       | One-sentence summary. Used on the home page card and `/services` listing. |
| `description` | string             | ✅       | 2–3 sentence lead paragraph shown at the top of the service page. |
| `bannerImage` | string             | ✅       | Path from `public/`, e.g. `"/services/my-service.jpg"`. Shown full-width at the top of the service page. |
| `bannerAlt`   | string             | ✅       | Descriptive alt text for the banner image. |
| `ogImage`     | string             | ⚠️       | Optional. A separate 1200×630 image used **only** as the social share card. Omit it and the banner is used instead. See [Banner vs. share card](#banner-vs-share-card-bannerimage-vs-ogimage). |
| `ogAlt`       | string             | ⚠️       | Optional. Alt text for `ogImage`. Falls back to `bannerAlt`, then the title. |
| `keywords`    | string[]           | ✅       | SEO keyword phrases for this service. |
| `body`        | ContentBlock[]     | ✅       | Rich content rendered between the lead paragraph and the benefits grid. See Part 4. |
| `benefits`    | ServiceBenefit[]   | ✅       | Array of `{ "title": "...", "description": "..." }` objects. Rendered as a 2-column card grid. |
| `whyMe`       | string             | ✅       | Single paragraph for the "Why work with me" section. |
| `faq`         | ServiceFaq[]     | ⚠️       | Optional array of `{ "question": "...", "answer": "..." }` objects. Rendered as the **per-service** FAQ section (overrides the global FAQ when present). |

---

### Sample service JSON

```json
{
  "number": "07",
  "slug": "my-new-service",
  "title": "My New Service",
  "shortDesc": "One sentence that captures the value of this service for the home page card.",
  "description": "Two or three sentences that open the service page. Explain what the service is, who it is for, and what makes your approach different.",
  "bannerImage": "/services/my-new-service.jpg",
  "bannerAlt": "A descriptive sentence about what is shown in the banner image",
  "ogImage": "/services/my-new-service-og.jpg",
  "ogAlt": "Share card reading 'My New Service'",
  "keywords": ["my service keyword phrase", "another keyword phrase"],
  "body": [
    {
      "type": "h2",
      "text": "How it works"
    },
    {
      "type": "p",
      "text": "Explain the process, approach, or methodology in plain language."
    },
    {
      "type": "h2",
      "text": "What is included"
    },
    {
      "type": "ul",
      "items": [
        "Deliverable or feature one",
        "Deliverable or feature two",
        "Deliverable or feature three"
      ]
    },
    {
      "type": "h2",
      "text": "A numbered process"
    },
    {
      "type": "ol",
      "items": [
        "Step one — discovery and scoping",
        "Step two — design and build",
        "Step three — review and launch"
      ]
    },
     {
      "type": "image",
      "src": "/rahman.jpeg",
      "alt": "Diagram showing the component tree",
      "caption": "Optional caption shown below the image"
    },
  ],
  "benefits": [
    {
      "title": "Benefit one title",
      "description": "One or two sentences explaining this specific benefit clearly."
    },
    {
      "title": "Benefit two title",
      "description": "One or two sentences explaining this specific benefit clearly."
    },
    {
      "title": "Benefit three title",
      "description": "One or two sentences explaining this specific benefit clearly."
    },
    {
      "title": "Benefit four title",
      "description": "One or two sentences explaining this specific benefit clearly."
    }
  ],
  "whyMe": "A single paragraph explaining why a client should choose you specifically for this service. Be concrete — reference relevant experience, outcomes, or your approach.",
  "faq": [
    {
      "question": "How much does this service cost?",
      "answer": "Pricing depends on scope. Small projects start from a fixed fee; larger builds are quoted after a discovery call. You always get a clear written estimate before work begins."
    },
    {
      "question": "How long does a typical project take?",
      "answer": "Most builds ship in 2–4 weeks. I share a milestone timeline up front so you always know what is happening and when."
    }
  ]
}
```

---

### Registering a new service

After creating the JSON file, add it to `lib/data/services.ts`:

```ts
// 1. Import the file
import myNewService from '@/content/services/my-new-service.json';

// 2. Add it to the array in the order you want it displayed
export const services: Service[] = [
  webDev,
  uiUx,
  apiBackend,
  crm,
  email,
  hosting,
  myNewService,   // ← add this line
] as Service[];
```

The service will automatically appear:
- On the home page services section (all services)
- On the `/services` listing page
- At `/services/<your-slug>`
- In the sitemap at `/sitemap.xml`

---

## Part 3 — Project Case Studies

### File location

```
content/projects/<your-slug>.json
```

The filename **must exactly match** the `slug` field inside the file.

---

### Required fields

| Field | Type | Notes |
|---|---|---|
| `number` | string | `"01"`, `"02"` — the eyebrow, and the big numeral on the placeholder cover. Also sets the array order. |
| `slug` | string | URL segment. `/projects/<slug>`. |
| `title` | string | The `h1`. Keep it short — it also appears on cards. |
| `shortDesc` | string | Card blurb, clamped to two lines. Also the meta description. Aim for 140–180 characters. |
| `description` | string | Hero paragraph under the `h1`. Two or three sentences setting up what the project is. |
| `year` | string | `"2024"`. Shown as a chip on the card and in the fact strip. |
| `tags` | string[] | Three or four short chips — `"Next.js"`, `"Stripe"`. The first one is used in the closing CTA sentence, so lead with the most representative. |
| `keywords` | string[] | Long-tail SEO phrases. **Never rendered** — these feed `<meta name="keywords">` and JSON-LD only. |
| `challenge` | string | "The problem" column. What was actually broken or missing, in business terms. |
| `solution` | string | "What I built" column. The approach, not the feature list. |
| `stack` | array | Grouped tech. Each item is `{ "group": "Frontend", "items": ["Next.js", "TypeScript"] }`. |
| `body` | array | The long-form case study. See Part 4. |

---

### Optional fields — omit them and the UI disappears

This is the important difference from services. Every field below is optional,
and when it is missing the component that renders it is **not rendered at all** —
no empty heading, no gap, no `undefined`. That is deliberate, so a personal
project can skip the client-work fields without looking broken.

| Field | Type | What appears when present |
|---|---|---|
| `bannerImage` | string | Full-bleed banner at the top, and the card cover. **When absent**, both fall back to a gradient plate with the project `number` — which is why you can ship a case study before you have a screenshot. Put files in `public/projectsimage/`. |
| `bannerAlt` | string | Alt text for the banner. Required *if* `bannerImage` is set — falls back to the title otherwise, which is worse for SEO. |
| `ogImage` | string | A separate 1200×630 image used **only** as the social share card — see [Banner vs. share card](#banner-vs-share-card-bannerimage-vs-ogimage). Unlike posts and services, a project can have *neither* image; the link then unfurls with the generated site card from `app/opengraph-image.tsx`, never with nothing. The gradient plate is a layout device and is not used as a share card. |
| `ogAlt` | string | Alt text for `ogImage`. Falls back to `bannerAlt`, then the title. |
| `client` | string | A "Client" pair in the fact strip. Omit for personal work. |
| `role` | string | A "Role" pair — `"Full-stack developer"`, `"Solo build"`. |
| `duration` | string | A "Timeline" pair — `"9 weeks"`, `"Ongoing side project"`. |
| `results` | array | The "Outcome" metric grid, placed before the body so the payoff is up front. Each item is `{ "metric": "+38%", "label": "checkout completion rate" }`. Use three or four — the grid is four columns wide. `metric` is a string, so `"11s → 380ms"` and `"0"` work as well as a percentage. |
| `testimonial` | object | A pull-quote card: `{ "quote": "…", "author": "Jane Doe", "role": "CTO, Acme" }`. `role` is itself optional. |
| `liveUrl` | string | A solid "View Live ↗" button in the header. |
| `repoUrl` | string | An outline "Source ↗" button. Omit for private client work — the `/projects` page carries the general GitHub link. |

If both `liveUrl` and `repoUrl` are missing, the whole button row is skipped.

---

### Sample project JSON

```json
{
  "number": "04",
  "slug": "inventory-sync-tool",
  "title": "Inventory Sync Tool",
  "shortDesc": "A one-way sync that keeps a Shopify catalogue and a warehouse system in agreement without a nightly CSV.",
  "description": "An internal tool that replaced a fragile nightly CSV import with an event-driven sync, so stock levels in Shopify match the warehouse within seconds instead of hours.",
  "year": "2025",
  "role": "Full-stack developer",
  "duration": "5 weeks",
  "tags": ["Node.js", "Shopify API", "PostgreSQL"],
  "keywords": ["Shopify inventory sync development", "warehouse integration developer"],
  "challenge": "Stock was imported once a night from a CSV, so the storefront was wrong for most of the working day and the team oversold on every busy afternoon.",
  "solution": "I replaced the import with a webhook-driven sync backed by a durable job queue, so a stock movement in the warehouse reaches the storefront in seconds and retries on its own when an API is down.",
  "results": [
    { "metric": "8h → 4s", "label": "stock propagation delay" },
    { "metric": "99.98%", "label": "sync success rate" }
  ],
  "stack": [
    { "group": "Backend", "items": ["Node.js", "PostgreSQL", "BullMQ"] },
    { "group": "Integrations", "items": ["Shopify Admin API", "Webhooks"] }
  ],
  "body": [
    { "type": "h2", "text": "Why the nightly CSV had to go" },
    { "type": "p", "text": "…" }
  ]
}
```

Note what is *not* in that sample: no `bannerImage`, no `ogImage`, no `client`,
no `testimonial`, no links. It renders correctly as-is, and shares with the
generated site card.

---

### Registering a new project

After creating the JSON file, add it to `lib/data/projects.ts`:

```ts
// 1. Import the file
import inventory from '@/content/projects/inventory-sync-tool.json';

// 2. Add it to the array in the order you want it displayed
export const projects: Project[] = [
  ecommerce,
  analytics,
  cms,
  inventory,   // ← add this line
] as Project[];
```

The project will automatically appear:
- On the home page projects section (the **first three** only — order the array accordingly)
- On the `/projects` listing page (all projects)
- At `/projects/<your-slug>`
- In the "Other projects" list on every sibling case study
- In the sitemap at `/sitemap.xml`

---

### Writing the case study itself

The `body` is where a case study earns its place. What makes these pages work is
specificity, so a rough shape that has held up:

1. **Name the real problem** — the business consequence, not the technical one. "Refunding one order in twenty" beats "race condition in inventory".
2. **Show one decision in depth** — a `code` block with a comment explaining *why*, not what.
3. **Include a trade-off you got wrong.** A "What I would do differently" section at the end is the single most credible thing on the page, and it is the section prospects quote back on calls.
4. Aim for 800–1200 words, at least three `h2` blocks (fewer than three and the table of contents hides itself), and one `table` or `code` block to break up the prose.

---

## Part 4 — Content Blocks (`body` field)

Posts, services, and projects all share the same `body` array made up of typed
content blocks. Every block is a JSON object with a `"type"` field.

> **Plain text only.** There is no inline `**bold**`, `_italic_`, or
> `` `code` `` formatting — the renderer would print those characters
> literally. Links are the one exception (see below). For code, use a `code`
> block.

### Inline links (backlinks / anchors)

You can embed a link inside any **text** field — a paragraph, a list item,
a table cell, or a caption — using a normal HTML anchor tag:

```
<a href="/services/web-app-development">web development services</a>
```

- **Internal paths** (starting with `/`, e.g. `/services/web-app-development`)
  render as fast Next.js links and are great for internal backlinks / SEO.
- **`https://` URLs** render as external links that open in a new tab.
- Any other scheme (`javascript:`, `mailto:`, etc.) is ignored and shown
  as plain text, so it is always safe.
- Markdown-style `[label](/path)` also works as a shortcut.

Example inside a paragraph block:

```json
{ "type": "p", "text": "I build production apps — see my <a href=\"/services/web-app-development\">web development services</a> for the full process." }
```

Use this to cross-link posts and services (and cite external sources) without
needing a dedicated link block.

---

### `h2` — Section heading

Renders a large `<h2>`. Use to divide the content into named sections.

```json
{ "type": "h2", "text": "Your Section Title" }
```

---

### `h3` — Sub-heading

Renders a smaller `<h3>`. Use inside an h2 section when you need a second level
of hierarchy.

```json
{ "type": "h3", "text": "Your Sub-heading" }
```

---

### `p` — Paragraph

Renders a `<p>`. Write one idea per paragraph. Avoid wall-of-text blocks.

```json
{ "type": "p", "text": "Your paragraph text goes here." }
```

---

### `ul` — Unordered list

Renders a bulleted `<ul>`. Each string in `items` becomes a `<li>`.

```json
{
  "type": "ul",
  "items": [
    "First item",
    "Second item",
    "Third item"
  ]
}
```

---

### `ol` — Ordered list

Renders a numbered `<ol>`. Use for steps, processes, or ranked content.

```json
{
  "type": "ol",
  "items": [
    "First step",
    "Second step",
    "Third step"
  ]
}
```

---

### `code` — Code block

Renders a syntax-highlighted code block with a language label in the header.

```json
{
  "type": "code",
  "lang": "tsx",
  "code": "export default function Hello() {\n  return <h1>Hello</h1>;\n}"
}
```

**`lang` values** — use the file extension as the label: `tsx`, `ts`, `js`,
`jsx`, `css`, `json`, `bash`, `html`, `py`, etc.

**Multi-line code** — use `\n` for line breaks and `\t` or spaces for indentation.
The code renders as-is inside a `<pre>` block, so whitespace is preserved exactly.

---

### `image` — Inline image

Renders a full-width image with optional caption. Images must be placed in the
`public/` folder first.

```json
{
  "type": "image",
  "src": "/blog/my-diagram.jpg",
  "alt": "Descriptive alt text for screen readers and SEO",
  "caption": "Optional caption displayed below the image"
}
```

- `src` — path from `public/`, e.g. `/blog/my-diagram.jpg`
- `alt` — always required, describe what is in the image
- `caption` — optional, omit the key entirely if not needed

---

### `table` — Comparison / data table

Renders a styled, responsive table — useful for feature comparisons, pricing
tiers, pros/cons, or any side-by-side data. It scrolls horizontally on small
screens, so columns never get crushed.

```json
{
  "type": "table",
  "headers": ["Plan", "Best for", "Price"],
  "rows": [
    ["Starter", "Landing pages", "$500"],
    ["Pro", "Web apps", "$2,000+"],
    ["Custom", "Full platforms", "Quote"]
  ],
  "caption": "Optional caption shown below the table"
}
```

- `headers` — array of column titles (strings). One entry per column.
- `rows` — array of rows; each row is an array of cell strings. Every row must
  have the same number of cells as `headers`.
- `caption` — optional, omit the key entirely if not needed.

---

### `hr` — Horizontal divider

Renders a thin `<hr>` line. Use sparingly to mark a major topic shift.

```json
{ "type": "hr" }
```

---

## Quick tips

- **Order matters.** Blocks render in the order they appear in the array — top to bottom.
- **No nesting.** Blocks are a flat array. You cannot put a list inside a paragraph. Use separate blocks instead.
- **Escape special characters in JSON.** A double quote inside a string must be written as `\"`. A backslash must be written as `\\`.
- **New lines in `p` blocks.** JSON strings do not support literal newlines. If you want a line break, split into two separate `p` blocks.
- **Images must be in `public/`.** Put post images in `public/blog/`, service images in `public/services/`, and project images in `public/projectsimage/` to keep things organised.
- **Name share cards predictably.** An `-og` suffix next to the banner (`/blog/my-post.jpg` → `/blog/my-post-og.jpg`) makes it obvious which file is which when you come back to the folder in six months.
- **`ogImage` is never rendered on the page.** If you want a picture visible in the article, that is `bannerImage` or an `image` block — setting `ogImage` alone changes nothing a visitor can see.
- **`updatedAt` format is strict.** Must be `"YYYY-MM-DD"` (e.g. `"2025-07-04"`). This drives the sort order on the blog listing and the sitemap dates.
