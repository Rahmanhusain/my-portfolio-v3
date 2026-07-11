'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/useScrollReveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { posts } from '@/lib/data/posts';

export default function BlogPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  // posts are sorted newest-first in the data file; take the first 3
  const previewPosts = [...posts]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  useScrollReveal(sectionRef, {
    targets: '.blog-post-row',
    y: 30,
    stagger: 0.12,
    duration: 0.7,
    start: 'top 82%',
  });

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-32 md:py-40 border-t border-[#242424]"
      aria-labelledby="blog-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="Writing"
            title="Thoughts"
            description="Occasionally I write about what I'm building and learning."
          />
          <Link
            href="/blog"
            className="shrink-0 self-start md:self-auto text-sm text-[#8a8a8a] hover:text-[#fafafa] transition-colors duration-200 mb-2"
          >
            All posts →
          </Link>
        </div>

        <ol className="blog-list divide-y divide-[#242424]">
          {previewPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="blog-post-row group flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-7 hover:pl-2 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base md:text-lg font-semibold text-[#fafafa] leading-snug tracking-tight mb-1 group-hover:text-[#fafafa] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#8a8a8a] line-clamp-1 leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-[#8a8a8a]">{post.readTime}</span>
                  <span className="text-xs text-[#8a8a8a] hidden md:block">{post.date}</span>
                  <span
                    className="w-6 h-6 rounded-full border border-[#242424] flex items-center justify-center text-[#8a8a8a] group-hover:border-[#fafafa] group-hover:text-[#fafafa] transition-colors duration-200"
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1 9L9 1M9 1H4M9 1V6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
