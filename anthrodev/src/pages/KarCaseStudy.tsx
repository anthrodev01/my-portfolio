import { Fragment, useCallback, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import ScreenViewer from '../components/case-study/ScreenViewer'
import type { ViewerScreen } from '../components/case-study/ScreenViewer'
import ScrollProgress from '../components/case-study/ScrollProgress'
import SectionNav from '../components/case-study/SectionNav'
import { SplitWords } from '../components/SplitWords'
import { img } from '../data/karAssets'
import { kar as c } from '../data/kar'
import { useKarFx } from '../hooks/useKarFx'
import { usePageMeta } from '../hooks/usePageMeta'

const pad = (n: number) => String(n).padStart(2, '0')
const v = (o: Record<string, string | number>) => o as CSSProperties

/** Section heading with the purple bar under it (Product Overview, User Persona …). */
function Heading({ id, children, className = '' }: { id?: string; children: string; className?: string }) {
  return (
    <Reveal as="div" className={`cs-split kar-head ${className}`.trim()}>
      <h2 id={id} className="kar-h2">
        <SplitWords text={children} />
      </h2>
      <span className="kar-head__bar" aria-hidden="true" />
    </Reveal>
  )
}

/** Eyebrow + large heading (Design timeline, Information architecture …). */
function Lead({ id, eyebrow, title }: { id: string; eyebrow?: string; title: string }) {
  return (
    <>
      {eyebrow ? <p className="kar-eyebrow">{eyebrow}</p> : null}
      <Reveal as="div" className="cs-split kar-lead">
        <h2 id={id} className="kar-h1">
          <SplitWords text={title} />
        </h2>
      </Reveal>
    </>
  )
}

/** The words of the page title. `d` / `m` choose where it breaks on desktop and on phones. */
const titleWords: Array<{ w: string; d?: boolean; m?: boolean }> = [
  { w: 'Streamlining' },
  { w: 'Car' },
  { w: 'Buying', m: true },
  { w: 'and' },
  { w: 'Selling', d: true },
  { w: 'Through', m: true },
  { w: 'Trust' },
  { w: 'and' },
  { w: 'Transparency' },
]

type Group = 'wire' | 'hifi'

/** A phone that opens in the full-size viewer. Defined once, outside the page, so it never remounts. */
function Phone({
  name,
  src,
  alt,
  w,
  h,
  onOpen,
  className = '',
}: {
  name: string
  src: string
  alt: string
  w: number
  h: number
  onOpen: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`kar-phone ${className}`.trim()}
      onClick={onOpen}
      aria-label={`${name}: view full size`}
      aria-haspopup="dialog"
    >
      <img src={src} width={w} height={h} alt={alt} loading="lazy" decoding="async" />
      <span className="kar-phone__chip" aria-hidden="true">
        View
      </span>
    </button>
  )
}


