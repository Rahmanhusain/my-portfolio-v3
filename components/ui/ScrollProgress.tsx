/**
 * Reading-progress bar pinned to the top of the viewport.
 *
 * Driven entirely by a CSS scroll timeline (`animation-timeline: scroll()`),
 * so it works inside Server Components with zero JavaScript. Browsers without
 * scroll-timeline support hide it completely rather than showing a dead bar.
 */
export default function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}
