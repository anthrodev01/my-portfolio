import Contact from '../components/Contact'
import HomeFx from '../components/HomeFx'
import ProjectSection from '../components/ProjectSection'
import ScrollProgress from '../components/case-study/ScrollProgress'
import SectionNav from '../components/case-study/SectionNav'
import { projects } from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'

/**
 * /work: every project in one list, then the contact block. It is the homepage's
 * selected-work section without the introduction, so it shares those components
 * (and their hover and scroll effects).
 */
// For the floating project navigator
const sections = [
  ...projects.map((p) => ({ id: p.slug, label: p.title })),
  { id: 'contact', label: 'Contact' },
]

// The phone design shows the category line for KAR only
const quietOnPhone = new Set(['afrixa', 'smoothballot'])

export default function WorkPage() {
  usePageMeta(
    'Work | AnthroDev',
    'Product design projects by AnthroDev: Afrixa, a commerce operations platform; KAR, a car sale mobile app; and SmoothBallot, digital voting and participation.',
  )

  return (
    <>
      <HomeFx />
      <ScrollProgress variant="gold" />
      <h1 className="visually-hidden">Work</h1>
      <div className="projects projects--page">
        {projects.map((project, i) => (
          <ProjectSection key={project.slug} project={project} index={i + 1} priority={i === 0} quietOnPhone={quietOnPhone.has(project.slug)} />
        ))}
      </div>
      <Contact compact />
      <SectionNav sections={sections} className="work-nav" />
    </>
  )
}
