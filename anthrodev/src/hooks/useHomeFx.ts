import { useEffect } from 'react'

/**
 * Homepage motion helpers (everything is optional decoration; the page is
 * complete without it):
 *  - `is-in`      added to .project / .contact the first time they scroll into view
 *  - `--hs`       hero scroll progress (0 → 1) so the headline and aura drift apart
 *  - `--ps`       each project's position in the viewport (-1 → 1), for the ghost numeral
 *  - `--hx/--hy`  pointer position over the hero (-1 → 1) steering the aura
 *  - `--bx/--by`  a small magnetic pull on the "Dive In" button
 *  - `--mx/--my`, `--px/--py`  pointer over a project panel: the "View" chip and an inner parallax
 * Pointer effects are mouse-only; scroll effects are skipped for reduced motion.
 */
export function useHomeFx() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    // ---- Landing on /#work or /#contact (e.g. "Back to work" from a case study).
    // The browser tries before React has drawn the page, so do it once it exists,
    // and again after images and fonts have settled the layout.
    const hashId = decodeURIComponent(window.location.hash.slice(1))
    if (hashId) {
      const jump = () => document.getElementById(hashId)?.scrollIntoView({ block: 'start' })
      jump()
      window.addEventListener('load', jump, { once: true })
      const t = window.setTimeout(jump, 600)
      const cancel = () => {
        window.clearTimeout(t)
        window.removeEventListener('load', jump)
      }
      window.addEventListener('wheel', cancel, { once: true, passive: true })
      window.addEventListener('touchstart', cancel, { once: true, passive: true })
      cleanups.push(() => {
        window.removeEventListener('load', jump)
        window.removeEventListener('wheel', cancel)
        window.removeEventListener('touchstart', cancel)
        window.clearTimeout(t)
      })
    }

    // ---- Section entrances ------------------------------------------------
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.project, .contact, .work-intro'))
    if (reduce || !('IntersectionObserver' in window)) {
      sections.forEach((s) => s.classList.add('is-in'))
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting || e.boundingClientRect.top < 0) {
              e.target.classList.add('is-in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0, rootMargin: '0px 0px -14% 0px' },
      )
      sections.forEach((s) => io.observe(s))
      cleanups.push(() => io.disconnect())
    }

    // ---- Scroll-linked variables -------------------------------------------
    const hero = document.querySelector<HTMLElement>('.hero')
    const projects = Array.from(document.querySelectorAll<HTMLElement>('.project'))
    if (!reduce) {
      let raf = 0
      const update = () => {
        raf = 0
        const vh = window.innerHeight
        if (hero) {
          const h = hero.offsetHeight || 1
          const p = Math.min(1, Math.max(0, window.scrollY / h))
          hero.style.setProperty('--hs', p.toFixed(3))
        }
        projects.forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.bottom < -200 || r.top > vh + 200) return
          const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
          el.style.setProperty('--ps', Math.max(-1, Math.min(1, p)).toFixed(3))
        })
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
    }

    // ---- Pointer effects (mouse only, never for reduced motion) ------------
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
      // Hero aura follows the cursor a little
      if (hero) {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = hero.getBoundingClientRect()
          hero.style.setProperty('--hx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
          hero.style.setProperty('--hy', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
        }
        hero.addEventListener('pointermove', move)
        cleanups.push(() => hero.removeEventListener('pointermove', move))
      }

      // Magnetic "Dive In"
      const cta = document.querySelector<HTMLElement>('.hero__cta')
      const btn = cta?.querySelector<HTMLElement>('.btn')
      if (cta && btn) {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = btn.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          const dist = Math.hypot(dx, dy)
          if (dist > 110) return leave()
          btn.style.setProperty('--bx', `${(dx * 0.22).toFixed(1)}px`)
          btn.style.setProperty('--by', `${(dy * 0.28).toFixed(1)}px`)
        }
        const leave = () => {
          btn.style.setProperty('--bx', '0px')
          btn.style.setProperty('--by', '0px')
        }
        cta.addEventListener('pointermove', move)
        cta.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          cta.removeEventListener('pointermove', move)
          cta.removeEventListener('pointerleave', leave)
        })
      }

      // Project panels: "View" chip that follows the cursor, plus a touch of inner parallax
      document.querySelectorAll<HTMLElement>('.project__media').forEach((el) => {
        const move = (e: PointerEvent) => {
          if (e.pointerType !== 'mouse') return
          const r = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${e.clientX - r.left}px`)
          el.style.setProperty('--my', `${e.clientY - r.top}px`)
          el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
          el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
          el.classList.add('is-tracking')
        }
        const leave = () => {
          el.classList.remove('is-tracking')
          el.style.setProperty('--px', '0')
          el.style.setProperty('--py', '0')
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
