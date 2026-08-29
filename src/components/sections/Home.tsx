import { useState, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '../../data/site'
import { cvExists } from '../../lib/cv'
import { useQuoteCycle } from '../../hooks/useQuoteCycle'
import { CopyToast, useCopyToast } from '../ui/CopyToast'
import { ParticleField } from '../ui/ParticleField'
import './Home.css'

const CV_SOON = 'The resume will be available soon.'

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
      />
    </svg>
  )
}

function IconCv() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L19.5 9H15zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h5v1.5H8V10z"
      />
    </svg>
  )
}

function Cursor() {
  return <span className="home__cursor" aria-hidden="true" />
}

type Props = {
  /** Wait until the splash overlay is gone so typing and tags play on the real first paint. */
  active?: boolean
}

export function Home({ active = true }: Props) {
  const reduce = useReducedMotion()
  const cycle = useQuoteCycle(SITE.quotes, {
    enabled: active,
    reduceMotion: Boolean(reduce),
  })
  const [cvNote, setCvNote] = useState<string | null>(null)
  const [cvBusy, setCvBusy] = useState(false)
  const { toast, copy } = useCopyToast()

  async function onCvClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    if (cvBusy) return
    setCvBusy(true)
    setCvNote(null)
    try {
      const ok = await cvExists()
      if (!ok) {
        setCvNote(CV_SOON)
        return
      }
      const link = document.createElement('a')
      link.href = SITE.cvPath
      link.download = 'YehanWANG_CV.pdf'
      link.rel = 'noreferrer'
      document.body.appendChild(link)
      link.click()
      link.remove()
    } finally {
      setCvBusy(false)
    }
  }

  const liveQuote = cycle.showAuthor
    ? `“${cycle.full.text}” — ${cycle.full.author}`
    : ''

  return (
    <section id="home" className="home">
      <ParticleField />
      <div className="home__inner">
        <motion.figure
          className="home__quotes"
          animate={{ opacity: !active || cycle.fading ? 0 : 1 }}
          transition={{ duration: cycle.fading ? 0.55 : 0.35 }}
        >
          <blockquote className="home__quote">
            <p>
              {cycle.quote}
              {cycle.typingQuote && active ? <Cursor /> : null}
            </p>
          </blockquote>
          <motion.figcaption
            className="home__author"
            initial={false}
            animate={{ opacity: cycle.showAuthor ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
          >
            — {cycle.full.author}
          </motion.figcaption>
          <p className="visually-hidden" aria-live="polite">
            {liveQuote}
          </p>
        </motion.figure>

        <div id="about" className="home__identity">
          <div className="home__person">
            <div className="home__avatar">
              <img
                src={SITE.profilePhoto}
                alt="Portrait of Yehan Wang"
                className="home__avatar-img"
              />
            </div>

            <div className="home__actions">
              <button
                type="button"
                className="home__chip"
                onClick={() => copy('Email', SITE.email)}
                aria-label="Copy email address"
              >
                <span className="home__icon">
                  <IconMail />
                </span>
                <span>
                  <small>Email</small>
                  {SITE.email}
                </span>
              </button>
              <a
                className="home__chip"
                href={SITE.cvPath}
                onClick={onCvClick}
                aria-busy={cvBusy}
              >
                <span className="home__icon">
                  <IconCv />
                </span>
                <span>
                  <small>Resume</small>
                  Download CV
                </span>
              </a>
              {cvNote ? (
                <p className="home__cv-note" role="status">
                  {cvNote}
                </p>
              ) : null}
            </div>
          </div>

          <div className="home__details">
            <h1 className="home__name">{SITE.shortName}</h1>
            <dl className="home__facts">
              {SITE.facts.map((fact) => (
                <div className="home__fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="home__tags">
              {SITE.tags.map((tag, i) => (
                <motion.li
                  key={tag}
                  className="home__tag"
                  initial={reduce ? false : { y: -48, opacity: 0 }}
                  animate={
                    active || reduce ? { y: 0, opacity: 1 } : { y: -48, opacity: 0 }
                  }
                  transition={
                    reduce || !active
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: 430,
                          damping: 15,
                          delay: 0.08 + i * 0.1,
                        }
                  }
                >
                  {tag}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <CopyToast message={toast} />
    </section>
  )
}
