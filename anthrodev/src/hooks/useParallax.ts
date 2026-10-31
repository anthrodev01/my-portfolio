import { useEffect, useRef } from 'react'

/**
 * Subtle scroll-linked drift for large mockups.
 *
 * Sets `--py` (a px offset between -strength and +strength) on the element as
 * it travels through the viewport; CSS applies it with `translate3d`.
 * - No scroll hijacking: it only reads scroll position inside a rAF.
 * - Does nothing for reduced-motion users (the variable stays at 0).
 */
export function useParallax<T extends HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // -1 when the element is entering from below, +1 when leaving above
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
      const clamped = Math.max(-1, Math.min(1, progress))
      el.style.setProperty('--py', `${(clamped * strength).toFixed(2)}px`)
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
  }, [strength])

  return ref
}
