import { lazy, Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Reveal from './components/Reveal'
import ProjectSection from './components/ProjectSection'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { ScrollWords } from './components/SplitWords'
import HomeFx from './components/HomeFx'
import ScrollProgress from './components/case-study/ScrollProgress'
import WorkPage from './pages/WorkPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import { projects } from './data/projects'
import { normalisePath, prefetchers, usePath } from './router'

// Loaded on demand: the homepage doesn't need the case study's code.
const loadAfrixa = () => import('./pages/AfrixaCaseStudy')
const loadKar = () => import('./pages/KarCaseStudy')
const loadSmoothBallot = () => import('./pages/SmoothBallotCaseStudy')
const AfrixaCaseStudy = lazy(loadAfrixa)
const KarCaseStudy = lazy(loadKar)
const SmoothBallotCaseStudy = lazy(loadSmoothBallot)
prefetchers['/work/afrixa'] = loadAfrixa
prefetchers['/work/kar'] = loadKar
prefetchers['/work/smoothballot'] = loadSmoothBallot

const normalise = normalisePath

export default function App() {
  const pathname = usePath()
  const path = normalise(pathname)
  const isAfrixa = path === '/work/afrixa'
  const isKar = path === '/work/kar'
  const isSmooth = path === '/work/smoothballot'
  const isWork = path === '/work'
  const isAbout = path === '/about'
  const isContact = path === '/contact'
  const isHome = path === '/'
  const hasOwnPage = isAfrixa || isKar || isSmooth

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {hasOwnPage ? (
          <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
            {isAfrixa ? <AfrixaCaseStudy /> : isKar ? <KarCaseStudy /> : <SmoothBallotCaseStudy />}
          </Suspense>
        ) : isWork ? (
          <WorkPage />
        ) : isAbout ? (
          <AboutPage />
        ) : isContact ? (
          <ContactPage />
        ) : !isHome ? (
          <NotFoundPage />
        ) : (
          <>
            <HomeFx />
            <ScrollProgress variant="gold" />
            <Hero />

            <section id="work" className="work-intro" tabIndex={-1} aria-label="Selected work">
              <Reveal as="p" className="work-intro__text">
                <ScrollWords text="A selection of products I've helped shape." />
              </Reveal>
            </section>

            <div className="projects">
              {projects.map((project, i) => (
                <ProjectSection key={project.slug} project={project} index={i + 1} />
              ))}
            </div>

            <Contact />
          </>
        )}
      </main>
      {/* The case studies and the contact page end with their own closing blocks, as designed. */}
      {!hasOwnPage && !isContact && <Footer />}
    </>
  )
}
