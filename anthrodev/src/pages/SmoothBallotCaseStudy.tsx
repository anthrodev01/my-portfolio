import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowUpRight, Pause, Play } from 'lucide-react'
import Reveal from '../components/Reveal'
import ScreenViewer from '../components/case-study/ScreenViewer'
import type { ViewerScreen } from '../components/case-study/ScreenViewer'
import ScrollProgress from '../components/case-study/ScrollProgress'
import SectionNav from '../components/case-study/SectionNav'
import { SplitWords } from '../components/SplitWords'
import { sbImg as img, sbVideo } from '../data/smoothballotAssets'
import { sb as c } from '../data/smoothballot'
import { useSbFx } from '../hooks/useSbFx'
import { usePageMeta } from '../hooks/usePageMeta'

const pad = (n: number) => String(n).padStart(2, '0')
const v = (o: Record<string, string | number>) => o as CSSProperties

/** Section heading with the blue bar under it. `small` is the 36px size used for Overview / Credits. */
function Heading({ id, children, small = false, className = '' }: { id?: string; children: string; small?: boolean; className?: string }) {
  return (
    <Reveal as="div" className={`cs-split sb-head${small ? ' sb-head--sm' : ''} ${className}`.trim()}>
      <h2 id={id} className="sb-h2">
        <SplitWords text={children} />
      </h2>
      <span className="sb-head__bar" aria-hidden="true" />
    </Reveal>
  )
}

/**
 * A paragraph with a few key phrases picked out. The highlight sweeps in as the
 * paragraph arrives; it is only a soft underline, so the text reads the same without it.
 */
function Marked({ text, marks }: { text: string; marks: string[] }) {
  const parts: Array<{ t: string; m: boolean }> = []
  let rest = text
  for (const m of marks) {
    const at = rest.indexOf(m)
    if (at < 0) continue
    if (at > 0) parts.push({ t: rest.slice(0, at), m: false })
    parts.push({ t: m, m: true })
    rest = rest.slice(at + m.length)
  }
  if (rest) parts.push({ t: rest, m: false })
  return (
    <>
      {parts.map((p, i) =>
        p.m ? (
          <mark key={i} className="sb-mark" style={v({ '--i': i })}>
            {p.t}
          </mark>
        ) : (
          <Fragment key={i}>{p.t}</Fragment>
        ),
      )}
    </>
  )
}

/** A workflow screenshot (in its browser or phone frame) that opens in the full-size viewer. */
function Shot({
  kind,
  name,
  alt,
  src,
  srcSet,
  w,
  h,
  video,
  poster,
  onOpen,
  className = '',
}: {
  kind: 'browser' | 'phone'
  name: string
  alt: string
  src: string
  srcSet?: string
  w: number
  h: number
  /** A screen recording that plays in the frame while it is on screen. */
  video?: string
  poster?: string
  onOpen: () => void
  className?: string
}) {
  const clip = useRef<HTMLVideoElement | null>(null)
  const [onScreen, setOnScreen] = useState(false)
  const [near, setNear] = useState(false)
  // Reduced motion: the recording waits for a tap on Play (or opens in the viewer)
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // React sets `muted` as a property, not an attribute; some browsers only allow autoplay
  // when the attribute is there from the start, so set both before anything plays.
  useEffect(() => {
    const el = clip.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    el.setAttribute('muted', '')
  }, [video])

  useEffect(() => {
    const el = clip.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setOnScreen(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 })
    // Start downloading a couple of screens before it arrives, so it is ready when it does
    const ahead = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '1500px 0px' })
    io.observe(el)
    ahead.observe(el)
    return () => {
      io.disconnect()
      ahead.disconnect()
    }
  }, [video])

  // Play while it is on screen and not paused by the visitor. A play() that is interrupted
  // (scrolled away while loading) is not a refusal; only a blocked autoplay shows the Play button.
  useEffect(() => {
    const el = clip.current
    if (!el) return
    const want = onScreen && !paused
    const start = () => {
      if (!el.paused) return
      el.play().catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name === 'NotAllowedError') setPaused(true)
      })
    }
    if (!want) {
      el.pause()
      return
    }
    start()
    // Still loading when it came into view: start the moment it can
    el.addEventListener('canplay', start)
    return () => el.removeEventListener('canplay', start)
  }, [onScreen, paused])

  return (
    <>
    <button
      type="button"
      className={`sb-shot sb-shot--${kind} ${className}`.trim()}
      onClick={onOpen}
      aria-label={`${name}: view full size`}
      aria-haspopup="dialog"
    >
      {video ? (
        <video
          ref={clip}
          src={video}
          poster={poster ?? src}
          width={w}
          height={h}
          muted
          loop
          playsInline
          preload={near ? 'auto' : 'metadata'}
          aria-label={alt}
          onPlay={() => setPaused(false)}
        />
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={kind === 'browser' ? '(min-width: 1100px) 1148px, (min-width: 700px) 92vw, 100vw' : '313px'}
          width={w}
          height={h}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      )}
      <span className="sb-shot__load" aria-hidden="true" />
      <span className="sb-shot__chip" aria-hidden="true">
        View
      </span>
    </button>
    {video ? (
      <button
        type="button"
        className="sb-shot__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={!paused}
        aria-label={paused ? `Play the ${name} recording` : `Pause the ${name} recording`}
      >
        {paused ? <Play aria-hidden="true" size={14} strokeWidth={2} /> : <Pause aria-hidden="true" size={14} strokeWidth={2} />}
      </button>
    ) : null}
    </>
  )
}

