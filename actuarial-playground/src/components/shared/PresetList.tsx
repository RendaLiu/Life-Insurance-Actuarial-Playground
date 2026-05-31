import { ALL_PRESETS_WITH_DEMOS, PRESETS_BY_CHAPTER } from '../../registry/presets'
import { CHAPTERS } from '../../registry/categories'

interface Props {
  onSelect: (presetId: string) => void
  activeId?: string | null
}

export default function PresetList({ onSelect, activeId }: Props) {
  const learnedChapters = CHAPTERS.filter((c) => c.isLearned)

  return (
    <div className="preset-list">
      <h3 className="preset-list-title">📚 课件例题</h3>
      {learnedChapters.map((ch) => {
        const presets = PRESETS_BY_CHAPTER.get(ch.chapter) || []
        if (presets.length === 0) return null
        return (
          <details key={ch.chapter} className="preset-chapter">
            <summary className="preset-chapter-title">
              第{ch.chapter}章：{ch.title} ({presets.length}题)
            </summary>
            <div className="preset-items">
              {presets.map((p) => (
                <button
                  key={p.id}
                  className={`preset-item ${activeId === p.id ? 'active' : ''}`}
                  onClick={() => onSelect(p.id)}
                  title={p.description}
                >
                  <span className="preset-item-badge">例</span>
                  <span className="preset-item-title">{p.title}</span>
                </button>
              ))}
            </div>
          </details>
        )
      })}
    </div>
  )
}
