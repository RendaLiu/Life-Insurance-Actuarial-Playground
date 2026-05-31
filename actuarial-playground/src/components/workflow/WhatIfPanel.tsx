import { useWorkflowStore } from '../../stores/useWorkflowStore'

const SLIDABLE_PARAMS = ['i', 'x', 'n', 't', 'delta', 'mu', 'omega']

export default function WhatIfPanel() {
  const { nodes, whatIfParams, updateNodeParam, setWhatIfParam, results } = useWorkflowStore()

  // Find all input nodes with slidable params
  const slidableNodes = nodes
    .filter((n) => n.type === 'input')
    .flatMap((n) =>
      Object.entries(n.params)
        .filter(([key]) => SLIDABLE_PARAMS.includes(key))
        .map(([key, value]) => ({
          nodeId: n.id,
          paramKey: key,
          currentValue: whatIfParams[`${n.id}.${key}`] ?? Number(value),
          defaultValue: Number(value),
        }))
    )

  if (slidableNodes.length === 0) return null

  return (
    <div className="whatif-panel">
      <h3 className="whatif-title">🎚 What-If 分析</h3>
      <p className="whatif-hint">拖动滑块改变参数，然后点击"计算"</p>
      {slidableNodes.map((item) => {
        const nodeResult = results[item.nodeId]
        const range = item.paramKey === 'i' ? [0.01, 0.20, 0.001] :
                      item.paramKey === 'x' ? [18, 80, 1] :
                      item.paramKey === 'n' ? [1, 50, 1] :
                      item.paramKey === 't' ? [1, 80, 1] :
                      item.paramKey === 'omega' ? [60, 150, 1] :
                      [0.01, 0.20, 0.001]

        return (
          <div key={`${item.nodeId}.${item.paramKey}`} className="whatif-slider">
            <label>
              <strong>{item.paramKey}</strong> = {item.currentValue.toFixed(typeof range[2] === 'number' && range[2] < 1 ? 3 : 0)}
              <span className="whatif-default">（默认: {item.defaultValue}）</span>
            </label>
            <input
              type="range"
              min={range[0]}
              max={range[1]}
              step={range[2]}
              value={item.currentValue}
              onChange={(e) => {
                const v = parseFloat(e.target.value)
                setWhatIfParam(item.nodeId, v)
                updateNodeParam(item.nodeId, item.paramKey, v)
              }}
            />
            {nodeResult?.status === 'ok' && (
              <div className="whatif-result">结果: {nodeResult.value?.toFixed(6)}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
