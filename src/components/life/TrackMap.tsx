import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { addTrackBasemap } from '../../lib/basemap'

type Props = {
  geojsonUrl?: string
  className?: string
}

type GeoJsonLine = {
  type?: string
  features?: Array<{
    geometry?: {
      type?: string
      coordinates?: number[][] | number[][][]
    }
  }>
  geometry?: {
    type?: string
    coordinates?: number[][] | number[][][]
  }
}

function extractLatLngs(data: GeoJsonLine): L.LatLng[] {
  const feature = data.features?.[0] ?? data
  const geometry = 'geometry' in feature ? feature.geometry : undefined
  if (!geometry?.coordinates) return []

  const raw =
    geometry.type === 'MultiLineString'
      ? (geometry.coordinates as number[][][]).flat()
      : (geometry.coordinates as number[][])

  return raw
    .filter((c) => Array.isArray(c) && c.length >= 2)
    .map(([lng, lat]) => L.latLng(lat, lng))
}

export function TrackMap({ geojsonUrl, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const lineRef = useRef<L.Polyline | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    }).setView([31.23, 121.47], 13)

    const removeBasemap = addTrackBasemap(map)

    mapRef.current = map
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      removeBasemap()
      map.remove()
      mapRef.current = null
      lineRef.current = null
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !geojsonUrl) return

    let cancelled = false
    let delayTimer: number | null = null

    const clearTrack = () => {
      if (delayTimer != null) {
        window.clearTimeout(delayTimer)
        delayTimer = null
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (lineRef.current) {
        map.removeLayer(lineRef.current)
        lineRef.current = null
      }
      markersRef.current.forEach((m) => map.removeLayer(m))
      markersRef.current = []
    }

    const preferReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    ;(async () => {
      const res = await fetch(geojsonUrl)
      const data = (await res.json()) as GeoJsonLine
      if (cancelled || !mapRef.current) return

      clearTrack()

      const latlngs = extractLatLngs(data)
      if (latlngs.length < 2) return

      const bounds = L.latLngBounds(latlngs)
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [28, 28], animate: false })
      }
      map.invalidateSize()

      const lineStyle: L.PolylineOptions = {
        color: '#a66b4d',
        weight: 3.5,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round',
      }

      const finishStatic = () => {
        if (cancelled || !mapRef.current) return
        lineRef.current?.setLatLngs(latlngs)

        const start = L.circleMarker(latlngs[0], {
          radius: 5,
          color: '#fffcfa',
          weight: 2,
          fillColor: '#c4896a',
          fillOpacity: 1,
        }).addTo(map)
        const end = L.circleMarker(latlngs[latlngs.length - 1], {
          radius: 5,
          color: '#fffcfa',
          weight: 2,
          fillColor: '#3d3630',
          fillOpacity: 1,
        }).addTo(map)
        markersRef.current = [start, end]
      }

      const startDraw = () => {
        if (cancelled || !mapRef.current) return
        delayTimer = null
        map.invalidateSize()

        const line = L.polyline([], lineStyle).addTo(map)
        lineRef.current = line

        if (preferReduced) {
          finishStatic()
          return
        }

        // Fast draw: ~1.1s regardless of point count
        const durationMs = 1100
        const startTs = performance.now()

        const tick = (now: number) => {
          if (cancelled || !lineRef.current) return
          const t = Math.min(1, (now - startTs) / durationMs)
          const eased = 1 - (1 - t) ** 3
          const count = Math.max(2, Math.floor(eased * latlngs.length))
          lineRef.current.setLatLngs(latlngs.slice(0, count))

          if (t < 1) {
            rafRef.current = requestAnimationFrame(tick)
          } else {
            rafRef.current = null
            finishStatic()
          }
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      // Let basemap tiles settle before animating the track.
      delayTimer = window.setTimeout(startDraw, 700)
    })()

    return () => {
      cancelled = true
      clearTrack()
    }
  }, [geojsonUrl])

  return <div ref={containerRef} className={className} />
}
