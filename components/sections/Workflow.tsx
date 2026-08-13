'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { CodeIcon, LifebuoyIcon, PenIcon, RocketIcon, SearchIcon } from '../icons';

interface WorkflowStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  deliverables: string[];
  tagline: string;
}

const steps: WorkflowStep[] = [
  {
    title: 'Discovery',
    tagline: 'Define the goal',
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
    tagline: 'Shape the experience',
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
    tagline: 'Write clean code',
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
    tagline: 'Ship with confidence',
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
    tagline: 'Stay and improve',
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

/** Auto-advance interval (ms). */
const AUTO_MS = 3500;
/** How long a manual interaction suppresses the timer (ms). */
const PAUSE_MS = 6000;

function CheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 14 14" className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-fg" fill="none">
      <path d="M2 7.5l3.2 3.2L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Workflow() {
  const sectionRef  = useRef<HTMLElement>(null);
  const fillRef     = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const tabRefs     = useRef<(HTMLButtonElement | null)[]>([]);

  /* Swipe tracking */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const [active, setActive]   = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused]   = useState(false);

  /* ── timer refs ─────────────────────────────────────────────────────────── */
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── helpers ────────────────────────────────────────────────────────────── */
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, AUTO_MS);
  }, []);

  const pauseInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      setPaused(false);
      startInterval();
    }, PAUSE_MS);
  }, [startInterval]);

  const goTo = useCallback((i: number, fromUser = false) => {
    if (fromUser) pauseInterval();
    setActive(i);
  }, [pauseInterval]);

  /* ── start timer when section becomes visible ───────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pauseTimer.current)  clearTimeout(pauseTimer.current);
    };
  }, [visible, startInterval]);

  /* ── fill bar ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!fillRef.current) return;
    const pct = (active / (steps.length - 1)) * 100;
    gsap.to(fillRef.current, { width: `${pct}%`, duration: 0.55, ease: 'power2.inOut' });
  }, [active]);

  /* ── panel slide-in ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!panelRef.current || !visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
    );
  }, [active, visible]);

  /* ── entrance animations ────────────────────────────────────────────────── */
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: reduced ? 0 : 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
          onEnter: () => setVisible(true),
        },
      },
    );

    if (!reduced) {
      gsap.fromTo(
        tabRefs.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          /* Drop the inline styles afterwards so the resting state is owned by
             the class list, not by whatever GSAP happened to leave behind. */
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        },
      );
    }
  }, { scope: sectionRef });

  /* ── keyboard navigation ────────────────────────────────────────────────── */
  const onTabKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = steps.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End')  next = last;
    if (next === null) return;
    e.preventDefault();
    goTo(next, true);
    tabRefs.current[next]?.focus();
  };

  /* ── swipe handlers ─────────────────────────────────────────────────────── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    /* Only register as a horizontal swipe if it's the dominant axis */
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) {
      /* swipe left → next */
      goTo((active + 1) % steps.length, true);
    } else {
      /* swipe right → prev */
      goTo((active - 1 + steps.length) % steps.length, true);
    }
  };

  const step = steps[active];

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
          description="No black boxes. Every project moves through the same five stages — you always know where things stand."
        />

        {/* ── Tab strip + rail ──────────────────────────────────────────── */}
        <div
          className="relative mt-10 md:mt-14"
          role="tablist"
          aria-label="Workflow steps"
        >
          {/*
            The rail must terminate exactly on the first and last circle centres.
            With five equal, gapless columns those centres sit at 10% and 90% of
            this container, and each circle centre is py-1 (0.25rem) + half of
            h-11 (1.375rem) = 1.625rem from the top. The fill is a *child* of the
            rail so its percentage width is measured against the rail's span, not
            the full strip — that is what keeps it from overshooting either end.
          */}
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-[1.625rem] -translate-y-1/2 h-0.5 rounded-full bg-border"
          >
            <div
              ref={fillRef}
              className="h-full rounded-full bg-gradient-to-r from-fg to-muted"
              style={{ width: '0%' }}
            />
          </div>

          <div className="grid grid-cols-5 relative z-10">
            {steps.map((s, i) => {
              const isActive = active === i;
              const isPast   = i < active;
              return (
                <button
                  key={s.title}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`wf-panel-${i}`}
                  id={`wf-tab-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(i, true)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="group flex flex-col items-center gap-2 px-1 py-1 outline-none"
                >
                  <span
                    className={[
                      'relative flex h-11 w-11 items-center justify-center rounded-full border',
                      'transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-fg group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg',
                      isActive
                        ? 'bg-fg border-fg text-bg ring-4 ring-fg/10 shadow-[0_6px_18px_-8px_rgba(23,21,15,0.45)]'
                        : isPast
                          ? 'bg-bg border-fg text-fg'
                          : 'bg-bg border-border text-subtle group-hover:border-faint group-hover:text-fg',
                    ].join(' ')}
                  >
                    {isPast && !isActive ? (
                      <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none">
                        <path d="M2 7.5l3.2 3.2L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </span>

                  <span className="block text-center">
                    <span className={['block text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest leading-none transition-colors duration-200', isActive ? 'text-fg' : 'text-muted'].join(' ')}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={['mt-1 hidden sm:block text-xs font-medium leading-snug transition-colors duration-200', isActive ? 'text-fg' : 'text-muted'].join(' ')}>
                      {s.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel (swipeable) ──────────────────────────────────── */}
        <div
          ref={panelRef}
          id={`wf-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`wf-tab-${active}`}
          className="mt-8 md:mt-10 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="bloom-card relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-raised to-surface">
            {/* Ghost number */}
            <span
              aria-hidden
              className="pointer-events-none select-none absolute top-4 right-6 font-display text-[5rem] sm:text-[7rem] font-bold leading-none text-faint opacity-25"
            >
              {String(active + 1).padStart(2, '0')}
            </span>

            <div className="relative grid md:grid-cols-[1fr_1.1fr]">
              {/* Left */}
              <div className="p-6 sm:p-8 md:p-10 md:border-r border-border flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-fg">
                    {step.icon}
                  </span>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted mb-1">
                      Step {String(active + 1).padStart(2, '0')} of {steps.length}
                    </p>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-fg leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-subtle">{step.tagline}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted max-w-md">
                  {step.description}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-subtle">
                    <svg aria-hidden viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M7 4.5V7l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {step.duration}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="p-6 pt-0 sm:p-8 sm:pt-0 md:p-10 md:pt-10 flex flex-col justify-center">
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted mb-5">
                  What you get
                </p>
                <ul className="space-y-4">
                  {step.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-strong">
                      <span className="mt-[0.2rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-bg">
                        <CheckIcon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 sm:px-8 md:px-10 py-4 flex items-center gap-3 sm:gap-4">
              {/* Countdown bar — drains from 100→0 between advances */}
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div
                  key={`${active}-${paused}`}          /* re-mount on every step or pause toggle */
                  className={[
                    'h-full bg-gradient-to-r from-fg to-muted rounded-full',
                    paused
                      ? 'w-full'                          /* frozen full while paused */
                      : 'animate-[countdown_3.5s_linear_forwards]',
                  ].join(' ')}
                />
              </div>

              <span className="shrink-0 text-[11px] font-medium tabular-nums text-subtle">
                {active + 1} / {steps.length}
              </span>

              {/* Swipe hint */}
              <span
                className="hidden md:flex items-center gap-1.5 text-[11px] text-faint"
                aria-hidden
              >
                <svg viewBox="0 0 16 10" className="h-3 w-4" fill="none">
                  <path d="M1 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Swipe
              </span>

              {/* Pause / resume */}
              <button
                type="button"
                onClick={() => {
                  if (paused) {
                    setPaused(false);
                    startInterval();
                  } else {
                    pauseInterval();
                  }
                }}
                aria-label={paused ? 'Resume auto-advance' : 'Pause auto-advance'}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:border-faint hover:text-fg transition-all duration-200"
              >
                {paused ? (
                  /* Play icon */
                  <svg viewBox="0 0 10 10" className="h-3 w-3 translate-x-px" fill="currentColor">
                    <path d="M2 1.5l7 3.5-7 3.5V1.5z" />
                  </svg>
                ) : (
                  /* Pause icon */
                  <svg viewBox="0 0 10 10" className="h-3 w-3" fill="currentColor">
                    <rect x="2" y="1.5" width="2.2" height="7" rx="0.5" />
                    <rect x="5.8" y="1.5" width="2.2" height="7" rx="0.5" />
                  </svg>
                )}
              </button>

              {/* Prev / Next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo((active - 1 + steps.length) % steps.length, true)}
                  aria-label="Previous step"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:border-faint hover:text-fg transition-all duration-200"
                >
                  <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
                    <path d="M6.5 2L3.5 5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goTo((active + 1) % steps.length, true)}
                  aria-label="Next step"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:border-faint hover:text-fg transition-all duration-200"
                >
                  <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
                    <path d="M3.5 2L6.5 5l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dot strip — a duplicate control surface for the tablist above,
            so it stays out of the tab order as well as the accessibility tree. */}
        <div className="mt-5 flex items-center justify-center gap-2 sm:hidden" aria-hidden>
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(i, true)}
              className={['h-1.5 rounded-full transition-all duration-300', active === i ? 'w-6 bg-fg' : 'w-1.5 bg-faint'].join(' ')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
