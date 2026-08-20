import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function navOffsetPx() {
  const nav = document.querySelector('.navbar')
  return nav?.getBoundingClientRect().height ?? 68
}

/** Scroll to hash targets after client-side navigation (e.g. /life → /#life). */
export function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/' || !hash) return
    const id = hash.replace(/^#/, '')

    const t = window.setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - navOffsetPx()
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }, 40)
    return () => window.clearTimeout(t)
  }, [pathname, hash])
}
