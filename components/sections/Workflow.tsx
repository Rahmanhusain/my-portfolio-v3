'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { CodeIcon, LifebuoyIcon, PenIcon, RocketIcon, SearchIcon } from '../icons';

interface WorkflowStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Shown as a pill on the card — sets expectations before the call does. */
  duration: string;
  /** Revealed when the step is expanded. Concrete things the client receives,
   *  not restatements of the description. */
  deliverables: string[];
}

/* Durations and deliverables have to match what the FAQs and /services already
   promise — a visitor who reads both and finds them disagreeing trusts
   neither. Keep them honest and keep them in step. */
const steps: WorkflowStep[] = [
  {
    title: 'Discovery',
    description:
      'We start with a call to define your goals, constraints, and what success looks like — so the work is aimed at outcomes, not just features.',
    icon: <SearchIcon className="h-5 w-5" strokeWidth="1.5" />,
    duration: 'A 30-minute call',
    deliverables: [
      'A written scope and a fixed price, before any work starts',
      'Agreed goals and how we will measure them',
      'An honest answer on whether you actually need me',
    ],
  },
  {
    title: 'Design',
    description:
      'I design the interface and experience, share it for review, and iterate until it feels right before a single line of production code is written.',
    icon: <PenIcon className="h-4 w-4" strokeWidth="1.5" />,
    duration: '3–5 days',
    deliverables: [
      'Designs you can click through, not static pictures',
      'Mobile and desktop layouts for every screen',
      'A review round before anything is built',
    ],
  },
  {
    title: 'Build',
    description:
      'I develop with a clean, typed, well-documented codebase. You get progress updates and a working preview at each milestone.',
    icon: <CodeIcon className="h-5 w-5" strokeWidth="1.5" />,
    duration: '1–6 weeks',
    deliverables: [
      'A working preview link updated at every milestone',
      'Typed, documented code in your own Git repository',
      'A progress update you do not have to chase',
    ],
  },
  {
    title: 'Launch',
    description:
      'I handle deployment, performance, and accessibility checks, then ship your product to a reliable, fast hosting environment.',
    icon: <RocketIcon className="h-5 w-5" strokeWidth="1.5" />,
    duration: '1–2 days',
    deliverables: [
      'Deployment, domain, and SSL configured end to end',
      'Performance, accessibility, and SEO checks passed',
      'Analytics and Search Console wired up',
    ],
  },
  {
    title: 'Support',
    description:
      'After launch I stay involved — the first 30 days include free fixes, and I remain available for improvements as you grow.',
    icon: <LifebuoyIcon className="h-5 w-5" strokeWidth="1.5" />,
    duration: '30 days included',
    deliverables: [
      'Free bug fixes on everything I built, for 30 days',
      'Handover docs for deployment and environments',
      'Quoted, scoped improvements whenever you need them',
    ],
  },
];

