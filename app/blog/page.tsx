import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/lib/data/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing about web development, performance, and building things on the web.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <header className="mb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-[#8a8a8a] mb-4">
            Writing
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#fafafa] tracking-tight leading-tight">
            Thoughts
          </h1>
          <p className="text-[#8a8a8a] mt-4 leading-relaxed max-w-lg">
            I write about web development, performance, and the craft of building
            things on the web.
          </p>
        </header>

        {/* Posts list */}
        <ol className="divide-y divide-[#242424]">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 py-8 hover:pl-2 transition-all duration-200"
              >
                <div className="flex items-center gap-3 text-xs text-[#8a8a8a]">
                  <time dateTime={post.updatedAt.toISOString().split('T')[0]}>
                    {post.date}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="font-display text-xl font-semibold text-[#fafafa] tracking-tight leading-snug group-hover:text-[#fafafa] transition-colors">
                  {post.title}
                </h2>

                <p className="text-sm text-[#8a8a8a] leading-relaxed line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full border border-[#242424] text-[#8a8a8a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
