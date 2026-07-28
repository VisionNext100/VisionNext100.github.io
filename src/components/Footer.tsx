import { useState } from 'react'
import { SITE } from '../data/site'
import './Footer.css'

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

export function Footer() {
  const year = new Date().getFullYear()
  const [toast, setToast] = useState<string | null>(null)

  async function handleCopy(label: string, value: string) {
    try {
      await copyText(value)
      setToast(`${label} copied`)
    } catch {
      setToast(`Could not copy ${label}`)
    }
    window.setTimeout(() => setToast(null), 1800)
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          © {year} {SITE.shortName}. All rights reserved.
        </p>
        <div className="footer__links">
          <button
            type="button"
            className="footer__copy"
            onClick={() => handleCopy('GitHub link', SITE.github)}
          >
            GitHub
          </button>
          <button
            type="button"
            className="footer__copy"
            onClick={() => handleCopy('Email', SITE.email)}
          >
            Email
          </button>
          <a href="#home">Back to top</a>
        </div>
      </div>
      {toast ? (
        <div className="footer__toast" role="status">
          {toast}
        </div>
      ) : null}
    </footer>
  )
}
