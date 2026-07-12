export interface Faq {
  question: string;
  answer: string;
}

// Freelancer FAQs for the /services page. Edit these to match your real offer.
export const faqs: Faq[] = [
  {
    question: 'How much do your services cost?',
    answer:
      'Pricing depends on scope and complexity. Small landing pages start from a fixed project fee, while larger web apps are quoted after a discovery call. I always give a clear, written estimate before any work begins — no surprises mid-project.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A marketing site usually ships in 1–2 weeks. A full web application takes 4–8 weeks depending on features. I share a milestone timeline up front so you always know what is happening and when.',
  },
  {
    question: 'What is your development process?',
    answer:
      'Discovery → Design → Build → Launch → Support. We start by defining goals, then I design the interface, build it with a clean and tested codebase, deploy it, and stay available after launch for fixes and improvements.',
  },
  {
    question: 'Which technologies do you use?',
    answer:
      'I build with Next.js, React, and TypeScript on the frontend, with Node.js and PostgreSQL or MongoDB on the backend. Styling is Tailwind CSS. Everything is deployed on Vercel or a managed VPS for speed and reliability.',
  },
  {
    question: 'How do we communicate during the project?',
    answer:
      'I reply within one business day and send regular progress updates. We use email or a shared channel of your choice, plus a kickoff call and a review session at each major milestone so you are never out of the loop.',
  },
  {
    question: 'Do you offer revisions?',
    answer:
      'Yes. Each milestone includes a review round, and the first 30 days after launch include free bug fixes on everything I built. Larger change requests are scoped and quoted transparently.',
  },
  {
    question: 'Who owns the code and design?',
    answer:
      'You do. On handover you receive the full source code in a private Git repository, plus deployment and environment documentation. Nothing is locked behind me — you are free to extend or host it anywhere.',
  },
];
