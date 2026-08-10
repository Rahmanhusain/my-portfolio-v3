import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/HeaderServerComp';
import Footer from '@/components/layout/Footer';
import { getPosts } from '@/lib/data/posts';
import { getServices } from '@/lib/data/services';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'That page does not exist. Browse the services, read the blog, or get in touch.',
  robots: { index: false, follow: true },
};

/**
 * 404 with somewhere to go. Rendered outside the route groups, so it brings
 * its own header and footer.
 */
export default async function NotFound() {
  const [services, posts] = await Promise.all([getServices(), getPosts()]);

  const suggestions = [
    ...services.slice(0, 3).map((s) => ({
      href: `/services/${s.slug}`,
      label: s.title,
      kind: 'Service',
    })),
    ...posts.slice(0, 2).map((p) => ({
      href: `/blog/${p.slug}`,
      label: p.title,
      kind: 'Article',
    })),
  ];

  return (
    <>
      <Header />
      <main
        id="main-content"
        className="relative flex flex-1 items-center overflow-hidden py-32"
      >
        <div className="aurora" aria-hidden="true" />
        <div className="grid-bg" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
          <p
            className="font-display text-[7rem] font-bold leading-none tracking-tight text-fg opacity-[0.08] md:text-[10rem]"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="-mt-6 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">
            This page took a wrong turn.
          </h1>

          <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
            The link is broken or the page has moved. Here is where most people
            were heading.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="hover-lift inline-flex items-center rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition-colors duration-200 hover:bg-strong"
            >
              Back to home
            </a>
            <Link
              href="/contact"
              className="hover-lift inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg"
            >
              Get in Touch
            </Link>
          </div>

          <ul className="mx-auto mt-14 max-w-lg divide-y divide-border border-y border-border text-left">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-4 py-4 transition-all duration-200 hover:pl-2"
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] font-medium uppercase tracking-widest text-subtle">
                      {item.kind}
                    </span>
                    <span className="block truncate text-sm text-fg">
                      <span className="link-sweep">{item.label}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="arrow-slide shrink-0 text-muted transition-colors group-hover:text-fg"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
