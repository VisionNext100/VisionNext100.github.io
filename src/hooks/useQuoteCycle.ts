import { useEffect, useState } from 'react'

export type Quote = {
  text: string
  author: string
}

type Phase = 'quote' | 'author' | 'hold' | 'fade'

type Options = {
  enabled?: boolean
  reduceMotion?: boolean
  typingSpeed?: number
  authorFadeMs?: number
  holdMs?: number
  fadeMs?: number
}

const EMPTY: Quote = { text: '', author: '' }

/**
 * Types a quote, fades in the author, holds, fades the pair, then advances.
 * The next sentence starts from a blank line — no character deletion.
 */
export function useQuoteCycle(
  quotes: readonly Quote[],
  {
    enabled = true,
    reduceMotion = false,
    typingSpeed = 48,
    authorFadeMs = 480,
    holdMs = 2800,
    fadeMs = 550,
  }: Options = {},
) {
  const [index, setIndex] = useState(0)
  const [quoteChars, setQuoteChars] = useState(0)
  const [phase, setPhase] = useState<Phase>('quote')

  const current = quotes[index] ?? EMPTY

  useEffect(() => {
    if (enabled) return
    setIndex(0)
    setQuoteChars(0)
    setPhase('quote')
  }, [enabled])

  useEffect(() => {
    if (!enabled || quotes.length === 0) return

    let timer: number
    const quote = quotes[index % quotes.length]

    if (reduceMotion) {
      if (phase === 'quote' || phase === 'author') {
        setQuoteChars(quote.text.length)
        timer = window.setTimeout(() => setPhase('hold'), 40)
      } else if (phase === 'hold') {
        timer = window.setTimeout(() => setPhase('fade'), holdMs)
      } else {
        timer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % quotes.length)
          setQuoteChars(0)
          setPhase('quote')
        }, fadeMs)
      }
      return () => window.clearTimeout(timer)
    }

    if (phase === 'quote') {
      if (quoteChars >= quote.text.length) {
        timer = window.setTimeout(() => setPhase('author'), 120)
      } else {
        timer = window.setTimeout(
          () => setQuoteChars((n) => n + 1),
          typingSpeed,
        )
      }
    } else if (phase === 'author') {
      timer = window.setTimeout(() => setPhase('hold'), authorFadeMs)
    } else if (phase === 'hold') {
      timer = window.setTimeout(() => setPhase('fade'), holdMs)
    } else {
      timer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length)
        setQuoteChars(0)
        setPhase('quote')
      }, fadeMs)
    }

    return () => window.clearTimeout(timer)
  }, [
    authorFadeMs,
    enabled,
    fadeMs,
    holdMs,
    index,
    phase,
    quoteChars,
    quotes,
    reduceMotion,
    typingSpeed,
  ])

  return {
    quote: current.text.slice(0, quoteChars),
    full: current,
    phase,
    fading: phase === 'fade',
    typingQuote: phase === 'quote',
    showAuthor: phase === 'author' || phase === 'hold' || phase === 'fade',
  }
}
