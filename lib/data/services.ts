import type { ContentBlock } from '@/lib/content-blocks';
export type { ContentBlock } from '@/lib/content-blocks';

// ─── Service types ───────────────────────────────────────────────────────────

export interface ServiceBenefit {
  title:       string;
  description: string;
}

export interface Service {
  number:      string;
  slug:        string;
  title:       string;
  shortDesc:   string;       // home page card + /services listing
  description: string;       // lead paragraph on service page
  bannerImage: string;
  bannerAlt:   string;
  keywords:    string[];
  benefits:    ServiceBenefit[];
  whyMe:       string;       // "Why work with me" paragraph
  body:        ContentBlock[]; // rich body rendered between header and benefits
}

// ─── Services ────────────────────────────────────────────────────────────────

export const services: Service[] = [
  // ── 01 ──────────────────────────────────────────────────────────────────────
  {
    number:      '01',
    slug:        'web-app-development',
    title:       'Web & App Development',
    shortDesc:   'End-to-end web applications built with modern frameworks — fast, scalable, and production-ready.',
    description: 'I build web applications from scratch using React, Next.js, and TypeScript. Whether you need a marketing site, a SaaS dashboard, or a complex data-driven platform, I handle everything from architecture decisions to deployment. Every project ships with clean code, thorough documentation, and a focus on long-term maintainability.',
    bannerImage: '/blogpostimages/banner.webp',
    bannerAlt:   'Code editor showing a modern React and Next.js web application',
    keywords:    ['web development services', 'Next.js developer', 'React app development', 'full-stack web developer', 'custom web application'],
    body: [
      { type: 'h2', text: 'What the process looks like' },
      {
        type: 'p',
        text: 'Every engagement starts with a discovery call where we define goals, constraints, and success criteria. From there I produce a technical spec before writing a single line of code — so you know exactly what you are getting and when.',
      },
      { type: 'h2', text: 'The technology stack' },
      {
        type: 'p',
        text: 'I default to Next.js with the App Router for most web projects. It gives you server-side rendering, static generation, API routes, and image optimisation in one cohesive framework. TypeScript is non-negotiable — it catches entire classes of bugs at compile time rather than in production.',
      },
      {
        type: 'ul',
        items: [
          'Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS',
          'State management: Zustand or React Query depending on the data model',
          'Database: PostgreSQL with Prisma, or MongoDB for document-oriented data',
          'Deployment: Vercel (web) or Docker on a managed VPS for full control',
        ],
      },
      { type: 'h2', text: 'What gets delivered' },
      {
        type: 'p',
        text: 'You receive a production-ready codebase in a private Git repository, a deployment pipeline, environment variable documentation, and a handover session. I do not disappear after launch — the first 30 days include free bug fixes on anything I built.',
      },
    ],
    benefits: [
      { title: 'Performance by default', description: 'Server-side rendering, image optimisation, and code splitting are built in from the start — not bolted on afterward.' },
      { title: 'Scalable architecture', description: 'Clean separation of concerns and typed interfaces mean your codebase stays manageable as the product grows.' },
      { title: 'SEO-ready structure', description: 'Semantic HTML, proper metadata, and static generation where appropriate give search engines exactly what they need.' },
      { title: 'Accessible out of the box', description: 'WCAG-compliant markup, keyboard navigation, and screen-reader support are part of every build, not an afterthought.' },
    ],
    whyMe: 'I have shipped production applications for startups and established businesses across e-commerce, SaaS, and media. I care about the details — from the architecture diagram to the loading spinner — and I stay involved through launch and beyond. You get a partner who understands both the business problem and the technical solution.',
  },

  // ── 02 ──────────────────────────────────────────────────────────────────────
  {
    number:      '02',
    slug:        'ui-ux-design',
    title:       'UI/UX Design',
    shortDesc:   'Pixel-perfect interfaces with fluid animations and micro-interactions that elevate user experience.',
    description: 'Good design is not decoration — it is the difference between a product people enjoy using and one they tolerate. I design interfaces in Figma, then bring them to life in code with precise attention to spacing, typography, and motion.',
    bannerImage: '/services/ui-ux-design.jpg',
    bannerAlt:   'Figma design file showing component library and responsive layouts',
    keywords:    ['UI UX design services', 'Figma designer', 'web interface design', 'user experience design', 'motion design'],
    body: [
      { type: 'h2', text: 'Design and code in one hand' },
      {
        type: 'p',
        text: 'Most design processes suffer from a handoff gap — the gap between what is designed and what gets built. Because I do both, that gap does not exist. What you approve in Figma is what ships in the browser, pixel for pixel.',
      },
      { type: 'h2', text: 'The design process' },
      {
        type: 'ol',
        items: [
          'Discovery — understanding your users, brand, and business goals',
          'Information architecture — defining structure and user flows before visual design begins',
          'Wireframes — low-fidelity layouts that focus on structure and hierarchy',
          'Visual design — high-fidelity screens with your brand applied consistently',
          'Prototyping — interactive Figma prototype for stakeholder review',
          'Implementation — design translated directly into production code',
        ],
      },
      { type: 'h2', text: 'Motion design' },
      {
        type: 'p',
        text: 'Animation is part of the design, not a finishing touch. Page transitions, hover states, loading indicators, and scroll-driven reveals are all considered during the design phase so they are purposeful rather than decorative.',
      },
    ],
    benefits: [
      { title: 'Design to code, no handoff gaps', description: 'Because I design and build, the finished product matches the mockup exactly — no compromises in translation.' },
      { title: 'Component-driven systems', description: 'A well-organised design system speeds up iteration and keeps every screen visually consistent.' },
      { title: 'Motion that means something', description: 'Animations guide attention and communicate state rather than just decorating the page.' },
      { title: 'Mobile-first by default', description: 'Every layout is designed for small screens first, then progressively enhanced for larger viewports.' },
    ],
    whyMe: 'I approach design as a problem-solving discipline, not an aesthetic exercise. I ask why before asking what, which means the interfaces I create solve real user problems while looking genuinely beautiful. My background in both design and engineering means I never propose something that cannot be built.',
  },

  // ── 03 ──────────────────────────────────────────────────────────────────────
  {
    number:      '03',
    slug:        'api-backend-development',
    title:       'API & Backend Development',
    shortDesc:   'Robust REST and GraphQL APIs, database design, and cloud infrastructure that scale with your product.',
    description: 'A strong frontend is only as good as the backend behind it. I design and build REST and GraphQL APIs using Node.js, with PostgreSQL or MongoDB depending on your data model. Authentication, rate limiting, caching, and deployment are all handled so your backend is reliable, secure, and ready for growth.',
    bannerImage: '/services/api-backend.jpg',
    bannerAlt:   'Terminal window showing API routes and database schema for a Node.js application',
    keywords:    ['API development services', 'Node.js backend developer', 'REST API development', 'GraphQL API', 'backend as a service'],
    body: [
      { type: 'h2', text: 'REST vs GraphQL — picking the right tool' },
      {
        type: 'p',
        text: 'REST APIs are straightforward, cache well, and are easy to understand. GraphQL shines when clients need flexible queries over complex, related data. I help you pick the right approach for your use case rather than defaulting to whichever is trendier.',
      },
      { type: 'h2', text: 'Security is not optional' },
      {
        type: 'p',
        text: 'Every API I build includes input validation on all endpoints, parameterised queries to prevent SQL injection, rate limiting per IP and per user, and JWT or session-based authentication depending on the client type. These are defaults, not extras.',
      },
      { type: 'h2', text: 'Database design' },
      {
        type: 'p',
        text: 'A poorly designed schema causes performance problems that are expensive to fix later. I model data carefully upfront, write migrations rather than manual schema changes, and index queries that will run at scale.',
      },
      {
        type: 'ul',
        items: [
          'PostgreSQL with Prisma ORM for relational data',
          'MongoDB with Mongoose for document-oriented data',
          'Redis for caching and session storage',
          'Full-text search via PostgreSQL or dedicated Meilisearch instance',
        ],
      },
    ],
    benefits: [
      { title: 'Type-safe end to end', description: 'Shared TypeScript types between frontend and backend eliminate entire classes of runtime errors.' },
      { title: 'Built for the real world', description: 'Proper error handling, input validation, and rate limiting protect your API from day one.' },
      { title: 'Documentation included', description: 'Every API ships with OpenAPI / Swagger documentation so your team and future integrations are never left guessing.' },
      { title: 'Observability baked in', description: 'Structured logging and request tracing make debugging in production straightforward rather than painful.' },
    ],
    whyMe: 'Backend work that nobody notices is the best backend work — it just runs. I have designed APIs for products serving thousands of users and know what it takes to keep them stable under load. I write tests, document assumptions, and hand over systems that your team can confidently maintain.',
  },

  // ── 04 ──────────────────────────────────────────────────────────────────────
  {
    number:      '04',
    slug:        'custom-crm-development',
    title:       'Custom CRM Development',
    shortDesc:   'Tailored CRM systems built around your workflow — not the other way around.',
    description: 'Off-the-shelf CRM tools are built for the average business, which means they rarely fit anyone perfectly. I build custom CRM systems tailored to your exact workflow — the right data fields, the right automations, the right integrations. The result is a tool your team actually wants to use, built on a stack you own.',
    bannerImage: '/services/crm-development.jpg',
    bannerAlt:   'Dashboard interface showing customer pipeline, analytics, and contact management',
    keywords:    ['custom CRM development', 'bespoke CRM software', 'CRM developer', 'custom business software', 'workflow automation'],
    body: [
      { type: 'h2', text: 'Why off-the-shelf CRMs often fail' },
      {
        type: 'p',
        text: 'Generic CRM platforms are designed to cover every possible business model, which means they are optimised for none of them. You end up paying for features you will never use while workarounding the ones that almost fit. A custom-built system gives you exactly what you need — nothing more, nothing less.',
      },
      { type: 'h2', text: 'Common features I build' },
      {
        type: 'ul',
        items: [
          'Contact and company management with custom fields',
          'Pipeline stages that match your actual sales or delivery process',
          'Automated follow-up reminders and task assignments',
          'Email and calendar integrations (Gmail, Outlook)',
          'Reporting dashboards with the metrics your team actually tracks',
          'Role-based access so each team member sees what they need',
        ],
      },
      { type: 'h2', text: 'Built to evolve' },
      {
        type: 'p',
        text: 'Businesses change. A custom CRM built with a clean architecture is easy to extend — adding a new pipeline stage, a new report, or a new integration is a manageable task rather than a project overhaul.',
      },
    ],
    benefits: [
      { title: 'Built around your process', description: "No forcing your workflow into someone else's opinionated structure — the CRM adapts to how your team works." },
      { title: 'Own your data', description: 'All your customer data lives in a database you control, with no third-party platform fees or data-export restrictions.' },
      { title: 'Integrates with your stack', description: 'Custom webhooks and integrations connect your CRM to the tools you already use — email, billing, support, and more.' },
      { title: 'Grows with your business', description: 'Adding new fields, reports, or automations is straightforward because the codebase is clean and well-documented.' },
    ],
    whyMe: "I have built internal tools and CRMs for businesses across sales, logistics, and professional services. I start by understanding your team's actual day-to-day before writing a line of code, which means the system I deliver is one your people will adopt immediately rather than work around.",
  },

  // ── 05 ──────────────────────────────────────────────────────────────────────
  {
    number:      '05',
    slug:        'business-email-setup',
    title:       'Business Email Setup',
    shortDesc:   'Professional branded email on your domain, configured correctly and secured from the start.',
    description: 'A business email address on your own domain builds trust with clients and protects your brand. I handle the full setup — DNS records, mail provider configuration, SPF, DKIM, and DMARC — so your emails reach the inbox rather than the spam folder every time.',
    bannerImage: '/services/business-email.jpg',
    bannerAlt:   'Email client showing a professional branded inbox on a custom domain',
    keywords:    ['business email setup', 'custom domain email', 'professional email configuration', 'SPF DKIM DMARC setup', 'Google Workspace setup'],
    body: [
      { type: 'h2', text: 'Why email deliverability matters' },
      {
        type: 'p',
        text: 'A misconfigured email domain does not just look unprofessional — it gets your messages silently dropped into spam folders, or rejected outright. SPF, DKIM, and DMARC are the three DNS records that tell receiving servers your domain is legitimate. Getting them right is not optional.',
      },
      { type: 'h2', text: 'Providers I work with' },
      {
        type: 'ul',
        items: [
          'Google Workspace (Gmail with your domain) — best for teams already in the Google ecosystem',
          'Microsoft 365 (Outlook with your domain) — preferred for businesses using Office tools',
          'Zoho Mail — a cost-effective option for smaller teams',
          'Custom SMTP with Postfix or similar — for full self-hosted control',
        ],
      },
      { type: 'h2', text: 'What the setup includes' },
      {
        type: 'p',
        text: 'I configure your MX, SPF, DKIM, and DMARC records, verify delivery with a test send to multiple providers, and document every record I created so you can manage your domain confidently in the future. If you need email forwarding, aliases, or shared inboxes, those are included.',
      },
    ],
    benefits: [
      { title: 'Inbox deliverability', description: 'Properly configured SPF, DKIM, and DMARC records mean your emails land in inboxes, not spam folders.' },
      { title: 'Professional brand image', description: 'A branded email address signals legitimacy to clients and partners in a way free webmail cannot.' },
      { title: 'Secure by default', description: 'Email security settings are configured to prevent spoofing and phishing attacks on your domain from day one.' },
      { title: 'Works with your existing tools', description: 'Compatible with Google Workspace, Microsoft 365, or any IMAP provider — your team keeps the apps they prefer.' },
    ],
    whyMe: 'Email setup sounds simple until a misconfigured DNS record sends every message to spam. I have set up email infrastructure for dozens of businesses and know the pitfalls. I also test deliverability after setup, so you have confidence before sending your first important message.',
  },

  // ── 06 ──────────────────────────────────────────────────────────────────────
  {
    number:      '06',
    slug:        'hosting-deployment',
    title:       'Hosting & Deployment',
    shortDesc:   'Production-grade deployments on reliable infrastructure, with CI/CD and monitoring included.',
    description: 'Deploying a web application is about more than uploading files. I set up production environments on Vercel, Netlify, AWS, or DigitalOcean depending on your needs, along with CI/CD pipelines so every commit to main is tested and deployed automatically.',
    bannerImage: '/services/hosting-deployment.jpg',
    bannerAlt:   'Cloud infrastructure diagram showing CI/CD pipeline from code commit to production',
    keywords:    ['web hosting services', 'deployment setup', 'CI/CD pipeline', 'Vercel deployment', 'cloud hosting developer'],
    body: [
      { type: 'h2', text: 'Choosing the right platform' },
      {
        type: 'p',
        text: 'Vercel is the obvious choice for Next.js projects — it handles edge caching, preview deployments, and environment management with almost no configuration. For projects that need more control (background workers, custom networking, large file storage), a VPS on DigitalOcean or a managed container service on AWS is usually the better fit.',
      },
      { type: 'h2', text: 'CI/CD that actually saves time' },
      {
        type: 'p',
        text: 'A good pipeline does more than deploy. It runs your test suite, checks types, lints your code, and only deploys if everything passes. I set up GitHub Actions workflows that give you fast feedback on every pull request and automatic deployments on merge.',
      },
      { type: 'h2', text: 'Observability from day one' },
      {
        type: 'ul',
        items: [
          'Uptime monitoring with Betterstack or UptimeRobot — alerts before users notice',
          'Error tracking with Sentry — full stack traces with source maps',
          'Performance monitoring — real user metrics, not just Lighthouse scores',
          'Log aggregation — structured logs searchable across deployments',
        ],
      },
      { type: 'h2', text: 'Environment management' },
      {
        type: 'p',
        text: 'Environment variables, secrets, and configuration drift are a common source of production incidents. I document every variable, separate concerns between development, staging, and production environments, and ensure secrets are never committed to source control.',
      },
    ],
    benefits: [
      { title: 'Zero-downtime deployments', description: 'Atomic deployments and rollback capability mean a bad push never takes your site offline.' },
      { title: 'Automated testing in CI', description: 'Every push runs your test suite before reaching production — catching regressions before your users do.' },
      { title: 'Monitoring and alerts', description: 'Uptime monitoring and error tracking are set up from day one so you know about issues before your users report them.' },
      { title: 'Infrastructure as code', description: 'Environment configuration lives in version control, making it reproducible and disaster-recovery-ready.' },
    ],
    whyMe: 'I have deployed and maintained applications ranging from simple marketing sites to data-intensive platforms with millions of monthly requests. I choose the right infrastructure for your scale and budget rather than defaulting to the most expensive option, and I document everything so your team is never dependent on me for operational knowledge.',
  },
];
