'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import TestimonialCard from '@/components/ui/TestimonialCard';
import type { Testimonial } from '@/lib/data/testimonials';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  /** Advance on a timer. Ignored when the track doesn't overflow (there is
   *  nowhere to advance to) or when the visitor prefers reduced motion. */
  autoPlay?: boolean;
  /** Milliseconds a slide is held before the next one is pulled in. */
  interval?: number;
}

/**
 * Horizontal testimonial track.
 *
 * The sliding is native CSS scroll-snap, not a JS transform loop — so swipe,
 * trackpad, shift-scroll, and keyboard all work before this component's
 * JavaScript has run, and there is no layout to keep in sync.
 *
 * JS only adds the affordances CSS can't: arrows, dots, auto-advance, and the
 * current-index readout. Those render only when the track actually overflows,
 * which is why three testimonials still look like a plain three-column grid on
 * desktop while a fourth turns the same markup into a carousel.
 *
 * Auto-advance is scroll, not transform: the timer calls the same
 * `scrollToIndex` the arrows do, so autoplay and manual control can never
 * disagree about where the track is. It suspends on hover, on focus inside the
 * carousel, while the tab is hidden, and whenever the visitor prefers reduced
 * motion — and the pause button lets anyone stop it outright, which is the
 * requirement that makes a moving carousel accessible rather than hostile.
 *
 * ── The geometry, because it is easy to break ──────────────────────────────
 * One card per view below `md`, centre-aligned. A centred slide can only sit
 * centred at the scroll extremes if the track's side padding equals
 * `(scrollport - slide) / 2` — otherwise the browser clamps at scrollLeft 0
 * and the first and last cards sit visibly off-centre. Here:
 *
 *   scrollport = parent + 3rem   (-mx-6 bleeds into the section's px-6 gutter)
 *   slide      = parent - 2rem   (100% of the content box, inside px-10)
 *   padding    = 2.5rem          (px-10) === (parent + 3rem - parent + 2rem)/2
 *
 * which balances, so every card centres and 1rem of each neighbour peeks out.
 * From `md` up the track switches to start-alignment with matching
 * `scroll-px`, so slides align to the page's content column instead.
 */
/**
 * The index of the slide currently occupying the leading edge, read straight
 * from layout.
 *
 * Deliberately not derived from React state: the arrows need the *live*
 * position at the moment they're clicked, and a scroll event that arrives late
 * or coalesced would otherwise leave them stepping from a stale index — which
 * shows up as an arrow that appears to do nothing on the second press.
 *
 * Measured from rects rather than `offsetLeft`, which is relative to the
 * nearest positioned ancestor and so silently disagrees with `scrollLeft` as
 * soon as the track carries its own padding or negative margin.
 */
function readIndex(track: HTMLElement): number {
  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) return 0;

  const trackRect = track.getBoundingClientRect();
  const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft);
  // The point content is expected to line up with, in both alignment modes.
  const anchor = trackRect.left + (Number.isNaN(pad) ? 0 : pad);

  let nearest = 0;
  let best = Infinity;
  slides.forEach((slide, i) => {
    const distance = Math.abs(slide.getBoundingClientRect().left - anchor);
    if (distance < best) {
      best = distance;
      nearest = i;
    }
  });
  return nearest;
}

