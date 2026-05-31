import { create } from 'zustand'

export type ModuleMode = 'graph' | 'workflow' | 'copilot'

interface UIState {
  mode: ModuleMode
  selectedNodeId: string | null
  highlightedPath: string[]  // traceback path node IDs
  formulaPanelId: string | null  // side panel formula details (workflow mode)
  sidebarOpen: boolean
  detailPanelOpen: boolean
  glossarySearch: string

  setMode: (mode: ModuleMode) => void
  selectNode: (id: string | null) => void
  highlightPath: (ids: string[]) => void
  openFormulaPanel: (id: string | null) => void
  toggleSidebar: () => void
  toggleDetailPanel: () => void
  setGlossarySearch: (q: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  mode: 'graph',
  selectedNodeId: null,
  highlightedPath: [],
  formulaPanelId: null,
  sidebarOpen: true,
  detailPanelOpen: false,
  glossarySearch: '',

  setMode: (mode) => set({ mode, selectedNodeId: null, highlightedPath: [], formulaPanelId: null }),
  selectNode: (id) => set({ selectedNodeId: id, detailPanelOpen: id !== null }),
  highlightPath: (ids) => set({ highlightedPath: ids }),
  openFormulaPanel: (id) => set({ formulaPanelId: id }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDetailPanel: () => set((s) => ({ detailPanelOpen: !s.detailPanelOpen })),
  setGlossarySearch: (q) => set({ glossarySearch: q }),
}))
