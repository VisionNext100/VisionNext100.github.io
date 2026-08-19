import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './LifePageShell.css'

type Props = {
  title: string
  lead: string
  children: ReactNode
  className?: string
}

export function LifePageShell({ title, lead, children, className }: Props) {
  return (
    <div className={['life-page', className].filter(Boolean).join(' ')}>
      <div className="life-page__inner">
        <Link to="/#life" className="life-page__back">
          ← Back to Life
        </Link>
        <h1 className="life-page__title">{title}</h1>
        <p className="section__lead life-page__lead">{lead}</p>
        {children}
      </div>
    </div>
  )
}
