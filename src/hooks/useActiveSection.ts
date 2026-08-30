import { useEffect, useState } from 'react'
import { NAV_ITEMS } from '../data/site'

/**
 * Highlight the nav item whose section last crossed a spy line near the
 * upper third of the viewport. IntersectionObserver ratios fail on tall
 * sections (Projects): a 15% band can never cover 10% of a 3000px block,
 * so Skills stayed active all the way through.
 */
export function useActiveSection() {
  const [active, setActive] = useState<string>('home')

  useEffect(() => {
    const ids = NAV_ITEMS.map((item) => item.id)

    const update = () => {
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))
      if (!elements.length) return

      const spy = window.innerHeight * 0.32
      let current = elements[0].id
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= spy) current = el.id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('hashchange', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('hashchange', update)
    }
  }, [])

  return active
}
