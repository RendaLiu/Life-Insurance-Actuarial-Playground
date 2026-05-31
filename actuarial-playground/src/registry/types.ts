// ============================================================
// 精算公式注册表 — 核心类型定义
// 数据源：pdf_pptx/final/chapter*_clean.md（8章课件内容）
// ============================================================

/** 公式输入参数 */
export interface FormulaInput {
  name: string;       // 参数名（如 "x", "i", "n"）
  type: "int" | "float" | "LifeTable" | "array" | "string";
  label: string;      // 中文标签
  default?: number | string;
  min?: number;
  max?: number;
}

/** 公式输出 */
export interface FormulaOutput {
  name: string;
  type: "float" | "int" | "array" | "distribution" | "curve";
  label: string;
}

/** 一条精算公式条目 */
export interface FormulaEntry {
  id: string;                      // 唯一标识（驼峰命名）
  symbol: string;                  // 纯文本符号（用于搜索）
  latex: string;                   // KaTeX 可渲染的 LaTeX
  category: string;                // 对应 categories.ts 中的 title
  chapter: number;
  subcategory: string;             // 子分类
  definition: string;              // 中文定义（来自课件）
  formulaLatex: string;            // 完整计算公式的 LaTeX
  inputs: FormulaInput[];
  outputs: FormulaOutput[];
  dependencies: string[];          // 概念依赖的 formula id（用于溯源）
  isLeaf: boolean;                 // 是否为叶节点（无公式依赖的基础变量）
  variation?: string;              // 变体区分
  relatedIds?: string[];           // 相关但非直接依赖的公式
  sourceFile: string;              // 数据来源 _clean.md 文件名
  proof?: string;                  // 推导/证明过程（LaTeX + 中文，用于 THM 节点点击展示）
}

/** 章节分类 */
export interface ChapterCategory {
  chapter: number;
  title: string;
  description: string;
  isLearned: boolean;              // 是否已学（有课件）
}

/** 概念依赖边 */
export interface ConceptEdge {
  source: string;                  // 上游概念 id
  target: string;                  // 下游概念 id
  relation: "depends_on" | "equals" | "dual" | "generalizes";
  latex?: string;                  // 边上的公式标签
}

/** 预设示例中的节点 */
export interface PresetNode {
  id: string;
  type: "input" | "compute" | "output" | "theorem";
  formulaId: string;               // 对应 FormulaEntry.id
  params: Record<string, number | string | number[]>;
  position: [number, number];      // [x, y] 坐标
  label?: string;                  // 此节点在此题中的具体 LaTeX 标签（如 "{}_{1}p_{20}"）
}

/** 预设示例中的边 */
export interface PresetEdge {
  from: string;                    // PresetNode.id
  to: string;
}

/** 一个课件例题的完整预置工作流 */
export interface PresetExample {
  id: string;
  chapter: number;
  section: string;
  title: string;
  sourceSlide: string;             // 课件页码
  description: string;
  nodes: PresetNode[];
  edges: PresetEdge[];
  expectedResults: Record<string, number>;  // 课件答案
}
