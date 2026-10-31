import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { site } from '../data/site'
import Reveal from './Reveal'
import { Words } from './SplitWords'

// Optional line-break point so the URL wraps after "linkedin.com/" on narrow screens.
const [linkedinHead, linkedinTail] = site.linkedin
  .replace(/^https?:\/\/(www\.)?/, '')
  .split(/(?<=linkedin\.com\/)/)

export default function Contact({ compact = false }: { compact?: boolean }) {
  return (
    <section id="contact" className={`contact${compact ? ' contact--compact' : ''}`} aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact__orbit" aria-hidden="true">
        {['#cd8d15', '#e8b24a', '#a06c0e', '#111111'].map((col, i) => (
          <span key={col} className="orbit__ring" style={{ '--n': i, '--c': col } as CSSProperties}>
            <i />
          </span>
        ))}
      </div>
      <div className="container contact__grid">
        <Reveal as="div" className="contact__heading cs-split">
          <h2 id="contact-title" className="contact__title">
            <span className="line">
              <Words text="Have a product" />
            </span>{' '}
            <span className="line">
              <Words text="worth making" start={3} />
            </span>{' '}
            <span className="line accent">
              <span className="swash">
                <Words text="better?" start={5} />
              </span>
            </span>
          </h2>
        </Reveal>

        <Reveal className="contact__details" delay={100}>
          <p className="contact__lede">
            I'm always interested in thoughtful product challenges and opportunities to create
            useful digital experiences.
          </p>
          <dl className="contact__list">
            <div className="contact__row">
              <dt>Email</dt>
              <dd>
                <a className="contact__link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="contact__row">
              <dt>LinkedIn</dt>
              <dd>
                <a
                  className="contact__link"
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkedinHead}
                  <wbr />
                  {linkedinTail}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
          <a className="btn contact__cta" href="/contact">
            <span>Start a conversation</span>
            <ArrowRight className="btn__icon btn__icon--go" aria-hidden="true" size={14} strokeWidth={1.75} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
