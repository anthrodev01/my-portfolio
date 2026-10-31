import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'
import { X } from 'lucide-react'
import logoMark from '../assets/images/logo-mark.png'
import { navLeft, navRight } from '../data/site'
import type { NavItem } from '../data/site'
import { usePath } from '../router'

function NavLink({
  item,
  onClick,
  active,
  inContact,
}: {
  item: NavItem
  onClick: () => void
  active: boolean
  inContact: boolean
}) {
  // Away from the homepage, "Work" opens the work page instead of scrolling a section.
  const path = usePath().replace(/\/+$/, '') || '/'
  let href = item.href
  if (item.href === '/#work' && path !== '/') href = '/work'
  const here = (href === '/work' && path === '/work' && !inContact) || (href === '/about' && path === '/about') || (href === '/contact' && path === '/contact')
  return (
    <li>
      <a
        className={`primary-nav__link${active || here ? ' is-active' : ''}`}
        href={href}
        aria-current={here ? 'page' : active ? 'location' : undefined}
        onClick={onClick}
        {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {item.label}
        {item.external && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    </li>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Which homepage section is in view: highlights Work / Contact in the nav
  const [section, setSection] = useState<'work' | 'contact' | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => setOpen(false), [])
  const currentPath = usePath().replace(/\/+$/, '') || '/'

  // On the homepage the logo should scroll to the top instead of reloading.
  const onHomeClick = useCallback(
    (e: ReactMouseEvent<HTMLAnchorElement>) => {
      setOpen(false)
      if (currentPath === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        history.replaceState(null, '', window.location.href.split('#')[0])
      }
    },
    [currentPath],
  )

  // Phone header is tall at the top of the page (as designed) and compacts once scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy for the in-page links (homepage and the work page)
  useEffect(() => {
    const path = currentPath === '/' ? '' : currentPath
    setSection(null)
    if (path !== '' && path !== '/work') return
    let raf = 0
    const update = () => {
      raf = 0
      const work = document.getElementById('work')
      const contact = document.getElementById('contact')
      const y = window.innerHeight * 0.4
      if (path === '/work') {
        setSection(contact && contact.getBoundingClientRect().top <= y ? 'contact' : 'work')
        return
      }
      if (!work || !contact) return
      if (contact.getBoundingClientRect().top <= y) setSection('contact')
      else if (work.getBoundingClientRect().top <= y) setSection('work')
      else setSection(null)
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
  }, [currentPath])

  // A page change closes the phone menu
  useEffect(() => setOpen(false), [currentPath])

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  // Close on Escape (returning focus to the toggle) and when resized to desktop.
  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => mq.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  // Keep Tab focus inside the header (toggle + menu links) while the menu is open.
  const trapFocus = (e: KeyboardEvent<HTMLElement>) => {
    if (!open || e.key !== 'Tab' || !headerRef.current) return
    const focusables = Array.from(
      headerRef.current.querySelectorAll<HTMLElement>('a[href], button'),
    ).filter((el) => el.offsetParent !== null)
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <header
      className={`site-header${open ? ' is-open' : ''}${scrolled ? ' is-scrolled' : ''}`}
      ref={headerRef}
      onKeyDown={trapFocus}
    >
      <div className="site-header__inner">
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? (
            <X aria-hidden="true" size={22} />
          ) : (
            <svg aria-hidden="true" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M1 1h14M1 6h14M1 11h14"
                stroke="#33363f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Mobile-only toggle (left) and brand (right), as in the mobile design. Hidden on desktop via CSS. */}
        <a
          className="site-header__brand"
          href="/"
          aria-label="AnthroDev, home"
          onClick={onHomeClick}
        >
          <img src={logoMark} alt="" width={51} height={51} />
        </a>

        <nav id="primary-nav" className="primary-nav" aria-label="Primary">
          <ul className="primary-nav__list">
            {navLeft.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={close}
                active={item.href === `/#${section}`}
                inContact={section === 'contact'}
              />
            ))}
            <li className="primary-nav__logo">
              <a href="/" aria-label="AnthroDev, home" onClick={onHomeClick}>
                <img src={logoMark} alt="" width={69} height={69} />
              </a>
            </li>
            {navRight.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={close}
                active={item.href === `/#${section}`}
                inContact={section === 'contact'}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
