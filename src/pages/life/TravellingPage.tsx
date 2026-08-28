import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { travelPlaces, travelRegions, travelFlights, type TravelPlace } from '../../data/travel'
import { flightArc, arcArrowPose, shiftArc, crossesAntimeridian } from '../../data/flightArc'
import { LifePageShell } from '../../components/life/LifePageShell'
import './TravellingPage.css'

const FILL = '#b88468'
const STROKE = '#d2a890'
const FLIGHT = '#d4b896'
const CARD_WIDTH = 260
const CARD_GAP = 16
const EDGE = 12

type CardPos = {
  left: number
  top: number
  placement: 'above' | 'below'
}

function formatVisitDates(place: TravelPlace) {
  return place.visits.map((v) => v.date).join(' · ')
}

function allPhotos(place: TravelPlace) {
  return place.visits.flatMap((v) => v.photos)
}

function placeCard(
  point: L.Point,
  shellW: number,
  shellH: number,
  cardH: number,
): CardPos {
  const preferAbove = point.y - CARD_GAP - cardH >= EDGE
  const placement: 'above' | 'below' = preferAbove ? 'above' : 'below'

  let top =
    placement === 'above'
      ? point.y - CARD_GAP - cardH
      : point.y + CARD_GAP

  top = Math.max(EDGE, Math.min(top, shellH - cardH - EDGE))

  let left = point.x - CARD_WIDTH / 2
  left = Math.max(EDGE, Math.min(left, shellW - CARD_WIDTH - EDGE))

  return { left, top, placement }
}

