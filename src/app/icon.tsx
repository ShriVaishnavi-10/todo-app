import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f43f5e', // Use the Rose accent color hex
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '80%', height: '80%' }}
        >
          <path
            d="M30 70V30L50 50L70 30V70"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 50L75 75"
            stroke="#f43f5e"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
