import { editorialPreviewEnabled } from '@/lib/education/library/visibility';
import { getLesson } from '@/lib/education/library/lessons';
import { videoPackage } from '@/lib/education/library/video';

export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ habit: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };
  if (!editorialPreviewEnabled()) return new Response('Not found', { status: 404, headers });
  const lesson = getLesson((await params).habit);
  if (!lesson) return new Response('Not found', { status: 404, headers });
  return Response.json(videoPackage(lesson), { headers: { ...headers, 'Content-Disposition': 'attachment; filename="' + lesson.id + '-video-source.json"' } });
}
