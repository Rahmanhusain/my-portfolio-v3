import type { Project } from '@/lib/data/projects';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** Deterministic per-card hue so the placeholder art varies but never
 *  re-randomises between server and client renders. */
const TINTS = [
  'from-[#dfe3f2] via-raised to-bg',
  'from-[#efe0ee] via-raised to-bg',
  'from-[#dbeee2] via-raised to-bg',
];

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      className={clsx(
        'project-card glow-card group border border-border rounded-2xl overflow-hidden bg-raised',
        'transition-all duration-500 hover:border-faint'
      )}
    >
      {/* Cover — gradient plate with the project index and a sweeping sheen */}
      <div className="relative aspect-[16/9] overflow-hidden bg-bg">
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
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <span className="absolute top-3 right-3 rounded-full border border-black/[0.08] bg-raised/85 px-2.5 py-1 text-[10px] font-medium text-strong backdrop-blur-sm">
          {project.year}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-fg leading-tight mb-3">
          {project.title}
        </h3>

        <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted transition-colors duration-200 group-hover:border-faint"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-fg group/link"
          aria-label={`View ${project.title} project`}
        >
          <span className="link-sweep">View Project</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          >
            <path
              d="M2 12L12 2M12 2H6M12 2V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
