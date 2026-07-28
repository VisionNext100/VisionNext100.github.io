import { useEffect, useState } from 'react'

type Options = {
  words: readonly string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseMs?: number
}

export function useTypewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 55,
  pauseMs = 1800,
}: Options) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timer: number

    if (!deleting && text === word) {
      timer = window.setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timer = window.setTimeout(
        () => {
          const next = deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1)
          setText(next)
        },
        deleting ? deletingSpeed : typingSpeed,
      )
    }

    return () => window.clearTimeout(timer)
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pauseMs])

  return text
}