export default function KarCaseStudy() {
  usePageMeta(c.metaTitle, c.metaDescription)
  useKarFx()

  // ---- Gallery images ------------------------------------------------------
  const wires = useMemo(() => {
    const src = [
      img.i_wire_01, img.i_wire_02, img.i_wire_03, img.i_wire_04, img.i_wire_05, img.i_wire_06, img.i_wire_07,
      img.i_wire_08, img.i_wire_09, img.i_wire_10, img.i_wire_11, img.i_wire_12, img.i_wire_13,
    ]
    return c.wireframes.items.map((it, i) => ({ ...it, src: src[i], w: 622, h: 1230 }))
  }, [])

  const screens = useMemo(() => {
    const src = [
      img.i_screen_01, img.i_screen_02, img.i_screen_03, img.i_screen_04, img.i_screen_05,
      img.i_screen_06, img.i_screen_07, img.i_screen_08, img.i_screen_09, img.i_screen_10,
    ]
    return c.hifi.other.items.map((it, i) => ({ ...it, src: src[i], w: 640, h: 1226 }))
  }, [])

  /** Everything in the high-fidelity gallery, in reading order, for the full-size viewer. */
  const hifiAll = useMemo(
    () => [
      { name: 'Onboarding', alt: c.hifi.onboarding.alt, src: img.i_phone_onboarding },
      { name: 'Home', alt: c.hifi.home.alt, src: img.i_phone_home },
      { name: 'Filters', alt: c.hifi.filters.alt, src: img.i_phone_filters },
      ...screens.map((s) => ({ name: s.name, alt: s.alt, src: s.src })),
    ],
    [screens],
  )

  const [viewer, setViewer] = useState<{ group: Group; index: number } | null>(null)
  const viewerScreens: Array<ViewerScreen | null> = useMemo(() => {
    if (!viewer) return []
    const list = viewer.group === 'wire' ? wires : hifiAll
    return list.map((s) => ({ name: s.name, src: s.src, alt: s.alt }))
  }, [viewer, wires, hifiAll])
  const open = (group: Group, index: number) => setViewer({ group, index })
  const close = useCallback(() => setViewer(null), [])
  const change = useCallback((index: number) => setViewer((cur) => (cur ? { ...cur, index } : cur)), [])

  // ---- Flow replay -----------------------------------------------------------
  const [run, setRun] = useState(0)

  // ---- Homescreen hotspots ---------------------------------------------------
  const [hot, setHot] = useState<number | null>(null)
  const hotspots = [
    { x: 7.5, y: 10.2, w: 85, h: 8 },
    { x: 7.5, y: 19.3, w: 85, h: 6.2 },
    { x: 7.5, y: 34.4, w: 85, h: 32.6 },
    { x: 7.5, y: 68.2, w: 85, h: 29 },
  ]

  return (
    <div className="kar">
      <ScrollProgress variant="purple" />
      <SectionNav sections={c.sections} />

      {/* ------------------------------------------------------------ Hero */}
      <section className="kar-hero" id="top" aria-labelledby="kar-title">
        <div className="kar-hero__photo" aria-hidden="true">
          <picture>
            <source
              media="(min-width: 1100px)"
              srcSet={`${img.i_hero_photo_d_1390} 1390w, ${img.i_hero_photo_d_2780} 2780w`}
              sizes="100vw"
            />
            <img
              src={img.i_hero_photo_m_780}
              srcSet={`${img.i_hero_photo_m_390} 390w, ${img.i_hero_photo_m_780} 780w`}
              sizes="100vw"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        <div className="kar-hero__stage">
          <a className="kar-back" href="/work">
            <ArrowLeft aria-hidden="true" size={10} strokeWidth={1.5} />
            <span>Back to selected work</span>
          </a>

          <picture className="kar-hero__logo" aria-hidden="true">
            <source media="(min-width: 1100px)" srcSet={img.i_hero_logo_d} />
            <img src={img.i_hero_logo_m} alt="" width={218} height={80} />
          </picture>

          <h1 id="kar-title" className="kar-hero__title cs-split is-hero">
            {titleWords.map((t, i) => (
              <Fragment key={i}>
                <span className="sw__w" style={v({ '--i': i })}>
                  {t.w}
                </span>{' '}
                {t.d ? <br className="kar-br kar-br--d" /> : null}
                {t.m ? <br className="kar-br kar-br--m" /> : null}
              </Fragment>
            ))}
          </h1>

          <picture className="kar-hero__lines" aria-hidden="true">
            <source
              media="(min-width: 1100px)"
              srcSet={`${img.i_hero_lines_d_1390} 1390w, ${img.i_hero_lines_d_2780} 2780w`}
              sizes="1390px"
            />
            <img
              src={img.i_hero_lines_m_780}
              srcSet={`${img.i_hero_lines_m_390} 390w, ${img.i_hero_lines_m_780} 780w`}
              sizes="100vw"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </picture>

          <div className="kar-hero__phones" role="img" aria-label={c.heroAlt}>
            <img className="kar-hero__phone kar-hero__phone--l" src={img.i_hero_phone_l} width={330} height={785} alt="" decoding="async" />
            <img className="kar-hero__phone kar-hero__phone--r" src={img.i_hero_phone_r} width={335} height={785} alt="" decoding="async" />
            <img className="kar-hero__phone kar-hero__phone--c" src={img.i_hero_phone_c} width={400} height={785} alt="" decoding="async" />
          </div>
        </div>
      </section>

      <div className="kar-main">
        {/* --------------------------------------------- Facts + overview */}
        <div className="kar-opening">
          <Reveal as="ul" className="kar-facts">
            {c.facts.map((f, i) => (
              <li key={f.label} style={v({ '--i': i })}>
                <span className="kar-facts__label">{f.label}</span>{' '}
                {'strong' in f && f.strong ? <strong>{f.strong}</strong> : null} {f.value}
              </li>
            ))}
          </Reveal>

          <section id="overview" className="kar-sec kar-overview" aria-labelledby="kar-overview" data-in>
            <Heading id="kar-overview">{c.overview.title}</Heading>
            <div className="kar-overview__cards">
              <Reveal as="div" className="kar-card kar-card--challenge kar-spot">
                <h3 className="kar-card__title">{c.overview.challenge.title}</h3>
                <p className="kar-card__text">{c.overview.challenge.text}</p>
                <span className="kar-card__dot" aria-hidden="true" />
              </Reveal>
              <span className="kar-overview__link" aria-hidden="true" />
              <Reveal as="div" className="kar-card kar-card--outcome kar-spot" delay={140}>
                <span className="kar-card__dot" aria-hidden="true" />
                <h3 className="kar-card__title">{c.overview.outcome.title}</h3>
                <p className="kar-card__text">{c.overview.outcome.text}</p>
              </Reveal>
            </div>
            <figure className="kar-overview__hand kar-float">
              <picture>
                <source media="(min-width: 1100px)" srcSet={`${img.i_hand_d_678} 678w, ${img.i_hand_d_1356} 1356w`} sizes="678px" />
                <img
                  src={img.i_hand_m_780}
                  srcSet={`${img.i_hand_m_390} 390w, ${img.i_hand_m_780} 780w`}
                  sizes="(min-width: 700px) 560px, 100vw"
                  width={390}
                  height={770}
                  alt={c.overview.handAlt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          </section>
        </div>

        {/* --------------------------------------------------- Process */}
        <section id="process" className="kar-sec kar-process" aria-labelledby="kar-process" data-in>
          <Heading id="kar-process">{c.process.title}</Heading>

          <div className="kar-proc" data-in role="img" aria-label={c.process.summary}>
            <svg className="kar-proc__loops" viewBox="0 0 1107 96" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M1015.5 96 V30 Q1015.5 2 987.5 2 H581.5 Q553.5 2 553.5 30 V82" />
              <path pathLength="1" d="M784.5 96 V70 Q784.5 44 758.5 44 H579.5 Q553.5 44 553.5 70 V82" />
              <path className="kar-proc__head" d="M544 72 L553.5 88 L563 72" />
            </svg>
            <ol className="kar-proc__row" aria-hidden="true">
              {c.process.steps.map((s, i) => (
                <Fragment key={s.label}>
                  <li className="kar-proc__step" style={v({ '--c': s.color, '--i': i })}>
                    <span>{s.label}</span>
                  </li>
                  {i < c.process.steps.length - 1 ? (
                    <li className="kar-proc__arrow" style={v({ '--i': i })} aria-hidden="true" />
                  ) : null}
                </Fragment>
              ))}
            </ol>
          </div>

          {/* Timeline */}
          <div className="kar-timeline">
            <Lead id="kar-timeline" eyebrow={c.timeline.eyebrow} title={c.timeline.title} />
            <ol className="kar-phases">
              {c.timeline.phases.map((p, i) => (
                <Reveal as="li" key={p.title} className="kar-phase" delay={i * 90}>
                  <p className="kar-phase__label">Phase {pad(i + 1)}</p>
                  <h3 className="kar-phase__title">{p.title}</h3>
                  <ul className="kar-phase__list">
                    {p.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------- Persona */}
        <section id="persona" className="kar-sec kar-persona" aria-labelledby="kar-persona" data-in>
          <Heading id="kar-persona">{c.persona.title}</Heading>
          <div className="kar-persona__board">
            <Reveal as="figure" className="kar-persona__photo">
              <div className="kar-tilt kar-persona__tilt">
                <img src={img.i_avatar_600} width={600} height={600} alt={c.persona.avatarAlt} loading="lazy" decoding="async" />
              </div>
            </Reveal>
            <dl className="kar-persona__facts">
              {c.persona.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <Reveal as="div" className="kar-note kar-note--want kar-spot" delay={80}>
              <h3 className="kar-note__title">{c.persona.want.title}</h3>
              <p className="kar-note__text">{c.persona.want.text}</p>
            </Reveal>
            <Reveal as="div" className="kar-note kar-note--goals kar-spot" delay={200}>
              <h3 className="kar-note__title">{c.persona.goals.title}</h3>
              <p className="kar-note__text">{c.persona.goals.text}</p>
            </Reveal>
            <Reveal as="div" className="kar-note kar-note--frustration kar-spot" delay={320}>
              <h3 className="kar-note__title">{c.persona.frustration.title}</h3>
              <p className="kar-note__text">{c.persona.frustration.text}</p>
            </Reveal>
          </div>
          <Reveal as="div" className="kar-note kar-hmw kar-spot">
            <h3 className="kar-note__title">{c.persona.hmw.title}</h3>
            <ul className="kar-hmw__list">
              {c.persona.hmw.items.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ---------------------------------------- Information architecture */}
        <section id="architecture" className="kar-sec kar-rule kar-arch" aria-labelledby="kar-arch" data-in>
          <Lead id="kar-arch" eyebrow={c.architecture.eyebrow} title={c.architecture.title} />
          <Reveal as="div" className="kar-ia">
            <div className="kar-ia__root">
              <img src={img.i_logo_ia} width={80} height={46} alt="KAR" />
              <span>{c.architecture.root}</span>
            </div>
            <ul className="kar-ia__top">
              {c.architecture.top.map((t, i) => (
                <li key={t} style={v({ '--i': i })}>
                  {t}
                </li>
              ))}
            </ul>
            <ol className="kar-ia__grid">
              {c.architecture.nodes.map((n, i) => (
                <li key={n} className="kar-ia__node" style={v({ '--i': i })}>
                  <span className="kar-ia__num">{pad(i + 1)}</span>
                  {n}
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* -------------------------------------------------- Core user flow */}
        <section id="flow" className="kar-sec kar-flowsec" aria-labelledby="kar-flow" data-in>
          <Lead id="kar-flow" eyebrow={c.flow.eyebrow} title={c.flow.title} />
          <Reveal as="p" className="kar-flowsec__text">
            {c.flow.text}
          </Reveal>
          <div className="kar-flow" data-in>
            <button type="button" className="kar-flow__replay" onClick={() => setRun((r) => r + 1)}>
              <span aria-hidden="true">↻</span> Replay the journey
            </button>
            <div key={run} className="kar-flow__map">
              <ol className="kar-flow__steps">
                {c.flow.steps.map((s, i) => (
                  <li key={s} className={`kar-step${i === 0 ? ' kar-step--start' : ''}${i === c.flow.steps.length - 1 ? ' kar-step--last' : ''}`} style={v({ '--i': i })}>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="kar-decision" style={v({ '--i': c.flow.steps.length })}>
                <span>{c.flow.decision}</span>
              </div>
              <div className="kar-outcomes">
                <div className="kar-outcome kar-outcome--no" style={v({ '--i': c.flow.steps.length + 1 })}>
                  <p className="kar-outcome__tag">{c.flow.no.tag}</p>
                  <h3 className="kar-outcome__title">{c.flow.no.title}</h3>
                  <p className="kar-outcome__text">{c.flow.no.text}</p>
                </div>
                <div className="kar-outcome kar-outcome--yes" style={v({ '--i': c.flow.steps.length + 2 })}>
                  <p className="kar-outcome__tag">{c.flow.yes.tag}</p>
                  <h3 className="kar-outcome__title">{c.flow.yes.title}</h3>
                  <p className="kar-outcome__text">{c.flow.yes.text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- Wireframes */}
        <section id="wireframes" className="kar-sec kar-wire" aria-labelledby="kar-wire" data-in>
          <Heading id="kar-wire">{c.wireframes.title}</Heading>
          <ul className="kar-wire__grid">
            {wires.map((s, i) => (
              <Reveal as="li" key={s.name} className="kar-wire__item" delay={(i % 4) * 80}>
                <Phone onOpen={() => open('wire', i)} name={s.name} src={s.src} alt={s.alt} w={s.w} h={s.h} className="kar-tilt" />
              </Reveal>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------- High-fidelity screens */}
        <section id="hifi" className="kar-sec kar-rule kar-hifi" aria-labelledby="kar-hifi" data-in>
          <Lead id="kar-hifi" eyebrow={c.hifi.eyebrow} title={c.hifi.title} />

          {/* Brand banner */}
          <Reveal as="div" className="kar-banner kar-tilt-wrap">
            <div className="kar-banner__panel">
              <div className="kar-banner__copy">
                <img className="kar-banner__logo" src={img.i_logo_banner} width={126} height={56} alt="KAR" />
                <p className="kar-banner__tagline">{c.hifi.banner.tagline}</p>
                <p className="kar-banner__title kar-banner__title--d">{c.hifi.banner.desktop.title}</p>
                <p className="kar-banner__title kar-banner__title--m">{c.hifi.banner.phone.title}</p>
                <p className="kar-banner__text">{c.hifi.banner.text}</p>
              </div>
              <img
                className="kar-banner__phone kar-banner__phone--d kar-float"
                src={img.i_phone_home}
                width={365}
                height={700}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <img
                className="kar-banner__phone kar-banner__phone--m"
                src={img.i_banner_phones_m}
                width={180}
                height={214}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>

          {/* Four screens side by side (desktop) */}
          <Reveal as="div" className="kar-strip">
            <div className="kar-strip__band" role="group" aria-label={c.hifi.stripAlt}>
              {[
                { i: 0, src: img.i_phone_onboarding, name: 'Onboarding' },
                { i: 1, src: img.i_phone_home, name: 'Home' },
                { i: 2, src: img.i_phone_filters, name: 'Filters' },
                { i: 5, src: img.i_screen_03, name: 'Results' },
              ].map((p, k) => (
                <button
                  key={p.name}
                  type="button"
                  className={`kar-strip__phone kar-strip__phone--${k + 1}`}
                  onClick={() => open('hifi', p.i)}
                  aria-label={`${p.name}: view full size`}
                  aria-haspopup="dialog"
                  style={v({ '--i': k })}
                >
                  <img src={p.src} width={365} height={700} alt={hifiAll[p.i].alt} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </Reveal>

          {/* Annotated: onboarding */}
          <div className="kar-annot kar-annot--onboarding">
            <figure className="kar-annot__fig">
              <Reveal as="div" className="kar-annot__phone">
                <Phone onOpen={() => open('hifi', 0)} name="Onboarding" src={img.i_phone_onboarding} alt={c.hifi.onboarding.alt} w={365} h={700} className="kar-tilt" />
              </Reveal>
              <figcaption className="kar-annot__caption">{c.hifi.onboarding.caption}</figcaption>
            </figure>
            <Reveal as="div" className="kar-annot__copy" delay={120}>
              <p className="kar-annot__p">{c.hifi.onboarding.text}</p>
            </Reveal>
          </div>

          {/* Annotated: home screen, with hotspots that tie each point to the screen */}
          <div className="kar-annot kar-annot--home">
            <figure className="kar-annot__fig">
              <Reveal as="div" className="kar-annot__phone">
                <div className="kar-hot" data-hot={hot ?? undefined}>
                  <Phone onOpen={() => open('hifi', 1)} name="Home" src={img.i_phone_home} alt={c.hifi.home.alt} w={365} h={700} />
                  {hotspots.map((h, i) => (
                    <span
                      key={i}
                      className={`kar-hot__spot${hot === i ? ' is-on' : ''}`}
                      style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                      aria-hidden="true"
                    >
                      <b>{i + 1}</b>
                    </span>
                  ))}
                </div>
              </Reveal>
              <figcaption className="kar-annot__caption">{c.hifi.home.caption}</figcaption>
            </figure>
            <Reveal as="div" className="kar-annot__copy" delay={120}>
              <p className="kar-annot__p">{c.hifi.home.intro}</p>
              <ul className="kar-annot__list" onPointerLeave={(e) => e.pointerType === 'mouse' && setHot(null)}>
                {c.hifi.home.points.map((p, i) => (
                  <li
                    key={p}
                    className={hot === i ? 'is-on' : undefined}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(i)}
                    onClick={() => setHot((cur) => (cur === i ? null : i))}
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <p className="kar-annot__p">{c.hifi.home.outro}</p>
            </Reveal>
          </div>

          {/* Annotated: filters */}
          <div className="kar-annot kar-annot--filters">
            <picture className="kar-annot__topo" aria-hidden="true">
              <source media="(min-width: 1100px)" srcSet={`${img.i_topo_d_630} 630w, ${img.i_topo_d_1260} 1260w`} sizes="630px" />
              <img src={img.i_topo_m_780} srcSet={`${img.i_topo_m_390} 390w, ${img.i_topo_m_780} 780w`} sizes="100vw" alt="" loading="lazy" decoding="async" />
            </picture>
            <figure className="kar-annot__fig">
              <Reveal as="div" className="kar-annot__phone">
                <Phone onOpen={() => open('hifi', 2)} name="Filters" src={img.i_phone_filters} alt={c.hifi.filters.alt} w={365} h={700} className="kar-tilt" />
              </Reveal>
            </figure>
            <Reveal as="div" className="kar-annot__copy" delay={120}>
              <p className="kar-annot__p">{c.hifi.filters.text}</p>
            </Reveal>
          </div>

          {/* Other screens */}
          <div className="kar-other">
            <Heading id="kar-other">{c.hifi.other.title}</Heading>
            <ul className="kar-other__grid">
              {screens.map((s, i) => (
                <Reveal as="li" key={s.name} className="kar-other__item" delay={(i % 4) * 80}>
                  <Phone onOpen={() => open('hifi', i + 3)} name={s.name} src={s.src} alt={s.alt} w={s.w} h={s.h} className="kar-tilt" />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------- Prototype */}
        <section id="prototype" className="kar-sec kar-proto" aria-labelledby="kar-proto" data-in>
          <Heading id="kar-proto">{c.prototype.title}</Heading>
          <Reveal as="p" className="kar-proto__text">
            {c.prototype.text}
          </Reveal>
          <Reveal as="p" className="kar-proto__linkwrap" delay={100}>
            <a className="kar-proto__link" href={c.prototype.href} target="_blank" rel="noopener noreferrer">
              <span>{c.prototype.link}</span>
              <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.5} />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </section>

        {/* ------------------------------------------------------ Learnings */}
        <section id="learnings" className="kar-sec kar-learn" aria-labelledby="kar-learn" data-in>
          <Lead id="kar-learn" title={c.learnings.title} />
          <div className="kar-learn__grid">
            <Reveal as="figure" className="kar-learn__portrait">
              <picture>
                <img
                  src={img.i_portrait_960}
                  srcSet={`${img.i_portrait_640} 640w, ${img.i_portrait_960} 960w, ${img.i_portrait_1280} 1280w`}
                  sizes="(min-width: 1100px) 435px, (min-width: 700px) 560px, 100vw"
                  width={960}
                  height={1280}
                  alt={c.learnings.portraitAlt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <figcaption>{c.learnings.name}</figcaption>
            </Reveal>
            <ol className="kar-learn__items">
              {c.learnings.items.map((it, i) => (
                <Reveal as="li" key={it.title} className="kar-learn__item" delay={i * 110}>
                  <p className="kar-learn__label">Learning {pad(i + 1)}</p>
                  <h3 className="kar-learn__title">{it.title}</h3>
                  <p className="kar-learn__text">{it.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal as="p" className="kar-learn__closing">
            {c.learnings.closing}
          </Reveal>
        </section>

        {/* ---------------------------------------------------------- Next */}
        <nav className="kar-next" data-in aria-label="Next project">
          <p className="kar-next__label">{c.next.label}</p>
          <a className="kar-next__link" href={c.next.href}>
            <span className="kar-next__title">{c.next.title}</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} className="kar-next__arrow" />
            <span className="visually-hidden">: next case study</span>
          </a>
        </nav>
      </div>

      <ScreenViewer
        className="kar-viewer"
        actualSize="natural"
        screens={viewerScreens}
        index={viewer ? viewer.index : null}
        onClose={close}
        onChange={change}
      />
    </div>
  )
}

