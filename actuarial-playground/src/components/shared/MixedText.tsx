import KaTeX from './KaTeX'

/**
 * 混合文本渲染：自动检测 LaTeX 公式模式（如 _x, ^2, {}_{n}p_{x} 等）
 * 并用 KaTeX 内联渲染。
 *
 * 使用 $...$ 作为显式数学分隔符，也支持自动检测常见精算符号。
 */
interface Props {
  text: string
  className?: string
}

/** 检测是否包含 LaTeX 公式特征 */
function hasLatexPattern(text: string): boolean {
  return /[_^\\]|\\\(|\\\)|\$|\\frac|\\sum|\\int|\\mu|\\delta|\\overline|\\ddot|\\bar|\\cdot|\\times|\\infty|\\lambda|\\omega|\\pi|\\sigma|\\alpha|\\beta|\\gamma|\\theta|\\rho|\\partial|\\sqrt/.test(text)
}

/** 将 $...$ 包围的内容用 KaTeX 渲染，其余保留为纯文本 */
export function splitMixedText(text: string): Array<{ type: 'text' | 'math'; content: string }> {
  const parts: Array<{ type: 'text' | 'math'; content: string }> = []
  const regex = /\$([^$]+)\$/g
  let lastIdx = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ type: 'text', content: text.slice(lastIdx, match.index) })
    }
    parts.push({ type: 'math', content: match[1] })
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIdx) })
  }
  return parts
}

export default function MixedText({ text, className = '' }: Props) {
  if (!text) return null

  // 如果有显式 $...$ 分隔符，拆分渲染
  if (text.includes('$')) {
    const parts = splitMixedText(text)
    return (
      <span className={className}>
        {parts.map((part, i) =>
          part.type === 'math' ? (
            <KaTeX key={i} latex={part.content} />
          ) : (
            <span key={i}>{part.content}</span>
          )
        )}
      </span>
    )
  }

  // 无 $ 分隔符：直接渲染为纯文本
  // 浏览器原生支持 Unicode 数学字符（μ, δ, ā, ₀₁₂, ⁰¹² 等）
  return <span className={className}>{text}</span>
}
