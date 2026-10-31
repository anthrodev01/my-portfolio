import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

/**
 * A very small client-side router: same-site links change the page without a full
 * reload (so the header and fonts stay put and pages can cross-fade), and the
 * browser's back/forward buttons keep working. Everything else (new tabs, modified
 * clicks, other sites, unknown paths) falls through to the browser as usual.
 */

const ROUTES = new Set(['/', '/work', '/work/afrixa', '/work/kar', '/work/smoothballot', '/about', '/contact'])
const listeners = new Set<() => void>()

export const normalisePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/'

/** Optional per-route warm-up (the case studies are code-split) so a click feels instant. */
export const prefetchers: Record<string, () => Promise<unknown>> = {}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const notify = () => listeners.forEach((cb) => cb())
const snapshot = () => window.location.pathname

/** The current pathname; re-renders when the page changes. */
export function usePath(): string {
  return useSyncExternalStore(subscribe, snapshot, () => '/')
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Wait for an element to exist (case studies load lazily), then run `fn`. */
function whenFound(id: string, fn: (el: HTMLElement) => void, frames = 90) {
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      // two frames so the page's own mount effects have run first
      requestAnimationFrame(() => requestAnimationFrame(() => fn(el)))
    } else if (frames-- > 0) {
      requestAnimationFrame(tick)
    }
  }
  tick()
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return
  whenFound(id, (el) => {
    const jump = () => el.scrollIntoView({ block: 'start' })
    jump()
    // Images and fonts settle the layout a moment later; re-aim until the reader takes over.
    const timers = [350, 900, 1800].map((ms) => window.setTimeout(jump, ms))
    const stop = () => {
      timers.forEach(window.clearTimeout)
      ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.removeEventListener(t, stop))
    }
    ;['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) =>
      window.addEventListener(t, stop, { once: true, passive: true }),
    )
    window.setTimeout(stop, 2000)
  })
}

function settle(hash: string) {
  if (hash) scrollToHash(hash)
  else window.scrollTo(0, 0)
  // Hand keyboard / screen-reader focus to the new page without scrolling
  const main = document.getElementById('main')
  if (main) main.focus({ preventScroll: true })
}

function go(url: URL) {
  // remember where we were, so Back returns to the same spot
  history.replaceState({ ...(history.state || {}), y: window.scrollY }, '')
  const apply = () => {
    flushSync(() => {
      history.pushState({ y: 0 }, '', url.pathname + url.search + url.hash)
      notify()
    })
    settle(url.hash)
  }
  type VT = { ready?: Promise<unknown>; finished?: Promise<unknown>; updateCallbackDone?: Promise<unknown> }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => VT }
  if (!prefersReducedMotion() && typeof doc.startViewTransition === 'function') {
    // a quick second click skips the first transition; that is fine, so swallow the rejection
    const vt = doc.startViewTransition(apply)
    vt.ready?.catch(() => {})
    vt.finished?.catch(() => {})
    vt.updateCallbackDone?.catch(() => {})
  } else {
    apply()
  }
}

function internalTarget(e: Event): { a: HTMLAnchorElement; url: URL } | null {
  const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!a) return null
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return null
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  if (!ROUTES.has(normalisePath(url.pathname))) return null
  return { a, url }
}

export function installRouter() {
  history.scrollRestoration = 'manual'

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const hit = internalTarget(e)
    if (!hit) return
    // Same page (including #hash links): the browser already does the right thing
    if (normalisePath(hit.url.pathname) === normalisePath(window.location.pathname)) return
    e.preventDefault()
    go(hit.url)
  })

  // Warm the code for a case study as soon as the pointer is over its link
  const warm = (e: Event) => {
    const hit = internalTarget(e)
    if (hit) void prefetchers[normalisePath(hit.url.pathname)]?.()
  }
  document.addEventListener('pointerover', warm, { passive: true })
  document.addEventListener('focusin', warm)

  // Back / forward
  window.addEventListener('popstate', () => {
    flushSync(notify)
    const y = (history.state && history.state.y) || 0
    const hash = window.location.hash
    if (hash && !y) {
      scrollToHash(hash)
      return
    }
    let tries = 40
    const restore = () => {
      window.scrollTo(0, y)
      if (Math.abs(window.scrollY - y) > 2 && tries-- > 0) requestAnimationFrame(restore)
    }
    requestAnimationFrame(restore)
  })

  // Deep link with a #hash into a lazily loaded page (e.g. /work/afrixa#cs-persona)
  if (window.location.hash) scrollToHash(window.location.hash)
}