export function TravellingPage() {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [hoverPlace, setHoverPlace] = useState<TravelPlace | null>(null)
  const [cardPos, setCardPos] = useState<CardPos | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const hoverTimer = useRef<number | null>(null)
  const anchorPoint = useRef<L.Point | null>(null)

  function clearHoverSoon() {
    if (hoverTimer.current != null) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => {
      setHoverPlace(null)
      setCardPos(null)
      anchorPoint.current = null
    }, 160)
  }

  function keepHover() {
    if (hoverTimer.current != null) {
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  function updateCardAt(point: L.Point, place: TravelPlace) {
    keepHover()
    setHoverPlace(place)
    anchorPoint.current = point
    const shell = shellRef.current
    if (!shell) return
    const cardH = cardRef.current?.offsetHeight || 220
    setCardPos(placeCard(point, shell.clientWidth, shell.clientHeight, cardH))
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      worldCopyJump: true,
      scrollWheelZoom: true,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
    }).setView([30, 10], 2)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      },
    ).addTo(map)

    const container = map.getContainer()
    const stopPageScroll = (e: WheelEvent) => {
      e.preventDefault()
    }
    container.addEventListener('wheel', stopPageScroll, { passive: false })

    const onMapViewChange = () => {
      const shell = shellRef.current
      const placeId = (map as L.Map & { __hoverId?: string }).__hoverId
      if (!shell || !placeId) return
      const place = travelPlaces.find((p) => p.id === placeId)
      if (!place) return
      const pt = map.latLngToContainerPoint([place.lat, place.lng])
      anchorPoint.current = pt
      const cardH = cardRef.current?.offsetHeight || 220
      setCardPos(placeCard(pt, shell.clientWidth, shell.clientHeight, cardH))
    }

    map.on('zoom move', onMapViewChange)

    const bounds = L.latLngBounds([])
    let cancelled = false

    const bindHover = (layer: L.Layer, place: TravelPlace) => {
      layer.on('mouseover', (e: L.LeafletMouseEvent) => {
        ;(map as L.Map & { __hoverId?: string }).__hoverId = place.id
        updateCardAt(e.containerPoint, place)
        if ('setStyle' in layer && typeof layer.setStyle === 'function') {
          ;(layer as L.Path).setStyle({ fillOpacity: 0.55, weight: 2 })
        }
      })
      layer.on('mousemove', (e: L.LeafletMouseEvent) => {
        updateCardAt(e.containerPoint, place)
      })
      layer.on('mouseout', () => {
        ;(map as L.Map & { __hoverId?: string }).__hoverId = undefined
        clearHoverSoon()
        if ('setStyle' in layer && typeof layer.setStyle === 'function') {
          ;(layer as L.Path).setStyle({
            fillOpacity: place.kind === 'province' ? 0.38 : 0.32,
            weight: 1.25,
          })
        }
      })
      layer.on('click', (e: L.LeafletMouseEvent) => {
        ;(map as L.Map & { __hoverId?: string }).__hoverId = place.id
        updateCardAt(e.containerPoint, place)
        const z = place.kind === 'province' ? 6 : 10
        map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), z), {
          duration: 0.75,
        })
      })
    }

    ;(async () => {
      // Non-interactive region fills (under city markers / China provinces).
      for (const region of travelRegions) {
        if (cancelled) return
        try {
          const res = await fetch(region.geojsonUrl)
          const data = await res.json()
          if (cancelled) return
          const layer = L.geoJSON(data as GeoJSON.GeoJsonObject, {
            style: {
              color: STROKE,
              weight: 1.25,
              fillColor: FILL,
              fillOpacity: 0.38,
              opacity: 0.95,
            },
            interactive: false,
          }).addTo(map)
          layer.eachLayer((l) => {
            if (l instanceof L.Path) l.options.interactive = false
          })
          const b = layer.getBounds()
          if (b.isValid()) bounds.extend(b)
        } catch (err) {
          console.warn('Failed to load region fill', region.id, err)
        }
      }

      // Flight arcs (under city / province interactions).
      const flightEnds = new Map<
        string,
        { name: string; lat: number; lng: number }
      >()

      for (const flight of travelFlights) {
        if (cancelled) return
        const from: [number, number] = [flight.from.lat, flight.from.lng]
        const to: [number, number] = [flight.to.lat, flight.to.lng]
        const arc = flightArc(from, to, { bulge: flight.bulge })
        bounds.extend(from)
        bounds.extend(to)

        const tipHtml =
          `<div class="travel-flight-tip__route">${flight.from.code} → ${flight.to.code}</div>` +
          `<div class="travel-flight-tip__meta">${flight.date} · ${flight.flightNumber}</div>`

        // Continuous unwrapped arc (no mid-ocean cut). For Pacific routes that
        // cross the antimeridian, also draw ±360 copies so both world sides
        // show a full Asia↔America path over the Pacific.
        const copies = crossesAntimeridian(arc)
          ? [arc, shiftArc(arc, -360), shiftArc(arc, 360)]
          : [arc]

        for (const pts of copies) {
          if (pts.length < 2) continue
          const hit = L.polyline(pts, {
            weight: 14,
            opacity: 0,
            interactive: true,
            bubblingMouseEvents: false,
          }).addTo(map)

          L.polyline(pts, {
            color: FLIGHT,
            weight: 1.25,
            opacity: 0.9,
            lineCap: 'round',
            interactive: false,
            className: 'travel-flight-arc',
          }).addTo(map)

          hit.bindTooltip(tipHtml, {
            sticky: true,
            direction: 'top',
            opacity: 1,
            className: 'travel-flight-route-tooltip',
          })

          const tip = arcArrowPose(pts, 0.9)
          L.marker([tip.lat, tip.lng], {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: 'travel-flight-arrow-wrap',
              html: `<div class="travel-flight-arrow" style="transform:rotate(${tip.deg}deg)"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            }),
          }).addTo(map)
        }

        flightEnds.set(flight.from.code, {
          name: flight.from.name,
          lat: flight.from.lat,
          lng: flight.from.lng,
        })
        flightEnds.set(flight.to.code, {
          name: flight.to.name,
          lat: flight.to.lat,
          lng: flight.to.lng,
        })
      }

      // Endpoint dots once per airport (shared by outbound / return).
      for (const end of flightEnds.values()) {
        const mark = L.circleMarker([end.lat, end.lng], {
          radius: 5,
          color: '#ffffff',
          weight: 1.5,
          fillColor: FILL,
          fillOpacity: 0.95,
          interactive: true,
        }).addTo(map)
        mark.bindTooltip(end.name, {
          direction: 'right',
          offset: [8, 0],
          opacity: 1,
          className: 'travel-flight-tooltip',
        })
      }

      for (const place of travelPlaces) {
        if (cancelled) return
        bounds.extend([place.lat, place.lng])

        if (place.kind === 'province' && place.geojsonUrl) {
          try {
            const res = await fetch(place.geojsonUrl)
            const data = await res.json()
            if (cancelled) return
            const layer = L.geoJSON(data as GeoJSON.GeoJsonObject, {
              style: {
                color: STROKE,
                weight: 1.25,
                fillColor: FILL,
                fillOpacity: 0.38,
                opacity: 0.95,
              },
            }).addTo(map)
            layer.eachLayer((l) => bindHover(l, place))
            const b = layer.getBounds()
            if (b.isValid()) bounds.extend(b)
          } catch (err) {
            console.warn('Failed to load region', place.id, err)
          }
          continue
        }

        // City markers: keep the point only (no outer disk over region fills).
        const core = L.circleMarker([place.lat, place.lng], {
          radius: 5,
          color: '#ffffff',
          weight: 1.5,
          fillColor: FILL,
          fillOpacity: 0.95,
        }).addTo(map)

        bindHover(core, place)
      }

      if (!cancelled && bounds.isValid()) {
        map.fitBounds(bounds.pad(0.4), { maxZoom: 5 })
      }
      map.invalidateSize()
    })()

    mapRef.current = map
    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      cancelled = true
      container.removeEventListener('wheel', stopPageScroll)
      map.off('zoom move', onMapViewChange)
      if (hoverTimer.current != null) window.clearTimeout(hoverTimer.current)
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (!hoverPlace || !anchorPoint.current || !shellRef.current) return
    const cardH = cardRef.current?.offsetHeight || 220
    setCardPos(
      placeCard(
        anchorPoint.current,
        shellRef.current.clientWidth,
        shellRef.current.clientHeight,
        cardH,
      ),
    )
  }, [hoverPlace, expanded])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const t = window.setTimeout(() => {
      map.invalidateSize()
      map.scrollWheelZoom.enable()
    }, 100)
    return () => window.clearTimeout(t)
  }, [expanded])

  useEffect(() => {
    if (!hoverPlace || !cardRef.current) return
    L.DomEvent.disableClickPropagation(cardRef.current)
    L.DomEvent.disableScrollPropagation(cardRef.current)
  }, [hoverPlace, cardPos])

  useEffect(() => {
    document.body.style.overflow = expanded || lightbox ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [expanded, lightbox])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setLightbox(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [lightbox])

  useEffect(() => {
    if (!expanded || lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, lightbox])

  const photo = hoverPlace ? allPhotos(hoverPlace)[0] : undefined

  const lightboxNode =
    lightbox &&
    createPortal(
      <div
        className="travel-lightbox"
        role="dialog"
        aria-modal="true"
        onClick={() => setLightbox(null)}
      >
        <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        <button
          type="button"
          className="travel-lightbox__close"
          onClick={() => setLightbox(null)}
        >
          Close
        </button>
      </div>,
      document.body,
    )

  return (
    <LifePageShell
      className="life-page--travel"
      title="Travelling"
      lead="A map of places I have been. More stops will appear over time."
    >
      <div className={`travel-stage ${expanded ? 'is-expanded' : ''}`}>
        <div className="travel-map-shell" ref={shellRef}>
          {expanded ? (
            <button
              type="button"
              className="travel-exit"
              onClick={() => setExpanded(false)}
            >
              Exit map
            </button>
          ) : (
            <button
              type="button"
              className="travel-enter"
              onClick={() => setExpanded(true)}
            >
              Enter map
            </button>
          )}

          <div ref={containerRef} className="travel-map" />

          {hoverPlace && cardPos ? (
            <div
              ref={cardRef}
              className={`travel-hovercard travel-hovercard--${cardPos.placement}`}
              style={{ left: cardPos.left, top: cardPos.top }}
              onMouseEnter={keepHover}
              onMouseLeave={clearHoverSoon}
            >
              {photo ? (
                <button
                  type="button"
                  className="travel-hovercard__media"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setLightbox(photo)
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <img src={photo} alt="" loading="lazy" />
                </button>
              ) : null}
              <div className="travel-hovercard__meta">
                <h2>
                  {hoverPlace.name}
                  <span>, {hoverPlace.country}</span>
                </h2>
                <p>{formatVisitDates(hoverPlace)}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {lightboxNode}
    </LifePageShell>
  )
}
