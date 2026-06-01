import { useMemo, useCallback, useEffect, useRef } from 'react'
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

// 核心概念：虽是衍生量但本身是基本定义
const DEFINITION_IDS = new Set([
  'pure_endowment',           // _nE_x 生存保险
  'Ax_term_continuous',       // Ā¹ 连续定期寿险
  'Ax_term_discrete',         // A¹ 离散定期寿险
  'Ax_continuous',            // Ā_x 连续终身寿险
  'Ax_discrete',              // A_x 离散终身寿险
  'endowment_insurance_continuous', // Ā_{x:n} 连续生死合险
  'endowment_insurance_discrete',   // A_{x:n} 离散生死合险
  'ax_continuous',            // ā_x 连续终身年金
  'ax_term_continuous',       // ā_{x:n} 连续定期年金
  'ax_due_discrete',          // ä_x 期初终身年金
  'ax_term_due_discrete',     // ä_{x:n} 期初定期年金
  'ax_immediate_discrete',    // a_x 期末终身年金
  'deferred_ax_continuous',   // {n|}ā_x 延期连续年金
  'deferred_ax_due_discrete', // {n|}ä_x 延期期初年金
  'Px_continuous',            // P̄ 连续净保费
  'Px_discrete',              // P_x 离散净保费
  'Px_term_discrete',         // P¹ 定期净保费
  'kVx_discrete',             // _kV_x 净准备金
  'complete_ex',              // ė_x 完全平均余命
  'curtate_ex',               // e_x 简约平均余命
])

/** 推断节点的展示类型：定义 | 公式 | 结论 */
function getNodeType(fid: string): 'definition' | 'formula' | 'conclusion' {
  const entry = FORMULA_BY_ID.get(fid)
  if (entry?.nodeType) return entry.nodeType
  // 定理 ID 开头且 category 不是"定义"的 → 定理（橙色）
  if (fid.startsWith('thm_')) {
    if (entry?.category === '定义') return 'definition'
    return 'conclusion'
  }
  // 叶子节点（无依赖的基础概念）→ 定义
  if (entry?.isLeaf) return 'definition'
  // 核心精算概念 → 定义（绿色）
  if (DEFINITION_IDS.has(fid)) return 'definition'
  // subcategory 为"恒等式"的 → 定理（橙色）
  if (entry?.subcategory === '恒等式') return 'conclusion'
  // 其余 → 公式（蓝色）
  return 'formula'
}

/** 节点类型的中文标签 */
const TYPE_LABEL: Record<string, string> = {
  definition: '定义',
  formula: '公式',
  conclusion: '结论',
}

/** 每种类型对应的颜色 */
const TYPE_COLOR: Record<string, string> = {
  definition: '#22c55e',
  formula: '#3b82f6',
  conclusion: '#f59e0b',
}

