import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode, TouchEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Maximize2 } from 'lucide-react'
import Reveal from '../components/Reveal'
import ProcessDiagram from '../components/case-study/ProcessDiagram'
import ScreenViewer from '../components/case-study/ScreenViewer'
import type { ViewerScreen } from '../components/case-study/ScreenViewer'
import ScrollProgress from '../components/case-study/ScrollProgress'
import { ScrollWords, SplitWords } from '../components/SplitWords'
import { afrixa as c } from '../data/afrixa'
import { useParallax } from '../hooks/useParallax'
import { usePageMeta } from '../hooks/usePageMeta'
import { usePointerFx } from '../hooks/usePointerFx'

import bannerA from '../assets/images/afrixa-banner-1296.webp'
import bannerB from '../assets/images/afrixa-banner-2592.webp'
import hifiA from '../assets/images/afrixa-hifi-1294.webp'
import hifiB from '../assets/images/afrixa-hifi-2588.webp'
import panelM1 from '../assets/images/afrixa-m-764.webp'
import panelM2 from '../assets/images/afrixa-m-1146.webp'
import posA from '../assets/images/afrixa-pos-764.webp'
import posB from '../assets/images/afrixa-pos-1294.webp'
import posC from '../assets/images/afrixa-pos-2588.webp'
import prodA from '../assets/images/afrixa-products-764.webp'
import prodB from '../assets/images/afrixa-products-1294.webp'
import prodC from '../assets/images/afrixa-products-2588.webp'
import repA from '../assets/images/afrixa-reports-764.webp'
import repB from '../assets/images/afrixa-reports-1294.webp'
import repC from '../assets/images/afrixa-reports-2588.webp'
import personaA from '../assets/images/persona-600.webp'
import personaB from '../assets/images/persona-900.webp'

const pad = (n: number) => String(n).padStart(2, '0')

