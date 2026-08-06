'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
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
    icon: <SearchIcon className="h-5 w-5" strokeWidth="1.5" />,
  },
  {
    title: 'Design',
    description:
      'I design the interface and experience, share it for review, and iterate until it feels right before a single line of production code is written.',
    icon: <PenIcon className="h-4 w-4" strokeWidth="1.5" />,
  },
  {
    title: 'Build',
    description:
      'I develop with a clean, typed, well-documented codebase. You get progress updates and a working preview at each milestone.',
    icon: <CodeIcon className="h-5 w-5" strokeWidth="1.5" />,
  },
  {
    title: 'Launch',
    description:
      'I handle deployment, performance, and accessibility checks, then ship your product to a reliable, fast hosting environment.',
    icon: <RocketIcon className="h-5 w-5" strokeWidth="1.5" />,
  },
  {
    title: 'Support',
    description:
      'After launch I stay involved — the first 30 days include free fixes, and I remain available for improvements as you grow.',
    icon: <LifebuoyIcon className="h-5 w-5" strokeWidth="1.5" />,
  },
];

/**
 * Resting halo on every node: a ring painted in the page colour, which is what
 * punches the gap in the rail where it passes behind a node. Written with the
 * token so a re-theme can't leave a pale disc floating on a dark page.
 */
const REST_SHADOW = '0 0 0 6px var(--color-bg)';

/** Reads a theme token as a real colour value GSAP can interpolate. `var(…)`
 *  strings can't be tweened, so the palette is resolved once, at run time,
 *  rather than duplicated as hex literals in this file. */