function buildGraphNodes(): Node[] {
  // Group: chapter → type → formulaIds
  const groups = new Map<number, Map<string, string[]>>()
  ALL_FORMULAS.forEach((f) => {
    if (!groups.has(f.chapter)) groups.set(f.chapter, new Map())
    const typeMap = groups.get(f.chapter)!
    const ntype = getNodeType(f.id)
    if (!typeMap.has(ntype)) typeMap.set(ntype, [])
    typeMap.get(ntype)!.push(f.id)
  })

  const nodes: Node[] = []
  const chapterGapX = 420   // 章间水平间距
  const typeGapX = 320       // 同章不同类水平间距
  const nodeGapY = 100       // 同列节点垂直间距 ⬆ 增大

  // 章节排序（已学在前）
  const chapterOrder = [1, 4, 5, 8, 9, 10, 11, 12]
  const typeOrder: Array<'definition' | 'formula' | 'conclusion'> = ['definition', 'formula', 'conclusion']

  let cursorX = 0
  chapterOrder.forEach((chapter) => {
    const typeMap = groups.get(chapter)
    if (!typeMap || typeMap.size === 0) return

    // 渲染该章的每一类（定义 | 公式 | 结论）
    let typeX = cursorX
    typeOrder.forEach((ntype) => {
      const ids = typeMap.get(ntype)
      if (!ids || ids.length === 0) return  // 跳过空列

      const startY = -(ids.length * nodeGapY) / 2 + 300
      ids.forEach((fid, idx) => {
        nodes.push({
          id: fid,
          type: 'formulaNode',
          position: { x: typeX, y: startY + idx * nodeGapY },
          data: { formulaId: fid, isHighlighted: false, isInPath: false, nodeType: ntype, chapter },
        })
      })
      typeX += typeGapX
    })

    cursorX = typeX + chapterGapX  // 下一章的起始位置
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

// Compute full ancestry path for a selected node
function computeTraceback(selectedId: string): Set<string> {
  const visited = new Set<string>()
  const queue = [selectedId]
  while (queue.length > 0) {
    const curr = queue.shift()!
    if (visited.has(curr)) continue
    visited.add(curr)
    // 1. 公式定义中的计算依赖：该公式直接依赖了哪些概念
    const entry = FORMULA_BY_ID.get(curr)
    if (entry) {
      entry.dependencies.forEach((dep) => queue.push(dep))
    }
    // 2. 概念边中的逆向遍历：找到所有"指向"当前节点的边，
    //    其 source 也是上游概念（对偶、推广、依赖等关系）
    ALL_CONCEPT_EDGES
      .filter((e) => e.target === curr)
      .forEach((e) => queue.push(e.source))
  }
  return visited
}

// Compute downstream: what depends on the selected node
function computeDownstream(selectedId: string): Set<string> {
  const visited = new Set<string>()
  const queue = [selectedId]
  while (queue.length > 0) {
    const curr = queue.shift()!
    if (visited.has(curr)) continue
    visited.add(curr)
    // Find all edges where curr is the source
    ALL_CONCEPT_EDGES
      .filter((e) => e.source === curr)
      .forEach((e) => queue.push(e.target))
  }
  return visited
}

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { selectedNodeId, selectNode } = useUIStore()

  // 保存原始边的样式和动画状态（用于取消选中时恢复，保留四种边关系的视觉区分）
  const originalEdgeMetaRef = useRef<Record<string, { style: React.CSSProperties; animated: boolean }>>({})

  // Initialize graph
  useEffect(() => {
    const initEdges = buildGraphEdges()
    // 保存每条边的原始 style + animated，供取消选中时恢复
    initEdges.forEach((e) => {
      originalEdgeMetaRef.current[e.id] = { style: { ...e.style! }, animated: e.animated ?? false }
    })
    setNodes(buildGraphNodes())
    setEdges(initEdges)
  }, [])

  // Update highlights when selection changes
  useEffect(() => {
    if (!selectedNodeId) {
      // 无选中：全部恢复正常，恢复原始边样式（保留四种边关系的颜色区分）
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, isHighlighted: false, isInPath: false, isUpstream: false, isDownstream: false },
          hidden: false,
          style: { opacity: 1, transition: 'opacity 0.3s' },
        }))
      )
      setEdges((eds) =>
        eds.map((e) => {
          const original = originalEdgeMetaRef.current[e.id]
          return {
            ...e,
            animated: original?.animated ?? false,
            hidden: false,
            style: original
              ? { ...original.style, opacity: 0.7, transition: 'opacity 0.3s' }
              : { ...e.style, opacity: 0.7 },
          }
        })
      )
      return
    }

    const upstream = computeTraceback(selectedNodeId)    // 定义依赖（向上追溯）
    const downstream = computeDownstream(selectedNodeId)  // 被依赖（向下追溯）
    const relevant = new Set([...upstream, ...downstream])

    // 仅直接依赖（用于标黄）
    const entry = FORMULA_BY_ID.get(selectedNodeId)
    const directDeps = new Set(entry?.dependencies || [])

    setNodes((nds) =>
      nds.map((n) => {
        const isUp = upstream.has(n.id) && n.id !== selectedNodeId
        const isDown = downstream.has(n.id) && n.id !== selectedNodeId && !upstream.has(n.id)
        // 直接依赖标黄，间接上游仍用蓝色边框
        const isDirectUp = directDeps.has(n.id)
        return {
          ...n,
          hidden: !relevant.has(n.id),
          data: {
            ...n.data,
            isHighlighted: n.id === selectedNodeId,
            isInPath: isUp && !isDirectUp,        // 间接上游 → 蓝色边框
            isUpstream: isDirectUp,                 // 直接依赖 → 黄色
            isDownstream: isDown,                   // 下游 → 浅蓝
          },
          style: {
            opacity: relevant.has(n.id) ? 1 : 0.08,
            transition: 'opacity 0.3s',
          },
        }
      })
    )

    setEdges((eds) =>
      eds.map((e) => {
        const isUpEdge = upstream.has(e.source) && upstream.has(e.target)
        const isDownEdge = downstream.has(e.source) && downstream.has(e.target) && !upstream.has(e.target)
        const inPath = isUpEdge || isDownEdge
        // 上游边 → 黄色，下游边 → 浅蓝
        const edgeColor = isUpEdge ? '#f59e0b' : isDownEdge ? '#60a5fa' : '#e2e8f0'
        return {
          ...e,
          animated: inPath,
          hidden: !inPath,
          style: {
            ...e.style,
            stroke: inPath ? edgeColor : '#e2e8f0',
            strokeWidth: inPath ? 2.5 : 0.5,
            opacity: inPath ? 1 : 0.05,
            transition: 'opacity 0.3s, stroke-width 0.3s, stroke 0.3s',
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

  // 章节标签叠加层
  const chapterLabels = useMemo(() => {
    const groups = new Map<number, { minX: number; maxX: number }>()
    nodes.forEach((n) => {
      const ch = n.data?.chapter as number
      if (!ch) return
      if (!groups.has(ch)) groups.set(ch, { minX: Infinity, maxX: -Infinity })
      const g = groups.get(ch)!
      g.minX = Math.min(g.minX, n.position.x)
      g.maxX = Math.max(g.maxX, n.position.x)
    })
    return Array.from(groups.entries()).map(([ch, { minX, maxX }]) => ({
      chapter: ch,
      x: (minX + maxX) / 2,
      y: 20,
    }))
  }, [nodes])

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
        fitViewOptions={{ padding: 0.4 }}
        attributionPosition="bottom-left"
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
      >
        <Background color="#e2e8f0" gap={30} />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const ntype = n.data?.nodeType || getNodeType(n.data?.formulaId || '')
            return TYPE_COLOR[ntype] || '#93c5fd'
          }}
        />
      </ReactFlow>
    </div>
  )
}
