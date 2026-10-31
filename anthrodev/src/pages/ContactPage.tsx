import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowRight, Check, ChevronDown, Copy } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Words } from '../components/SplitWords'
import ScrollProgress from '../components/case-study/ScrollProgress'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

const topics = [
  'A full-time role',
  'Hiring for a team',
  'Product design project',
  'Improving an existing product',
  'A design partnership',
  'Something else',
]

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function Sparkle({ className }: { className: string }) {
  return (
    <span className={`ct-spark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          d="M12 0.5C12.9 7.3 16.7 11.1 23.5 12 16.7 12.9 12.9 16.7 12 23.5 11.1 16.7 7.3 12.9 0.5 12 7.3 11.1 11.1 7.3 12 0.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function Squiggle({ className }: { className: string }) {
  return (
    <span className={`ct-squiggle ${className}`} aria-hidden="true">
      <svg viewBox="0 0 38 17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="ct-squiggle__line" pathLength="1" d="M1.6 6.6C4.4 5.2 7.2 2.4 10 2.4S15.2 11.8 20 12.2 28.5 8.4 33 6.8" />
        <path className="ct-squiggle__head" fill="currentColor" strokeWidth="1.2" d="M25.2 4.3 36.4 5.6 31.9 15.7 32.6 8.6Z" />
      </svg>
    </span>
  )
}

/** The two hand-drawn lines under "Let's talk." */
function Underline() {
  return (
    <svg className="ct-underline" viewBox="0 0 420 14" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path className="ct-underline__a" pathLength="1" d="M1 12.5C110 9.5 300 7.5 419 5.2" strokeWidth="1.6" />
      <path className="ct-underline__b" pathLength="1" d="M20 7.6C130 5.8 290 4.4 400 3.4" strokeWidth="1.3" />
    </svg>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      // Older browsers / blocked clipboard: select a throwaway field instead
      const el = document.createElement('textarea')
      el.value = site.email
      el.setAttribute('readonly', '')
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      try {
        document.execCommand('copy')
      } catch {
        /* nothing more to try */
      }
      el.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <button type="button" className={`ct-copy${copied ? ' is-copied' : ''}`} onClick={copy}>
        <span className="ct-copy__icon" aria-hidden="true">
          {copied ? <Check size={11} strokeWidth={2.4} /> : <Copy size={11} strokeWidth={2} />}
        </span>
        <span>{copied ? 'Copied' : 'Copy email'}</span>
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="ct-field">
      <label className="ct-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="ct-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const formRef = useRef<HTMLFormElement | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const next: Errors = {}
    if (!name) next.name = 'Please tell me your name.'
    if (!email) next.email = 'Please add your email so I can reply.'
    else if (!emailOk(email)) next.email = 'That email address doesn’t look right.'
    if (!message) next.message = 'A line or two about the project helps.'
    setErrors(next)
    if (Object.keys(next).length) {
      const first = (['name', 'email', 'message'] as const).find((k) => next[k])
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const body = new URLSearchParams()
      data.forEach((v, k) => body.append(k, String(v)))
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="ct-sent" role="status">
        <span className="ct-sent__tick" aria-hidden="true">
          <Check size={18} strokeWidth={2.4} />
        </span>
        <h3 className="ct-sent__title">Message sent.</h3>
        <p className="ct-sent__text">Thank you. I’ll reply to the email you gave as soon as I can.</p>
        <button type="button" className="ct-sent__again" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  const busy = status === 'sending'
  const err = (k: keyof Errors) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `ct-${k}-error` } : {})

  return (
    <form ref={formRef} className="ct-form" name="contact" method="POST" onSubmit={onSubmit} noValidate>
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot: people never see it, bots fill it in */}
      <p className="ct-hp" aria-hidden="true">
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <Field id="ct-name" label="Your name" error={errors.name}>
        <input id="ct-name" className="ct-input" name="name" type="text" autoComplete="name" placeholder="How should I address you?" {...err('name')} />
      </Field>
      <Field id="ct-email" label="Your email" error={errors.email}>
        <input id="ct-email" className="ct-input" name="email" type="email" autoComplete="email" placeholder="you@example.com" {...err('email')} />
      </Field>
      <Field id="ct-topic" label="What would you like to discuss?">
        <div className="ct-select">
          <select id="ct-topic" className="ct-input" name="topic" defaultValue="Product design project">
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="ct-select__chev" size={16} strokeWidth={2.2} aria-hidden="true" />
        </div>
      </Field>
      <Field id="ct-message" label="Tell me a little about it" error={errors.message}>
        <textarea
          id="ct-message"
          className="ct-input ct-input--area"
          name="message"
          placeholder="A little context, the challenge, and what you’re hoping to create…"
          {...err('message')}
        />
      </Field>

      <button type="submit" className="ct-send" disabled={busy}>
        <span>{busy ? 'Sending…' : 'Send your message'}</span>
        <svg className="ct-send__arrow" width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path d="M1.5 7.5 7.5 1.5M2.5 1.5h5v5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {status === 'error' ? (
        <p className="ct-fail" role="alert">
          That didn’t go through. Please try again, or email me directly at{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      ) : null}
    </form>
  )
}

export default function ContactPage() {
  usePageMeta(
    'Contact | AnthroDev',
    'Have a project in mind? Get in touch with Oladejo Jibril about product design, improving an existing experience, or a design partnership.',
  )

  return (
    <>
      <ScrollProgress variant="gold" />
      <div className="ctp">
        <div className="ct-stage">
          {/* Intro */}
          <section className="ct-hero" aria-labelledby="contact-page-title">
            <p className="ct-label ct-hero__eyebrow">Let’s make something meaningful</p>
            <Reveal as="div" className="ct-hero__head cs-split">
              <h1 id="contact-page-title" className="ct-title">
                <Words text="Have a good" />
                <br className="ct-br" /> <Words text="project" start={3} />{' '}
                <br className="ct-br-d" />
                <Words text="in mind?" start={4} />{' '}
                <span className="ct-title__talk">
                  <Words text="Let’s talk." start={6} />
                  <Underline />
                </span>
              </h1>
            </Reveal>
            <Sparkle className="ct-spark--hero" />
            <Reveal as="p" className="ct-hero__lede" delay={120}>
              Whether you’re building a new product, improving an existing experience, or looking for a design
              partner, I’d love to hear what you’re working on.
            </Reveal>
            <Reveal as="span" className="ct-rule" />
          </section>

          {/* Form and direct details */}
          <section className="ct-main">
            <Reveal className="ct-card" delay={60}>
              <p className="ct-label">Start a conversation</p>
              <h2 className="ct-card__title">Tell me what you’re thinking.</h2>
              <ContactForm />
            </Reveal>

            <div className="ct-direct">
              <Reveal as="p" className="ct-label">
                Direct contact
              </Reveal>
              <Reveal as="div" className="ct-direct__head cs-split">
                <h2 className="ct-direct__title">
                  <Words text="Prefer a direct hello?" />
                </h2>
              </Reveal>
              <Reveal as="p" className="ct-direct__text" delay={80}>
                No complicated introductions needed. Send me a message or find me around the web.
              </Reveal>

              <Reveal className="ct-rows" delay={120}>
                <p className="ct-note" aria-hidden="true">
                  Good things start with a conversation.
                </p>
                <Squiggle className="ct-squiggle--mail" />
                <div className="ct-row ct-row--email">
                  <p className="ct-micro">Email</p>
                  <a className="ct-email" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  <CopyEmail />
                </div>
                <div className="ct-gap" aria-hidden="true" />
                <div className="ct-row ct-row--link">
                  <p className="ct-link-label">LinkedIn</p>
                  <a className="ct-link" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                    {site.linkedin}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </div>
              </Reveal>

              <Reveal as="p" className="ct-quote" delay={160}>
                I enjoy conversations about thoughtful products, human behaviour, design systems, and the occasional
                football debate.
              </Reveal>
            </div>
          </section>

          {/* Closing line */}
          <section className="ct-last" aria-labelledby="contact-last-title">
            <Reveal as="span" className="ct-rule" />
            <Reveal as="p" className="ct-label">
              One last thought
            </Reveal>
            <Reveal as="div" className="ct-last__head cs-split">
              <h2 id="contact-last-title" className="ct-last__title">
                <Words text="Not every great idea starts with a plan. Sometimes, it starts with a hello." />
              </h2>
            </Reveal>
            <Reveal as="div" className="ct-last__link-wrap" delay={100}>
              <a className="ct-back" href="/work">
                <span>Back to selected work</span>
                <ArrowRight size={11} strokeWidth={1.6} aria-hidden="true" />
              </a>
            </Reveal>
          </section>
        </div>
      </div>
    </>
  )
}

