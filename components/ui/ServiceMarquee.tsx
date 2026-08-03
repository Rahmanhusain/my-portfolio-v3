import Link from 'next/link';
import Marquee from '@/components/ui/Marquee';
import { services } from '@/lib/data/services';

/**
 * Scrolling band of every service, each one linked. Doubles as internal
 * linking: every page that renders this passes crawl equity to all eight
 * service pages, and a visitor always has a next click available.
 */
export default function ServiceMarquee({
  reverse = false,
}: {
  reverse?: boolean;
}) {
  return (
    <div
      className="border-y border-border py-5"
      aria-label="All services"
    >
      <Marquee duration={52} gap="2.5rem" reverse={reverse}>
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap text-muted transition-colors duration-200 hover:text-fg"
          >
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-faint transition-colors duration-200 group-hover:bg-fg"
            />
            <span className="link-sweep font-display text-lg font-medium tracking-tight md:text-xl">
              {service.title}
            </span>
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
