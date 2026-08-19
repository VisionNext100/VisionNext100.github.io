import meta from './photography.meta.generated.json'

export type Photo = {
  id: string
  src: string
  title: string
  width: number
  height: number
  lqip: string
}

function frame(id: keyof typeof meta, title: string): Photo {
  const { w, h, lqip } = meta[id]
  return {
    id,
    title,
    src: `/images/photography/${id}.jpg`,
    width: w,
    height: h,
    lqip,
  }
}

/**
 * Coverflow order. To add a new frame:
 * 1. Drop the original into raw/photography/
 * 2. Run `node scripts/watermark-photos.mjs`
 * 3. Run `node scripts/build-photo-meta.mjs`
 * 4. Append one `frame(...)` line below
 */
export const photos: Photo[] = [
  frame('parallel-arcs', 'Parallel Arcs'),
  frame('golden-grass-shore', 'Golden Grass Shore'),
  frame('above-the-channel', 'Above the Channel'),
  frame('toward-the-peaks', 'Toward the Peaks'),
  frame('rain-on-glass', 'Rain on Glass'),
  frame('autumn-columns', 'Autumn Columns'),
  frame('under-the-canopy', 'Under the Canopy'),
  frame('night-signal', 'Night Signal'),
  frame('skyward-pine', 'Skyward Pine'),
  frame('pier-at-dusk', 'Pier at Dusk'),
  frame('brick-and-autumn', 'Brick and Autumn'),
  frame('empty-swings', 'Empty Swings'),
]
