import Marquee from '@/components/ui/Marquee';
import { techStack } from '@/lib/data/techStack';
import { getSite } from '@/lib/data/site';

/**
 * The band directly under the hero: what I build with, and the promises that
 * back it. It answers "is this person legit?" in the two seconds before a
 * visitor decides whether to keep scrolling.
 *
 * Wordmarks only — no icons. At this size the logos read as clutter and the
 * names alone scan faster.
 *
 * Server Component: the marquee is CSS-only.
 */
export default async function TrustStrip() {
  const site = await getSite();

  return (
    <section
      className="relative border-t border-border py-14 md:py-16"
      aria-labelledby="trust-strip-heading"
    >
      <h2 id="trust-strip-heading" className="sr-only">
        Technologies I build with, and what every project includes
      </h2>

      <p className="mb-9 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        Built with a modern, production-grade stack
      </p>

      <Marquee duration={44} gap="3.5rem" repeat={3} className="mb-14">
        {techStack.map((tech) => (
          <span
            key={tech.name}
            className="shrink-0 whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-subtle transition-colors duration-300 hover:text-fg md:text-[1.75rem]"
          >
            {tech.name}
          </span>
        ))}
      </Marquee>

      <div className="mx-auto max-w-6xl px-6">
        <dl className="stagger grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {site.proof.map((item) => (
            <div key={item.label} className="text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-bold tracking-tight text-fg md:text-4xl">
                  {item.value}
                </span>
                <span className="mt-1.5 block text-xs leading-snug text-muted">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
