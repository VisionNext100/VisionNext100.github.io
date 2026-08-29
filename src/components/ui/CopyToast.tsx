import { useState } from 'react'
import { copyText } from '../../lib/clipboard'

/** Same copy-then-toast pattern used by the footer GitHub / Email links. */
export function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null)

  async function copy(label: string, value: string) {
    try {
      await copyText(value)
      setToast(`${label} copied`)
    } catch {
      setToast(`Could not copy ${label}`)
    }
    window.setTimeout(() => setToast(null), 1800)
  }

  return { toast, copy }
}

export function CopyToast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="copy-toast" role="status">
      {message}
    </div>
  )
}
