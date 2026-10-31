import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

/**
 * Splits a heading into words so each can rise in on its own. The full text
 * stays available to assistive tech; the split words are decorative.
 * The parent needs the `cs-split` class and to be a <Reveal>.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="sw__w" style={{ '--i': i } as CSSProperties}>
              {w}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  )
}

/**
 * Words light up as the paragraph scrolls up the screen (no scroll hijacking;
 * it only reads the scroll position). With reduced motion every word is lit.
 */
export function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const words = text.split(' ')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.sx'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => s.classList.add('on'))
      return
    }
    let raf = 0
    let lit = -1
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.5)))
      const n = Math.round(p * spans.length)
      if (n === lit) return
      lit = n
      spans.forEach((s, i) => s.classList.toggle('on', i < n))
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
  }, [text])

  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span ref={ref} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="sx">{w}</span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </>
  )
}

/**
 * Plain word-by-word split for text that stays in the document as real text
 * (hero and contact headlines). Each word gets `--i` so CSS can stagger it.
 */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="sw__w" style={{ '--i': start + i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}
