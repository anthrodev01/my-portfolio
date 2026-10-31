import { useEffect, useRef } from 'react'

/**
 * Adds `is-visible` to the element once it scrolls into view.
 * - Runs once per element (no re-hiding while scrolling back up).
 * - If IntersectionObserver is unavailable, or the user prefers reduced
 *   motion, the element is shown immediately.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Also reveal anything already scrolled past (reloads, anchor jumps, End key).
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            const el = entry.target as HTMLElement
            el.classList.add('is-visible')
            // The stagger delay is only for the entrance; hover states shouldn't inherit it.
            if (el.style.transitionDelay) {
              window.setTimeout(() => (el.style.transitionDelay = ''), 1800)
            }
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
