import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/data/projects';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  index: number;
  /** `h3` under the homepage section heading, `h2` on /projects where the page
   *  title is the only h1. */
  headingLevel?: 'h2' | 'h3';
}

/** Deterministic per-card hue so the placeholder art varies but never
 *  re-randomises between server and client renders. Used when a project has
 *  no `bannerImage` yet. */
const TINTS = [
  'from-[#dfe3f2] via-raised to-bg',
  'from-[#efe0ee] via-raised to-bg',
  'from-[#dbeee2] via-raised to-bg',
];

/** Tags shown before collapsing the rest into a "+N" chip. Four chips wrap to
 *  two ragged lines at card width; three never do. */
const MAX_TAGS = 3;

export default function ProjectCard({
  project,
  index,
  headingLevel = 'h3',
}: ProjectCardProps) {
  const Heading = headingLevel;
  const visibleTags = project.tags.slice(0, MAX_TAGS);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  // The strongest thing a card can say is the outcome, so the first metric is
  // promoted onto the cover. Projects without results just don't get a badge.
  const headline = project.results?.[0];

  return (
    <article
      className={clsx(
        'project-card glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl',
        'border border-border bg-raised transition-colors duration-500 hover:border-faint'
      )}
    >
      {/* Cover — the real banner when there is one, otherwise a gradient plate
          with the project number and a sweeping sheen. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg">
        {project.bannerImage ? (
          <Image
            src={project.bannerImage}
            alt={project.bannerAlt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className={clsx(
                'absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105',
                TINTS[index % TINTS.length]
              )}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(23,21,15,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(23,21,15,.5) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-display text-8xl font-bold select-none text-fg opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.16]"
                aria-hidden="true"
              >
                {project.number}
              </span>
            </div>
          </>
        )}

        {/* Keeps the chips legible over a photographic banner */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/[0.12] to-transparent"
          aria-hidden="true"
        />

        {/* Year, top-right */}
        <span className="absolute top-3 right-3 rounded-full border border-black/[0.08] bg-raised/85 px-2.5 py-1 text-[10px] font-medium text-strong backdrop-blur-sm">
          {project.year}
        </span>

        {/* Headline metric, bottom-left — the card's actual pitch */}
        {headline && (
          <div className="absolute bottom-3 left-3 flex items-baseline gap-1.5 rounded-full border border-black/[0.08] bg-raised/90 py-1 pr-3 pl-2.5 backdrop-blur-sm">
            <span className="font-display text-xs font-bold tracking-tight text-fg">
              {headline.metric}
            </span>
            <span className="text-[10px] leading-none text-muted">
              {headline.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Eyebrow */}
        <p className="mb-2.5 text-[10px] font-medium uppercase tracking-widest text-subtle">
          Case Study {project.number}
        </p>

        <Heading className="mb-3 font-display text-lg font-semibold leading-tight tracking-tight text-fg">
          {/* The overlay makes the whole card clickable while the anchor itself
              stays a single, plain, crawlable link. Same trick as ServiceList. */}
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
            aria-label={`Read the ${project.title} case study`}
          >
            <span className="link-sweep">{project.title}</span>
          </Link>
        </Heading>

        <p className="mb-5 line-clamp-1 text-sm leading-relaxed text-muted">
          {project.shortDesc}
        </p>

        {/* Tags — pushed to the bottom so cards of unequal copy length align */}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors duration-200 group-hover:border-faint"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="text-xs text-subtle">+{hiddenTagCount}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-fg">
          <span>Read case study</span>
          <span
            aria-hidden="true"
            className="arrow-slide text-muted transition-colors group-hover:text-fg"
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}
