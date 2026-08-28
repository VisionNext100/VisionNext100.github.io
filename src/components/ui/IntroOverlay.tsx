import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './IntroOverlay.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** Jittered grid keeps the constellation even across any viewport. */
const GRID_COLS = 10
const GRID_ROWS = 6
const LINK_DISTANCE = 12

/** Position in percent of the overlay; size in device pixels. */
type Star = { x: number; y: number; size: number }

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Constellation field mirroring the banner artwork; seeded so it never shifts. */
function buildStarfield() {
  const rand = mulberry32(20260828)
  const stars: Star[] = []

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      stars.push({
        x: ((col + 0.2 + rand() * 0.6) / GRID_COLS) * 100,
        y: ((row + 0.2 + rand() * 0.6) / GRID_ROWS) * 100,
        size: 2 + rand() * 2.6,
      })
    }
  }

  const links: Array<[Star, Star]> = []
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i]
      const b = stars[j]
      if (Math.hypot(a.x - b.x, a.y - b.y) < LINK_DISTANCE) links.push([a, b])
    }
  }

  return { stars, links }
}

type Props = {
  onDone: () => void
}

export function IntroOverlay({ onDone }: Props) {
  const reduce = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const { stars, links } = useMemo(buildStarfield, [])

  const holdMs = reduce ? 350 : 1800
  const exitSec = reduce ? 0.25 : 0.5

  const leave = useCallback(() => setLeaving(true), [])

  useEffect(() => {
    const timer = window.setTimeout(leave, holdMs)
    return () => window.clearTimeout(timer)
  }, [holdMs, leave])

  // Let visitors dismiss the splash instead of waiting it out.
  useEffect(() => {
    window.addEventListener('pointerdown', leave)
    window.addEventListener('keydown', leave)
    return () => {
      window.removeEventListener('pointerdown', leave)
      window.removeEventListener('keydown', leave)
    }
  }, [leave])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const step = (delay: number) =>
    reduce
      ? { duration: 0.2, delay: 0 }
      : { duration: 0.65, delay, ease: EASE }

  return (
    <motion.div
      className="intro"
      role="presentation"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={leaving ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
      transition={{ duration: exitSec, ease: EASE }}
      onAnimationComplete={() => {
        if (leaving) onDone()
      }}
    >
      <motion.div
        className="intro__stars"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 1.2, ease: 'linear' }}
      >
        <svg
          className="intro__links"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {links.map(([a, b], i) => (
            <line
              key={`l${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {stars.map((s, i) => (
          <span
            key={`s${i}`}
            className="intro__star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
      </motion.div>

      <div className="intro__brand">
        <motion.img
          className="intro__mark"
          src="/apple-touch-icon.png"
          alt=""
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={step(0.15)}
        />

        <div className="intro__text">
          <motion.div
            className="intro__title"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            transition={step(0.45)}
          >
            VisionNext100
          </motion.div>

          <motion.p
            className="intro__name"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={step(0.75)}
          >
            Yehan Wang
          </motion.p>

          <div className="intro__rule">
            <motion.span
              className="intro__rule-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={step(0.95)}
            />
            <motion.span
              className="intro__rule-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { duration: 0.45, delay: 1.15, ease: EASE }
              }
            />
          </div>

          <motion.p
            className="intro__eyebrow"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={step(1.15)}
          >
            Personal Homepage
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}
