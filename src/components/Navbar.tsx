import { NAV_ITEMS, SITE } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useEffect, useState } from 'react'
import './Navbar.css'

export function Navbar() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#home" className="navbar__brand" onClick={() => setOpen(false)}>
          {SITE.githubUser}
        </a>

        <button
          className="navbar__toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav className={`navbar__nav ${open ? 'navbar__nav--open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`navbar__link ${active === item.id ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="navbar__cta"
            onClick={() => setOpen(false)}
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  )
}
