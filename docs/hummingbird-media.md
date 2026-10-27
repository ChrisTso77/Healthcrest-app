# Hummingbird hero media

The supplied WebM is preserved at `public/media/healthcrest-hummingbird.webm` (Git blob `99df9ebccfc648ee6fe6e406162f205e1f11f207`). It contains a complete 1280×720 bird/shield/wordmark composition, with a defective alpha channel that cuts out much of the image on a light background.

The page uses `healthcrest-hummingbird-opaque.webm`, a 960×540 opaque rendition of the same animation. Dropping the alpha channel recovers the existing colour image; no replacement artwork is generated. Both global and stream metadata are removed so the inherited ALPHA_MODE flag cannot incorrectly mark the output as transparent.

Recreate with FFmpeg (libvpx enabled):

```sh
ffmpeg -c:v libvpx-vp9 -i public/media/healthcrest-hummingbird.webm \
  -vf 'scale=960:-2,format=yuv420p' -c:v libvpx-vp9 \
  -deadline good -cpu-used 4 -threads 2 -crf 30 -b:v 0 -an \
  -map_metadata -1 -map_metadata:s:v -1 \
  public/media/healthcrest-hummingbird-opaque.webm

ffmpeg -ss 4.986 -i public/media/healthcrest-hummingbird-opaque.webm \
  -frames:v 1 -q:v 3 public/media/healthcrest-hummingbird-still.jpg
```

The matching still is the initial poster, reduced-motion rendering, playback-error fallback and no-JavaScript rendering. The frame stays at 16:9 with `object-fit: contain`. Captions sit below it.

Inspection at 4.986 seconds, scaled to 160×90 RGBA pixels: the original had 14,080 pixels with alpha below 255; the opaque rendition had none. Browser regression checks also assert decoded frame opacity, media aspect ratio and caption containment at phone, tablet and desktop widths.
