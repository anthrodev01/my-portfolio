import type { CSSProperties } from 'react'
import { desktopProcess, mobileProcess } from '../../data/processPaths'

interface ProcessDiagramProps {
  steps: string[]
}

/**
 * The five-circle "design process" diagram, drawn with the exact geometry from
 * the Figma files. Desktop has connector arrows between circles; the phone
 * version (a different composition in the mobile design) does not.
 * CSS shows exactly one of the two at any width.
 */
export default function ProcessDiagram({ steps }: ProcessDiagramProps) {
  const variants = [
    { key: 'desktop', geo: desktopProcess },
    { key: 'mobile', geo: mobileProcess },
  ] as const

  return (
    <div className="cs-process" role="img" aria-label={`Process: ${steps.join(', then ')}. Ideate loops back from Design and Testing.`}>
      {variants.map(({ key, geo }) => (
        <svg
          key={key}
          className={`cs-process__svg cs-process__svg--${key}`}
          viewBox={geo.viewBox}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {geo.loops.map((d, i) => (
            <path key={`l${i}`} className="cs-process__loop" d={d} fill="#CECCCC" />
          ))}
          {geo.arrows.map((d, i) => (
            <path key={`a${i}`} className="cs-process__arrow" d={d} fill="#CECCCC" />
          ))}
          {geo.circles.map((c, i) => (
            <g
              key={steps[i]}
              className="cs-process__node"
              style={{ '--d': `${i * 90}ms`, color: c.stroke } as CSSProperties}
            >
              <g className="cs-process__float">
                <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry} stroke={c.stroke} strokeWidth="4" />
                <text x={c.cx} y={c.cy + 3.6} textAnchor="middle" fontSize="11" fill="#333333">
                  {steps[i]}
                </text>
              </g>
            </g>
          ))}
        </svg>
      ))}
    </div>
  )
}
