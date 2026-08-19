/** Normalize longitude into [-180, 180]. */
export function normalizeLng(lng: number): number {
  let x = lng
  while (x > 180) x -= 360
  while (x < -180) x += 360
  return x
}

/** Unwrap lng2 onto the shortest path relative to lng1 (may be outside [-180, 180]). */
function shortestLng2(lng1: number, lng2: number): number {
  let d = lng2 - lng1
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return lng1 + d
}

/**
 * Build a mild curved arc between two lat/lng points (airline-map style).
 * Uses the shortest longitude path (e.g. HKG→SFO goes over the Pacific).
 * Returned longitudes are continuous (may exceed ±180) for smooth geometry.
 */
export function flightArc(
  from: [number, number],
  to: [number, number],
  {
    steps = 64,
    /**
     * Bulge as a fraction of chord length.
     * Sign is geographic along the unwrapped shortest chord (west→east frame),
     * so outbound +b and return −b land on opposite sides.
     */
    bulge = 0.22,
  }: { steps?: number; bulge?: number } = {},
): [number, number][] {
  const [lat1, lng1] = from
  const [lat2, lng2raw] = to
  const lng2 = shortestLng2(lng1, lng2raw)

  // Stable west→east basis on the unwrapped chord.
  const westToEast = lng1 <= lng2
  const eLat = westToEast ? lat2 - lat1 : lat1 - lat2
  const eLng = westToEast ? lng2 - lng1 : lng1 - lng2
  const eLen = Math.hypot(eLat, eLng) || 1

  const cLat = (lat1 + lat2) / 2 + (-eLng / eLen) * eLen * bulge
  const cLng = (lng1 + lng2) / 2 + (eLat / eLen) * eLen * bulge

  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    pts.push([
      u * u * lat1 + 2 * u * t * cLat + t * t * lat2,
      u * u * lng1 + 2 * u * t * cLng + t * t * lng2,
    ])
  }
  return pts
}

/**
 * Split an arc at the antimeridian into Leaflet-safe segments
 * (kept for debugging; prefer continuous + shifted copies when drawing).
 */
export function splitAntimeridian(
  pts: [number, number][],
): [number, number][][] {
  const segs: [number, number][][] = []
  let cur: [number, number][] = []
  let prevNorm: number | null = null

  for (const [lat, lng] of pts) {
    const n = normalizeLng(lng)
    if (prevNorm != null && Math.abs(n - prevNorm) > 180) {
      if (cur.length) segs.push(cur)
      cur = [[lat, n]]
    } else {
      cur.push([lat, n])
    }
    prevNorm = n
  }
  if (cur.length) segs.push(cur)
  return segs
}

export function crossesAntimeridian(pts: [number, number][]): boolean {
  return splitAntimeridian(pts).length > 1
}

/** Shift every longitude by delta (e.g. ±360 for a wrapped world copy). */
export function shiftArc(
  pts: [number, number][],
  delta: number,
): [number, number][] {
  return pts.map(([lat, lng]) => [lat, lng + delta])
}

/** Compass bearing (degrees clockwise from north) between two lat/lng points. */
export function bearingDeg(
  from: [number, number],
  to: [number, number],
): number {
  const [lat1, lng1] = from
  const [lat2, lng2raw] = to
  const lng2 = shortestLng2(lng1, lng2raw)
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

/** Position + heading near the end of an arc, for arrow placement. */
export function arcArrowPose(
  pts: [number, number][],
  at = 0.9,
): { lat: number; lng: number; deg: number } {
  const i = Math.max(
    1,
    Math.min(pts.length - 1, Math.round(at * (pts.length - 1))),
  )
  const prev = pts[i - 1]
  const cur = pts[i]
  return {
    lat: cur[0],
    // Keep continuous longitude so the arrow sits on the drawn world copy.
    lng: cur[1],
    deg: bearingDeg(prev, cur),
  }
}
