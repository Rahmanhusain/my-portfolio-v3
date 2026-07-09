import Link from 'next/link';
import type { Project } from '@/lib/data/projects';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      className={clsx(
        'project-card group border border-[#242424] rounded-2xl overflow-hidden bg-[#141414]',
        'transition-all duration-500 hover:border-[#3a3a3a]'
      )}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[16/9] bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-[#242424]">
          <span className="font-display text-8xl font-bold select-none opacity-30">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#fafafa]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-lg font-semibold text-[#fafafa] leading-tight group-hover:text-[#fafafa] transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-[#8a8a8a] shrink-0 mt-0.5">{project.year}</span>
        </div>

        <p className="text-sm text-[#8a8a8a] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border border-[#242424] text-[#8a8a8a]"
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
          className="inline-flex items-center gap-2 text-sm text-[#fafafa] group/link"
          aria-label={`View ${project.title} project`}
        >
          View Project
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
