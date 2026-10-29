// Browsers also probe this conventional address independently of icon metadata.
// Keep one generated PNG, reached through a same-origin relative redirect.
export const dynamic = 'force-static';

export function GET() {
  return new Response(null, { status: 308, headers: { Location: '/icon' } });
}
