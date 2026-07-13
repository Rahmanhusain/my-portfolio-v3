import { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement>;

/**
 * Magnifying-glass / discovery glyph.
 * Control size via `className` (e.g. "h-6 w-6") and weight via `strokeWidth`.
 */
export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export default SearchIcon;
