import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import KaTeX from '../shared/KaTeX'
import { FORMULA_BY_ID } from '../../registry/formulas'
import { useUIStore } from '../../stores/useUIStore'

interface FormulaNodeData {
  formulaId: string
  isHighlighted: boolean
  isInPath: boolean
}

function FormulaNode({ data, selected }: NodeProps<FormulaNodeData>) {
  const entry = FORMULA_BY_ID.get(data.formulaId)
  const selectNode = useUIStore((s) => s.selectNode)

  if (!entry) {
    return (
      <div className="formula-node formula-node-unknown">
        <Handle type="target" position={Position.Top} />
        <div className="formula-node-label">Unknown: {data.formulaId}</div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    )
  }

  const colorClass = entry.isLeaf ? 'formula-node-leaf' : 'formula-node-derived'
  const highlightClass = data.isHighlighted ? 'formula-node-highlighted' : ''
  const pathClass = data.isInPath ? 'formula-node-in-path' : ''
  const selectedClass = selected ? 'formula-node-selected' : ''

  return (
    <div
      className={`formula-node ${colorClass} ${highlightClass} ${pathClass} ${selectedClass}`}
      onClick={() => selectNode(data.formulaId)}
    >
      <Handle type="target" position={Position.Top} />
      <div className="formula-node-header">
        <span className="formula-node-chapter">Ch{entry.chapter}</span>
        <span className="formula-node-category">{entry.subcategory}</span>
      </div>
      <div className="formula-node-symbol">
        <KaTeX latex={entry.latex} />
      </div>
      <div className="formula-node-name">{entry.symbol}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default memo(FormulaNode)
