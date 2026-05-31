import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  MarkerType,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { workflowNodeTypes, wfTypeToReactFlowType } from './WorkflowNodes'
import { useWorkflowStore } from '../../stores/useWorkflowStore'
import { FORMULA_BY_ID } from '../../registry/formulas'
import { computeDAG, verifyResults } from '../../api/client'

export default function WorkflowBuilder() {
  const {
    nodes: wfNodes, edges: wfEdges, results,
    addEdge: storeAddEdge, removeNode, removeEdge,
    setResults, setComputing, isComputing,
    activePresetId,
  } = useWorkflowStore()

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([])
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([])
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null)
  const rfInstance = useRef<any>(null)

  // Convert workflow nodes → React Flow nodes
  useEffect(() => {
    setRfNodes(
      wfNodes.map((n) => ({
        id: n.id,
        type: wfTypeToReactFlowType(n.type),
        position: n.position,
        data: {
          formulaId: n.formulaId,
          nodeType: n.type,
          params: n.params,
          label: n.label,
          result: results[n.id]?.value ?? null,
          resultStatus: results[n.id]?.status || 'pending',
        },
      }))
    )
  }, [wfNodes, results])

  // Auto fit view when preset nodes load
  useEffect(() => {
    if (wfNodes.length > 0 && rfInstance.current) {
      const timer = setTimeout(() => {
        rfInstance.current?.fitView({ padding: 0.3, duration: 300 })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [wfNodes.length, activePresetId])

  // Convert workflow edges → React Flow edges
  useEffect(() => {
    setRfEdges(
      wfEdges.map((e, i) => ({
        id: e.id || `wf-edge-${i}`,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
      }))
    )
  }, [wfEdges])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return
      const newEdge: Edge = {
        id: `wf-edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      }
      storeAddEdge({
        id: newEdge.id,
        source: connection.source,
        target: connection.target,
      })
      setRfEdges((eds) => addEdge(newEdge, eds))
    },
    [storeAddEdge]
  )

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((n) => removeNode(n.id))
    },
    [removeNode]
  )

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      deleted.forEach((e) => removeEdge(e.id))
    },
    [removeEdge]
  )

  // Compute via API
  const handleCompute = useCallback(async () => {
    if (wfNodes.length === 0) return
    setComputing(true)

    const graph = {
      nodes: wfNodes.map((n) => ({
        id: n.id,
        formulaId: n.formulaId,
        params: n.params,
      })),
      edges: wfEdges.map((e) => ({ from: e.source, to: e.target })),
      interest_rate: wfNodes.find((n) => n.params?.i)?.params?.i as number || 0.035,
    }

    try {
      const resp = await computeDAG(graph)
      const newResults: Record<string, any> = {}
      for (const [id, r] of Object.entries(resp.results)) {
        newResults[id] = {
          value: r.value,
          status: r.status,
          error: r.error,
        }
      }
      setResults(newResults)
      setVerifyMsg(`完成 (${resp.compute_time_ms.toFixed(1)}ms)`)
    } catch (err) {
      setVerifyMsg(`计算失败: ${err}`)
    } finally {
      setComputing(false)
    }
  }, [wfNodes, wfEdges, setResults, setComputing])

  // Verify against preset expected values
  const handleVerify = useCallback(async () => {
    if (!activePresetId) {
      setVerifyMsg('请先加载一个课件例题')
      return
    }
    const computed: Record<string, number> = {}
    for (const [id, r] of Object.entries(results)) {
      if (r.value != null && r.status === 'ok') {
        computed[id] = r.value
      }
    }
    try {
      const resp = await verifyResults(activePresetId, computed)
      setVerifyMsg(resp.summary)
    } catch (err) {
      setVerifyMsg(`验证失败: ${err}`)
    }
  }, [activePresetId, results])

  return (
    <div className="workflow-builder">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={workflowNodeTypes}
        onInit={(instance) => { rfInstance.current = instance }}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <div className="wf-panel">
            <button
              className="wf-btn wf-btn-compute"
              onClick={handleCompute}
              disabled={isComputing || wfNodes.length === 0}
            >
              {isComputing ? '⏳ 计算中...' : '▶ 计算'}
            </button>
            <button
              className="wf-btn wf-btn-verify"
              onClick={handleVerify}
              disabled={!activePresetId}
            >
              ✓ 验证答案
            </button>
            {verifyMsg && <div className="wf-verify-msg">{verifyMsg}</div>}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
