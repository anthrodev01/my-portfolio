import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

export interface ViewerScreen {
  name: string
  /** The largest version of the screen. */
  src: string
  alt: string
  /** A screen recording to play instead of the image; `src` is then its poster. */
  video?: string
  /** A tall phone recording: shown larger than its own pixel size. */
  tall?: boolean
}

interface ScreenViewerProps {
  /** Same order as the tabs; a missing screen is `null`. */
  screens: Array<ViewerScreen | null>
  /** Which screen is open, or `null` when closed. */
  index: number | null
  onClose: () => void
  onChange: (index: number) => void
  /** Extra class on the dialog, to theme it per case study. */
  className?: string
  /** What "Actual size" means: 1440px wide (full screens) or the image's own size (phones). */
  actualSize?: 'wide' | 'natural'
}

/**
 * Full-screen viewer for the high-fidelity screens.
 * - "Fit" shows the whole screen; "Actual size" shows it at design size (1440px
 *   wide) so small text is readable, and you pan by dragging or scrolling.
 * - Click / tap the screen to jump in and out of actual size at that point.
 * - ← → (or swiping while fitted) move between screens; Esc closes.
 * Built on the native <dialog>, so focus is trapped and returned for free.
 */
export default function ScreenViewer({
  screens,
  index,
  onClose,
  onChange,
  className = '',
  actualSize = 'wide',
}: ScreenViewerProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [actual, setActual] = useState(false)
  const focusPoint = useRef<{ x: number; y: number } | null>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  const open = index !== null
  const ready = screens.map((s, i) => (s ? i : -1)).filter((i) => i >= 0)
  const at = index === null ? -1 : ready.indexOf(index)
  const current = index === null ? null : screens[index]

  // Open / close the native dialog to match `index`
  useEffect(() => {
    const dlg = dialogRef.current
    if (!dlg) return
    if (open && !dlg.open) {
      dlg.showModal()
      dlg.querySelector<HTMLElement>('[data-autofocus]')?.focus()
      document.documentElement.classList.add('cs-lock')
    } else if (!open && dlg.open) {
      dlg.close()
    }
    if (!open) {
      document.documentElement.classList.remove('cs-lock')
      setActual(false)
    }
  }, [open])

  useEffect(() => () => document.documentElement.classList.remove('cs-lock'), [])

  // After switching to actual size, centre on the point that was clicked
  useLayoutEffect(() => {
    const body = bodyRef.current
    const p = focusPoint.current
    if (!body || !p) return
    focusPoint.current = null
    if (actual) {
      body.scrollLeft = p.x * body.scrollWidth - body.clientWidth / 2
      body.scrollTop = p.y * body.scrollHeight - body.clientHeight / 2
    }
  }, [actual])

  const go = useCallback(
    (dir: 1 | -1) => {
      if (ready.length < 2 || at < 0) return
      onChange(ready[(at + dir + ready.length) % ready.length])
      setActual(false)
    },
    [ready, at, onChange],
  )

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'z' || e.key === 'Z') {
      if (current?.video) return
      setActual((a) => !a)
    }
  }

  // Mouse drag to pan at actual size (touch scrolls natively)
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const body = bodyRef.current
    if (!body) return
    drag.current = { x: e.clientX, y: e.clientY, left: body.scrollLeft, top: body.scrollTop, moved: false }
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const body = bodyRef.current
    if (!d || !body || !actual) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true
      body.setPointerCapture(e.pointerId)
      body.classList.add('is-dragging')
    }
    if (d.moved) {
      body.scrollLeft = d.left - dx
      body.scrollTop = d.top - dy
    }
  }
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const body = bodyRef.current
    if (body?.hasPointerCapture(e.pointerId)) body.releasePointerCapture(e.pointerId)
    body?.classList.remove('is-dragging')
    // leave `moved` readable for the click that follows, then clear
    window.setTimeout(() => (drag.current = null), 0)
  }

  const onImageClick = (e: ReactMouseEvent<HTMLImageElement>) => {
    if (drag.current?.moved) return
    const r = e.currentTarget.getBoundingClientRect()
    focusPoint.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    setActual((a) => !a)
  }

  // Swipe between screens while fitted
  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (actual || e.touches.length !== 1) return (swipe.current = null)
    swipe.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    const s = swipe.current
    swipe.current = null
    if (!s || actual) return
    const dx = e.changedTouches[0].clientX - s.x
    const dy = e.changedTouches[0].clientY - s.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className={`cs-lightbox${className ? ` ${className}` : ''}`}
      aria-label={current ? `${current.name} screen, full size` : 'Screen viewer'}
      onClose={onClose}
      onKeyDown={onKeyDown}
    >
      {current ? (
        <>
          <header className="cs-lightbox__bar">
            <p className="cs-lightbox__title">
              <span>{current.name}</span>
              {ready.length > 1 ? (
                <span className="cs-lightbox__count" aria-hidden="true">
                  {at + 1} / {ready.length}
                </span>
              ) : null}
            </p>
            <div className="cs-lightbox__actions">
              {current.video ? null : (
              <button
                type="button"
                className="cs-lightbox__btn"
                aria-pressed={actual}
                onClick={() => setActual((a) => !a)}
              >
                {actual ? <ZoomOut aria-hidden="true" size={16} /> : <ZoomIn aria-hidden="true" size={16} />}
                <span>{actual ? 'Fit to screen' : 'Actual size'}</span>
              </button>
              )}
              <button type="button" className="cs-lightbox__btn cs-lightbox__btn--icon" onClick={onClose} aria-label="Close viewer" data-autofocus>
                <X aria-hidden="true" size={18} />
              </button>
            </div>
          </header>

          <div
            ref={bodyRef}
            className={`cs-lightbox__body${actual ? ' is-actual' : ''}${actualSize === 'natural' ? ' is-natural' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={(e) => {
              if (e.target === e.currentTarget && !actual) onClose()
            }}
          >
            {current.video ? (
              <video
                key={index}
                className={`cs-lightbox__img is-video${current.tall ? ' is-tall' : ''}`}
                src={current.video}
                poster={current.src}
                aria-label={current.alt}
                controls
                loop
                muted
                playsInline
                autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
              />
            ) : (
              <img
                key={index}
                className="cs-lightbox__img"
                src={current.src}
                alt={current.alt}
                draggable={false}
                onClick={onImageClick}
              />
            )}
          </div>

          {ready.length > 1 ? (
            <>
              <button type="button" className="cs-lightbox__nav cs-lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous screen">
                <ChevronLeft aria-hidden="true" size={22} />
              </button>
              <button type="button" className="cs-lightbox__nav cs-lightbox__nav--next" onClick={() => go(1)} aria-label="Next screen">
                <ChevronRight aria-hidden="true" size={22} />
              </button>
            </>
          ) : null}
          <p className="visually-hidden" aria-live="polite">
            {current.name}, screen {at + 1} of {ready.length}
          </p>
        </>
      ) : null}
    </dialog>
  )
}
