# Content Authoring Guide

This guide covers everything you need to add or edit blog posts and services.
All content lives in the `content/` folder as plain JSON files — no code changes
required unless you are adding a brand-new entry (see the registration step at
the end of each section).

```
content/
├── posts/          ← one JSON file per blog post
├── services/       ← one JSON file per service
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
| `bannerImage` | string            | ✅       | Path from `public/`, e.g. `"/blog/my-banner.jpg"`. Shown full-width at the top. Recommended size: 1200×630 px. |
| `bannerAlt`   | string            | ✅       | Descriptive alt text for the banner image. |
| `body`        | ContentBlock[]    | ✅       | Array of content blocks. See Part 3 for all block types. |

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
| `bannerImage` | string             | ✅       | Path from `public/`, e.g. `"/services/my-service.jpg"`. Recommended size: 1200×630 px. |
| `bannerAlt`   | string             | ✅       | Descriptive alt text for the banner image. |
| `keywords`    | string[]           | ✅       | SEO keyword phrases for this service. |
| `body`        | ContentBlock[]     | ✅       | Rich content rendered between the lead paragraph and the benefits grid. See Part 3. |
| `benefits`    | ServiceBenefit[]   | ✅       | Array of `{ "title": "...", "description": "..." }` objects. Rendered as a 2-column card grid. |
| `whyMe`       | string             | ✅       | Single paragraph for the "Why work with me" section. |

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
  "whyMe": "A single paragraph explaining why a client should choose you specifically for this service. Be concrete — reference relevant experience, outcomes, or your approach."
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

## Part 3 — Content Blocks (`body` field)

Both posts and services share the same `body` array made up of typed content
blocks. Every block is a JSON object with a `"type"` field.

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
- **Images must be in `public/`.** Put post images in `public/blog/` and service images in `public/services/` to keep things organised.
- **`updatedAt` format is strict.** Must be `"YYYY-MM-DD"` (e.g. `"2025-07-04"`). This drives the sort order on the blog listing and the sitemap dates.
