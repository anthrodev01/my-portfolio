import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import Reveal from './Reveal'
import { Words } from './SplitWords'

interface ProjectSectionProps {
  project: Project
  /** 1-based position, shown as "01", "02"… */
  index: number
  /** Eagerly load the first image only if it could be above the fold. */
  priority?: boolean
  /** On phones, leave the category line out (the Work page design does for some projects). */
  quietOnPhone?: boolean
}

export default function ProjectSection({ project, index, priority = false, quietOnPhone = false }: ProjectSectionProps) {
  const { slug, title, year, role, duration, extra, category, description, tags, href, align, image, mobile } = project
  const num = String(index).padStart(2, '0')
  const headingId = `project-${slug}-title`

  return (
    <article
      id={slug}
      className={`project project--${align}${quietOnPhone ? ' project--quiet-m' : ''}`}
      data-meta={mobile.meta}
      data-media={mobile.media}
      aria-labelledby={headingId}
      style={
        {
          '--media-position': image.position,
          // Reserve the right amount of space for the phone artwork before it loads
          '--media-ratio-m': image.mobile
            ? `${image.mobile.width} / ${image.mobile.height}`
            : undefined,
        } as CSSProperties
      }
    >
      <div className="container">
       <div className="project__inner">
        <div className="project__meta">
          <span className="project__num">
            <span aria-hidden="true">{num}</span>
            <span className="project__year">
              <span aria-hidden="true"> / </span>
              <span className="visually-hidden">Year: </span>
              <time dateTime={String(year)}>{year}</time>
            </span>
          </span>
          <span className="project__category">{category}</span>
        </div>

        <Reveal className="project__body cs-split">
          <div className="project__headline">
            <h2 id={headingId} className="project__title">
              <Words text={title} />
            </h2>
            {/* Phone only (when meta is 'beside'): category sits on the title row.
                CSS shows exactly one of the two category elements at any width. */}
            <span className="project__category project__category--inline">{category}</span>
          </div>
          <p className="project__desc">{description}</p>
          <dl className="project__facts">
            <div>
              <dt>Role</dt>
              <dd>{role}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{duration}</dd>
            </div>
          </dl>
          <ul className="tags" aria-label={`${title} focus areas`}>
            {tags.map((tag) => (
              <li key={tag} className="tags__item">
                {tag}
              </li>
            ))}
          </ul>
          <div className="project__links">
            <a className="text-link" href={href} aria-label={`Explore ${title} case study`}>
              <span className="text-link__label">Explore case study</span>
              <ArrowUpRight className="text-link__icon" aria-hidden="true" size={12} strokeWidth={1.75} />
            </a>
            {extra && (
              <a className="text-link text-link--quiet" href={extra.href} target="_blank" rel="noopener noreferrer">
                <span className="text-link__label">{extra.label}</span>
                <ArrowUpRight className="text-link__icon" aria-hidden="true" size={12} strokeWidth={1.75} />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </Reveal>

        <Reveal className="project__media-wrap" delay={80}>
          {/* Keyboard users reach the case study via the text link above. */}
          <a className="project__media" href={href} tabIndex={-1}>
            <picture>
              {image.mobile && (
                <source media="(max-width: 767px)" srcSet={image.mobile.srcSet} sizes="100vw" />
              )}
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes="(min-width: 1390px) 1304px, 100vw"
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
              />
            </picture>
          </a>
        </Reveal>
       </div>
      </div>
    </article>
  )
}
