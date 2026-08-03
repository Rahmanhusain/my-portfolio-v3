/**
 * Back-to-top affordance that fades in once the visitor is ~60vh down the
 * page. Uses a CSS scroll timeline for the fade and a plain `#top` anchor for
 * the jump, so it needs no JavaScript and keeps working in Server Components.
 */
export default function BackToTop() {
  return (
    <a
      href="#top"
      aria-label="Back to top"
      className="back-to-top fixed bottom-6 left-6 z-40 h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/80 text-muted backdrop-blur-xl transition-colors duration-200 hover:border-fg hover:text-fg"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
