import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export interface NavSection {
  id: string
  label: string
}

/**
 * A long case study is easier to move around in with a map. This is a small
 * floating control that shows which section you're in and how far through the
 * page you are, and opens a list to jump anywhere.
 *  - Appears once the hero has scrolled away; never covers content at rest.
 *  - Arrow keys / Home / End move through the list, Esc closes and returns focus.
 *  - Jumps use the browser's own scrolling (smooth only if motion is allowed).
 */
export default function SectionNav({ sections, className = 'kar-nav' }: { sections: NavSection[]; className?: string }) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [current, setCurrent] = useState(-1)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const ringRef = useRef<SVGCircleElement | null>(null)

  // Scroll-spy + progress ring
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.innerHeight * 0.4
      let idx = -1
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= y) idx = i
      })
      setCurrent(idx)
      setShown(window.scrollY > window.innerHeight * 0.55)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ringRef.current?.style.setProperty('--p', p.toFixed(4))
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
  }, [sections])

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Move focus into the list when it opens
  useEffect(() => {
    if (open) rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open])

  const go = (id: string | null) => {
    setOpen(false)
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (id === null) window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    else document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const at = items.indexOf(document.activeElement as HTMLElement)
    let next = -1
    if (e.key === 'ArrowDown') next = (at + 1) % items.length
    else if (e.key === 'ArrowUp') next = (at - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    if (next >= 0) {
      e.preventDefault()
      items[next].focus()
    }
  }

  const label = current >= 0 ? sections[current].label : 'Contents'

  return (
    <div ref={rootRef} className={`${className}${shown ? ' is-shown' : ''}${open ? ' is-open' : ''}`}>
      <button
        ref={btnRef}
        type="button"
        className={`${className}__btn`}
        aria-expanded={open}
        aria-controls="kar-nav-list"
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        tabIndex={shown || open ? 0 : -1}
      >
        <svg className={`${className}__ring`} viewBox="0 0 36 36" aria-hidden="true">
          <circle className={`${className}__ring-bg`} cx="18" cy="18" r="15" pathLength="1" />
          <circle ref={ringRef} className={`${className}__ring-fg`} cx="18" cy="18" r="15" pathLength="1" />
        </svg>
        <span className={`${className}__count`} aria-hidden="true">
          {current >= 0 ? String(current + 1).padStart(2, '0') : '··'}
        </span>
        <span className={`${className}__label`}>{label}</span>
        <span className="visually-hidden">. Open the list of sections</span>
        <span className={`${className}__chev`} aria-hidden="true" />
      </button>

      <ul
        id="kar-nav-list"
        className={`${className}__list`}
        role="menu"
        aria-label="Sections of this case study"
        hidden={!open}
        onKeyDown={onListKey}
      >
        {sections.map((s, i) => (
          <li key={s.id} role="none">
            <a
              role="menuitem"
              href={`#${s.id}`}
              className={`${className}__item${i === current ? ' is-current' : ''}`}
              aria-current={i === current ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(s.id)
              }}
            >
              <span className={`${className}__num`}>{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </a>
          </li>
        ))}
        <li role="none" className={`${className}__top`}>
          <a
            role="menuitem"
            href="#top"
            className={`${className}__item`}
            onClick={(e) => {
              e.preventDefault()
              go(null)
            }}
          >
            <ArrowUp aria-hidden="true" size={14} />
            Back to top
          </a>
        </li>
      </ul>
    </div>
  )
}
