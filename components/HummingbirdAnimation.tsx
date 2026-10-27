'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from '@/lib/accessibility/useReducedMotion';

export function HummingbirdAnimation() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    if (reducedMotion || paused || unavailable) {
      media.pause();
      return;
    }
    let active = true;
    media.play().catch(() => { if (active) setUnavailable(true); });
    return () => { active = false; media.pause(); };
  }, [reducedMotion, paused, unavailable]);
  return (
    <div className="hc-bird">
      <div className="hc-bird-media" role="img" aria-label="Healthcrest hummingbird">
        {reducedMotion || unavailable ? (
          // The supplied static artwork also serves visitors without JavaScript.
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/media/healthcrest-logo.png" alt="" width={1664} height={940} />
        ) : (
          <video ref={video} src="/media/healthcrest-hummingbird.webm"
            poster="/media/healthcrest-logo.png" autoPlay={!paused} muted loop playsInline
            preload="metadata" aria-hidden="true" onError={() => setUnavailable(true)} />
        )}
      </div>
      {!reducedMotion && !unavailable && (
        <button className="hc-bird-toggle" type="button"
          aria-label={paused ? 'Play hummingbird animation' : 'Pause hummingbird animation'}
          onClick={() => setPaused(current => !current)}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? 'Play animation' : 'Pause animation'}
        </button>
      )}
    </div>
  );
}