function Eyebrow({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <p className={`cs-eyebrow${muted ? ' cs-eyebrow--muted' : ''}`}>{children}</p>
}

/** A page-wide parallax figure: a still artwork that drifts a few px as you scroll. */
function Figure({ className, children }: { className: string; children: ReactNode }) {
  const ref = useParallax<HTMLElement>(14)
  return (
    <Reveal as="div" className={`cs-figure-wrap cs-tilt ${className}`}>
      <figure ref={ref} className="cs-figure">
        {children}
      </figure>
    </Reveal>
  )
}

/** URL slugs for the screen tabs, in tab order: /work/afrixa#point-of-sale */
const screenSlugs = ['dashboard', 'point-of-sale', 'products', 'reports']
const screenFromHash = () => screenSlugs.indexOf(window.location.hash.slice(1))

export default function AfrixaCaseStudy() {
  usePageMeta(c.metaTitle, c.metaDescription)
  usePointerFx()

  const [active, setActive] = useState(() => Math.max(0, screenFromHash()))
  const [viewer, setViewer] = useState<number | null>(null)

  /** Switch screen and keep the address bar in step, so a tab can be linked to directly. */
  const select = (i: number) => {
    setActive(i)
    const { pathname, search } = window.location
    window.history.replaceState(null, '', i === 0 ? `${pathname}${search}` : `#${screenSlugs[i]}`)
  }

  // Open the page already on the linked screen, and follow manual hash edits
  useEffect(() => {
    if (screenFromHash() >= 0) {
      requestAnimationFrame(() => {
        const section = document.getElementById('cs-screens')?.closest('section')
        if (section) window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 88)
      })
    }
    const onHash = () => setActive(Math.max(0, screenFromHash()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Keep the chosen tab in view in the scrollable tab bar on narrow screens
  const tabsRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const bar = tabsRef.current
    const tab = bar?.querySelector<HTMLElement>(`#cs-tab-${active}`)
    if (!bar || !tab) return
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.clientWidth) / 2, behavior: 'smooth' })
  }, [active])

  // Swipe the screen left / right to change tab (vertical scrolling is untouched)
  const swipeFrom = useRef<{ x: number; y: number } | null>(null)
  const onStageTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    swipeFrom.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
  }
  const onStageTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const s0 = swipeFrom.current
    swipeFrom.current = null
    if (!s0) return
    const dx = e.changedTouches[0].clientX - s0.x
    const dy = e.changedTouches[0].clientY - s0.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    const ready = screenArt.map((a, k) => (a ? k : -1)).filter((k) => k >= 0)
    const next = ready[ready.indexOf(active) + (dx < 0 ? 1 : -1)]
    if (next !== undefined) select(next)
  }

  /**
   * The artwork for each tab, in the same order as `c.screens.tabs`
   * (Dashboard, Point of Sale, Products, Reports). A tab stays disabled until
   * its screen is supplied here; once it is, clicking it slides that screen in.
   */
  const screenArt: Array<ReactNode | null> = [
    <picture key="dashboard">
      <source
        media="(min-width: 1100px)"
        srcSet={`${hifiA} 1294w, ${hifiB} 2588w`}
        sizes="(min-width: 1390px) 1294px, calc(100vw - 96px)"
      />
      <img
        src={panelM2}
        srcSet={`${panelM1} 764w, ${panelM2} 1146w`}
        sizes="100vw"
        width={764}
        height={399}
        alt={c.screens.alt}
        loading="lazy"
        decoding="async"
      />
    </picture>,
    <picture key="pos">
      <img
        src={posB}
        srcSet={`${posA} 764w, ${posB} 1294w, ${posC} 2588w`}
        sizes="(min-width: 1390px) 1294px, calc(100vw - 96px)"
        width={1294}
        height={917}
        alt={c.screens.posAlt}
        loading="lazy"
        decoding="async"
      />
    </picture>, // Point of Sale
    <picture key="products">
      <img
        src={prodB}
        srcSet={`${prodA} 764w, ${prodB} 1294w, ${prodC} 2588w`}
        sizes="(min-width: 1390px) 1294px, calc(100vw - 96px)"
        width={1294}
        height={917}
        alt={c.screens.productsAlt}
        loading="lazy"
        decoding="async"
      />
    </picture>, // Products
    <picture key="reports">
      <img
        src={repB}
        srcSet={`${repA} 764w, ${repB} 1294w, ${repC} 2588w`}
        sizes="(min-width: 1390px) 1294px, calc(100vw - 96px)"
        width={1294}
        height={1031}
        alt={c.screens.reportsAlt}
        loading="lazy"
        decoding="async"
      />
    </picture>, // Reports
  ]

  /** The large version of each screen, for the full-size viewer. */
  const viewerScreens: Array<ViewerScreen | null> = [
    { name: c.screens.tabs[0], src: hifiB, alt: c.screens.alt },
    { name: c.screens.tabs[1], src: posC, alt: c.screens.posAlt },
    { name: c.screens.tabs[2], src: prodC, alt: c.screens.productsAlt },
    { name: c.screens.tabs[3], src: repC, alt: c.screens.reportsAlt },
  ]

  // Arrow keys / Home / End move between the tabs that have a screen.
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const ready = screenArt.map((a, k) => (a ? k : -1)).filter((k) => k >= 0)
    const at = ready.indexOf(i)
    let next = -1
    if (e.key === 'ArrowRight') next = ready[(at + 1) % ready.length]
    else if (e.key === 'ArrowLeft') next = ready[(at - 1 + ready.length) % ready.length]
    else if (e.key === 'Home') next = ready[0]
    else if (e.key === 'End') next = ready[ready.length - 1]
    if (next < 0) return
    e.preventDefault()
    select(next)
    document.getElementById(`cs-tab-${next}`)?.focus()
  }

  return (
    <div className="cs">
      <ScrollProgress />
      {/* ------------------------------------------------------------ Hero */}
      <section className="cs-hero" aria-labelledby="cs-title">
        <a className="cs-back" href="/work">
          <ArrowLeft aria-hidden="true" size={10} strokeWidth={1.5} />
          <span>Back to selected work</span>
        </a>

        <h1 id="cs-title" className="cs-title">
          <span className="cs-title__line">{c.title.top}</span>{' '}
          <span className="cs-title__line cs-title__line--accent">{c.title.accent}</span>
        </h1>

        <div className="cs-hero__grid">
          <Reveal as="p" className="cs-headline" delay={80}>
            {c.headline}
          </Reveal>
          <Reveal as="p" className="cs-intro" delay={160}>
            {c.intro}
          </Reveal>
        </div>

        <Reveal as="dl" className="cs-facts" delay={120}>
          {c.facts.map((f, i) => (
            <div key={f.key} className={`cs-fact cs-fact--${f.key}`} style={{ '--i': i } as CSSProperties}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <Figure className="cs-banner">
        <picture>
          <source
            media="(min-width: 1100px)"
            srcSet={`${bannerA} 1296w, ${bannerB} 2592w`}
            sizes="(min-width: 1390px) 1296px, calc(100vw - 94px)"
          />
          <img
            src={panelM2}
            srcSet={`${panelM1} 764w, ${panelM2} 1146w`}
            sizes="100vw"
            width={764}
            height={399}
            alt={c.screens.alt}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </Figure>

      {/* -------------------------------------------------------- Overview */}
      <section className="cs-section cs-section--full-rule cs-overview" aria-labelledby="cs-overview">
        <Reveal as="div" className="cs-split">
          <h2 id="cs-overview" className="cs-h2 cs-h2--small">
            <SplitWords text="Overview" />
          </h2>
        </Reveal>
        <div className="cs-overview__cols">
          {c.overview.map((p, i) => (
            <Reveal key={i} as="p" className="cs-body" delay={i * 90}>
              {p}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cs-section cs-section--hair cs-premise" aria-label={c.premise.label}>
        <Eyebrow muted>{c.premise.label}</Eyebrow>
        <Reveal as="p" className="cs-premise__text">
          <ScrollWords text={c.premise.text} />
        </Reveal>
      </section>

      {/* --------------------------------------------------------- Problem */}
      <section className="cs-section cs-problem" aria-labelledby="cs-problem">
        <Eyebrow>{c.problem.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-problem" className="cs-h2">
            <SplitWords text={c.problem.title} />
          </h2>
        </Reveal>
        <div className="cs-problem__grid">
          <Reveal as="p" className="cs-body cs-body--green cs-problem__text">
            {c.problem.text}
          </Reveal>
          <ul className="cs-cards">
            {c.problem.items.map((item, i) => (
              <Reveal as="li" key={item.title} className="cs-card cs-spot" delay={i * 70}>
                <span className="cs-card__num">{pad(i + 1)}</span>
                <div>
                  <h3 className="cs-card__title">{item.title}</h3>
                  <p className="cs-card__text">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* -------------------------------------------------------- Solution */}
      <section className="cs-section cs-section--rule cs-solution" aria-labelledby="cs-solution">
        <Eyebrow>{c.solution.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-solution" className="cs-h2">
            <SplitWords text={c.solution.title} />
          </h2>
        </Reveal>
        <div className="cs-solution__grid">
          <Reveal as="p" className="cs-body cs-body--green cs-solution__text">
            {c.solution.text}
          </Reveal>
          <Reveal as="div" className="cs-solution__card cs-spot" delay={60}>
            <span className="cs-solution__card-label">{c.solution.card.label}</span>
            <span className="cs-solution__card-title">{c.solution.card.title}</span>
            <span className="cs-solution__card-note">{c.solution.card.note}</span>
          </Reveal>
          <ul className="cs-modules">
            {c.solution.modules.map((m, i) => (
              <Reveal as="li" key={m.title} className="cs-module cs-spot" delay={i * 60}>
                <span className="cs-module__num">{pad(i + 1)}</span>
                <div>
                  <h3 className="cs-module__title">{m.title}</h3>
                  <p className="cs-module__text">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- Process */}
      <section className="cs-section cs-section--rule cs-process-section" aria-labelledby="cs-process">
        <Eyebrow>{c.process.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-process" className="cs-h2 cs-h2--small-m">
            <SplitWords text={c.process.title} />
          </h2>
        </Reveal>
        <Reveal as="div" className="cs-process-wrap">
          <ProcessDiagram steps={c.process.steps} />
        </Reveal>
        <ol className="cs-phases">
          {c.process.phases.map((p, i) => (
            <Reveal as="li" key={p.title} className="cs-phase" delay={i * 80}>
              <span className="cs-phase__dot" aria-hidden="true" />
              <span className="cs-phase__label">Phase {pad(i + 1)}</span>
              <h3 className="cs-phase__title">{p.title}</h3>
              <span className="cs-phase__duration">{p.duration}</span>
              <ul className="cs-phase__list">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* --------------------------------------------------------- Persona */}
      <section className="cs-section cs-section--rule cs-persona" aria-labelledby="cs-persona">
        <Eyebrow>{c.persona.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-persona" className="cs-h2 cs-h2--persona">
            <SplitWords text={c.persona.title} />
          </h2>
        </Reveal>

        <div className="cs-persona__top">
          <Reveal as="div" className="cs-persona__photo">
            <img
              src={personaA}
              srcSet={`${personaA} 600w, ${personaB} 900w`}
              sizes="(min-width: 1100px) 440px, 70vw"
              width={600}
              height={900}
              alt={c.persona.photoAlt}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal as="div" className="cs-persona__info" delay={90}>
            <p className="cs-eyebrow cs-persona__tag">{c.persona.tag}</p>
            <h3 className="cs-persona__name">
              {c.persona.name.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </h3>
            <dl className="cs-persona__facts">
              {c.persona.details.map((d) => (
                <div key={d.key} className={`cs-persona__fact cs-persona__fact--${d.key}`}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <p className="cs-persona__bio">{c.persona.bio}</p>
          </Reveal>
        </div>

        <div className="cs-persona__lists">
          <Reveal as="div" className="cs-list-col">
            <h3 className="cs-list-col__title">Goals</h3>
            <ul>
              {c.persona.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div" className="cs-list-col cs-list-col--pains" delay={90}>
            <h3 className="cs-list-col__title">Pain points</h3>
            <ul>
              {c.persona.pains.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="figure" className="cs-quote cs-split">
          <blockquote>
            <SplitWords text={c.persona.quote} />
          </blockquote>
          <figcaption>{c.persona.quoteNote}</figcaption>
        </Reveal>

        <div className="cs-opportunity">
          <Eyebrow>{c.persona.opportunity.label}</Eyebrow>
          <Reveal as="p" className="cs-opportunity__text">
            {c.persona.opportunity.text}
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- Needs */}
      <section className="cs-section cs-section--rule cs-needs" aria-labelledby="cs-needs">
        <Eyebrow>{c.needs.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-needs" className="cs-h2 cs-h2--small-m">
            <SplitWords text={c.needs.title} />
          </h2>
        </Reveal>
        <div className="cs-table" role="table" aria-label="User needs and the proposed design response">
          <div className="cs-table__head" role="row">
            <span role="columnheader">User need</span>
            <span role="columnheader">Proposed design response</span>
          </div>
          {c.needs.rows.map(([need, response], i) => (
            <Reveal as="div" key={need} className="cs-table__row" delay={(i % 3) * 60}>
              <div role="row" className="cs-table__row-inner">
                <span className="cs-table__num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span role="cell" className="cs-table__need">
                  {need}
                </span>
                <span role="cell" className="cs-table__response">
                  {response}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------- Information arch. */}
      <section className="cs-section cs-section--rule cs-ia" aria-labelledby="cs-ia">
        <Eyebrow>{c.architecture.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-ia" className="cs-h2 cs-h2--small-m">
            <SplitWords text={c.architecture.title} />
          </h2>
        </Reveal>
        <Reveal as="div" className="cs-ia__panel">
          <div className="cs-ia__root">
            <span className="cs-ia__root-label">{c.architecture.root.label}</span>
            <span className="cs-ia__root-title">{c.architecture.root.title}</span>
            <span className="cs-ia__root-note">{c.architecture.root.note}</span>
          </div>
          <ul className="cs-ia__grid">
            {c.architecture.nodes.map((n, i) => (
              <li key={n} className="cs-ia__node" style={{ '--i': i } as CSSProperties}>
                <span className="cs-ia__node-num">{pad(i + 1)}</span>
                <span className="cs-ia__node-label">{n}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Flow */}
      <section className="cs-section cs-section--rule cs-flow" aria-labelledby="cs-flow">
        <Eyebrow>{c.flow.eyebrow}</Eyebrow>
        <div className="cs-flow__head">
          <Reveal as="div" className="cs-split">
            <h2 id="cs-flow" className="cs-h2 cs-h2--small-m">
              <SplitWords text={c.flow.title} />
            </h2>
          </Reveal>
          <Reveal as="p" className="cs-body cs-body--green cs-flow__text" delay={80}>
            {c.flow.text}
          </Reveal>
        </div>

        <Reveal as="div" className="cs-flow__panel">
          <ol className="cs-flow__chain">
            <li className="cs-flow__box cs-flow__box--pill">{c.flow.start}</li>
            <li className="cs-flow__arrow" aria-hidden="true">
              <ArrowDown size={11} strokeWidth={1.2} />
            </li>
            <li className="cs-flow__box">{c.flow.dashboard}</li>
            <li className="cs-flow__arrow" aria-hidden="true">
              <ArrowDown size={11} strokeWidth={1.2} />
            </li>
            <li className="cs-flow__box cs-flow__box--select">{c.flow.select}</li>
            <li className="cs-flow__modules-row">
              <ul className="cs-flow__modules">
                {c.flow.modules.map((m) => (
                  <li key={m} className="cs-flow__module">
                    {m}
                  </li>
                ))}
              </ul>
            </li>
            <li className="cs-flow__arrow" aria-hidden="true">
              <ArrowDown size={11} strokeWidth={1.2} />
            </li>
            <li className="cs-flow__box cs-flow__box--pill cs-flow__box--end">{c.flow.end}</li>
          </ol>
        </Reveal>

        <div className="cs-journeys">
          {c.flow.journeys.map((j, i) => (
            <Reveal as="div" key={j.title} className={`cs-journey cs-spot cs-journey--${i + 1}`} delay={i * 80}>
              <h3 className="cs-journey__title">{j.title}</h3>
              <ol>
                {j.steps.map((s, k) => (
                  <li key={s} style={{ '--k': k } as CSSProperties}>
                    <span className="cs-journey__n" aria-hidden="true">
                      {k + 1}
                    </span>
                    <span className="cs-journey__s">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Screens */}
      <section className="cs-section cs-section--rule cs-screens" aria-labelledby="cs-screens">
        <Eyebrow>{c.screens.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-screens" className="cs-h2 cs-h2--screens">
            <SplitWords text={c.screens.title} />
          </h2>
        </Reveal>
        <div ref={tabsRef} className="cs-tabs" role="tablist" aria-label="Afrixa screens">
          {c.screens.tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              role="tab"
              className="cs-tab"
              id={`cs-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`cs-tabpanel-${i}`}
              disabled={!screenArt[i]}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Each screen sits in the same grid cell; the active one slides in from the
            side it belongs on (later tabs from the right, earlier from the left). */}
        <div className="cs-stage" onTouchStart={onStageTouchStart} onTouchEnd={onStageTouchEnd}>
          {screenArt.map((art, i) =>
            art ? (
              <div
                key={i}
                id={`cs-tabpanel-${i}`}
                role="tabpanel"
                aria-labelledby={`cs-tab-${i}`}
                className={`cs-panel${i === active ? ' is-active' : i < active ? ' is-before' : ' is-after'}`}
                inert={i !== active}
              >
                <Figure className="cs-hifi">
                  {art}
                  <button type="button" className="cs-zoom" onClick={() => setViewer(i)}>
                    <span className="visually-hidden">View the {c.screens.tabs[i]} screen full size</span>
                    <span className="cs-zoom__chip" aria-hidden="true">
                      <Maximize2 size={12} strokeWidth={1.75} />
                      Expand
                    </span>
                  </button>
                </Figure>
              </div>
            ) : null,
          )}
        </div>
        <ScreenViewer screens={viewerScreens} index={viewer} onClose={() => setViewer(null)} onChange={setViewer} />
      </section>

      {/* ------------------------------------------------------ Reflection */}
      <section className="cs-section cs-section--rule cs-reflection" aria-labelledby="cs-reflection">
        <Eyebrow>{c.reflection.eyebrow}</Eyebrow>
        <Reveal as="div" className="cs-split">
          <h2 id="cs-reflection" className="cs-h2 cs-h2--reflection">
            <SplitWords text={c.reflection.title} />
          </h2>
        </Reveal>
        <div className="cs-learnings">
          {c.reflection.learnings.map((l, i) => (
            <Reveal as="article" key={l.title} className="cs-learning" delay={i * 90}>
              <span className="cs-learning__label">Learning {pad(i + 1)}</span>
              <h3 className="cs-learning__title">{l.title}</h3>
              <p className="cs-learning__text">{l.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cs-closing cs-section--rule" aria-label="Closing thought">
        <Reveal as="p" className="cs-closing__text">
          <ScrollWords text={c.reflection.closing} />
        </Reveal>
      </section>

      <div className="cs-next">
        <span className="cs-next__label">{c.next.label}</span>
        <a className="cs-next__link" href={c.next.href}>
          <span className="cs-next__title">{c.next.title}</span>
          <ArrowUpRight aria-hidden="true" className="cs-next__icon" size={14} strokeWidth={1.5} />
          <span className="visually-hidden"> — case study</span>
        </a>
      </div>

      {/* ---------------------------------------------------------- Outro */}
      <section className="cs-outro" aria-labelledby="cs-outro">
        <div className="cs-outro__inner">
          <div className="cs-outro__orbit" aria-hidden="true">
            {['#57E5CC', '#FF3508', '#02A6EC', '#E2E526', '#7DD326'].map((col, i) => (
              <span key={col} className="cs-orbit__ring" style={{ '--n': i, '--c': col } as CSSProperties}>
                <i />
              </span>
            ))}
          </div>
          <p className="cs-outro__eyebrow">{c.outro.eyebrow}</p>
          <Reveal as="div" className="cs-split">
            <h2 id="cs-outro" className="cs-outro__title">
              <SplitWords text={c.outro.title} />
            </h2>
          </Reveal>
          <div className="cs-outro__links">
            <a className="cs-outro__link" href="/work">
              <span>Back to portfolio</span>
              <ArrowLeft aria-hidden="true" size={10} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              className="cs-outro__link"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span>Back to top</span>
              <ArrowUp aria-hidden="true" size={10} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
