import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { photos, type Photo } from '../../data/photography'
import { LifePageShell } from '../../components/life/LifePageShell'
import { PhotoViewer } from '../../components/life/PhotoViewer'
import './PhotographyPage.css'

const AUTO_MS = 4200
/** Visible cards on each side of the focus (past / queue). */
const SIDE_DEPTH = 2

/** Shortest signed distance on a circular reel of length `n`. */
function signedOffset(index: number, active: number, n: number) {
  let d = (index - active) % n
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

type CardProps = {
  photo: Photo
  offset: number
  onSelect: () => void
}

function CoverCard({ photo, offset, onSelect }: CardProps) {
  const [loaded, setLoaded] = useState(false)
  const abs = Math.abs(offset)
  const isFocus = offset === 0

  return (
    <button
      type="button"
      className={[
        'photo-cover__card',
        isFocus ? 'is-focus' : 'is-side',
        offset < 0 ? 'is-past' : '',
        offset > 0 ? 'is-next' : '',
        loaded ? 'is-loaded' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--offset': offset,
          '--abs': abs,
          '--ar': `${photo.width} / ${photo.height}`,
          '--lqip': `url("${photo.lqip}")`,
          zIndex: 100 - abs,
        } as CSSProperties
      }
      onClick={onSelect}
      aria-label={isFocus ? `Open ${photo.title}` : `Show ${photo.title}`}
      aria-current={isFocus ? 'true' : undefined}
      tabIndex={abs <= 1 ? 0 : -1}
    >
      <img
        src={photo.src}
        alt={photo.title}
        loading={abs <= 3 ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
      {isFocus ? (
        <span className="photo-cover__caption">{photo.title}</span>
      ) : null}
    </button>
  )
}

export function PhotographyPage() {
  const n = photos.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const remainingRef = useRef(AUTO_MS)
  const deadlineRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const prevActiveRef = useRef(active)

  const playing = !paused && openIndex === null && n >= 2

  // Resume-aware autoplay: pause banks leftover ms; resume continues from there.
  // Changing `active` (auto or manual) resets to a full AUTO_MS window.
  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    if (prevActiveRef.current !== active) {
      prevActiveRef.current = active
      remainingRef.current = AUTO_MS
      deadlineRef.current = null
      clearTimer()
    }

    if (!playing) {
      if (deadlineRef.current != null) {
        remainingRef.current = Math.max(50, deadlineRef.current - Date.now())
        deadlineRef.current = null
      }
      clearTimer()
      return
    }

    deadlineRef.current = Date.now() + remainingRef.current
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      deadlineRef.current = null
      remainingRef.current = AUTO_MS
      setActive((i) => (i + 1) % n)
    }, remainingRef.current)

    return () => {
      if (deadlineRef.current != null) {
        remainingRef.current = Math.max(50, deadlineRef.current - Date.now())
        deadlineRef.current = null
      }
      clearTimer()
    }
  }, [playing, active, n])

  useEffect(() => {
    if (openIndex !== null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActive((i) => (i + 1) % n)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActive((i) => (i - 1 + n) % n)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex, n])

  const go = (delta: number) => {
    setActive((i) => (i + delta + n) % n)
  }

  const jumpTo = (index: number) => {
    setActive(((index % n) + n) % n)
  }

  return (
    <LifePageShell
      className="life-page--photos"
      title="Photography"
      lead="A revolving reel of frames I keep coming back to."
    >
      <div className="photo-cover-toolbar">
        <div className="photo-cover-toolbar__nav">
          <button
            type="button"
            className="photo-cover-toolbar__btn"
            aria-label="Previous photo"
            onClick={() => go(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="photo-cover-toolbar__btn"
            aria-label="Next photo"
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="photo-cover"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setPaused(false)
          }
        }}
      >
        <div className="photo-cover__stage">
          {photos.map((photo, i) => {
            const offset = signedOffset(i, active, n)
            if (Math.abs(offset) > SIDE_DEPTH) return null
            return (
              <CoverCard
                key={photo.id}
                photo={photo}
                offset={offset}
                onSelect={() => {
                  if (offset === 0) setOpenIndex(i)
                  else jumpTo(i)
                }}
              />
            )
          })}
        </div>
      </div>

      {openIndex !== null ? (
        <PhotoViewer
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </LifePageShell>
  )
}
