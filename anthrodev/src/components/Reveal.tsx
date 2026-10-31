import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface RevealProps {
  as?: ElementType
  className?: string
  /** Stagger in ms. */
  delay?: number
  children: ReactNode
}

/** Fades and lifts its children in the first time they enter the viewport. */
export default function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  children,
}: RevealProps) {
  const ref = useReveal<HTMLElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
