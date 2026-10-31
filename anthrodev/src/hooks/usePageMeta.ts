import { useEffect } from 'react'

/** Sets <title> and the description / social meta tags while the page is mounted. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title
    const set = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      const created = !el
      if (!el) {
        el = document.createElement('meta')
        const [, key, val] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/) ?? []
        if (key && val) el.setAttribute(key, val)
        document.head.appendChild(el)
      }
      const prev = el.getAttribute(attr)
      el.setAttribute(attr, value)
      return () => {
        if (created) el?.remove()
        else if (prev !== null) el?.setAttribute(attr, prev)
      }
    }
    document.title = title
    const undo = [
      set('meta[name="description"]', 'content', description),
      set('meta[property="og:title"]', 'content', title),
      set('meta[property="og:description"]', 'content', description),
    ]
    if (!window.location.hash) window.scrollTo(0, 0)
    return () => {
      document.title = prevTitle
      undo.forEach((fn) => fn())
    }
  }, [title, description])
}

