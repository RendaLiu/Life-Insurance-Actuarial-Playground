import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import KaTeX from '../shared/KaTeX'
import FormulaPopup from '../shared/FormulaPopup'
import { FORMULA_BY_ID } from '../../registry/formulas'
import { useUIStore } from '../../stores/useUIStore'

interface WFNodeData {
  formulaId: string
  nodeType: 'input' | 'compute' | 'output'
  params: Record<string, number | string>
  result?: number | null
  resultStatus?: 'ok' | 'error' | 'pending'
  label?: string  // 此题中的具体 LaTeX 标签
}

/** Input node — leaf parameter source */
function InputNode({ data }: NodeProps<WFNodeData>) {
  const entry = FORMULA_BY_ID.get(data.formulaId)
  const latex = data.label || entry?.latex || data.formulaId
  return (
    <div className="wf-node wf-node-input">
      <Handle type="source" position={Position.Right} />
      <div className="wf-node-header input">
        <span className="wf-node-badge">IN</span>
      </div>
      <div className="wf-node-formula">
        <KaTeX latex={latex} />
      </div>
      <div className="wf-node-params">
        {Object.entries(data.params).filter(([k]) => k !== 'label').map(([k, v]) => (
          <span key={k} className="wf-node-param">{k}={String(v)}</span>
        ))}
      </div>
    </div>
  )
}

/** Compute node — formula evaluation */
function ComputeNode({ data }: NodeProps<WFNodeData>) {
  const entry = FORMULA_BY_ID.get(data.formulaId)
  const displayLatex = data.label || entry?.latex || data.formulaId
  const hasResult = data.result != null

  return (
    <div className={`wf-node wf-node-compute ${data.resultStatus === 'error' ? 'wf-node-error' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="wf-node-header compute">
        <span className="wf-node-badge">CP</span>
        <FormulaPopup formulaId={data.formulaId}>
          <span className="wf-node-subcategory">
            {entry?.subcategory || entry?.symbol || data.formulaId}
          </span>
        </FormulaPopup>
      </div>
      <div className="wf-node-specific">
        <KaTeX latex={displayLatex} />
      </div>
      {hasResult && (
        <div className={`wf-node-result ${data.resultStatus}`}>
          = {typeof data.result === 'number' ? data.result.toFixed(6) : String(data.result)}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

/** Output node — terminal display */
function OutputNode({ data }: NodeProps<WFNodeData>) {
  return (
    <div className={`wf-node wf-node-output ${data.resultStatus === 'error' ? 'wf-node-error' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="wf-node-header output">
        <span className="wf-node-badge">OUT</span>
        <span className="wf-node-label">结果</span>
      </div>
      {data.result != null && (
        <div className={`wf-node-result ${data.resultStatus}`}>
          = {typeof data.result === 'number' ? data.result.toFixed(6) : String(data.result)}
        </div>
      )}
    </div>
  )
}

/** Theorem node — displays the key formula/theorem, click to see derivation */
function TheoremNode({ data }: NodeProps<WFNodeData>) {
  const entry = FORMULA_BY_ID.get(data.formulaId)
  const displayLatex = data.label || entry?.latex || data.formulaId
  const openFormulaPanel = useUIStore((s) => s.openFormulaPanel)

  return (
    <div className="wf-node wf-node-theorem" onClick={() => openFormulaPanel(data.formulaId)}>
      <Handle type="target" position={Position.Left} />
      <div className="wf-node-header theorem">
        <span className="wf-node-badge">THM</span>
        <span className="wf-node-subcategory">
          {entry?.subcategory || "定理"}
        </span>
      </div>
      <div className="wf-node-specific">
        <KaTeX latex={displayLatex} />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export const workflowNodeTypes = {
  inputNode: memo(InputNode),
  computeNode: memo(ComputeNode),
  outputNode: memo(OutputNode),
  theoremNode: memo(TheoremNode),
}

export function wfTypeToReactFlowType(type: 'input' | 'compute' | 'output' | 'theorem'): string {
  switch (type) {
    case 'input': return 'inputNode'
    case 'compute': return 'computeNode'
    case 'output': return 'outputNode'
    case 'theorem': return 'theoremNode'
  }
}
