import { ImageResponse } from 'next/og';

// iOS home-screen icon.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 116,
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
