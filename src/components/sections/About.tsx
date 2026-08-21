import { useState, type MouseEvent } from 'react'
import { SITE } from '../../data/site'
import { SectionReveal } from '../ui/SectionReveal'
import './About.css'

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

const CV_SOON = 'The resume will be available soon.'

async function cvExists(): Promise<boolean> {
  try {
    const head = await fetch(SITE.cvPath, { method: 'HEAD', cache: 'no-store' })
    if (head.ok) return true
    // Some hosts are picky about HEAD; fall back to a tiny GET probe.
    const get = await fetch(SITE.cvPath, {
      method: 'GET',
      cache: 'no-store',
      headers: { Range: 'bytes=0-0' },
    })
    return get.ok || get.status === 206
  } catch {
    return false
  }
}

export function About() {
  const [cvNote, setCvNote] = useState<string | null>(null)
  const [cvBusy, setCvBusy] = useState(false)

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

  return (
    <section id="about" className="section section--alt">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">About</p>
          <h2 className="section__title">About Me</h2>
          <p className="section__lead">
            A short introduction to who I am and what I care about building.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="about__layout">
            <div className="about__content">
              <p>
                I&apos;m Yehan Wang, a sophomore in Computer Science at East
                China Normal University. My passion lies at the intersection of
                AI and systems design—building intelligent solutions that solve
                real-world problems.
              </p>
              <p>
                Currently, I&apos;m working on an &quot;Expert Model for
                Purchased Parts Processes and Problem-Solving&quot; at the SAIC
                VOLKSWAGEN AI Hackathon 2026, where we&apos;re developing
                AI-powered workflows and automated monitoring systems to
                streamline quality control in automotive manufacturing.
                Previously, I led the development of AdenoGuard, an AI-driven
                multi-modal screening system for pediatric adenoid hypertrophy,
                and contributed to a next-gen intelligent map layout system.
                I&apos;ve also applied machine learning to analyze audience
                preferences in the MCM/ICM competition.
              </p>
              <p>
                Beyond academics, I enjoy data visualization, photography, and
                exploring creative ways to make technology more intuitive and
                human-centered. I&apos;m always eager to learn, collaborate, and
                take on challenges that push boundaries.
              </p>
            </div>

            <aside className="about__aside">
              <a className="about__chip" href={`mailto:${SITE.email}`}>
                <span className="about__icon">
                  <IconMail />
                </span>
                <span>
                  <small>Email</small>
                  {SITE.email}
                </span>
              </a>
              <a
                className="about__chip"
                href={SITE.cvPath}
                onClick={onCvClick}
                aria-busy={cvBusy}
              >
                <span className="about__icon">
                  <IconCv />
                </span>
                <span>
                  <small>Resume</small>
                  Download CV
                </span>
              </a>
              {cvNote ? (
                <p className="about__cv-note" role="status">
                  {cvNote}
                </p>
              ) : null}
            </aside>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
