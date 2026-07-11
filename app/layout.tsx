import type { Metadata } from 'next';
import { Inter, Inter_Tight, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  display: 'swap',
});

const dancingScript = Dancing_Script({
  variable: '--font-cursive',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev'
  ),
  title: {
    default: 'Rahman — Full-Stack Developer',
    template: '%s | Rahman',
  },
  description:
    'Full-Stack Developer building fast, accessible, and beautifully crafted web products. Available for freelance.',
  openGraph: {
    title: 'Rahman — Full-Stack Developer',
    description:
      'Full-Stack Developer building fast, accessible, and beautifully crafted web products.',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev',
    siteName: 'Rahman',
    images: ['/og-image.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rahman — Full-Stack Developer',
    description:
      'Full-Stack Developer building fast, accessible, and beautifully crafted web products.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rahman',
  jobTitle: 'Full-Stack Developer',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourname.dev',
  sameAs: [
    'https://github.com/rahman',
    'https://linkedin.com/in/rahman',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${dancingScript.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#fafafa] antialiased">
        {children}
      </body>
    </html>
  );
}
