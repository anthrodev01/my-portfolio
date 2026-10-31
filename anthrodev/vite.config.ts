import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// On Netlify, URL is the site's primary address (your custom domain once it is set).
// VITE_SITE_URL overrides it; the last fallback is only used for local builds.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {}
const SITE_URL = (env.VITE_SITE_URL || env.URL || 'https://anthrodev.netlify.app').replace(/\/+$/, '')

const PAGES = ['/', '/work', '/work/afrixa', '/work/kar', '/work/smoothballot', '/about', '/contact']

/** Fills the absolute URLs that link previews need, and writes sitemap.xml and robots.txt. */
function seo(): Plugin {
  return {
    name: 'anthrodev-seo',
    // 'pre' so the absolute URLs are in place before Vite scans the page for local assets
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    },
    generateBundle() {
      const urls = PAGES.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
    },
  }
}

// Static build -> `dist/`. No backend or paid service required.
export default defineConfig({
  plugins: [react(), seo()],
  server: { port: 5173, open: true },
  build: {
    // Keep small images (e.g. the nav mark) as files, not base64, for caching.
    assetsInlineLimit: 0,
  },
})
