import { useMemo, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import FormulaNode from './FormulaNode'
import { ALL_FORMULAS, FORMULA_BY_ID } from '../../registry/formulas'
import { ALL_CONCEPT_EDGES } from '../../registry/edges'
import { useUIStore } from '../../stores/useUIStore'

const nodeTypes = { formulaNode: FormulaNode }

function buildGraphNodes(): Node[] {
  // Group formulas by chapter for layout
  const chapterGroups = new Map<number, string[]>()
  ALL_FORMULAS.forEach((f) => {
    const ids = chapterGroups.get(f.chapter) || []
    ids.push(f.id)
    chapterGroups.set(f.chapter, ids)
  })

  const nodes: Node[] = []
  const chapterXGap = 350
  const nodeYGap = 90

  let globalX = 0
  chapterGroups.forEach((formulaIds, chapter) => {
    const n = formulaIds.length
    const startY = -(n * nodeYGap) / 2 + 200

    formulaIds.forEach((fid, idx) => {
      const entry = FORMULA_BY_ID.get(fid)
      nodes.push({
        id: fid,
        type: 'formulaNode',
        position: { x: globalX, y: startY + idx * nodeYGap },
        data: {
          formulaId: fid,
          isHighlighted: false,
          isInPath: false,
        },
      })
    })
    globalX += chapterXGap
  })

  return nodes
}

function buildGraphEdges(): Edge[] {
  return ALL_CONCEPT_EDGES.map((ce, i) => ({
    id: `ge-${ce.source}-${ce.target}-${i}`,
    source: ce.source,
    target: ce.target,
    type: 'smoothstep',
    animated: ce.relation === 'depends_on',
    style: {
      stroke: ce.relation === 'dual' ? '#22c55e' :
              ce.relation === 'generalizes' ? '#a855f7' : '#64748b',
      strokeWidth: ce.relation === 'depends_on' ? 2 : 1.5,
      strokeDasharray: ce.relation === 'dual' ? '5,5' : undefined,
    },
    label: ce.latex || '',
    markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
  }))
}

// Compute traceback path for a selected node
function computeTraceback(selectedId: string): Set<string> {
  const visited = new Set<string>()
  const queue = [selectedId]
  while (queue.length > 0) {
    const curr = queue.shift()!
    if (visited.has(curr)) continue
    visited.add(curr)
    const entry = FORMULA_BY_ID.get(curr)
    if (entry) {
      entry.dependencies.forEach((dep) => queue.push(dep))
    }
  }
  return visited
}

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { selectedNodeId, selectNode } = useUIStore()

  // Initialize graph
  useEffect(() => {
    setNodes(buildGraphNodes())
    setEdges(buildGraphEdges())
  }, [])

  // Update highlights when selection changes
  useEffect(() => {
    if (!selectedNodeId) {
      setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isHighlighted: false, isInPath: false } })))
      setEdges((eds) => eds.map((e) => ({ ...e, style: { ...e.style, stroke: '#94a3b8', strokeWidth: 1.5 } })))
      return
    }

    const path = computeTraceback(selectedNodeId)
    const dependencyEdges = new Set<string>()
    const entry = FORMULA_BY_ID.get(selectedNodeId)

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: n.id === selectedNodeId,
          isInPath: path.has(n.id) && n.id !== selectedNodeId,
        },
      }))
    )

    setEdges((eds) =>
      eds.map((e) => {
        const isInPath = path.has(e.source) && path.has(e.target)
        return {
          ...e,
          animated: isInPath,
          style: {
            ...e.style,
            stroke: isInPath ? '#3b82f6' : '#94a3b8',
            strokeWidth: isInPath ? 3 : 1.5,
            opacity: selectedNodeId && !isInPath ? 0.3 : 1,
          },
        }
      })
    )
  }, [selectedNodeId])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectNode(node.data.formulaId)
    },
    [selectNode]
  )

  const onPaneClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  return (
    <div className="knowledge-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const entry = FORMULA_BY_ID.get(n.data?.formulaId || '')
            return entry?.isLeaf ? '#86efac' : '#93c5fd'
          }}
        />
      </ReactFlow>
    </div>
  )
}