/** An email address: opens the mail app, and has a button that copies it. */
function Email({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
    } catch {
      const t = document.createElement('textarea')
      t.value = address
      t.setAttribute('readonly', '')
      t.style.position = 'fixed'
      t.style.opacity = '0'
      document.body.appendChild(t)
      t.select()
      try {
        document.execCommand('copy')
      } catch {
        /* nothing more to try */
      }
      t.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <span className="sb-email">
      <a className="sb-email__link" href={`mailto:${address}`}>
        {address}
      </a>
      <button type="button" className={`sb-email__copy${copied ? ' is-copied' : ''}`} onClick={copy} aria-label={`Copy ${address}`}>
        {copied ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <rect x="9" y="9" width="11" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </span>
  )
}

const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1)
  const r = 90 + ((i * 37) % 70)
  return {
    dx: Math.round(Math.cos(a) * r),
    dy: Math.round(Math.sin(a) * r * 0.8 - 30),
    rot: (i * 53) % 360,
    c: ['#0654b0', '#d08f19', '#57b3ff', '#0f2f66', '#f2d2c7'][i % 5],
    s: i % 3,
  }
})

type Flow = { group: 'flows'; index: number }

export default function SmoothBallotCaseStudy() {
  usePageMeta(c.metaTitle, c.metaDescription)
  useSbFx()

  // ---- Viewer: the five workflow screens, in reading order --------------------
  const flows = useMemo(
    () => [
      { name: c.admin.shots[0].name, alt: c.admin.shots[0].alt, src: sbVideo.adminLogin.poster, video: sbVideo.adminLogin.src },
      { name: c.admin.shots[1].name, alt: c.admin.shots[1].alt, src: sbVideo.electionSetup.poster, video: sbVideo.electionSetup.src },
      { name: c.admin.shots[2].name, alt: c.admin.shots[2].alt, src: sbVideo.resultsExport.poster, video: sbVideo.resultsExport.src },
      { name: c.voter.shots[0].name, alt: c.voter.shots[0].alt, src: sbVideo.castVote.poster, video: sbVideo.castVote.src, tall: true },
      { name: c.voter.shots[1].name, alt: c.voter.shots[1].alt, src: sbVideo.checkResult.poster, video: sbVideo.checkResult.src, tall: true },
    ],
    [],
  )
  const [viewer, setViewer] = useState<Flow | null>(null)
  const viewerScreens: Array<ViewerScreen | null> = useMemo(() => (viewer ? flows.map((s) => ({ ...s })) : []), [viewer, flows])
  const open = (index: number) => setViewer({ group: 'flows', index })
  const close = useCallback(() => setViewer(null), [])
  const change = useCallback((index: number) => setViewer((cur) => (cur ? { ...cur, index } : cur)), [])

  // ---- Confetti on the thumbs-up portrait ---------------------------------------
  const [burst, setBurst] = useState(0)
  const burstTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(burstTimer.current), [])
  const celebrate = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setBurst((b) => b + 1)
    window.clearTimeout(burstTimer.current)
    burstTimer.current = window.setTimeout(() => setBurst(0), 1500)
  }

  const shotSrc = [img.shot1_1152, img.shot2_1152, img.shot3_1152]
  // Screens that have a recording (the rest are still images for now)
  const shotVideos = [sbVideo.adminLogin, sbVideo.electionSetup, sbVideo.resultsExport]
  const voterVideos = [sbVideo.castVote, sbVideo.checkResult]
  const shotSets = [
    `${img.shot1_768} 768w, ${img.shot1_1152} 1152w`,
    `${img.shot2_768} 768w, ${img.shot2_1152} 1152w`,
    `${img.shot3_768} 768w, ${img.shot3_1152} 1152w`,
  ]

  return (
    <div className="sb">
      <ScrollProgress variant="blue" />
      <SectionNav sections={c.sections} className="sb-nav" />

      {/* ------------------------------------------------------------ Hero */}
      <section className="sb-hero" id="top" aria-label="SmoothBallot case study">
        <h1 className="visually-hidden">SmoothBallot: a secure e-voting platform. Case study</h1>
        <div className="sb-hero__stage">
          <a className="sb-back" href="/work">
            <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.75} />
            <span>Back to selected work</span>
          </a>

          <div className="sb-laptop" role="img" aria-label={c.heroAlt}>
            <div className="sb-laptop__tilt">
              <img
                className="sb-laptop__frame"
                src={img.laptop830}
                srcSet={`${img.laptop830} 830w, ${img.laptop1660} 1660w`}
                sizes="(min-width: 1100px) 830px, 100vw"
                width={830}
                height={520}
                alt=""
                fetchPriority="high"
                decoding="async"
              />
              <div className="sb-laptop__screen" aria-hidden="true">
                <img
                  className="sb-laptop__site"
                  src={img.site1046}
                  srcSet={`${img.site640} 640w, ${img.site1046} 1046w`}
                  sizes="(min-width: 1100px) 590px, 300px"
                  width={1046}
                  height={4096}
                  alt=""
                  decoding="async"
                />
                <span className="sb-laptop__glare" />
              </div>
            </div>
          </div>

          <p className="sb-hint" aria-hidden="true">
            <span>Keep scrolling: the site scrolls with you</span>
            <i />
          </p>
        </div>
      </section>

      <div className="sb-main">
        {/* ------------------------------------- Overview + credits */}
        <section id="overview" className="sb-sec sb-opening" aria-label="Overview and credits" data-in>
          <div className="sb-opening__facts">
            <Heading id="sb-overview" small>
              Overview
            </Heading>
            <Reveal as="ul" className="sb-list sb-list--facts">
              {c.facts.map((f, i) => (
                <li key={f.label} style={v({ '--i': i })}>
                  {f.label} {f.strong ? <strong>{f.value}</strong> : f.value}
                </li>
              ))}
            </Reveal>
          </div>
          <div className="sb-opening__credits">
            <Heading id="sb-credits" small>
              {c.credits.title}
            </Heading>
            <Reveal as="ul" className="sb-list sb-list--credits" delay={120}>
              {c.credits.people.map((p, i) => (
                <li key={p} style={v({ '--i': i })}>
                  {p}
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------- Product overview */}
        <section className="sb-sec sb-product" aria-labelledby="sb-product" data-in>
          <Heading id="sb-product">{c.overview.title}</Heading>
          <Reveal as="div" className="sb-product__text">
            <p>
              <Marked
                text={c.overview.paragraphs[0]}
                marks={['transparent, credible, and accessible elections', 'minimizing human interference and electoral malpractice']}
              />
            </p>
            <p>
              <Marked
                text={c.overview.paragraphs[1]}
                marks={['election rigging and result manipulation are common', 'trust and integrity in voting processes']}
              />
            </p>
          </Reveal>
        </section>

        {/* ------------------------------------- Problem → goal */}
        <section id="problem" className="sb-sec sb-brief" aria-label="Problem statement and goal" data-in>
          <Reveal as="div" className="sb-card sb-card--problem sb-spot">
            <h3 className="sb-card__title">{c.problem.title}</h3>
            <p className="sb-card__text">{c.problem.intro}</p>
            <ul className="sb-bullets sb-bullets--problem">
              {c.problem.items.map((it, i) => (
                <li key={it} style={v({ '--i': i })}>
                  {it}
                </li>
              ))}
            </ul>
            <p className="sb-card__text sb-card__text--end">{c.problem.outro}</p>
            <span className="sb-card__dot sb-card__dot--end" aria-hidden="true" />
          </Reveal>
          <span className="sb-brief__link" aria-hidden="true" />
          <Reveal as="div" className="sb-card sb-card--goal sb-spot" delay={140}>
            <span className="sb-card__dot sb-card__dot--start" aria-hidden="true" />
            <h3 className="sb-card__title">{c.goal.title}</h3>
            <p className="sb-card__text">{c.goal.intro}</p>
            <p className="sb-card__text sb-card__text--lead">{c.goal.lead}</p>
            <ul className="sb-bullets sb-bullets--goal">
              {c.goal.items.map((it, i) => (
                <li key={it} style={v({ '--i': i })}>
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ------------------------------------- Design process */}
        <section id="process" className="sb-sec sb-process" aria-labelledby="sb-process" data-in>
          <Heading id="sb-process">{c.process.title}</Heading>
          <Reveal as="p" className="sb-process__text">
            {c.process.text}
          </Reveal>

          <div className="sb-proc" data-in role="img" aria-label={c.process.summary}>
            <svg className="sb-proc__loops" viewBox="0 0 1107 96" aria-hidden="true" focusable="false">
              <path pathLength="1" d="M1015.5 96 V30 Q1015.5 2 987.5 2 H581.5 Q553.5 2 553.5 30 V82" />
              <path pathLength="1" d="M784.5 96 V70 Q784.5 44 758.5 44 H579.5 Q553.5 44 553.5 70 V82" />
              <path className="sb-proc__head" d="M544 72 L553.5 88 L563 72" />
            </svg>
            <ol className="sb-proc__row" aria-hidden="true">
              {c.process.steps.map((s, i) => (
                <Fragment key={s.label}>
                  <li className="sb-proc__step" style={v({ '--c': s.color, '--i': i })}>
                    <span>{s.label}</span>
                  </li>
                  {i < c.process.steps.length - 1 ? <li className="sb-proc__arrow" style={v({ '--i': i })} aria-hidden="true" /> : null}
                </Fragment>
              ))}
            </ol>
          </div>

          <div className="sb-timeline">
            <p className="sb-eyebrow">{c.timeline.eyebrow}</p>
            <Reveal as="div" className="cs-split sb-lead">
              <h2 id="sb-timeline" className="sb-h1">
                <SplitWords text={c.timeline.title} />
              </h2>
            </Reveal>
            <ol className="sb-phases">
              {c.timeline.phases.map((p, i) => (
                <Reveal as="li" key={p.title} className="sb-phase" delay={i * 90}>
                  <p className="sb-phase__label">Phase {pad(i + 1)}</p>
                  <h3 className="sb-phase__title">{p.title}</h3>
                  <ul className="sb-phase__list">
                    {p.items.map((it) => {
                      const text = typeof it === 'string' ? it : it.text
                      const desktopOnly = typeof it !== 'string' && it.desktopOnly
                      return (
                        <li key={text} className={desktopOnly ? 'sb-desktop-only' : undefined}>
                          {text}
                        </li>
                      )
                    })}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------- Admin workflow */}
        <div className="sb-flows">
          <section id="admin" className="sb-sec sb-flow sb-flow--admin" aria-labelledby="sb-admin" data-in>
            <Heading id="sb-admin">{c.admin.title}</Heading>
            {c.admin.shots.map((s, i) => (
              <Reveal as="figure" key={s.name} className="sb-fig">
                <figcaption className="sb-fig__cap">{s.name}</figcaption>
                <div className="sb-float">
                  <Shot
                    kind="browser"
                    className="sb-tilt"
                    name={s.name}
                    alt={s.alt}
                    src={shotSrc[i]}
                    srcSet={shotSets[i]}
                    w={1152}
                    h={720}
                    video={shotVideos[i]?.src}
                    poster={shotVideos[i]?.poster}
                    onOpen={() => open(i)}
                  />
                </div>
              </Reveal>
            ))}
          </section>
        </div>

        {/* ------------------------------------- Voter workflow */}
        <section id="voter" className="sb-sec sb-flow sb-flow--voter" aria-labelledby="sb-voter" data-in>
          <Heading id="sb-voter">{c.voter.title}</Heading>
          {c.voter.shots.map((s, i) => (
            <Reveal as="figure" key={s.name} className="sb-fig">
              <figcaption className="sb-fig__cap">{s.name}</figcaption>
              <div className="sb-float">
                <Shot
                  kind="phone"
                  className="sb-tilt"
                  name={s.name}
                  alt={s.alt}
                  src={i === 0 ? img.phone1 : img.phone2}
                  w={288}
                  h={656}
                  video={voterVideos[i].src}
                  poster={voterVideos[i].poster}
                  onOpen={() => open(3 + i)}
                />
              </div>
            </Reveal>
          ))}
        </section>

        {/* ------------------------------------- Live website + thanks */}
        <section id="live" className="sb-sec sb-live" aria-labelledby="sb-live" data-in>
          <Heading id="sb-live">{c.live.title}</Heading>
          <Reveal as="p" className="sb-live__text">
            {c.live.text}
          </Reveal>
          <Reveal as="p" className="sb-live__linkwrap" delay={100}>
            <a className="sb-live__link" href={c.live.href} target="_blank" rel="noopener noreferrer">
              <span>{c.live.link}</span>
              <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.75} />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </Reveal>

          <div className="sb-thanks">
            <button type="button" className="sb-memoji" onClick={celebrate} aria-label="Throw some confetti">
              <img src={img.memoji} width={512} height={512} alt="" loading="lazy" decoding="async" />
              {burst > 0 ? (
                <span key={burst} className="sb-confetti" aria-hidden="true">
                  {CONFETTI.map((p, i) => (
                    <i key={i} className={`sb-confetti__bit sb-confetti__bit--${p.s}`} style={v({ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--r': `${p.rot}deg`, '--c': p.c })} />
                  ))}
                </span>
              ) : null}
            </button>
            <Reveal as="div" className="cs-split sb-thanks__lead">
              <p className="sb-thanks__title">
                <SplitWords text={c.live.thanks} />
              </p>
            </Reveal>
            <Reveal as="p" className="sb-thanks__reach" delay={80}>
              {c.live.reach}
            </Reveal>
            <Reveal as="p" className="sb-thanks__emails" delay={140}>
              {c.live.emails.map((e, i) => (
                <Fragment key={e}>
                  <Email address={e} />
                  {i < c.live.emails.length - 1 ? <span className="sb-thanks__sep"> / </span> : null}
                </Fragment>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------- Next */}
        <nav className="sb-next" data-in aria-label="Next project">
          <p className="sb-next__label">{c.next.label}</p>
          <a className="sb-next__link" href={c.next.href}>
            <span className="sb-next__title">{c.next.title}</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} className="sb-next__arrow" />
            <span className="visually-hidden">: next case study</span>
          </a>
        </nav>
      </div>

      <ScreenViewer
        className="sb-viewer"
        actualSize="natural"
        screens={viewerScreens}
        index={viewer ? viewer.index : null}
        onClose={close}
        onChange={change}
      />
    </div>
  )
}
