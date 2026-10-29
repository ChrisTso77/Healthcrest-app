import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export async function createBrowserIcon() {
  const logo = await readFile(join(process.cwd(), 'public/media/healthcrest-logo.png'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f0' }}>
      {/* Keep the complete approved logo proportional, without cropping or redrawing. */}
      <img src={`data:image/png;base64,${logo.toString('base64')}`} width={60} height={60} style={{ objectFit: 'contain' }} alt="" />
    </div>,
    { width: 64, height: 64 },
  );
}
