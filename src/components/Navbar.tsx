import { NAV_ITEMS, SITE } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export function Navbar() {
  const location = useLocation()
  const onHome = location.pathname === '/'
  const onLifeSubpage = location.pathname.startsWith('/life/')
  const sectionActive = useActiveSection()
  const active = onLifeSubpage ? 'life' : onHome ? sectionActive : ''
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  function sectionHref(id: string) {
    return onHome ? `#${id}` : `/#${id}`
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/#home" className="navbar__brand" onClick={() => setOpen(false)}>
          {SITE.githubUser}
        </Link>

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
              href={sectionHref(item.id)}
              className={`navbar__link ${active === item.id ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={sectionHref('contact')}
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