/** Small check mark for the deliverables list. Decorative — the list item text
 *  carries the meaning. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className="mt-[0.3rem] h-3 w-3 shrink-0 text-fg"
      fill="none"
    >
      <path
        d="M2 7.5l3.2 3.2L12 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    muted: token('--color-muted', '#6b6459'),
    faint: token('--color-faint', '#c9c2b3'),
    fgAlpha,
  };
}

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);

  /** Which step is expanded, or `null`. One at a time — five open cards is a
   *  wall of text and defeats the point of the timeline. */
  const [openStep, setOpenStep] = useState<number | null>(null);
  const headerIds = useId();
  const stepButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const hasToggled = useRef(false);

  /*
   * Expanding a card changes its height, which moves every node below it.
   * The rail's ScrollTrigger start/end positions were measured at creation, so
   * without a refresh the line would keep drawing to where the nodes *used* to
   * be and drift further out of true with each toggle.
   *
   * The delay lets the grid-rows transition finish first — refreshing mid-
   * animation just measures another wrong height.
   */
  useEffect(() => {
    if (!hasToggled.current) {
      // Skip the mount pass; the GSAP setup below does its own refresh.
      hasToggled.current = true;
      return;
    }
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 360);
    return () => window.clearTimeout(timer);
  }, [openStep]);

  /** Roving arrow-key navigation between steps, the standard accordion
   *  pattern — Tab still moves out of the group entirely. */
  const onStepKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = steps.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = index === last ? 0 : index + 1;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = index === 0 ? last : index - 1;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = last;
    }

    if (next === null) return;
    event.preventDefault();
    stepButtons.current[next]?.focus();
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const rows = gsap.utils.toArray<HTMLElement>('.workflow-row');
      const dots = rows.map((row) => row.querySelector('.w'));

      const palette = readTokens();

      /*
       * A reached node *sharpens*; it does not invert.
       *
       * This used to fill the disc with `--color-fg`, which on a warm-paper
       * page means a near-black blob — five of them marching down a soft cream
       * layout, each one heavier than any real content around it. The step
       * icon also had to flip to the page colour to stay legible, so the glyph
       * you were meant to read became a knockout.
       *
       * Instead the disc stays paper the whole time and the *ring* does the
       * work: a hairline in `faint` when unreached, doubled to a crisp
       * `fg` edge via an inset shadow when the rail arrives. No layout shift
       * (an inset shadow costs no box, unlike a wider border), no heavy fill,
       * and the icon keeps its own colour throughout — it only steps up from
       * `muted` to `fg`.
       */
      const restShadow = `0 0 0 6px ${palette.bg}`;
      const activeShadow = [
        // Ring in the page colour — this is what punches the gap in the rail
        // where it passes behind a node.
        `0 0 0 6px ${palette.bg}`,
        // Reads as a second border weight, without occupying a box.
        `inset 0 0 0 1px ${palette.fg}`,
        // Barely-there lift. The old 0.55 alpha read as a hard drop shadow.
        `0 6px 16px -8px ${palette.fgAlpha(0.2)}`,
      ].join(', ');

      /** Lights or dims a node. Guarded by a data flag so a scrubbed scroll
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
          // `backgroundColor` is deliberately absent: the disc is `bg-bg` in
          // CSS and stays there, so there is nothing to fill or unfill.
          // borderColor: active ? palette.fg : palette.faint,
          color: active ? palette.fg : palette.muted,
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
            const isOpen = openStep === i;
            return (
              <li
                key={step.title}
                className="workflow-row relative pb-[var(--wf-gap)] last:pb-0"
              >
                {/* Wrapper sized to the card, so the rail measures card to card.
                    `group/row` spans the node *and* the card, so pointing at
                    either one lights the other — the two read as one control. */}
                <div className="group/row relative pl-16 md:pl-0">
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
                    // `text-muted`, not `text-fg`: it is the resting state GSAP
                    // tweens away from, so starting on `fg` would flash a dark
                    // glyph for a frame before the first scroll update.
                    className="workflow-dot absolute z-10 top-[var(--wf-node)] left-5 md:left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-faint bg-bg text-muted"
                    style={{ boxShadow: REST_SHADOW }}
                  >
                    {step.icon}
                    {/* Halo on hover/expand. A *child* of the node on purpose:
                        GSAP owns the node's own transform, background, border
                        and box-shadow for the scroll choreography, so animating
                        any of those from CSS here would fight it. This element
                        touches none of them. */}
                    <span
                      aria-hidden="true"
                      className={[
                        'pointer-events-none absolute inset-0 rounded-full border border-fg',
                        'transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none',
                        'group-hover/row:scale-150 group-hover/row:opacity-25',
                        'group-focus-within/row:scale-150 group-focus-within/row:opacity-25',
                        isOpen ? 'scale-150 opacity-25' : 'scale-100 opacity-0',
                      ].join(' ')}
                    />
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
                    <div
                      className={[
                        'bloom-card group relative rounded-2xl border bg-gradient-to-b from-raised to-surface p-6',
                        'transition-[border-color,transform] duration-300 motion-reduce:transition-none',
                        // Lifts on hover *or* keyboard focus — a keyboard user
                        // gets the same affordance a mouse user does.
                        'hover:-translate-y-0.5 focus-within:-translate-y-0.5',
                        isOpen ? 'border-faint' : 'border-border hover:border-faint',
                      ].join(' ')}
                    >
                      {/* Ghost step number, tucked in the corner the text runs
                          away from. Decorative only — `faint` is the token for
                          exactly this and never carries meaning. */}
                      {/* <span
                        aria-hidden="true"
                        className={[
                          'pointer-events-none absolute select-none font-display text-5xl font-bold leading-none text-faint opacity-45 transition-opacity duration-300 group-hover:opacity-70',
                          isLeft
                            ? 'top-3 right-4 md:left-4 md:right-auto'
                            : 'top-3 right-4',
                        ].join(' ')}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span> */}

                      <div className={`relative ${isLeft ? 'md:text-right' : ''}`}>
                        {/* The heading *wraps* the button rather than sitting
                            beside it — that is the pattern screen readers
                            announce as a real expandable section, and it keeps
                            the document outline intact. */}
                        <h3 className="font-display text-lg font-semibold tracking-tight">
                          <button
                            type="button"
                            ref={(el) => {
                              stepButtons.current[i] = el;
                            }}
                            id={`${headerIds}-trigger-${i}`}
                            aria-expanded={isOpen}
                            aria-controls={`${headerIds}-panel-${i}`}
                            onClick={() =>
                              setOpenStep((current) => (current === i ? null : i))
                            }
                            onKeyDown={(event) => onStepKeyDown(event, i)}
                            className={[
                              'flex w-full cursor-pointer items-center gap-3 text-fg',
                              // Mirrored so the chevron always sits on the edge
                              // nearest the rail, pointing back at its node.
                              isLeft ? 'md:flex-row-reverse' : '',
                            ].join(' ')}
                          >
                            <span
                              className={`flex-1 text-left ${isLeft ? 'md:text-right' : ''}`}
                            >
                              {step.title}
                            </span>

                            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-subtle">
                              {step.duration}
                            </span>

                            <span
                              aria-hidden="true"
                              className={[
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted',
                                'transition-transform duration-300 motion-reduce:transition-none',
                                isOpen ? 'rotate-45' : 'rotate-0',
                              ].join(' ')}
                            >
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M6 1.5v9M1.5 6h9"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          </button>
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {step.description}
                        </p>

                        {/* Height animates via `grid-template-rows: 0fr → 1fr`,
                            which needs no fixed max-height guess and so cannot
                            clip a long list or leave dead space under a short
                            one. The inner element owns the `overflow-hidden`. */}
                        <div
                          id={`${headerIds}-panel-${i}`}
                          role="region"
                          aria-labelledby={`${headerIds}-trigger-${i}`}
                          className={[
                            'grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none',
                            isOpen
                              ? 'grid-rows-[1fr] opacity-100'
                              : 'grid-rows-[0fr] opacity-0',
                          ].join(' ')}
                        >
                          <div className="overflow-hidden">
                            <ul
                              className={[
                                'mt-4 space-y-2 border-t border-border pt-4',
                                // Ticks lead the text, so on a right-aligned
                                // card the row order flips to keep them on the
                                // outside edge.
                                isLeft ? 'md:[&>li]:flex-row-reverse' : '',
                              ].join(' ')}
                            >
                              {step.deliverables.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2.5 text-sm leading-relaxed text-strong"
                                >
                                  <CheckIcon />
                                  <span className="flex-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
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
