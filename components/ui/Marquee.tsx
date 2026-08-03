import { Children } from 'react';
import clsx from 'clsx';

interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full loop. Higher = slower. */
  duration?: number;
  /** Gap between items, any CSS length. */
  gap?: string;
  /** Scroll right-to-left (default) or left-to-right. */
  reverse?: boolean;
  /**
   * How many times to repeat the item list inside each track.
   *
   * This matters more than it looks: the track is `min-width: 100%` with
   * `space-around`, so a short list on a wide screen gets spread edge-to-edge
   * and the loop takes a full `duration` to travel one viewport — which reads
   * as "not moving". Repeating until the content overflows restores the real
   * gap between items and makes the motion obvious.
   */
  repeat?: number;
  className?: string;
}

/**
 * Infinite horizontal marquee — pure CSS, no JavaScript, safe in Server
 * Components. Pauses on hover and on keyboard focus so the content stays
 * readable, and collapses to a plain scrollable row under reduced motion.
 *
 * The track is rendered twice: the second copy is `aria-hidden` so screen
 * readers and search-engine crawlers only ever see the content once.
 */
export default function Marquee({
  children,
  duration = 40,
  gap = '3rem',
  reverse = false,
  repeat = 1,
  className,
}: MarqueeProps) {
  const items = Children.toArray(children);
  const track = Array.from({ length: repeat }, (_, i) =>
    items.map((child, j) => <span key={`${i}-${j}`} className="contents">{child}</span>)
  );

  return (
    <div
      className={clsx('marquee', reverse && 'marquee--reverse', className)}
      style={
        {
          '--marquee-duration': `${duration}s`,
          '--marquee-gap': gap,
        } as React.CSSProperties
      }
    >
      <div className="marquee__group">{track}</div>
      <div className="marquee__group" aria-hidden="true">
        {track}
      </div>
    </div>
  );
}
