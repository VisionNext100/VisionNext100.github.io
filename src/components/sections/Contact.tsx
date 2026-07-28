import { useEffect, useRef, useState, type FormEvent } from 'react'
import { SITE } from '../../data/site'
import { SectionReveal } from '../ui/SectionReveal'
import './Contact.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

const MAX_NAME = 80
const MAX_EMAIL = 120
const MAX_MESSAGE = 1200
const MIN_MESSAGE = 10
const COOLDOWN_MS = 45_000
const MIN_FILL_MS = 2500

const STORAGE_KEY = 'homepage_contact_last_submit'

function looksLikeSpam(name: string, email: string, message: string) {
  const urlCount = (message.match(/https?:\/\//gi) ?? []).length
  if (urlCount >= 3) return 'Too many links in the message.'
  if (/(viagra|crypto\s*invest|casino|loan\s*now)/i.test(message)) {
    return 'Message blocked by spam filter.'
  }
  if (name.trim().length < 2) return 'Please enter a valid name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email.'
  }
  if (message.trim().length < MIN_MESSAGE) {
    return `Message should be at least ${MIN_MESSAGE} characters.`
  }
  if (message.length > MAX_MESSAGE) {
    return `Message is too long (max ${MAX_MESSAGE} characters).`
  }
  return null
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot — bots often fill hidden fields
    const honey = String(data.get('website') ?? '').trim()
    if (honey) {
      setStatus('success')
      setMessage('Thanks — your message was sent.')
      form.reset()
      return
    }

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const body = String(data.get('message') ?? '').trim()

    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus('error')
      setMessage('Please take a moment to write your message, then try again.')
      return
    }

    const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
    if (Date.now() - last < COOLDOWN_MS) {
      setStatus('error')
      setMessage('Please wait about a minute before sending another message.')
      return
    }

    const spamReason = looksLikeSpam(name, email, body)
    if (spamReason) {
      setStatus('error')
      setMessage(spamReason)
      return
    }

    const formId = SITE.formspreeId?.trim()
    if (!formId || formId === 'your_form_id_here') {
      setStatus('error')
      setMessage(
        'Formspree is not configured yet. Please set VITE_FORMSPREE_ID in .env.',
      )
      return
    }

    setStatus('loading')
    setMessage('')

    // Only send intended fields
    const payload = new FormData()
    payload.set('name', name.slice(0, MAX_NAME))
    payload.set('email', email.slice(0, MAX_EMAIL))
    payload.set('message', body.slice(0, MAX_MESSAGE))
    payload.set('_subject', 'Homepage contact form')

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) throw new Error('Request failed')
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
      setStatus('success')
      setMessage('Thanks — your message was sent.')
      form.reset()
      mountedAt.current = Date.now()
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please email me directly instead.')
    }
  }

  return (
    <section id="contact" className="section section--contact">
      <div className="section__inner">
        <SectionReveal>
          <p className="section__eyebrow">Contact</p>
          <h2 className="section__title">Get in Touch</h2>
          <p className="section__lead contact__lead">
            Have a question or opportunity? Send a short note.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="contact__layout">
            <div className="contact__visual">
              <img
                src={SITE.contactImage}
                alt="Illustration of sending a message"
                loading="lazy"
              />
            </div>

            <form className="contact__form" onSubmit={onSubmit} noValidate>
              {/* Honeypot field — visually hidden from humans */}
              <div className="contact__honeypot" aria-hidden="true">
                <label>
                  Website
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="contact__row">
                <label>
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    maxLength={MAX_NAME}
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={MAX_EMAIL}
                    autoComplete="email"
                  />
                </label>
              </div>
              <label>
                Message
                <textarea
                  name="message"
                  rows={3}
                  required
                  maxLength={MAX_MESSAGE}
                  minLength={MIN_MESSAGE}
                />
              </label>
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Submit'}
              </button>
              {message ? (
                <p
                  className={`contact__status ${
                    status === 'success' ? 'is-success' : 'is-error'
                  }`}
                  role="status"
                >
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
