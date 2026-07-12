'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import SectionHeading from '@/components/ui/SectionHeading';

interface WorkflowStep {
  title: string;
  description: string;
}

const steps: WorkflowStep[] = [
  {
    title: 'Discovery',
    description:
      'We start with a call to define your goals, constraints, and what success looks like — so the work is aimed at outcomes, not just features.',
  },
  {
    title: 'Design',
    description:
      'I design the interface and experience, share it for review, and iterate until it feels right before a single line of production code is written.',
  },
  {
    title: 'Build',
    description:
      'I develop with a clean, typed, well-documented codebase. You get progress updates and a working preview at each milestone.',
  },
  {
    title: 'Launch',
    description:
      'I handle deployment, performance, and accessibility checks, then ship your product to a reliable, fast hosting environment.',
  },
  {
    title: 'Support',
    description:
      'After launch I stay involved — the first 30 days include free fixes, and I remain available for improvements as you grow.',
  },
];

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const rows = gsap.utils.toArray<HTMLElement>('.workflow-row');
      const dots = gsap.utils.toArray<HTMLElement>('.workflow-dot');
      const line = lineRef.current;

      if (prefersReducedMotion) {
        gsap.set([rows, dots], { opacity: 1, y: 0, scale: 1 });
        if (line) gsap.set(line, { scaleY: 1 });
        return;
      }

      // The connecting line "draws" itself top-to-bottom as you scroll.
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              end: 'bottom 75%',
              scrub: 0.5,
            },
          }
        );
      }

      // Each node + its content reveal step-by-step as the line reaches them.
      rows.forEach((row, i) => {
        const dot = dots[i];
        const content = row.querySelector('.workflow-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 78%',
          },
        });

        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
          );
        }
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.2'
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="workflow-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading
          eyebrow="How I work"
          title="A clear process, start to finish."
          description="No black boxes. Every project moves through the same five connected stages — you always know where things stand."
        />

        {/* Node graph */}
        <ol className="relative mt-8">
          {/* Vertical rail (track) */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[15px] md:left-1/2 md:-translate-x-1/2 w-px bg-[#242424]"
          />
          {/* Animated draw-line over the rail */}
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[15px] md:left-1/2 md:-translate-x-1/2 w-px origin-top bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-[#8a8a8a]"
          />

          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`workflow-row relative flex items-start gap-6 pb-14 last:pb-0 md:gap-0 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Node dot on the rail */}
              <div className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                <span className="workflow-dot flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#0a0a0a] text-xs font-semibold text-[#fafafa] shadow-[0_0_0_6px_#0a0a0a]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content card, alternating sides on desktop */}
              <div
                className={`workflow-content flex-1 md:w-[calc(50%-2.5rem)] md:flex-none ${
                  i % 2 === 0
                    ? 'md:pr-12 md:text-right'
                    : 'md:pl-12 md:ml-auto'
                }`}
              >
                <div className="rounded-2xl border border-[#242424] bg-[#141414] p-6 transition-colors duration-300 hover:border-[#3a3a3a]">
                  <h3 className="font-display text-lg font-semibold text-[#fafafa] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8a8a8a] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
