'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import MagneticButton from '@/components/ui/MagneticButton';
import { projects } from '@/lib/data/projects';

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollReveal(sectionRef, {
    targets: '.project-card',
    trigger: null, // will use first .project-card
    y: 40,
    scale: 0.97,
    stagger: 0.15,
    duration: 0.8,
    start: 'top 82%',
  });

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects"
            description="A few things I've built recently."
          />
          <MagneticButton
            as="a"
            href="https://github.com/rahman"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-start md:self-auto mb-2"
          >
            All on GitHub ↗
          </MagneticButton>
        </div>

        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
