'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import TestimonialCard from '@/components/ui/TestimonialCard';
import type { Testimonial } from '@/lib/data/testimonials';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

/**
 * Horizontal testimonial track.
 *
 * The sliding is native CSS scroll-snap, not a JS transform loop — so swipe,
 * trackpad, shift-scroll, and keyboard all work before this component's
 * JavaScript has run, and there is no layout to keep in sync.
 *
 * JS only adds the affordances CSS can't: arrows, dots, and the current-index
 * readout. Those render only when the track actually overflows, which is why
 * three testimonials still look like a plain three-column grid on desktop
 * while a fourth turns the same markup into a carousel.
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
}: TestimonialCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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

  return (
    <div className="relative">
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
          {/* Dots */}
          <ul className="flex items-center gap-2">
            {testimonials.map((testimonial, i) => (
              <li key={testimonial.id}>
                <button
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Show testimonial ${i + 1} of ${testimonials.length}`}
                  aria-current={i === active}
                  className={clsx(
                    'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2',
                    i === active
                      ? 'w-7 bg-fg'
                      : 'w-1.5 bg-faint hover:bg-muted'
                  )}
                />
              </li>
            ))}
          </ul>

          {/* Arrows */}
          <div className="flex items-center gap-2.5">
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
