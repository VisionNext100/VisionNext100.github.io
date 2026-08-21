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

/**
 * Privacy-friendly page views via GoatCounter (no on-page UI).
 * Set VITE_GOATCOUNTER_ENDPOINT=https://YOURCODE.goatcounter.com/count
 */
export function VisitorBeacon() {
  const location = useLocation()
  const ready = useRef(false)
  const pending = useRef<string | null>(null)

  useEffect(() => {
    if (!ENDPOINT) return

    window.goatcounter = { ...(window.goatcounter ?? {}), no_onload: true }

    if (document.querySelector('script[data-goatcounter]')) {
      ready.current = true
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://gc.zgo.at/count.js'
    script.dataset.goatcounter = ENDPOINT
    script.onload = () => {
      ready.current = true
      const path = pending.current
      pending.current = null
      if (path) window.goatcounter?.count?.({ path })
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!ENDPOINT) return
    const path = visitPath(location.pathname, location.search, location.hash)
    if (ready.current && window.goatcounter?.count) {
      window.goatcounter.count({ path })
    } else {
      pending.current = path
    }
  }, [location.pathname, location.search, location.hash])

  return null
}
