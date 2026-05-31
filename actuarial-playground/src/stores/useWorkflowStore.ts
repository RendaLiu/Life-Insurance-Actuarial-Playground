import { create } from 'zustand'
import type { PresetExample, PresetNode, PresetEdge } from '../registry/types'
import { ALL_PRESETS_WITH_DEMOS, getPresetsByChapter } from '../registry/presets'

export interface WorkflowNode {
  id: string
  type: 'input' | 'compute' | 'output' | 'theorem'
  formulaId: string
  params: Record<string, number | string | number[]>
  position: { x: number; y: number }
  label?: string
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export interface ComputeResult {
  value: number | null
  status: 'ok' | 'error' | 'pending'
  error?: string
}

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  results: Record<string, ComputeResult>
  whatIfParams: Record<string, number>  // nodeId -> override value
  activePresetId: string | null
  isComputing: boolean

  // Actions
  loadPreset: (presetId: string) => void
  addNode: (node: WorkflowNode) => void
  updateNodeParam: (nodeId: string, key: string, value: number | string) => void
  addEdge: (edge: WorkflowEdge) => void
  removeNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  setResults: (results: Record<string, ComputeResult>) => void
  setWhatIfParam: (nodeId: string, value: number) => void
  setComputing: (v: boolean) => void
  clearCanvas: () => void
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  results: {},
  whatIfParams: {},
  activePresetId: null,
  isComputing: false,

  loadPreset: (presetId) => {
    const preset = ALL_PRESETS_WITH_DEMOS.find((p) => p.id === presetId)
    if (!preset) return

    const nodes: WorkflowNode[] = preset.nodes.map((n: PresetNode) => ({
      id: n.id,
      type: n.type,
      formulaId: n.formulaId,
      params: { ...n.params },
      position: { x: n.position[0], y: n.position[1] },
      label: n.label,
    }))

    const edges: WorkflowEdge[] = preset.edges.map((e: PresetEdge, i: number) => ({
      id: `e-${e.from}-${e.to}-${i}`,
      source: e.from,
      target: e.to,
    }))

    set({
      nodes,
      edges,
      results: {},
      activePresetId: presetId,
      whatIfParams: {},
    })
  },

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  updateNodeParam: (nodeId, key, value) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === nodeId ? { ...n, params: { ...n.params, [key]: value } } : n
      ),
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeNode: (nodeId) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== nodeId),
      edges: s.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  removeEdge: (edgeId) =>
    set((s) => ({ edges: s.edges.filter((e) => e.id !== edgeId) })),

  setResults: (results) => set({ results }),

  setWhatIfParam: (nodeId, value) =>
    set((s) => ({ whatIfParams: { ...s.whatIfParams, [nodeId]: value } })),

  setComputing: (v) => set({ isComputing: v }),

  clearCanvas: () =>
    set({
      nodes: [],
      edges: [],
      results: {},
      whatIfParams: {},
      activePresetId: null,
    }),
}))
