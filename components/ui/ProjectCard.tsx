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

/** Deterministic per-card accent colour so the bottom bar varies without
 *  re-randomising between server and client renders. */
const ACCENTS = [
  'bg-[#f5c842]', // warm yellow
  'bg-[#a78bfa]', // soft violet
  'bg-[#34d399]', // mint green
  'bg-[#f87171]', // coral
  'bg-[#60a5fa]', // sky blue
  'bg-[#fb923c]', // orange
];

/** Gradient plates used when a project has no banner image yet. */
const TINTS = [
  'from-[#dfe3f2] via-raised to-bg',
  'from-[#efe0ee] via-raised to-bg',
  'from-[#dbeee2] via-raised to-bg',
];

export default function ProjectCard({
  project,
  index,
  headingLevel = 'h3',
}: ProjectCardProps) {
  const Heading = headingLevel;
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <article
      className={clsx(
        'group relative flex h-full flex-col overflow-hidden'
      )}
    >
      {/* ── Cover image ─────────────────────────────────────────────────── */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-transparent">
        {project.ProjectImage ? (
          <Image
            src={project.ProjectImage ?? ''}
            alt={project.ProjectAlt ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 560px"
            className="object-cover transition-transform duration-700 group-hover:scale-105 rounded-3xl bg-transparent"
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
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(23,21,15,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(23,21,15,.5) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />
            {/* Large faded project number */}
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

        {/* Scrim so chips stay readable over photography */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 "
          aria-hidden="true"
        />

        {/* Year badge — top right */}
        {/* <span className="absolute top-3 right-3 rounded-full border border-black/[0.08] bg-raised/85 px-2.5 py-1 text-[10px] font-medium text-strong backdrop-blur-sm">
          {project.year}
        </span> */}

        {/* Headline metric — bottom left, the card's actual pitch */}
        {/* {project.results?.[0] && (
          <div className="absolute bottom-3 left-3 flex items-baseline gap-1.5 rounded-full border border-black/[0.08] bg-raised/90 py-1 pr-3 pl-2.5 backdrop-blur-sm">
            <span className="font-display text-xs font-bold tracking-tight text-fg">
              {project.results[0].metric}
            </span>
            <span className="text-[10px] leading-none text-muted">
              {project.results[0].label}
            </span>
          </div>
        )} */}
      </div>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col py-5 px-2">
        {/* Title — overlay-link makes the whole card clickable */}
        <Heading className="mb-1.5 font-display text-xl font-semibold leading-snug tracking-tight text-fg">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
            aria-label={`Read the ${project.title} case study`}
          >
            <span className="link-sweep">{project.title}</span>
          </Link>
        </Heading>

        {/* Subtitle — shortDesc acts as the "Agency Framer Template" line */}
        <p className="line-clamp-1 text-sm text-muted">
          {project.shortDesc}
        </p>
      </div>

      {/* ── Coloured accent bar ──────────────────────────────────────────── */}
      {/* <div
        className={clsx('h-1 w-full transition-all duration-500 group-hover:h-1.5', accent)}
        aria-hidden="true"
      /> */}
    </article>
  );
}
