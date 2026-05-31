const API_BASE = '/api'

export interface ComputeNodeResult {
  node_id: string
  formula_id: string
  value: number | null
  status: 'ok' | 'error'
  error?: string
}

export interface ComputeResponse {
  results: Record<string, ComputeNodeResult>
  topological_order: string[]
  error_nodes: string[]
  compute_time_ms: number
}

export interface VerifyResponse {
  preset_id: string
  all_match: boolean
  results: Record<string, {
    expected: number
    actual: number | null
    match: boolean
    diff: number | null
    error?: string
  }>
  summary: string
}

export interface LifeTableData {
  label: string
  radix: number
  omega: number
  lx: number[]
  qx: number[]
}

export interface PresetSummary {
  id: string
  chapter: number
  section: string
  title: string
  description: string
}

export async function computeDAG(
  graph: { nodes: any[]; edges: any[]; interest_rate?: number },
  changedNodes?: string[]
): Promise<ComputeResponse> {
  const resp = await fetch(`${API_BASE}/compute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ graph, changedNodes }),
  })
  if (!resp.ok) throw new Error(`Compute failed: ${resp.statusText}`)
  return resp.json()
}

export async function verifyResults(
  presetId: string,
  computedResults: Record<string, number>,
  tolerance = 1e-6
): Promise<VerifyResponse> {
  const resp = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ presetId, computedResults, tolerance }),
  })
  if (!resp.ok) throw new Error(`Verify failed: ${resp.statusText}`)
  return resp.json()
}

export async function getLifeTable(name = 'CL93M'): Promise<LifeTableData> {
  const resp = await fetch(`${API_BASE}/lifetable/${name}`)
  if (!resp.ok) throw new Error(`Life table not found: ${name}`)
  return resp.json()
}

export async function listPresets(chapter?: number): Promise<{
  total: number
  by_chapter: Record<string, number>
  presets: PresetSummary[]
}> {
  const url = chapter != null ? `${API_BASE}/presets?chapter=${chapter}` : `${API_BASE}/presets`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error('Failed to fetch presets')
  return resp.json()
}
