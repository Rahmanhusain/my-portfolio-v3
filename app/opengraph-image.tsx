import { ImageResponse } from 'next/og';

// Route segment config
export const alt = 'Rahman — Software Developer building fast, accessible web products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Default branded social card for the whole site.
// Any route that sets its own openGraph.images (blog posts, service pages)
// overrides this automatically.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* subtle top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8a8a8a',
          }}
        >
          Software Developer
        </div>

        {/* headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: '#fafafa',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            Rahman
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 40,
              fontWeight: 400,
              color: '#8a8a8a',
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            Fast, accessible &amp; beautifully crafted web products.
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#8a8a8a',
          }}
        >
          <span style={{ color: '#fafafa' }}>Available for freelance</span>
          <span>{process.env.NEXT_PUBLIC_SITE_URL ?? 'yourname.dev'}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
