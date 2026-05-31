import { useEffect, useRef, useMemo } from 'react'
import katex from 'katex'

interface Props {
  latex: string
  displayMode?: boolean
  className?: string
}

/**
 * 预处理 LaTeX 字符串，将 KaTeX 不支持的语法转换为可渲染形式：
 * - \\enclose{actuarial}{n} → {\\overline{n|}} （精算角度符号）
 * - 其他不兼容语法
 */
export function preprocessLatex(latex: string): string {
  return latex
    // 精算角度符号：KaTeX 不支持 \enclose{actuarial}{n}
    // 替换为 \overline{n|} （标准替代表示法）
    .replace(/\\enclose\{actuarial\}\{([^}]+)\}/g, '\\overline{$1|}')
    // 处理可能的嵌套情况 like _{x:\enclose{actuarial}{n}}
    // 已在上面通配处理
    // 处理双反斜杠转义
    .replace(/\\\\/g, '\\')
}

export default function KaTeX({ latex, displayMode = false, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  const processedLatex = useMemo(() => preprocessLatex(latex), [latex])

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(processedLatex, ref.current, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
      })
    } catch {
      // Fallback: 显示处理后的 LaTeX 源码
      if (ref.current) ref.current.textContent = processedLatex
    }
  }, [processedLatex, displayMode])

  return <span ref={ref} className={className} />
}
