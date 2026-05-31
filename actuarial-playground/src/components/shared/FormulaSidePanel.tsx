import KaTeX from './KaTeX'
import MixedText from './MixedText'
import { FORMULA_BY_ID, ALL_FORMULAS } from '../../registry/formulas'
import { ALL_CONCEPT_EDGES } from '../../registry/edges'
import { useUIStore } from '../../stores/useUIStore'
import type { FormulaEntry } from '../../registry/types'

function findRelatedFormulas(formulaId: string): FormulaEntry[] {
  const entry = FORMULA_BY_ID.get(formulaId)
  if (!entry) return []

  const sameCategory = ALL_FORMULAS.filter(
    (f) => f.chapter === entry.chapter && f.subcategory === entry.subcategory && f.id !== formulaId
  )

  const upstream = ALL_CONCEPT_EDGES
    .filter((e) => e.target === formulaId)
    .map((e) => FORMULA_BY_ID.get(e.source))
    .filter(Boolean) as FormulaEntry[]

  const seen = new Set<string>([formulaId])
  const result: FormulaEntry[] = []
  for (const f of [...sameCategory, ...upstream]) {
    if (!seen.has(f.id)) { seen.add(f.id); result.push(f); if (result.length >= 8) break }
  }
  return result
}

export default function FormulaSidePanel() {
  const formulaPanelId = useUIStore((s) => s.formulaPanelId)
  const openFormulaPanel = useUIStore((s) => s.openFormulaPanel)

  if (!formulaPanelId) return null

  const entry = FORMULA_BY_ID.get(formulaPanelId)
  if (!entry) return null

  const related = findRelatedFormulas(formulaPanelId)

  return (
    <aside className="formula-side-panel">
      <div className="formula-side-panel-header">
        <h3><KaTeX latex={entry.latex} /></h3>
        <button className="formula-side-panel-close" onClick={() => openFormulaPanel(null)}>✕</button>
      </div>

      <div className="formula-side-panel-body">
        <div className="formula-side-badge">
          第{entry.chapter}章 · {entry.subcategory}
        </div>

        <section className="formula-side-section">
          <h4>定义</h4>
          <p>{entry.definition}</p>
        </section>

        <section className="formula-side-section">
          <h4>计算公式</h4>
          <div className="formula-side-latex">
            <KaTeX latex={entry.formulaLatex} displayMode />
          </div>
        </section>

        {(entry as any).proof && (
          <section className="formula-side-section">
            <h4>推导过程</h4>
            <div className="formula-side-proof">
              {(entry as any).proof
                .replace(/\\n/g, '\n')
                .split('\n')
                .filter((l: string) => l.trim())
                .map((line: string, i: number) => {
                  // 如果行包含 $...$，用 MixedText 渲染
                  if (line.includes('$')) {
                    return <p key={i}><MixedText text={line.trim()} /></p>
                  }
                  // 纯文本行直接显示
                  return <p key={i} className="formula-side-proof-plain">{line.trim()}</p>
                })}
            </div>
          </section>
        )}

        {entry.inputs.length > 0 && (
          <section className="formula-side-section">
            <h4>输入参数</h4>
            <div className="formula-side-params">
              {entry.inputs.map((inp) => (
                <span key={inp.name} className="formula-side-param">
                  {inp.label} ({inp.name})
                </span>
              ))}
            </div>
          </section>
        )}

        {entry.dependencies.length > 0 && (
          <section className="formula-side-section">
            <h4>概念依赖</h4>
            <div className="formula-side-deps">
              {entry.dependencies.map((depId) => {
                const dep = FORMULA_BY_ID.get(depId)
                return dep ? (
                  <button key={depId} className="formula-side-dep-link" onClick={() => openFormulaPanel(depId)}>
                    <KaTeX latex={dep.latex} />
                    <span>{dep.symbol}</span>
                  </button>
                ) : null
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="formula-side-section">
            <h4>相关公式与定理 ({related.length})</h4>
            <div className="formula-side-related">
              {related.map((f) => (
                <div key={f.id} className="formula-side-related-item">
                  <div className="formula-side-related-header">
                    <KaTeX latex={f.latex} />
                    <span className="formula-side-related-symbol">{f.symbol}</span>
                  </div>
                  <p className="formula-side-related-def">{f.definition}</p>
                  <div className="formula-side-related-latex">
                    <KaTeX latex={f.formulaLatex} displayMode />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {entry.sourceFile && (
          <div className="formula-side-source">
            来源: {entry.sourceFile}
          </div>
        )}
      </div>
    </aside>
  )
}
