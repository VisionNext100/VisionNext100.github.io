import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

type GoatCounterApi = {
  count?: (vars?: { path?: string; title?: string; referrer?: string }) => void
  no_onload?: boolean
}

declare global {
  interface Window {
    goatcounter?: GoatCounterApi
  }
}

const ENDPOINT = import.meta.env.VITE_GOATCOUNTER_ENDPOINT?.trim()

function visitPath(pathname: string, search: string, hash: string) {
  return `${pathname}${search}${hash}` || '/'
}

function sendCount(path: string) {
  const count = window.goatcounter?.count
  if (typeof count !== 'function') return false
  count.call(window.goatcounter, { path })
  return true
}

/**
 * Privacy-friendly page views via GoatCounter (no on-page UI).
 * Set VITE_GOATCOUNTER_ENDPOINT=https://YOURCODE.goatcounter.com/count
 */
export function VisitorBeacon() {
  const location = useLocation()
  const pending = useRef<string | null>(null)

  useEffect(() => {
    if (!ENDPOINT) return

    // Must set before count.js runs so it skips the automatic first hit.
    window.goatcounter = { ...(window.goatcounter ?? {}), no_onload: true }

    const flush = () => {
      const path = pending.current
      if (!path) return
      if (sendCount(path)) pending.current = null
    }

    let script = document.querySelector<HTMLScriptElement>(
      'script[data-goatcounter]',
    )

    if (!script) {
      script = document.createElement('script')
      script.async = true
      script.src = 'https://gc.zgo.at/count.js'
      script.dataset.goatcounter = ENDPOINT
      document.body.appendChild(script)
    }

    script.addEventListener('load', flush)
    // count.js may already be cached/loaded
    flush()
    const timer = window.setInterval(flush, 300)
    const stop = window.setTimeout(() => window.clearInterval(timer), 8000)

    return () => {
      script?.removeEventListener('load', flush)
      window.clearInterval(timer)
      window.clearTimeout(stop)
    }
  }, [])

  useEffect(() => {
    if (!ENDPOINT) return
    const path = visitPath(location.pathname, location.search, location.hash)
    if (!sendCount(path)) pending.current = path
  }, [location.pathname, location.search, location.hash])

  return null
}
