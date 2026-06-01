import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import KaTeX from '../shared/KaTeX'
import { FORMULA_BY_ID } from '../../registry/formulas'
import { useUIStore } from '../../stores/useUIStore'

interface FormulaNodeData {
  formulaId: string
  isHighlighted: boolean
  isInPath: boolean
  isUpstream?: boolean   // 定义依赖 → 黄色
  isDownstream?: boolean  // 被依赖 → 浅蓝
  nodeType?: string
  chapter?: number
}

const TYPE_LABEL_CN: Record<string, string> = {
  definition: '定义',
  formula: '公式',
  conclusion: '定理',
}

function FormulaNode({ data, selected }: NodeProps<FormulaNodeData>) {
  const entry = FORMULA_BY_ID.get(data.formulaId)
  const selectNode = useUIStore((s) => s.selectNode)

  if (!entry) {
    return (
      <div className="formula-node formula-node-unknown">
        <Handle type="target" position={Position.Left} />
        <div className="formula-node-label">Unknown: {data.formulaId}</div>
        <Handle type="source" position={Position.Right} />
      </div>
    )
  }

  // 优先使用 KnowledgeGraph 传入的 nodeType（基于 getNodeType 推断），
  // 其次用 FormulaEntry 中的显式 nodeType
  const actualType = data.nodeType || entry.nodeType
  const colorClass = actualType === 'definition' ? 'formula-node-definition' :
                     actualType === 'conclusion' ? 'formula-node-conclusion' :
                     entry.isLeaf ? 'formula-node-leaf' : 'formula-node-derived'
  const typeLabel = TYPE_LABEL_CN[actualType || ''] || (entry.isLeaf ? '定义' : '公式')

  const highlightClass = data.isHighlighted ? 'formula-node-highlighted' : ''
  const upstreamClass = data.isUpstream && !data.isHighlighted ? 'formula-node-upstream' : ''
  const downstreamClass = data.isDownstream && !data.isHighlighted ? 'formula-node-downstream' : ''
  const selectedClass = selected ? 'formula-node-selected' : ''

  return (
    <div
      className={`formula-node ${colorClass} ${highlightClass} ${upstreamClass} ${downstreamClass} ${selectedClass}`}
      onClick={() => selectNode(data.formulaId)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="formula-node-header">
        <span className="formula-node-chapter">Ch{entry.chapter}</span>
        <span className={`formula-node-type-badge ${actualType || (entry.isLeaf ? 'definition' : 'formula')}`}>
          {typeLabel}
        </span>
        <span className="formula-node-category">{entry.subcategory}</span>
      </div>
      <div className="formula-node-symbol">
        <KaTeX latex={entry.latex} />
      </div>
      <div className="formula-node-name">{entry.symbol}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default memo(FormulaNode)
