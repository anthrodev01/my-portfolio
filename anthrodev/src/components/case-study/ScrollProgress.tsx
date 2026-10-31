import { useEffect, useRef } from 'react'

/** A 2px reading-progress line at the top of the page. */
export default function ScrollProgress({ variant = 'green' }: { variant?: 'green' | 'gold' | 'purple' | 'blue' }) {
  const bar = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.current?.style.setProperty('--p', p.toFixed(4))
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
  }, [])
  return (
    <div className={`cs-progress cs-progress--${variant}`} role="presentation" aria-hidden="true">
      <span ref={bar} className="cs-progress__bar" />
    </div>
  )
}
