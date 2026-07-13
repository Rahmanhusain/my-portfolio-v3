'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { CodeIcon, LifebuoyIcon, PenIcon, RocketIcon, SearchIcon } from '../icons';

interface WorkflowStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WorkflowStep[] = [
  {
    title: 'Discovery',
    description:
      'We start with a call to define your goals, constraints, and what success looks like — so the work is aimed at outcomes, not just features.',
    icon: (
     <SearchIcon className='w-5 h-5' strokeWidth='1.5' />
    ),
  },
  {
    title: 'Design',
    description:
      'I design the interface and experience, share it for review, and iterate until it feels right before a single line of production code is written.',
    icon: (
    <PenIcon className='w-4 h-4' strokeWidth='1.5'/>
    ),
  },
  {
    title: 'Build',
    description:
      'I develop with a clean, typed, well-documented codebase. You get progress updates and a working preview at each milestone.',
    icon: (
      <CodeIcon className='w-5 h-5' strokeWidth='1.5'/>
    ),
  },
  {
    title: 'Launch',
    description:
      'I handle deployment, performance, and accessibility checks, then ship your product to a reliable, fast hosting environment.',
    icon: (
      <RocketIcon className='w-5 h-5' strokeWidth='1.5'/>
    ),
  },
  {
    title: 'Support',
    description:
      'After launch I stay involved — the first 30 days include free fixes, and I remain available for improvements as you grow.',
    icon: (
     <LifebuoyIcon className='w-5 h-5' strokeWidth='1.5'/>
    ),
  },
];

