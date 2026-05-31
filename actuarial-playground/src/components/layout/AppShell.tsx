import { useUIStore, type ModuleMode } from '../../stores/useUIStore'
import { useWorkflowStore } from '../../stores/useWorkflowStore'
import KnowledgeGraph from '../graph/KnowledgeGraph'
import FormulaPanel from '../graph/FormulaPanel'
import WorkflowBuilder from '../workflow/WorkflowBuilder'
import WhatIfPanel from '../workflow/WhatIfPanel'
import PresetList from '../shared/PresetList'
import KaTeX from '../shared/KaTeX'
import MixedText from '../shared/MixedText'
import FormulaSidePanel from '../shared/FormulaSidePanel'
import { GLOSSARY } from '../../registry/glossary'
import { ALL_PRESETS_WITH_DEMOS } from '../../registry/presets'
import GlossaryTooltip from '../shared/GlossaryTooltip'

function ActivePresetBanner({ presetId }: { presetId: string }) {
  const preset = ALL_PRESETS_WITH_DEMOS.find((p: { id: string }) => p.id === presetId)
  if (!preset) return null
  return (
    <div className="preset-banner">
      <div className="preset-banner-header">
        <span className="preset-banner-badge">📋 当前例题</span>
        <span className="preset-banner-source">{preset.sourceSlide}</span>
      </div>
      <h3 className="preset-banner-title">{preset.title}</h3>
      <div className="preset-banner-desc">
        <MixedText text={preset.description} />
      </div>
      {Object.keys(preset.expectedResults).length > 0 && (
        <div className="preset-banner-expected">
          <span className="preset-banner-expected-label">课件答案：</span>
          {Object.entries(preset.expectedResults).map(([key, val]) => (
            <span key={key} className="preset-banner-value">
              {key} = {typeof val === 'number' ? val.toFixed(6) : String(val)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const TABS: { key: ModuleMode; label: string; icon: string }[] = [
  { key: 'graph', label: '概念图谱', icon: '🔗' },
  { key: 'workflow', label: '工作流', icon: '⚙️' },
  { key: 'copilot', label: 'Copilot', icon: '🤖' },
]

export default function AppShell() {
  const { mode, setMode, detailPanelOpen, glossarySearch, setGlossarySearch } = useUIStore()
  const { loadPreset, clearCanvas, activePresetId, nodes } = useWorkflowStore()

  const handlePresetSelect = (presetId: string) => {
    setMode('workflow')
    loadPreset(presetId)
  }

  const filteredGlossary = glossarySearch
    ? GLOSSARY.filter(
        (g) =>
          g.plainText.toLowerCase().includes(glossarySearch.toLowerCase()) ||
          g.definition.includes(glossarySearch) ||
          g.latex.includes(glossarySearch)
      ).slice(0, 20)
    : []

  return (
    <div className="app-shell">
      {/* Top nav */}
      <header className="app-header">
        <h1 className="app-title">寿险精算 Playground</h1>
        <nav className="app-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`app-tab ${mode === tab.key ? 'active' : ''}`}
              onClick={() => setMode(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="app-header-right">
          <input
            type="text"
            className="glossary-search"
            placeholder="🔍 搜索精算符号..."
            value={glossarySearch}
            onChange={(e) => setGlossarySearch(e.target.value)}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="app-main">
        {/* Left sidebar */}
        <aside className="app-sidebar">
          {mode === 'graph' && (
            <div className="sidebar-section">
              <h3>📐 公式注册表</h3>
              <p className="sidebar-hint">点击节点查看定义和溯源</p>
            </div>
          )}
          {mode === 'workflow' && (
            <>
              <PresetList onSelect={handlePresetSelect} activeId={activePresetId} />
              <div className="sidebar-section">
                <h3>🛠 操作</h3>
                <button className="sidebar-btn" onClick={clearCanvas} disabled={nodes.length === 0}>
                  🗑 清空画布
                </button>
                <p className="sidebar-hint">
                  从"课件例题"加载预设，或拖拽节点搭建自定义工作流
                </p>
              </div>
              <WhatIfPanel />
            </>
          )}
          {mode === 'copilot' && (
            <div className="sidebar-section">
              <h3>🤖 Neuro-Symbolic Copilot</h3>
              <p className="sidebar-hint">自然语言 → 精算工作流（即将推出）</p>
              <textarea
                className="copilot-input"
                placeholder="例如：计算一个30岁男性购买10年期定期寿险的年均衡净保费，假设利率5%，使用CL93M生命表..."
                rows={4}
                disabled
              />
              <button className="sidebar-btn" disabled>生成工作流 (Coming Soon)</button>
            </div>
          )}
        </aside>

        {/* Center canvas */}
        <main className="app-canvas">
          {mode === 'workflow' && activePresetId && (
            <ActivePresetBanner presetId={activePresetId} />
          )}
          {mode === 'graph' && <KnowledgeGraph />}
          {mode === 'workflow' && <WorkflowBuilder />}
          {mode === 'copilot' && (
            <div className="copilot-placeholder">
              <h2>🤖 Neuro-Symbolic Copilot</h2>
              <p>自然语言驱动的工作流生成 — 第二期开发</p>
            </div>
          )}
        </main>

        {/* Right detail panel (Module 1: graph) */}
        {mode === 'graph' && detailPanelOpen && (
          <aside className="app-detail-panel">
            <FormulaPanel />
          </aside>
        )}

        {/* Right formula reference panel (workflow + graph) */}
        <FormulaSidePanel />

        {/* Glossary search results overlay */}
        {glossarySearch && filteredGlossary.length > 0 && (
          <div className="glossary-results">
            <h4>搜索结果 ({filteredGlossary.length})</h4>
            {filteredGlossary.map((g) => (
              <div key={g.id} className="glossary-result-item">
                <strong>{g.plainText}</strong>: {g.definition}
                <span className="glossary-result-chapter">第{g.chapter}章</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
