import { useEffect } from 'react'

/**
 * Page-level pointer and section effects for the case study:
 *  - `.cs-spot`  gets --mx/--my so a soft spotlight follows the cursor
 *  - `.cs-tilt`  gets --rx/--ry for a barely-there 3D tilt on large artwork
 *  - `.cs-section` gets `is-in` the first time it scrolls into view (draws its rule)
 * Pointer effects only run for a mouse; nothing here hijacks scrolling.
 */
export function usePointerFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    // Section rules
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.cs-section'))
    if (reduce || !('IntersectionObserver' in window)) {
      sections.forEach((s) => s.classList.add('is-in'))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting || e.boundingClientRect.top < 0) {
              // Anything above the viewport is already "in" too (reloads and anchor jumps).
              const at = sections.indexOf(e.target as HTMLElement)
              sections.slice(0, at + 1).forEach((s) => {
                s.classList.add('is-in')
                io.unobserve(s)
              })
            }
          })
        },
        { threshold: 0, rootMargin: '0px 0px -12% 0px' },
      )
      sections.forEach((s) => io.observe(s))
      cleanups.push(() => io.disconnect())
    }

    // Spotlight + tilt
    const spots = Array.from(document.querySelectorAll<HTMLElement>('.cs-spot'))
    spots.forEach((el) => {
      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      el.addEventListener('pointermove', move)
      cleanups.push(() => el.removeEventListener('pointermove', move))
    })

    if (!reduce) {
      const tilts = Array.from(document.querySelectorAll<HTMLElement>('.cs-tilt'))
      tilts.forEach((el) => {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          el.style.setProperty('--ry', `${(x * 2.4).toFixed(2)}deg`)
          el.style.setProperty('--rx', `${(-y * 1.6).toFixed(2)}deg`)
        }
        const leave = () => {
          el.style.setProperty('--ry', '0deg')
          el.style.setProperty('--rx', '0deg')
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