const ACTIVE_GLOW = '0 0 0 6px #0a0a0a, 0 0 18px 2px rgba(250,250,250,0.35)';
const REST_SHADOW = '0 0 0 6px #0a0a0a';

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const rows = gsap.utils.toArray<HTMLElement>('.workflow-row');

      // Activate / deactivate a node dot (filled + glow when reached).
      // const setDotActive = (dot: Element | null, active: boolean) => {
      //   if (!dot) return;
      //   const state = active ? '1' : '0';
      //   if ((dot as HTMLElement).dataset.active === state) return; // no-op if unchanged
      //   (dot as HTMLElement).dataset.active = state;
      //   gsap.to(dot, {
      //     backgroundColor: active ? '#EEF2FF' : '#0a0a0a',
      //     borderColor: active ? '#fafafa' : '#3a3a3a',
      //     color: active ? '#0a0a0a' : '#fafafa',
      //     boxShadow: active ? ACTIVE_GLOW : REST_SHADOW,  
      //     duration: 0.3,
      //     ease: 'power2.out',
      //   });
      // };

      if (prefersReducedMotion) {
        rows.forEach((row) => {
          const dot = row.querySelector('.workflow-dot');
          const connector = row.querySelector('.workflow-connector');
          const content = row.querySelector('.workflow-content');
          const segment = row.querySelector('.workflow-segment');
          gsap.set([dot, content], { opacity: 1, y: 0, scale: 1 });
          if (connector) gsap.set(connector, { scaleX: 1, opacity: 1 });
          if (segment) gsap.set(segment, { scaleY: 1 });
          if (dot)
            gsap.set(dot, {
              backgroundColor: '#fafafa',
              borderColor: '#fafafa',
              color: '#0a0a0a',
            });
        });
        return;
      }

      // Reveal each node, its branch, and its card as it enters view.
      rows.forEach((row) => {
        const dot = row.querySelector('.workflow-dot');
        const connector = row.querySelector('.workflow-connector');
        const content = row.querySelector('.workflow-content');

        gsap.set(dot, { scale: 0, opacity: 0 });
        gsap.set(connector, { scaleX: 0, opacity: 0 });
        gsap.set(content, { opacity: 0, y: 28 });

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } })
          .to(dot, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)' })
          .to(
            connector,
            { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
            '-=0.15'
          )
          .to(
            content,
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.35'
          );
      });

      // Each segment fills node -> node on scroll down, unfills on scroll up.
      // As a segment completes, the node it reaches lights up.
      rows.forEach((row, i) => {
        const segment = row.querySelector('.workflow-segment');
        if (!segment) return; // last node has no outgoing segment

        const fromDot = row.querySelector('.workflow-dot');
        const toDot = rows[i + 1]?.querySelector('.workflow-dot');

        gsap.set(segment, { scaleY: 0 });

        gsap.fromTo(
          segment,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 58%',
              end: 'bottom 58%',
              scrub: 0.5,
              // light the origin node once the segment starts drawing
              // onEnter: () => setDotActive(fromDot, true),
              // onLeaveBack: () => setDotActive(fromDot, false),
              // light the destination node once the segment is essentially full
              // onUpdate: (self) => {
              //   setDotActive(toDot ?? null, self.progress > 0.9);
              // },
            },
          }
        );
      });

      // First node lights up as soon as its row is reached.
      const firstDot = rows[0]?.querySelector('.workflow-dot');
      if (firstDot) {
        ScrollTrigger.create({
          trigger: rows[0],
          start: 'top 70%',
          // onEnter: () => setDotActive(firstDot, true),
          // onLeaveBack: () => setDotActive(firstDot, false),
        });
      }
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

        {/* Node graph — each node is joined to the next by its own segment */}
        <ol className="relative mt-10">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0; // desktop: even = left card, odd = right card
            const isLast = i === steps.length - 1;
            return (
              <li
                key={step.title}
                className="workflow-row relative pb-12 last:pb-0"
              >
                {/* Wrapper sized to the card so the rail nodes centre on the card */}
                <div className="relative pl-16 md:pl-0">
                  {/* Segment: line from THIS node down to the NEXT node */}
                  {!isLast && (
                    <>
                      {/* faint track */}
                      <span
                        aria-hidden="true"
                        style={{ top: '50%', height: 'calc(100% + 3rem)' }}
                        className="absolute w-px -translate-x-1/2 left-5 md:left-1/2 bg-[#242424]"
                      />
                      {/* white fill that grows toward the next node on scroll */}
                      <span
                        aria-hidden="true"
                        style={{ top: '50%', height: 'calc(100% + 3rem)' }}
                        className="workflow-segment absolute w-px -translate-x-1/2 left-5 md:left-1/2 origin-top bg-gradient-to-b from-[#fafafa] to-[#cfcfcf]"
                      />
                    </>
                  )}

                  {/* Node dot — centred vertically on the card */}
                  <span
                    className="workflow-dot absolute z-10 top-1/2 left-5 md:left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#0a0a0a] text-[#fafafa]"
                    style={{ boxShadow: REST_SHADOW }}
                  >
                    {step.icon}
                  </span>

                  {/* Horizontal branch connecting the rail to the card */}
                  <span
                    aria-hidden="true"
                    className={[
                      'workflow-connector absolute top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-[#3a3a3a] to-transparent',
                      // mobile: from dot toward the card on the right
                      'left-10 w-6 origin-left',
                      // desktop: point from center rail toward whichever side the card is
                      isLeft
                        ? 'md:left-auto md:right-1/2 md:w-10 md:origin-right md:bg-gradient-to-l'
                        : 'md:left-1/2 md:w-10 md:origin-left md:bg-gradient-to-r',
                    ].join(' ')}
                  />

                  {/* Content card, alternating sides on desktop */}
                  <div
                    className={[
                      'workflow-content',
                      'md:w-[calc(50%-2.75rem)]',
                      isLeft ? 'md:mr-auto md:pr-2' : 'md:ml-auto md:pl-2',
                    ].join(' ')}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-[#242424] bg-gradient-to-b from-[#191919] to-[#101010] p-6 transition-colors duration-300 hover:border-[#3a3a3a]">
                      {/* Large low-opacity step number, tucked in the corner opposite the text */}
                      <span
                        aria-hidden="true"
                        style={{ color: 'rgba(250,250,250,0.07)' }}
                        className={[
                          'pointer-events-none absolute select-none font-display text-4xl font-bold leading-none',
                          isLeft ? 'top-2 right-3 md:left-2 md:right-auto' : 'top-2 right-3',
                        ].join(' ')}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="relative">
                        <h3
                          className={`font-display text-lg font-semibold text-[#fafafa] mb-2 tracking-tight ${
                            isLeft ? 'md:text-right' : ''
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm text-[#8a8a8a] leading-relaxed ${
                            isLeft ? 'md:text-right' : ''
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
