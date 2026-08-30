import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../lib/clipboard'

/** Same copy-then-toast pattern used by the footer GitHub / Email links. */
export function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number>(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function show(message: string) {
    window.clearTimeout(timer.current)
    setToast(message)
    timer.current = window.setTimeout(() => setToast(null), 1800)
  }

  async function copy(label: string, value: string) {
    try {
      await copyText(value)
      show(`${label} copied`)
    } catch {
      show(`Could not copy ${label}`)
    }
  }

  return { toast, copy, show }
}

export function CopyToast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="copy-toast" role="status">
      {message}
    </div>
  )
}
