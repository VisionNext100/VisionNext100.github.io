import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import './IntroOverlay.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** Jittered grid keeps the constellation even across any viewport. */
const GRID_COLS = 10
const GRID_ROWS = 6
const LINK_DISTANCE = 12

/** Position in percent of the overlay; size in device pixels. */
type Star = { x: number; y: number; size: number }

/** Travel offsets are percentages of the shape's own size. */
type Travel = { x: number; y: number }

type Shape = {
  id: string
  /** Silhouette class for the inner element. */
  className: string
  /** Anchor and size of the orbit wrapper. */
  box: React.CSSProperties
  color: string
  /**
   * Drawn as an SVG polygon instead of a rounded box. Its colour must be opaque
   * and its alpha supplied via `opacity`: fill and stroke overlap at the rounded
   * joins, and a translucent paint would darken that band twice.
   */
  polygon?: string
  opacity?: number
  enter: Travel
  exit: Travel
  /** Resting tilt in degrees. */
  tilt: number
  /** Degrees swept on entry and exit; one sign keeps the turn going one way. */
  spin: number
  /** Idle roll: degrees per loop (sign matches spin) and its period in ms. */
  roll: number
  rollMs: number
  /**
   * Idle wander in percent of the shape's own size. Keyframes start and end at
   * zero so the loop is seamless; x and y run at different periods so the path
   * traces a slow figure rather than a straight line.
   */
  drift: { x: number[]; y: number[]; ms: number }
}

/**
 * Four oversized colour blocks, one per corner, anchored well past the edges so
 * only a shallow slice of each is on screen. Distinct silhouettes and a mostly
 * lateral idle orbit keep the composition from clumping, and travel stays clear
 * of the centred brand block.
 */
const SHAPES: Shape[] = [
  {
    id: 'marigold',
    className: 'intro__shape intro__shape--dome',
    box: { top: '-27vmax', left: '6vw', width: '33vmax', height: '33vmax' },
    color: 'rgba(238, 172, 58, 0.9)',
    enter: { x: -24, y: -62 },
    exit: { x: 34, y: -96 },
    tilt: -6,
    spin: 82,
    roll: 360,
    rollMs: 22000,
    drift: { x: [0, 15, 5, 0], y: [0, 7, 2, 0], ms: 11000 },
  },
  {
    id: 'terracotta',
    className: 'intro__shape intro__shape--squircle',
    box: { top: '-21vmax', right: '-13vw', width: '30vmax', height: '30vmax' },
    color: 'rgba(223, 116, 72, 0.85)',
    enter: { x: 72, y: -44 },
    exit: { x: 104, y: -30 },
    tilt: 12,
    spin: -92,
    roll: -360,
    rollMs: 26000,
    drift: { x: [0, -12, -4, 0], y: [0, 9, 3, 0], ms: 12500 },
  },
  {
    id: 'blush',
    className: 'intro__shape intro__shape--leaf',
    box: { bottom: '-21vmax', left: '-11vw', width: '36vmax', height: '31vmax' },
    color: 'rgba(238, 163, 178, 0.78)',
    enter: { x: -68, y: 58 },
    exit: { x: -98, y: 44 },
    tilt: -14,
    spin: 86,
    roll: 360,
    rollMs: 28000,
    drift: { x: [0, 13, 4, 0], y: [0, -8, -3, 0], ms: 13500 },
  },
  {
    id: 'sage',
    className: 'intro__shape',
    box: { bottom: '-25vmax', right: '1vw', width: '37vmax', height: '37vmax' },
    color: 'rgb(143, 175, 104)',
    polygon: '50,8 92,88 8,88',
    opacity: 0.72,
    enter: { x: 48, y: 66 },
    exit: { x: 72, y: 88 },
    tilt: 16,
    spin: -104,
    roll: -360,
    rollMs: 24000,
    drift: { x: [0, -11, -4, 0], y: [0, -7, -2, 0], ms: 10500 },
  },
]

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

/** Hexagon that grows from the centre while rotating. */
function hexPath(progress: number, w: number, h: number) {
  const maxRadius = (Math.hypot(w, h) / 2 / Math.cos(Math.PI / 6)) * 1.02
  const radius = progress * maxRadius
  const spin = ((-30 + 105 * progress) * Math.PI) / 180
  const cx = w / 2
  const cy = h / 2

  const hex = Array.from({ length: 6 }, (_, i) => {
    const angle = spin - Math.PI / 2 + (i * Math.PI) / 3
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return `${x.toFixed(1)} ${y.toFixed(1)}`
  })

  return `M${hex[0]} L${hex[1]} L${hex[2]} L${hex[3]} L${hex[4]} L${hex[5]} Z`
}

/**
 * Full-bleed cover with a hexagonal hole (even-odd fill), so growing the hole
 * opens the site through a rotating hexagon.
 */
function coverPath(progress: number, w: number, h: number) {
  return `M0 0 H${w} V${h} H0 Z ${hexPath(progress, w, h)}`
}

type Props = {
  onDone: () => void
}

