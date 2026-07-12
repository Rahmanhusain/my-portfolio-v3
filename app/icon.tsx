import { ImageResponse } from 'next/og';

// PWA / Android icon (also used as a high-res favicon; the browser scales it).
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontSize: 320,
          fontWeight: 700,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.05em',
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
