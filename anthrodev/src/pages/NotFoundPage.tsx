import { useEffect } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

/** Shown for any address the site doesn't have. */
export default function NotFoundPage() {
  usePageMeta('Page not found | AnthroDev', 'This page does not exist. Head back to the selected work or get in touch.')

  // Keep stray addresses out of search results
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <section className="coming-soon container" aria-labelledby="nf-title">
      <p className="coming-soon__eyebrow">404</p>
      <h1 id="nf-title" className="coming-soon__title">
        This page isn’t here.
      </h1>
      <p className="coming-soon__text">The link may be old, or the address mistyped. These will get you back on track.</p>
      <div className="nf-links">
        <a className="text-link" href="/">
          <span className="text-link__label">Homepage</span>
        </a>
        <a className="text-link" href="/work">
          <span className="text-link__label">Selected work</span>
        </a>
        <a className="text-link" href="/contact">
          <span className="text-link__label">Get in touch</span>
        </a>
      </div>
    </section>
  )
}
