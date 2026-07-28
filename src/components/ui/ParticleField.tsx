import { useEffect, useRef } from 'react'
import './ParticleField.css'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles: Particle[] = []
    let raf = 0
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(110, Math.floor((width * height) / 11000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: Math.random() * 2.1 + 0.9,
      }))
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const onLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        if (!reduce) {
          const dx = p.x - mouse.current.x
          const dy = p.y - mouse.current.y
          const dist = Math.hypot(dx, dy)
          if (dist < 160 && dist > 0.001) {
            const force = (160 - dist) / 160
            p.vx += (dx / dist) * force * 0.055
            p.vy += (dy / dist) * force * 0.055
          }

          p.vx *= 0.982
          p.vy *= 0.982
          p.x += p.vx
          p.y += p.vy

          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1
          p.x = Math.max(0, Math.min(width, p.x))
          p.y = Math.max(0, Math.min(height, p.y))
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(27, 58, 75, 0.42)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 125) {
            ctx.strokeStyle = `rgba(42, 157, 143, ${0.32 * (1 - d / 125)})`
            ctx.lineWidth = 1.15
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Soft mouse halo for clearer interaction feedback
      if (!reduce && mouse.current.x > 0) {
        const g = ctx.createRadialGradient(
          mouse.current.x,
          mouse.current.y,
          0,
          mouse.current.x,
          mouse.current.y,
          90,
        )
        g.addColorStop(0, 'rgba(42, 157, 143, 0.12)')
        g.addColorStop(1, 'rgba(42, 157, 143, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(mouse.current.x, mouse.current.y, 90, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
