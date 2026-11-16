import type { Lesson } from './types';

export function buildCaptions(scenes: Lesson['video']['scenes']): string {
  const stamp = (seconds: number) => new Date(Math.round(seconds * 1000)).toISOString().slice(11, 23);
  let elapsed = 0;
  let cue = 0;
  const output = ['WEBVTT', ''];
  for (const scene of scenes) {
    const lines: string[] = [];
    for (const word of scene.narration.split(/\s+/)) {
      const last = lines.length - 1;
      if (last < 0 || lines[last].length + word.length + 1 > 42) lines.push(word);
      else lines[last] += ' ' + word;
    }
    const count = Math.ceil(lines.length / 2);
    for (let index = 0; index < count; index++) {
      output.push(String(++cue), stamp(elapsed + scene.seconds * index / count) + ' --> ' + stamp(elapsed + scene.seconds * (index + 1) / count), ...lines.slice(index * 2, index * 2 + 2), '');
    }
    elapsed += scene.seconds;
  }
  return output.join('\n');
}
