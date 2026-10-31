import { useEffect } from 'react'

/**
 * Motion helpers for the KAR case study (all optional decoration; the page is
 * complete without them):
 *  - `is-in`        added to `[data-in]` blocks the first time they scroll into view
 *                   (sections draw their rules, diagrams start drawing)
 *  - `--hs`         hero scroll progress (0 → 1): the phones and photo drift apart
 *  - `--hx / --hy`  pointer position over the hero (-1 → 1): the layers parallax
 *  - `--rx / --ry`  a barely-there tilt on `.kar-tilt` phones under a mouse
 *  - `--ps`         position of each `.kar-float` in the viewport (-1 → 1)
 *  - `--mx / --my`  pointer position inside `.kar-spot` cards (a soft glow follows it)
 * Pointer effects are mouse-only; scroll effects are skipped for reduced motion.
 */
export function useKarFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    // ---- Blocks entering view ------------------------------------------------
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-in]'))
    if (reduce || !('IntersectionObserver' in window)) {
      blocks.forEach((b) => b.classList.add('is-in'))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            // Also anything already scrolled past (reloads, anchor jumps)
            if (e.isIntersecting || e.boundingClientRect.top < 0) {
              e.target.classList.add('is-in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.06, rootMargin: '0px 0px -12% 0px' },
      )
      blocks.forEach((b) => io.observe(b))
      cleanups.push(() => io.disconnect())
    }

    if (reduce) return () => cleanups.forEach((fn) => fn())

    // ---- Scroll-linked variables ---------------------------------------------
    const hero = document.querySelector<HTMLElement>('.kar-hero')
    const floats = Array.from(document.querySelectorAll<HTMLElement>('.kar-float'))
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      if (hero) {
        const r = hero.getBoundingClientRect()
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.8)))
        hero.style.setProperty('--hs', p.toFixed(3))
      }
      for (const el of floats) {
        const r = el.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) continue
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        el.style.setProperty('--ps', Math.max(-1, Math.min(1, p)).toFixed(3))
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    cleanups.push(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    })

    // ---- Pointer effects (mouse only) ----------------------------------------
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      if (hero) {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = hero.getBoundingClientRect()
          hero.style.setProperty('--hx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
          hero.style.setProperty('--hy', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
        }
        const leave = () => {
          hero.style.setProperty('--hx', '0')
          hero.style.setProperty('--hy', '0')
        }
        hero.addEventListener('pointermove', move)
        hero.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          hero.removeEventListener('pointermove', move)
          hero.removeEventListener('pointerleave', leave)
        })
      }

      document.querySelectorAll<HTMLElement>('.kar-spot').forEach((el) => {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${e.clientX - r.left}px`)
          el.style.setProperty('--my', `${e.clientY - r.top}px`)
        }
        el.addEventListener('pointermove', move)
        cleanups.push(() => el.removeEventListener('pointermove', move))
      })

      document.querySelectorAll<HTMLElement>('.kar-tilt').forEach((el) => {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = el.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          el.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
          el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
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
