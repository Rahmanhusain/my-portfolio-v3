import Link from 'next/link';
import clsx from 'clsx';
import type { Service } from '@/lib/types/content';

/**
 * The services index, as an editorial row list: name on the left, scope tags
 * on the right, hairline between each.
 *
 * Rows beat a card grid here — eight cards is a wall to scan, eight rows is a
 * menu. The whole row is the click target (via the title link's `::after`
 * overlay) while the anchor itself stays a plain, crawlable link.
 *
 * Hover motion is CSS only. Services arrive as a prop rather than being
 * imported: the homepage renders this from the `'use client'` Services
 * section, which would drag `lib/data/services` — and with it the MongoDB
 * driver — into the browser bundle.
 */
export default function ServiceList({
  services,
  className,
  headingLevel = 'h3',
}: {
  services: Service[];
  className?: string;
  /** `h3` under a section heading on the homepage, `h2` on /services where
   *  the page title is the only h1. */
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;

  return (
    <ul className={clsx('border-t border-border', className)}>
      {services.map((service) => (
        <li key={service.slug}>
          <article className="group relative flex flex-col gap-2 border-b border-border py-7 transition-[padding] duration-300 hover:pl-2 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-8">
            <Heading className="font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">
              <Link
                href={`/services/${service.slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {service.title}
              </Link>
            </Heading>

            {/* Wraps below `md`, where the row stacks and the tags get only the
                content column to sit in — a nowrap track of three tags is wider
                than a 320px viewport and would scroll the whole page sideways.
                From `md` up the row is horizontal again, so the tags go back to
                a single unshrinkable line beside the title. */}
            <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted transition-colors duration-300 group-hover:text-strong md:shrink-0 md:flex-nowrap">
              {service.tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-faint">
                      •
                    </span>
                  )}
                  <span className="whitespace-nowrap">{tag}</span>
                </span>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
