import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), 'public/media/healthcrest-logo.png'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f0' }}>
      {/* The complete approved logo is scaled proportionally, without cropping or redrawing. */}
      <img src={`data:image/png;base64,${logo.toString('base64')}`} width={60} height={60} style={{ objectFit: 'contain' }} alt="" />
    </div>,
    size,
  );
}
