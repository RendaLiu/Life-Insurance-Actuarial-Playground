import { useUIStore } from '../../stores/useUIStore'

interface Props {
  formulaId: string
  children: React.ReactNode
}

export default function FormulaPopup({ formulaId, children }: Props) {
  const openFormulaPanel = useUIStore((s) => s.openFormulaPanel)

  return (
    <span
      onClick={(e) => { e.stopPropagation(); openFormulaPanel(formulaId) }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  )
}
