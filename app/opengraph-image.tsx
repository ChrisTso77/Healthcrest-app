import { ImageResponse } from 'next/og';

export const alt = 'Healthcrest — Health through everyday habits';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SharingImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#f8f7f0', color: '#183b2d' }}>
      <div style={{ display: 'flex', fontSize: 36, fontWeight: 700 }}>Healthcrest</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', fontSize: 64, lineHeight: 1.1 }}>Health through everyday habits</div>
        <div style={{ display: 'flex', fontSize: 27 }}>Movement · Food · Sleep · Stress &amp; support</div>
      </div>
      <div style={{ display: 'flex', fontSize: 26 }}>Try the Habit Explorer · No account needed</div>
    </div>,
    size,
  );
}
