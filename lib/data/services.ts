// ─── Service type ────────────────────────────────────────────────────────────

export interface ServiceBenefit {
  title:       string;
  description: string;
}

export interface Service {
  number:      string;
  slug:        string;
  title:       string;
  shortDesc:   string;       // used on home page card
  description: string;       // opening paragraph on service page
  bannerImage: string;
  bannerAlt:   string;
  keywords:    string[];
  benefits:    ServiceBenefit[];
  whyMe:       string;       // "Why work with me" paragraph
}

// ─── Services ────────────────────────────────────────────────────────────────

export const services: Service[] = [
  {
    number:      '01',
    slug:        'web-app-development',
    title:       'Web & App Development',
    shortDesc:   'End-to-end web applications built with modern frameworks — fast, scalable, and production-ready.',
    description: 'I build web applications from scratch using React, Next.js, and TypeScript. Whether you need a marketing site, a SaaS dashboard, or a complex data-driven platform, I handle everything from architecture decisions to deployment. Every project ships with clean code, thorough documentation, and a focus on long-term maintainability.',
    bannerImage: '/blogpostimages/banner.webp',
    bannerAlt:   'Code editor showing a modern React and Next.js web application',
    keywords:    ['web development services', 'Next.js developer', 'React app development', 'full-stack web developer', 'custom web application'],
    benefits: [
      { title: 'Performance by default', description: 'Server-side rendering, image optimisation, and code splitting are built in from the start — not bolted on afterward.' },
      { title: 'Scalable architecture', description: 'Clean separation of concerns and typed interfaces mean your codebase stays manageable as the product grows.' },
      { title: 'SEO-ready structure', description: 'Semantic HTML, proper metadata, and static generation where appropriate give search engines exactly what they need.' },
      { title: 'Accessible out of the box', description: 'WCAG-compliant markup, keyboard navigation, and screen-reader support are part of every build, not an afterthought.' },
    ],
    whyMe: 'I have shipped production applications for startups and established businesses across e-commerce, SaaS, and media. I care about the details — from the architecture diagram to the loading spinner — and I stay involved through launch and beyond. You get a partner who understands both the business problem and the technical solution.',
  },
  {
    number:      '02',
    slug:        'ui-ux-design',
    title:       'UI/UX Design',
    shortDesc:   'Pixel-perfect interfaces with fluid animations and micro-interactions that elevate user experience.',
    description: 'Good design is not decoration — it is the difference between a product people enjoy using and one they tolerate. I design interfaces in Figma, then bring them to life in code with precise attention to spacing, typography, and motion. The result is a consistent, polished experience that reflects your brand and keeps users engaged.',
    bannerImage: '/services/ui-ux-design.jpg',
    bannerAlt:   'Figma design file showing component library and responsive layouts',
    keywords:    ['UI UX design services', 'Figma designer', 'web interface design', 'user experience design', 'motion design'],
    benefits: [
      { title: 'Design to code, no handoff gaps', description: 'Because I design and build, the finished product matches the mockup exactly — no compromises in translation.' },
      { title: 'Component-driven systems', description: 'A well-organised design system speeds up iteration and keeps every screen visually consistent.' },
      { title: 'Motion that means something', description: 'Animations guide attention and communicate state rather than just decorating the page.' },
      { title: 'Mobile-first by default', description: 'Every layout is designed for small screens first, then progressively enhanced for larger viewports.' },
    ],
    whyMe: 'I approach design as a problem-solving discipline, not an aesthetic exercise. I ask why before asking what, which means the interfaces I create solve real user problems while looking genuinely beautiful. My background in both design and engineering means I never propose something that cannot be built.',
  },
  {
    number:      '03',
    slug:        'api-backend-development',
    title:       'API & Backend Development',
    shortDesc:   'Robust REST and GraphQL APIs, database design, and cloud infrastructure that scale with your product.',
    description: 'A strong frontend is only as good as the backend behind it. I design and build REST and GraphQL APIs using Node.js, with PostgreSQL or MongoDB depending on your data model. I handle authentication, rate limiting, caching, and deployment to cloud platforms so your backend is reliable, secure, and ready for growth.',
    bannerImage: '/services/api-backend.jpg',
    bannerAlt:   'Terminal window showing API routes and database schema for a Node.js application',
    keywords:    ['API development services', 'Node.js backend developer', 'REST API development', 'GraphQL API', 'backend as a service'],
    benefits: [
      { title: 'Type-safe end to end', description: 'Shared TypeScript types between frontend and backend eliminate entire classes of runtime errors.' },
      { title: 'Built for the real world', description: 'Proper error handling, input validation, and rate limiting protect your API from day one.' },
      { title: 'Documentation included', description: 'Every API ships with OpenAPI / Swagger documentation so your team and future integrations are never left guessing.' },
      { title: 'Observability baked in', description: 'Structured logging and request tracing make debugging in production straightforward rather than painful.' },
    ],
    whyMe: 'Backend work that nobody notices is the best backend work — it just runs. I have designed APIs for products serving thousands of users and know what it takes to keep them stable under load. I write tests, document assumptions, and hand over systems that your team can confidently maintain.',
  },
  {
    number:      '04',
    slug:        'custom-crm-development',
    title:       'Custom CRM Development',
    shortDesc:   'Tailored CRM systems built around your workflow — not the other way around.',
    description: 'Off-the-shelf CRM tools are built for the average business, which means they rarely fit anyone perfectly. I build custom CRM systems tailored to your exact workflow — the right data fields, the right automations, the right integrations. The result is a tool your team actually wants to use, built on a tech stack you own.',
    bannerImage: '/services/crm-development.jpg',
    bannerAlt:   'Dashboard interface showing customer pipeline, analytics, and contact management',
    keywords:    ['custom CRM development', 'bespoke CRM software', 'CRM developer', 'custom business software', 'workflow automation'],
    benefits: [
      { title: 'Built around your process', description: 'No forcing your workflow into someone else\'s opinionated structure — the CRM adapts to how your team works.' },
      { title: 'Own your data', description: 'All your customer data lives in a database you control, with no third-party platform fees or data-export restrictions.' },
      { title: 'Integrates with your stack', description: 'Custom webhooks and integrations connect your CRM to the tools you already use — email, billing, support, and more.' },
      { title: 'Grows with your business', description: 'Adding new fields, reports, or automations is straightforward because the codebase is clean and well-documented.' },
    ],
    whyMe: 'I have built internal tools and CRMs for businesses across sales, logistics, and professional services. I start by understanding your team\'s actual day-to-day before writing a line of code, which means the system I deliver is one your people will adopt immediately rather than work around.',
  },
  {
    number:      '05',
    slug:        'business-email-setup',
    title:       'Business Email Setup',
    shortDesc:   'Professional branded email on your domain, configured correctly and secured from the start.',
    description: 'A business email address on your own domain — name@yourcompany.com — builds trust with clients and protects your brand. I handle the full setup: DNS records, mail provider configuration, SPF, DKIM, and DMARC to ensure your emails reach the inbox rather than the spam folder. Whether you need one inbox or fifty, I get it right the first time.',
    bannerImage: '/services/business-email.jpg',
    bannerAlt:   'Email client showing a professional branded inbox on a custom domain',
    keywords:    ['business email setup', 'custom domain email', 'professional email configuration', 'SPF DKIM DMARC setup', 'Google Workspace setup'],
    benefits: [
      { title: 'Inbox deliverability', description: 'Properly configured SPF, DKIM, and DMARC records mean your emails land in inboxes, not spam folders.' },
      { title: 'Professional brand image', description: 'A branded email address signals legitimacy to clients and partners in a way free webmail cannot.' },
      { title: 'Secure by default', description: 'Email security settings are configured to prevent spoofing and phishing attacks on your domain from day one.' },
      { title: 'Works with your existing tools', description: 'Compatible with Google Workspace, Microsoft 365, or any IMAP provider — your team keeps the apps they prefer.' },
    ],
    whyMe: 'Email setup sounds simple until a misconfigured DNS record sends every message to spam. I have set up email infrastructure for dozens of businesses and know the pitfalls. I also test deliverability after setup, so you have confidence before sending your first important message.',
  },
  {
    number:      '06',
    slug:        'hosting-deployment',
    title:       'Hosting & Deployment',
    shortDesc:   'Production-grade deployments on reliable infrastructure, with CI/CD and monitoring included.',
    description: 'Deploying a web application is about more than uploading files. I set up production environments on Vercel, Netlify, AWS, or DigitalOcean depending on your needs, along with CI/CD pipelines so every commit to main gets tested and deployed automatically. You get a stable, monitored environment that your team can deploy to with confidence.',
    bannerImage: '/services/hosting-deployment.jpg',
    bannerAlt:   'Cloud infrastructure diagram showing CI/CD pipeline from code commit to production',
    keywords:    ['web hosting services', 'deployment setup', 'CI/CD pipeline', 'Vercel deployment', 'cloud hosting developer'],
    benefits: [
      { title: 'Zero-downtime deployments', description: 'Atomic deployments and rollback capability mean a bad push never takes your site offline.' },
      { title: 'Automated testing in CI', description: 'Every push runs your test suite before reaching production — catching regressions before your users do.' },
      { title: 'Monitoring and alerts', description: 'Uptime monitoring and error tracking are set up from day one so you know about issues before your users report them.' },
      { title: 'Infrastructure as code', description: 'Environment configuration lives in version control, making it reproducible and disaster-recovery-ready.' },
    ],
    whyMe: 'I have deployed and maintained applications ranging from simple marketing sites to data-intensive platforms with millions of monthly requests. I choose the right infrastructure for your scale and budget rather than defaulting to the most expensive option, and I document everything so your team is never dependent on me for operational knowledge.',
  },
];
