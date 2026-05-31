import { useState } from 'react'
import KaTeX from './KaTeX'
import { GLOSSARY_BY_ID, type GlossaryEntry } from '../../registry/glossary'

interface Props {
  symbolId: string
  children: React.ReactNode
}

export function getGlossaryForFormula(formulaId: string): GlossaryEntry | null {
  // Direct ID match
  if (GLOSSARY_BY_ID.has(formulaId)) return GLOSSARY_BY_ID.get(formulaId)!
  // Try common prefixes
  const prefixes = ['gl_']
  for (const prefix of prefixes) {
    const key = prefix + formulaId
    if (GLOSSARY_BY_ID.has(key)) return GLOSSARY_BY_ID.get(key)!
  }
  return null
}

export default function GlossaryTooltip({ symbolId, children }: Props) {
  const [show, setShow] = useState(false)
  const entry = getGlossaryForFormula(symbolId)

  if (!entry) return <>{children}</>

  return (
    <span
      className="glossary-tooltip-trigger"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="glossary-tooltip">
          <KaTeX latex={entry.latex} />
          <span className="glossary-def">{entry.definition}</span>
          <span className="glossary-chapter">第{entry.chapter}章 · {entry.category}</span>
        </span>
      )}
    </span>
  )
}

export function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <div className="glossary-card">
      <div className="glossary-card-latex">
        <KaTeX latex={entry.latex} displayMode />
      </div>
      <div className="glossary-card-def">{entry.definition}</div>
      <div className="glossary-card-meta">
        第{entry.chapter}章 · {entry.category}
        {entry.isLearned ? ' ✓已学' : ''}
      </div>
    </div>
  )
}
