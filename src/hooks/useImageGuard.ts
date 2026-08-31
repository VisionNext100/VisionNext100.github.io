import { useEffect } from 'react'

/**
 * Stops casual save/drag of images. This is a courtesy lock, not DRM:
 * the files are still in the network panel and page source.
 */
export function useImageGuard() {
  useEffect(() => {
    const isImage = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('img'))

    const onContextMenu = (event: MouseEvent) => {
      if (isImage(event.target)) event.preventDefault()
    }

    const onDragStart = (event: DragEvent) => {
      if (isImage(event.target)) event.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [])
}