export function IntroOverlay({ onDone }: Props) {
  const reduce = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  const [viewport, setViewport] = useState(() => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  }))
  const { stars, links } = useMemo(buildStarfield, [])
  const coverRef = useRef<SVGPathElement>(null)
  const edgeRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const reveal = useMotionValue(0)

  const holdMs = reduce ? 350 : 2350
  const leave = useCallback(() => setLeaving(true), [])

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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

  useMotionValueEvent(reveal, 'change', (value) => {
    coverRef.current?.setAttribute(
      'd',
      coverPath(value, viewport.w, viewport.h),
    )
    const rim = hexPath(value, viewport.w, viewport.h)
    // The rim carries the reveal, so it stays readable most of the way out.
    const rimOpacity = String(Math.max(0, 0.85 - value * 0.85))

    for (const ref of [edgeRef, glowRef]) {
      const el = ref.current
      if (!el) continue
      el.setAttribute('d', rim)
      el.setAttribute('opacity', rimOpacity)
    }
  })

  useEffect(() => {
    if (!leaving) return
    const controls = animate(reveal, 1, {
      duration: reduce ? 0.25 : 1.45,
      delay: reduce ? 0 : 0.15,
      ease: [0.4, 0, 0.2, 1],
      onComplete: onDone,
    })
    return () => controls.stop()
  }, [leaving, onDone, reduce, reveal])

  const step = (delay: number) =>
    reduce ? { duration: 0.2, delay: 0 } : { duration: 0.65, delay, ease: EASE }

  const fadeOut = leaving ? { opacity: 0 } : { opacity: 1 }

  return (
    <div className="intro" role="presentation" aria-hidden="true">
      <svg
        className="intro__cover"
        viewBox={`0 0 ${viewport.w} ${viewport.h}`}
        preserveAspectRatio="none"
      >
        <path
          ref={coverRef}
          className="intro__cover-fill"
          d={coverPath(0, viewport.w, viewport.h)}
          fillRule="evenodd"
        />
        <path
          ref={glowRef}
          className="intro__cover-glow"
          d={hexPath(0, viewport.w, viewport.h)}
          opacity={0}
        />
        <path
          ref={edgeRef}
          className="intro__cover-edge"
          d={hexPath(0, viewport.w, viewport.h)}
          opacity={0}
        />
      </svg>

      {reduce ? null : (
        <div className="intro__geometry">
          {SHAPES.map((shape, i) => (
            /* Outer element owns the fast entry and exit sweep; the inner one
               keeps a slow orbit running underneath the whole time. */
            <motion.span
              key={shape.id}
              className="intro__orbit"
              style={shape.box}
              initial={{
                x: `${shape.enter.x}%`,
                y: `${shape.enter.y}%`,
                rotate: shape.tilt - shape.spin,
                opacity: 0,
              }}
              animate={
                leaving
                  ? {
                      x: `${shape.exit.x}%`,
                      y: `${shape.exit.y}%`,
                      rotate: shape.tilt + shape.spin * 0.9,
                      opacity: 0,
                    }
                  : { x: '0%', y: '0%', rotate: shape.tilt, opacity: 1 }
              }
              transition={{
                duration: leaving ? 0.7 : 1.05,
                delay: leaving ? i * 0.04 : 0.04 + i * 0.08,
                ease: leaving ? [0.5, 0, 0.78, 0] : EASE,
                opacity: leaving
                  ? { duration: 0.5, delay: 0.15 + i * 0.04 }
                  : { duration: 0.5, delay: 0.04 + i * 0.08 },
              }}
            >
              <motion.span
                className={shape.className}
                style={
                  shape.polygon
                    ? { opacity: shape.opacity }
                    : { background: shape.color }
                }
                animate={{
                  x: shape.drift.x.map((v) => `${v}%`),
                  y: shape.drift.y.map((v) => `${v}%`),
                  rotate: [0, shape.roll],
                }}
                transition={{
                  x: {
                    duration: shape.drift.ms / 1000,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  y: {
                    duration: (shape.drift.ms * 1.4) / 1000,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  rotate: {
                    duration: shape.rollMs / 1000,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              >
                {shape.polygon ? (
                  /* Same colour on fill and stroke, with round joins, so the
                     corners match the radii used by the other silhouettes. */
                  <svg className="intro__polygon" viewBox="0 0 100 100">
                    <polygon
                      points={shape.polygon}
                      fill={shape.color}
                      stroke={shape.color}
                      strokeWidth={13}
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </motion.span>
            </motion.span>
          ))}
        </div>
      )}

      <motion.div
        className="intro__stars"
        initial={{ opacity: 0 }}
        animate={leaving ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : leaving ? 0.35 : 1.2 }}
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

      <motion.div
        className="intro__brand"
        animate={fadeOut}
        transition={{ duration: leaving ? 0.3 : 0 }}
      >
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
            transition={step(0.7)}
          >
            Yehan Wang
          </motion.p>

          <div className="intro__rule">
            <motion.span
              className="intro__rule-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={step(0.9)}
            />
            <motion.span
              className="intro__rule-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { duration: 0.45, delay: 1.1, ease: EASE }
              }
            />
          </div>

          <motion.p
            className="intro__eyebrow"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={step(1.1)}
          >
            Personal Homepage
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
