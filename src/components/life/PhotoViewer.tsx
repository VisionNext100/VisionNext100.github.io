import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from '../../data/photography'
import './PhotoViewer.css'

type Props = {
  photos: Photo[]
  index: number
  onIndexChange: (next: number) => void
  onClose: () => void
}

const SWIPE_THRESHOLD = 48

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function PhotoViewer({ photos, index, onIndexChange, onClose }: Props) {
  const photo = photos[index]
  const dialogRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const swiped = useRef(false)

  const go = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + photos.length) % photos.length)
    },
    [index, photos.length, onIndexChange],
  )

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [go, onClose])

  // Warm the neighbours so arrow-key browsing does not flash empty frames.
  useEffect(() => {
    for (const delta of [1, -1]) {
      const neighbour = photos[(index + delta + photos.length) % photos.length]
      if (neighbour) new Image().src = neighbour.src
    }
  }, [index, photos])

  if (!photo) return null

  return createPortal(
    <div
      ref={dialogRef}
      className="photo-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title}, ${index + 1} of ${photos.length}`}
      tabIndex={-1}
      onClick={() => {
        if (swiped.current) {
          swiped.current = false
          return
        }
        onClose()
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start == null) return
        const dx = (e.changedTouches[0]?.clientX ?? start) - start
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          swiped.current = true
          go(dx < 0 ? 1 : -1)
        }
      }}
    >
      <button
        type="button"
        className="photo-viewer__close"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>

      <button
        type="button"
        className="photo-viewer__nav photo-viewer__nav--prev"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation()
          go(-1)
        }}
      >
        <span aria-hidden="true">←</span>
      </button>

      <figure className="photo-viewer__figure" onClick={(e) => e.stopPropagation()}>
        <img key={photo.src} src={photo.src} alt={photo.title} />
        <figcaption>
          <span className="photo-viewer__title">{photo.title}</span>
          <span className="photo-viewer__count">
            {pad(index + 1)} <i>/</i> {pad(photos.length)}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="photo-viewer__nav photo-viewer__nav--next"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation()
          go(1)
        }}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>,
    document.body,
  )
}
