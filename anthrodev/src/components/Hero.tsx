import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { site } from '../data/site'
import Reveal from './Reveal'
import { Words } from './SplitWords'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <Reveal className="hero__eyebrow">
          <p className="hero__role">
            {site.role} <span aria-hidden="true">·</span> {site.location}
          </p>
          {site.available && (
            <a className="avail" href="/contact">
              <span className="avail__dot" aria-hidden="true" />
              Open to opportunities
            </a>
          )}
        </Reveal>
        <h1 id="hero-title" className="hero__title">
          <span className="line">
            <Words text="I design digital products" />
          </span>{' '}
          <span className="line">
            <Words text="that make" start={4} />{' '}
            <span className="accent">
              <Words text="complex" start={6} />
            </span>
          </span>{' '}
          <span className="line accent">
            <Words text="things feel" start={7} />{' '}
            <span className="swash">
              <Words text="simple." start={9} />
            </span>
          </span>
        </h1>

        <Reveal as="p" className="hero__lede" delay={120}>
          I'm {site.fullName}, a product designer focused on turning complex workflows and business
          challenges into clear, intuitive digital experiences.
        </Reveal>
      </div>

      <div className="hero__cta">
        <a className="btn" href="#work">
          <span>View selected work</span>
          <ArrowDownRight className="btn__icon" aria-hidden="true" size={10} strokeWidth={2} />
        </a>
        <a className="btn btn--ghost" href={site.resume} target="_blank" rel="noopener noreferrer">
          <span>Resume</span>
          <ArrowUpRight className="btn__icon btn__icon--out" aria-hidden="true" size={12} strokeWidth={1.75} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  )
}