function readTokens() {
  const root = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    root.getPropertyValue(name).trim() || fallback;

  const fg = token('--color-fg', '#17150f');

  /** fg at a given alpha, for the shadow under a lit node. */
  const fgAlpha = (alpha: number) => {
    const hex = fg.replace('#', '');
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    if (full.length !== 6) return fg; // non-hex token — drop the alpha, keep it valid
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return {
    bg: token('--color-bg', '#f5f2ec'),
    fg,
    faint: token('--color-faint', '#c9c2b3'),
    fgAlpha,
  };
}

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const rows = gsap.utils.toArray<HTMLElement>('.workflow-row');
      const dots = rows.map((row) => row.querySelector('.workflow-dot'));

      const palette = readTokens();
      const restShadow = `0 0 0 6px ${palette.bg}`;
      const activeShadow = `0 0 0 6px ${palette.bg}, 0 8px 22px -8px ${palette.fgAlpha(0.55)}`;

      /** Fills or empties a node. Guarded by a data flag so a scrubbed scroll
       *  doesn't restart the same tween on every frame. */
      const setDotActive = (
        dot: Element | null | undefined,
        active: boolean,
        instant = false
      ) => {
        if (!dot) return;
        const node = dot as HTMLElement;
        const state = active ? '1' : '0';
        if (node.dataset.active === state) return;
        node.dataset.active = state;

        gsap.to(node, {
          backgroundColor: active ? palette.fg : palette.bg,
          borderColor: active ? palette.fg : palette.faint,
          color: active ? palette.bg : palette.fg,
          boxShadow: active ? activeShadow : restShadow,
          duration: instant ? 0 : 0.35,
          ease: 'power2.out',
        });
      };

      if (prefersReducedMotion) {
        rows.forEach((row, i) => {
          const connector = row.querySelector('.workflow-connector');
          const content = row.querySelector('.workflow-content');
          const segment = row.querySelector('.workflow-segment');
          gsap.set([dots[i], content], { opacity: 1, y: 0, scale: 1 });
          if (connector) gsap.set(connector, { scaleX: 1, opacity: 1 });
          if (segment) gsap.set(segment, { scaleY: 1 });
          // The whole path reads as complete rather than half-lit.
          setDotActive(dots[i], true, true);
        });
        return;
      }

      // Reveal each node, its branch, and its card as the row enters view.
      rows.forEach((row, i) => {
        const connector = row.querySelector('.workflow-connector');
        const content = row.querySelector('.workflow-content');

        gsap.set(dots[i], { scale: 0, opacity: 0 });
        gsap.set(connector, { scaleX: 0, opacity: 0 });
        gsap.set(content, { opacity: 0, y: 28 });

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } })
          .to(dots[i], {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2.2)',
          })
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

      // Draw each segment node -> node on the way down, undraw on the way up,
      // lighting the node at each end as the line arrives.
      //
      // The trigger is the segment itself, and the segment spans exactly one
      // node centre to the next — so scroll progress and the drawn length are
      // the same number, and a node can't light before its line reaches it.
      rows.forEach((row, i) => {
        const segment = row.querySelector('.workflow-segment');
        if (!segment) return; // the last node has no outgoing segment

        // Held in an object rather than referenced directly: ScrollTrigger can
        // render a scrubbed tween while it is still being constructed, and a
        // `const` self-reference would throw before it is assigned.
        const drawing: { tween?: ReturnType<typeof gsap.fromTo> } = {};

        drawing.tween = gsap.fromTo(
          segment,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: segment,
              start: 'top 62%',
              end: 'bottom 62%',
              scrub: 0.4,
            },
            // Driven off the tween, not the trigger, so the scrub's easing
            // lag is shared by the line and the node it feeds.
            onUpdate: () => {
              const progress = drawing.tween?.progress() ?? 0;
              setDotActive(dots[i], progress > 0.001);
              setDotActive(dots[i + 1], progress > 0.995);
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="py-20 sm:py-24 md:py-40 border-t border-border"
      aria-labelledby="workflow-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          id="workflow-heading"
          eyebrow="How I work"
          title="A clear process, start to finish."
          description="No black boxes. Every project moves through the same five connected stages — you always know where things stand."
        />

        {/* Node graph — each node is joined to the next by its own segment.
            Two custom properties keep the geometry honest:
              --wf-node  distance from the top of a card to its node centre
              --wf-gap   vertical space between cards
            A segment is `top: --wf-node` and `100% + --wf-gap` tall, which lands
            it exactly on the next node whatever height the two cards happen to
            be. Change either value here and the rail follows; hardcode one and
            the line starts overshooting on long cards. */}
        <ol className="relative mt-10 max-w-4xl mx-auto [--wf-gap:3rem] [--wf-node:2.5rem] md:[--wf-gap:4rem]">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0; // desktop: even = left card, odd = right card
            const isLast = i === steps.length - 1;
            return (
              <li
                key={step.title}
                className="workflow-row relative pb-[var(--wf-gap)] last:pb-0"
              >
                {/* Wrapper sized to the card, so the rail measures card to card */}
                <div className="relative pl-16 md:pl-0">
                  {/* Segment: line from THIS node down to the NEXT node */}
                  {!isLast && (
                    <>
                      {/* Unlit track */}
                      <span
                        aria-hidden="true"
                        style={{
                          top: 'var(--wf-node)',
                          height: 'calc(100% + var(--wf-gap))',
                        }}
                        className="absolute w-px -translate-x-1/2 left-5 md:left-1/2 bg-border"
                      />
                      {/* Fill that grows toward the next node on scroll */}
                      <span
                        aria-hidden="true"
                        style={{
                          top: 'var(--wf-node)',
                          height: 'calc(100% + var(--wf-gap))',
                        }}
                        className="workflow-segment absolute w-px -translate-x-1/2 left-5 md:left-1/2 origin-top bg-gradient-to-b from-fg to-muted"
                      />
                    </>
                  )}

                  {/* Node — sits on the card's title line, not its centre, which
                      is what makes the segment maths above exact */}
                  <span
                    className="workflow-dot absolute z-10 top-[var(--wf-node)] left-5 md:left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-faint bg-bg text-fg"
                    style={{ boxShadow: REST_SHADOW }}
                  >
                    {step.icon}
                  </span>

                  {/* Branch from the rail to the card — spans the gap exactly,
                      starting at the node's edge rather than under it */}
                  <span
                    aria-hidden="true"
                    className={[
                      'workflow-connector absolute top-[var(--wf-node)] -translate-y-1/2 h-px w-6 bg-gradient-to-r from-faint to-transparent',
                      // mobile: node edge -> card
                      'left-10 origin-left',
                      // desktop: centre rail -> whichever side the card is on
                      isLeft
                        ? 'md:left-auto md:right-1/2 md:mr-5 md:origin-right md:bg-gradient-to-l'
                        : 'md:left-1/2 md:ml-5 md:origin-left md:bg-gradient-to-r',
                    ].join(' ')}
                  />

                  {/* Content card, alternating sides on desktop */}
                  <div
                    className={[
                      'workflow-content',
                      'md:w-[calc(50%-2.75rem)]',
                      isLeft ? 'md:mr-auto' : 'md:ml-auto',
                    ].join(' ')}
                  >
                    <div className="bloom-card group relative rounded-2xl border border-border bg-gradient-to-b from-raised to-surface p-6 transition-colors duration-300 hover:border-faint">
                      {/* Ghost step number, tucked in the corner the text runs
                          away from. Decorative only — `faint` is the token for
                          exactly this and never carries meaning. */}
                      <span
                        aria-hidden="true"
                        className={[
                          'pointer-events-none absolute select-none font-display text-5xl font-bold leading-none text-faint opacity-45 transition-opacity duration-300 group-hover:opacity-70',
                          isLeft
                            ? 'top-3 right-4 md:left-4 md:right-auto'
                            : 'top-3 right-4',
                        ].join(' ')}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className={`relative ${isLeft ? 'md:text-right' : ''}`}>
                        <h3 className="font-display text-lg font-semibold text-fg mb-2 tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">
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
