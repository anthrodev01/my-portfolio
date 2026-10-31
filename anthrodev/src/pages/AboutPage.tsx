import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import Contact from '../components/Contact'
import HomeFx from '../components/HomeFx'
import Reveal from '../components/Reveal'
import { Words } from '../components/SplitWords'
import ScrollProgress from '../components/case-study/ScrollProgress'
import SectionNav from '../components/case-study/SectionNav'
import { portrait, snaps, steps } from '../data/about'
import type { Snap } from '../data/about'
import { useReveal } from '../hooks/useReveal'
import { usePageMeta } from '../hooks/usePageMeta'

const sections = [
  { id: 'about', label: 'About me' },
  { id: 'how-i-think', label: 'How I think' },
  { id: 'beyond', label: 'Beyond the pixels' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Where each photo sits on the board, in the design's own pixels: d* is the
 * 1512px desktop design, m* the 390px phone design (y is measured from the rule
 * above "Beyond the pixels"). `par` is how far, in px, it drifts as the board
 * scrolls past; `cap` is the caption's left inset, right overhang and gap below the photo.
 */
interface Place {
  d: [x: number, y: number, w: number, h: number, r: number]
  m: [x: number, y: number, w: number, h: number, r: number]
  par: number
  /** Where the photo's decoration (squiggle, sparkle, sticky note) sits, from its top-left. */
  extra?: { d: [number, number]; m: [number, number] }
  cap?: { d: [number, number, number]; m: [number, number, number] }
}
const places: Record<string, Place> = {
  pitch: { d: [53.6, 271, 574, 568, -1.1], m: [23, 280, 335, 332, -1.1], par: -26, cap: { d: [14, 9, 18], m: [1, 5, 16] } },
  field: { d: [826.6, 244, 370, 368, 1.2], m: [65, 705, 235, 237, 1.2], par: 18, extra: { d: [-45.6, 341], m: [-62, 36] }, cap: { d: [1, -3, 16], m: [-41, 4, 18] } },
  moments: { d: [721.2, 717, 442, 338, -0.9], m: [24, 1387, 342, 227, 0], par: -14, extra: { d: [373, 344], m: [228, 216] } },
  desk: { d: [155.8, 928, 334, 328, 1.2], m: [23, 1027, 297, 290, 1.2], par: 22, extra: { d: [364, 88], m: [321, 77] }, cap: { d: [1, -3, 17], m: [5, 25, 15] } },
  adventures: { d: [545, 1119, 370, 298, -0.6], m: [22, 1871, 343, 278, -0.6], par: -20, cap: { d: [8, 3, 21], m: [7, 0, 13] } },
  badge: { d: [983.4, 1122.7, 274, 268, 1.7], m: [190, 1656, 187, 185, 1.7], par: 26 },
  details: { d: [61.5, 1421, 226, 228, -1.5], m: [16, 1656, 165, 160, -1.5], par: -10, cap: { d: [10, 7, 15], m: [8, 7, 14] } },
}

function Sparkle({ className }: { className: string }) {
  return (
    <span className={`ab-spark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path
          d="M12 0.5C12.9 7.3 16.7 11.1 23.5 12 16.7 12.9 12.9 16.7 12 23.5 11.1 16.7 7.3 12.9 0.5 12 7.3 11.1 11.1 7.3 12 0.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function Squiggle() {
  return (
    <span className="ab-squiggle" aria-hidden="true">
      <svg viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path className="ab-squiggle__line" pathLength="1" d="M2 9.5C5 4.5 9 4.5 11 8.3S16.5 12.5 20 8.3 26 4.3 30 7.6 33 9.4 36 8.6" />
        <path className="ab-squiggle__head" d="M31.3 4.6 36.4 8.6 31 12.2" />
      </svg>
    </span>
  )
}

function Polaroid({ snap, index }: { snap: Snap; index: number }) {
  const ref = useReveal<HTMLElement>()
  const p = places[snap.id]
  const [dx, dy, dw, dh, dr] = p.d
  const [mx, my, mw, mh, mr] = p.m
  const cap = p.cap
  const style = {
    '--dx': dx,
    '--dy': dy,
    '--dw': dw,
    '--dh': dh,
    '--dr': `${dr}deg`,
    '--mx': mx,
    '--my': my,
    '--mw': mw,
    '--mh': mh,
    '--mr': `${mr}deg`,
    '--paper': snap.paper,
    '--fd': snap.focus.d,
    '--fm': snap.focus.m,
    '--z': snap.zoom,
    '--par': p.par,
    ...(p.extra ? { '--edx': p.extra.d[0], '--edy': p.extra.d[1], '--emx': p.extra.m[0], '--emy': p.extra.m[1] } : {}),
    '--i': index,
    ...(cap
      ? { '--cld': cap.d[0], '--crd': cap.d[1], '--ctd': cap.d[2], '--clm': cap.m[0], '--crm': cap.m[1], '--ctm': cap.m[2] }
      : {}),
  } as CSSProperties
  const { image } = snap

  return (
    <figure ref={ref} className={`ab-pol ab-pol--${snap.id}`} style={style}>
      <div className="ab-pol__frame">
        <span className="ab-pol__paper" aria-hidden="true" />
        <div className="ab-pol__photo">
          <img
            src={image.sm}
            srcSet={`${image.sm} 560w, ${image.lg} ${image.w}w`}
            sizes={`(min-width: 1100px) ${Math.round(dw)}px, ${Math.round(mw)}px`}
            width={image.w}
            height={image.h}
            alt={snap.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <span className="ab-pol__no" aria-hidden="true">
            {snap.no}
          </span>
        </div>
        {snap.tape ? <span className="ab-pol__tape" aria-hidden="true" /> : null}
        {snap.id === 'field' ? <Squiggle /> : null}
        {snap.id === 'desk' ? <Sparkle className="ab-spark--desk" /> : null}
        {snap.id === 'moments' ? <span className="ab-pol__sticky">made of many moments</span> : null}
        {snap.label || snap.note ? (
          <figcaption className="ab-pol__cap">
            {snap.label ? <span className="ab-pol__label">{snap.label}</span> : null}
            {snap.note ? <span className="ab-pol__note">{snap.note}</span> : null}
          </figcaption>
        ) : null}
      </div>
    </figure>
  )
}

/** Lets the board drift very slightly as it scrolls by (skipped with reduced motion). */
function useBoardDrift(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const mid = r.top + r.height / 2
      const p = Math.max(-1, Math.min(1, (mid - vh / 2) / (vh / 2 + r.height / 2)))
      el.style.setProperty('--gp', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])
}

export default function AboutPage() {
  usePageMeta(
    'About | AnthroDev',
    'Oladejo Jibril is a Product Designer and Design Lead from Nigeria, with a background in Anthropology, creating digital products that make complex things feel simple.',
  )
  const boardRef = useRef<HTMLDivElement | null>(null)
  useBoardDrift(boardRef)

  // Lets the footer line up with this page's wider artboard (see about.css)
  useEffect(() => {
    document.documentElement.classList.add('is-about')
    return () => document.documentElement.classList.remove('is-about')
  }, [])

  return (
    <>
      <HomeFx />
      <ScrollProgress variant="gold" />
      <div className="about">
        <div className="ab-stage">
          <section id="about" className="ab-hero" aria-labelledby="about-title" tabIndex={-1}>
            <p className="ab-label">About me</p>
            <Reveal as="div" className="ab-titlewrap cs-split">
              <h1 id="about-title" className="ab-title">
                <Words text="A product designer with an" />{' '}
                <span className="accent">
                  <Words text="anthropologist’s eye." start={5} />
                </span>
              </h1>
            </Reveal>

            <Reveal as="p" className="ab-lede" delay={80}>
              I'm Oladejo Jibril, a Product Designer and Design Lead from Nigeria, passionate about
              creating digital products that solve real problems and make people's lives easier.
            </Reveal>

            <Reveal as="figure" className="ab-portrait" delay={120}>
              <div
                className="ab-portrait__frame"
                style={{ '--fd': portrait.focus.d, '--fm': portrait.focus.m, '--z': portrait.zoom } as CSSProperties}
              >
                <img
                  src={portrait.sm}
                  srcSet={`${portrait.sm} 560w, ${portrait.lg} ${portrait.w}w`}
                  sizes="(min-width: 1100px) 414px, 341px"
                  width={portrait.w}
                  height={portrait.h}
                  alt="Oladejo Jibril in a denim jacket and sunglasses, in black and white, arms crossed in front of a curtain."
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <figcaption className="ab-portrait__cap">Oladejo Jibril · Product Designer &amp; Design Lead</figcaption>
            </Reveal>

            <Reveal className="ab-bio" delay={160}>
              <p>
                My background in Anthropology has shaped how I see the world: I'm curious about
                people, how they behave, the systems they live in, and how technology can make
                everyday experiences better.
              </p>
              <p>
                <span aria-hidden="true">⚽ </span>Beyond the pixels, you'll probably find me on a football pitch, playing
                with my team, or debating whether that last goal was actually offside. Football
                reminds me a lot of design: good results rarely come from one person alone. It takes
                teamwork, communication, and knowing when to make the right pass.
              </p>
              <p>
                <span aria-hidden="true">🌍 </span>My curiosity goes beyond the screen. Anthropology introduced me to
                fieldwork, observing people in their everyday environments, asking questions, and
                understanding perspectives different from my own. I bring that same curiosity into
                product design, where understanding people is just as important as designing the
                interface.
              </p>
              <p>
                At the end of the day, I'm a curious thinker, a team player, and someone who believes
                there's always something new to learn. Whether I'm exploring human behaviour, playing
                football, or working through a challenging design problem, I enjoy the process of
                figuring things out.
              </p>
              <p>Take a look around, explore my work, and feel free to say hello!</p>
            </Reveal>
          </section>

          <section id="how-i-think" className="ab-think" aria-labelledby="think-title" tabIndex={-1}>
            <Reveal as="span" className="ab-rule" />
            <Reveal as="p" className="ab-label">
              How I think
            </Reveal>
            <Reveal as="div" className="ab-think__head cs-split">
              <h2 id="think-title" className="ab-think__title">
                <Words text="Good design starts with understanding the problem." />
              </h2>
            </Reveal>
            <Reveal as="p" className="ab-think__text" delay={100}>
              I look beyond individual screens to understand the people, workflows and business
              goals behind a product. My process brings together structured thinking, thoughtful UX
              and careful visual execution.
            </Reveal>
            <ol className="ab-steps">
              {steps.map((step, i) => (
                <Reveal as="li" className="ab-step" key={step.no} delay={i * 90}>
                  <span className="ab-step__no">{step.no}</span>
                  <h3 className="ab-step__title">{step.title}</h3>
                  <p className="ab-step__text">{step.text}</p>
                  <a className="ab-step__proof" href={step.proof.href}>
                    {step.proof.label}
                    <span aria-hidden="true"> →</span>
                  </a>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="beyond" className="ab-beyond" aria-labelledby="beyond-title" tabIndex={-1}>
            <Reveal as="span" className="ab-rule" />
            <Reveal as="p" className="ab-label">
              Beyond the pixels
            </Reveal>
            <Reveal as="div" className="ab-beyond__head cs-split">
              <h2 id="beyond-title" className="ab-beyond__title">
                <Words text="A little bit of me," />{' '}
                <span className="accent">
                  <Words text="Off the screen" start={5} />
                </span>
              </h2>
            </Reveal>
            <Sparkle className="ab-spark--head" />
            <Reveal as="p" className="ab-beyond__text" delay={100}>
              Football, fieldwork, random adventures, and the little moments that keep me curious.
              Here’s a glimpse of life beyond the design desk.
            </Reveal>

            <div className="ab-gallery" ref={boardRef} role="group" aria-label="Photos from life off the screen">
              {snaps.map((snap, i) => (
                <Polaroid key={snap.id} snap={snap} index={i} />
              ))}
            </div>
          </section>
        </div>
        <Contact compact />
      </div>
      <SectionNav sections={sections} className="work-nav" />
    </>
  )
}