export default function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 6000,
}: TestimonialCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /** Set by the pause button — an explicit, sticky "stop moving". */
  const [paused, setPaused] = useState(false);
  /** Transient suspensions: pointer over the carousel, focus inside it, tab in
   *  the background. All of them resume on their own. */
  const [engaged, setEngaged] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /** Bumped on every auto-advance — see the timer effect for why. */
  const [cycle, setCycle] = useState(0);

  /** Does the content exceed the visible width? Re-measured on resize, since
   *  the answer changes at every breakpoint. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // 2px of slack absorbs sub-pixel rounding, which would otherwise report
      // a permanent 1px overflow and show controls that can't scroll anywhere.
      setOverflows(track.scrollWidth - track.clientWidth > 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /** Keeps the dots and the arrow disabled states in step with the scroll. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      setActive(readIndex(track));
      setAtStart(track.scrollLeft <= 2);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
    };

    onScroll();
    track.addEventListener('scroll', onScroll, { passive: true });

    // Breakpoint changes move every snap position without firing a scroll.
    const observer = new ResizeObserver(onScroll);
    observer.observe(track);

    return () => {
      track.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [testimonials.length]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const target = Math.min(Math.max(index, 0), testimonials.length - 1);
      const slide = track.children[target] as HTMLElement | undefined;
      if (!slide) return;

      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();

      // Honour whatever alignment CSS is currently applying, so the controls
      // land on the real snap position at every breakpoint instead of fighting
      // the snap and bouncing back.
      const centred = getComputedStyle(slide).scrollSnapAlign.includes('center');

      let delta: number;
      if (centred) {
        delta =
          slideRect.left +
          slideRect.width / 2 -
          (trackRect.left + trackRect.width / 2);
      } else {
        const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft);
        delta =
          slideRect.left - (trackRect.left + (Number.isNaN(pad) ? 0 : pad));
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches;

      // scrollBy on a delta — the browser clamps to the scrollable range.
      track.scrollBy({ left: delta, behavior: reduced ? 'auto' : 'smooth' });

      // Move the dot now rather than waiting for the scroll event, so the
      // control feels immediate during a long smooth scroll.
      setActive(target);
    },
    [testimonials.length]
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      scrollToIndex(readIndex(track) + direction);
    },
    [scrollToIndex]
  );

  /** Motion preference, watched rather than read once — the visitor can flip it
   *  from the OS while the page is open. */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  /** A backgrounded tab shouldn't burn through the whole set unseen. */
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const canAutoPlay = autoPlay && overflows && !reducedMotion;
  const playing = canAutoPlay && !paused && !engaged && !hidden;

  /** One timeout per slide rather than a repeating interval: `active` is a
   *  dependency, so any move — timer, arrow, dot, or swipe — restarts the
   *  countdown from the slide the visitor is actually looking at.
   *
   *  `cycle` is what guarantees the chain never dies. At breakpoints where the
   *  overflow is smaller than half a slide, an advance can legitimately land on
   *  the index it started from; without a value that changes on every tick the
   *  effect wouldn't re-run and autoplay would silently stop for good. */
  useEffect(() => {
    if (!playing) return;

    const id = window.setTimeout(() => {
      const track = trackRef.current;
      if (track) {
        // Read the edge live: `atEnd` state can lag a scroll that is still
        // settling, and wrapping one slide early looks like a skip.
        const finished =
          track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        if (finished) scrollToIndex(0);
        else step(1);
      }
      setCycle((n) => n + 1);
    }, interval);

    return () => window.clearTimeout(id);
  }, [playing, active, cycle, interval, scrollToIndex, step]);

  return (
    <div
      className="relative"
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      // Focus moving between two controls inside the carousel is still focus
      // inside the carousel — only a real exit resumes rotation.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setEngaged(false);
        }
      }}
    >
      <ul
        ref={trackRef}
        className={clsx(
          'no-scrollbar flex snap-x snap-mandatory overflow-x-auto',
          // Bleeds into the section's px-6 gutter so cards can scroll edge to
          // edge instead of stopping inside the content column.
          '-mx-6 gap-6',
          // See the geometry note above — px-10 is what centres the first and
          // last card on mobile; md+ realigns to the content column.
          'px-10 scroll-px-10 md:px-6 md:scroll-px-6',
          // Vertical breathing room so a hovered card's lift isn't clipped by
          // the scroll container, pulled back with a negative margin.
          '-my-3 py-3'
        )}
        // Only announce a scrollable region once there is something to scroll.
        {...(overflows && {
          role: 'group',
          'aria-roledescription': 'carousel',
          'aria-label': 'Client testimonials',
          tabIndex: 0,
          // Slides that move on their own must not be announced as they pass;
          // once rotation stops, the region reports what the visitor landed on.
          'aria-live': playing ? ('off' as const) : ('polite' as const),
        })}
      >
        {testimonials.map((testimonial, i) => (
          <li
            key={testimonial.id}
            className={clsx(
              'shrink-0',
              // One centred card, then two, then three aligned to the column.
              'w-full snap-center',
              'md:w-[calc((100%-1.5rem)/2)] md:snap-start',
              'lg:w-[calc((100%-3rem)/3)]'
            )}
            {...(overflows && {
              role: 'group',
              'aria-roledescription': 'slide',
              'aria-label': `${i + 1} of ${testimonials.length}`,
            })}
          >
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      {/* Controls — only meaningful when there's somewhere to scroll */}
      {overflows && (
        <div className="mt-8 flex items-center justify-between gap-6">
          {/* Dots — the active one doubles as the autoplay countdown */}
          <ul className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <li key={testimonial.id}>
                <button
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  aria-current={i === active}
                  className={clsx(
                    'relative h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2',
                    // One background class per state, never a base plus an
                    // override — Tailwind's emission order decides which of two
                    // `bg-*` utilities wins, and it isn't the one written last.
                    i !== active && 'w-1.5 bg-faint hover:bg-muted',
                    // Active and rotating: faint is the countdown's track.
                    i === active && playing && 'w-7 bg-faint',
                    // Active and suspended: a plain filled pill.
                    i === active && !playing && 'w-7 bg-fg'
                  )}
                >
                  {i === active && playing && (
                    <span
                      // Remounting is what restarts the fill; the cycle covers
                      // an advance that lands back on the same index.
                      key={`${active}-${cycle}`}
                      aria-hidden="true"
                      className="dot-countdown absolute inset-0 rounded-full bg-fg"
                      style={{ animationDuration: `${interval}ms` }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Arrows, plus the rotation toggle when there is one to give */}
          <div className="flex items-center gap-2.5">
            {canAutoPlay && (
              <button
                type="button"
                onClick={() => setPaused((wasPaused) => !wasPaused)}
                aria-label={
                  paused
                    ? 'Start automatic testimonial rotation'
                    : 'Stop automatic testimonial rotation'
                }
                className="mr-0.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-fg transition-colors duration-200 hover:border-faint hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {paused ? (
                    <path d="M4 2.2v9.6a.5.5 0 0 0 .77.42l7.1-4.8a.5.5 0 0 0 0-.84l-7.1-4.8A.5.5 0 0 0 4 2.2Z" />
                  ) : (
                    <>
                      <rect x="3.2" y="2.3" width="2.6" height="9.4" rx="1.1" />
                      <rect x="8.2" y="2.3" width="2.6" height="9.4" rx="1.1" />
                    </>
                  )}
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-fg transition-colors duration-200 hover:border-faint hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M9 2L4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-fg transition-colors duration-200 hover:border-faint hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg disabled:cursor-not-allowed disabled:opacity-35"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M5 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
