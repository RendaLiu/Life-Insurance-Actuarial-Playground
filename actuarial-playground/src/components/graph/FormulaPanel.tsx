import { FORMULA_BY_ID } from '../../registry/formulas'
import { ALL_CONCEPT_EDGES } from '../../registry/edges'
import { useUIStore } from '../../stores/useUIStore'
import KaTeX from '../shared/KaTeX'
import { GlossaryCard } from '../shared/GlossaryTooltip'
import { searchGlossary, GLOSSARY_BY_ID } from '../../registry/glossary'

export default function FormulaPanel() {
  const { selectedNodeId, selectNode, highlightedPath } = useUIStore()

  if (!selectedNodeId) {
    return (
      <div className="formula-panel formula-panel-empty">
        <p>👈 点击图谱中的节点查看公式详情</p>
      </div>
    )
  }

  const entry = FORMULA_BY_ID.get(selectedNodeId)
  if (!entry) {
    return (
      <div className="formula-panel">
        <p>未找到公式: {selectedNodeId}</p>
      </div>
    )
  }

  // Related glossary entries
  const glossaryMatches = searchGlossary(entry.symbol.replace(/[{}_\\]/g, ' '))

  // Upstream and downstream edges
  const upstream = ALL_CONCEPT_EDGES.filter((e) => e.target === selectedNodeId)
  const downstream = ALL_CONCEPT_EDGES.filter((e) => e.source === selectedNodeId)

  return (
    <div className="formula-panel">
      <button className="formula-panel-close" onClick={() => selectNode(null)}>✕</button>

      <h2 className="formula-panel-title">
        <KaTeX latex={entry.latex} displayMode />
      </h2>
      <span className="formula-panel-chapter">
        第{entry.chapter}章 · {entry.subcategory}
      </span>

      <section className="formula-panel-section">
        <h3>定义</h3>
        <p>{entry.definition}</p>
      </section>

      <section className="formula-panel-section">
        <h3>公式</h3>
        <div className="formula-panel-latex">
          <KaTeX latex={entry.formulaLatex} displayMode />
        </div>
      </section>

      {entry.inputs.length > 0 && (
        <section className="formula-panel-section">
          <h3>输入参数</h3>
          <div className="formula-panel-params">
            {entry.inputs.map((inp) => (
              <span key={inp.name} className="param-tag">
                {inp.label} ({inp.name}: {inp.type})
              </span>
            ))}
          </div>
        </section>
      )}

      {entry.outputs.length > 0 && (
        <section className="formula-panel-section">
          <h3>输出</h3>
          <div className="formula-panel-params">
            {entry.outputs.map((out) => (
              <span key={out.name} className="param-tag output">
                {out.label} ({out.type})
              </span>
            ))}
          </div>
        </section>
      )}

      {entry.dependencies.length > 0 && (
        <section className="formula-panel-section">
          <h3>概念依赖 ({highlightedPath.length} 项溯源路径)</h3>
          <div className="formula-panel-deps">
            {entry.dependencies.map((depId) => {
              const depEntry = FORMULA_BY_ID.get(depId)
              return (
                <button
                  key={depId}
                  className={`dep-link ${highlightedPath.includes(depId) ? 'in-path' : ''}`}
                  onClick={() => selectNode(depId)}
                >
                  {depEntry ? (
                    <>
                      <KaTeX latex={depEntry.latex} />
                      <span className="dep-name">{depEntry.symbol}</span>
                    </>
                  ) : (
                    depId
                  )}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {glossaryMatches.length > 0 && (
        <section className="formula-panel-section">
          <h3>相关符号定义</h3>
          {glossaryMatches.slice(0, 5).map((g) => (
            <GlossaryCard key={g.id} entry={g} />
          ))}
        </section>
      )}

      <section className="formula-panel-section">
        <h3>溯源关系</h3>
        {upstream.length > 0 && (
          <div className="relation-group">
            <span className="relation-label">← 依赖上游 ({upstream.length})：</span>
            {upstream.map((e) => (
              <button key={e.source} className="dep-link" onClick={() => selectNode(e.source)}>
                {FORMULA_BY_ID.get(e.source)?.symbol || e.source}
              </button>
            ))}
          </div>
        )}
        {downstream.length > 0 && (
          <div className="relation-group">
            <span className="relation-label">→ 被下游依赖 ({downstream.length})：</span>
            {downstream.map((e) => (
              <button key={e.target} className="dep-link" onClick={() => selectNode(e.target)}>
                {FORMULA_BY_ID.get(e.target)?.symbol || e.target}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="formula-panel-section">
        <span className="source-file">
          来源: {entry.sourceFile}
        </span>
      </section>
    </div>
  )
}
