# AnthroDev portfolio

Oladejo Jibril's product design portfolio. React 19 + Vite + TypeScript, plain CSS, Geist (self-hosted), Lucide icons. Static site, no backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

Node 20.19+ (22 recommended).

## Deploy to Netlify

1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import from Git**, pick the repo. The build settings come from `netlify.toml` (`npm run build`, publish `dist`).
3. After the first deploy, open **Forms** in Netlify to see contact-form submissions (the form is `contact`, with a honeypot). Turn on email notifications under *Forms → Form notifications*.

The site address used in link previews, `sitemap.xml` and `robots.txt` is read from Netlify's `URL` variable, so it follows your custom domain automatically. To force one, set `VITE_SITE_URL` in Netlify's environment variables.

`/resume` redirects to the Canva resume (see `public/_redirects`).

## Where to edit things

| What | File |
| --- | --- |
| Name, role, email, LinkedIn, resume link, "Open to opportunities" pill (`available`) | `src/data/site.ts` |
| Project cards: year, role, duration, extra link, order | `src/data/projects.ts` |
| Case study copy | `src/data/afrixa.ts`, `kar.ts`, `smoothballot.ts` |
| About page copy and photos | `src/data/about.ts`, `src/pages/AboutPage.tsx` |
| Contact form topics | `src/pages/ContactPage.tsx` |
| Link-preview image | `public/og-image.jpg` (1200 × 630) |
| Colours | `src/styles/tokens.css` |

## Notes

- Same-site links change pages without a full reload (`src/router.ts`); other links behave as normal links.
- Motion respects `prefers-reduced-motion`.
- The contact page's handwritten notes use a fallback font stack (`--font-hand`, defined in `src/styles/about.css`). To match the design exactly, add the real font to `public/fonts/`, declare it in `src/styles/fonts.css`, and put its name first in `--font-hand`.
