import { useState, type FormEvent } from 'react'
import { SITE } from '../../data/site'
import { SectionReveal } from '../ui/SectionReveal'
import './Contact.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

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

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setMessage('Thanks — your message was sent.')
      form.reset()
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

            <form className="contact__form" onSubmit={onSubmit}>
              <div className="contact__row">
                <label>
                  Name
                  <input name="name" type="text" required autoComplete="name" />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
              </div>
              <label>
                Message
                <textarea name="message" rows={3} required />
              </label>
              <input
                type="hidden"
                name="_subject"
                value="Homepage contact form"
              />
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
