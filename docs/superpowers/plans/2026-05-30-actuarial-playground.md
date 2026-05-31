# 寿险精算 Playground 实现计划（v2）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans.

**Goal:** 构建一个三层交互的寿险精算 Playground，将课件内容（8 章 Clean Markdown）完整数字化：概念拓扑图谱（探索公式依赖）、可视化工作流（拖拽搭建精算测算 + What-If 分析）、课件例题一键复现（Preset Examples）。

**Architecture:** 课件 Clean Markdown → 公式注册表 + 预设示例 → React Flow 双模式（图谱/工作流）+ Python 计算引擎 + FastAPI。

**Tech Stack:** React 18 + React Flow + KaTeX + Zustand + TypeScript | Python 3.11+ / FastAPI / numpy / scipy | Claude API (Copilot)

---

## 数据源说明

已从 PPTX 课件中提取并手修了 **8 个章节的 Clean Markdown**（位于 `pdf_pptx/final/`），包含全部公式、定理、证明和例题数值：

| 数据文件 | 章节 | 公式数 | 例题数 | 用途 |
|---------|------|--------|--------|------|
| `chapter1_clean.md` | 单生命生存模型 | ~15 | 15 | 基础层：$l_x$, ${}_t p_x$, $e_x$, UDD 等 |
| `chapter4_clean.md` | 死亡保险精算现值 | ~20 | 24 | 保险层：$\overline{A}_x, A_x, A_{x:n}^1$ 系列 |
| `chapter5_clean.md` | 生存年金精算现值 | ~18 | 19 | 年金层：$\overline{a}_x, \ddot{a}_x, a_x$ 系列 |
| `chapter8_clean.md` | 净保费理论 | ~15 | 7 | 保费层：$P_x, {}_h P_x$ 系列 |
| `chapter9_clean.md` | 费用负荷保费 | ~5 | 2 | 实务层（次要） |
| `chapter10_clean.md` | 完全离散净准备金（一般） | ~12 | 5 | 准备金理论基础：$C_h$, Hattendorf 定理 |
| `chapter11_clean.md` | 完全离散净准备金（具体） | ~10 | 1+ | ${}_k V_x$, Fackler 递推 |
| `chapter12_clean.md` | 完全连续净准备金 | ~8 | 3 | Thiele 微分方程，${}_t\overline{V}$ |

**已学核心覆盖（Ch1/4/5/8/10/11）+ Ch9/12 补充 = 全部有 PPTX 的章节**。Ch2/3/6/7/13 无 PPTX 课件，暂不纳入第一期。

---

## 核心思路变化（v1 → v2）

| v1 方案 | v2 方案 |
|---------|---------|
| 从"精算符号.md"提取公式元数据 | 从 **8 个 `_clean.md`** 提取公式 + 定理 + 例题 |
| 只有公式定义 | 公式定义 + **完整例题数据**（参数 → 数值结果） |
| 无课件复现能力 | **Preset Examples 系统**：一键加载课件例题到工作流 |
| 抽象的工作流节点 | 节点分类与课件章节对齐 |

### 新的数据流水线

```
课件 Clean Markdown (pdf_pptx/final/*.md)
        │
        ├──→ formulas.ts    (公式注册表：100+ 条目，含 LaTeX/定义/参数/依赖)
        ├──→ presets.ts     (预设示例：50+ 课件例题，含参数/期望结果)
        └──→ edges.ts       (概念追溯边：depends_on / equals / dual)
                │
                ▼
        React Playground
        ├── Module 1: 概念图谱（公式节点 + 依赖边 + 溯源高亮）
        ├── Module 2: 工作流构建（拖入预设→连线→计算→What-If）
        └── Module 3: Copilot（自然语言→自动生成工作流）
```

### Preset Examples 系统设计

这是 v2 最大的新增。每个课件例题对应一个预置工作流：

```typescript
// presets.ts — 从 _clean.md 课件中提取的所有例题
interface PresetExample {
  id: string;                          // "ch4_ex_4_2_2"
  chapter: number;
  section: string;                     // "4.2 生存保险"
  title: string;                       // "例4.2.2：3年期生存保险"
  sourceSlide: string;                 // "chapter4 PPTX Slide 13"
  description: string;                 // 例题的中文描述
  nodes: PresetNode[];                 // 预置节点（含参数）
  edges: PresetEdge[];                 // 预置连线
  expectedResults: Record<string, number>; // 课件上的参考答案
}

const CH4_EXAMPLE_4_2_2: PresetExample = {
  id: "ch4_ex_4_2_2",
  chapter: 4,
  section: "4.2 生存保险",
  title: "例4.2.2：3年期生存保险（1000人×1000元）",
  sourceSlide: "chapter4 PPTX Slide 13",
  description: "20岁投保3年期生存保险，q20=0.01, q21=0.02, q22=0.03, i=2.5%",
  nodes: [
    { id: "lt",  type: "input",  formula: "life_table",        params: { table: "custom", l0: 100000, qx: [0.01,0.02,0.03] }, pos: [100, 100] },
    { id: "econ",type: "input",  formula: "economic_assumption", params: { i: 0.025 }, pos: [100, 280] },
    { id: "nEx", type: "compute",formula: "pure_endowment",     params: { x: 20, n: 3 }, pos: [400, 190] },
  ],
  edges: [
    { from: "lt", to: "nEx" },
    { from: "econ", to: "nEx" },
  ],
  expectedResults: { "nEx": 0.873899334 },
};
```

用户交互流程：
1. 左侧面板 "📚 课件例题" → 展开 "第四章：保险现值"
2. 点击 "例4.2.2" → 画布自动弹出预置工作流
3. 自动计算 → 输出节点显示 `0.873899334` ✓（与课件精确一致）
4. 用户拖动利率滑块 i: 2.5% → 5% → 观察 ${}_3E_{20}$ 从 0.8739 变到 ~0.86

---

## 系统架构总览（不变）

```
┌──────────────────────────────────────────────────────────────────┐
│                    前端 SPA (localhost:5173)                      │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Mode: 图谱│  │ Mode: 工作流  │  │ Mode: Copilot│              │
│  │ (Module1) │  │ (Module2)    │  │ (Module3)    │              │
│  └─────┬─────┘  └──────┬───────┘  └──────┬───────┘              │
│        │               │                 │                       │
│        └───────────────┼─────────────────┘                       │
│                        │                                         │
│         ┌──────────────┴──────────────┐                          │
│         │    共享状态层 (Zustand)      │                          │
│         │  · SymbolGlossary (120+条)   │  ← 符号定义表           │
│         │  · FormulaRegistry (100+条)  │                          │
│         │  · PresetExamples (50+条)    │                          │
│         │  · KnowledgeGraph (溯源图)   │                          │
│         │  · WorkflowDAG (计算图)      │                          │
│         │  · ComputeResults            │                          │
│         └──────────────┬──────────────┘                          │
│                        │                                         │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP
┌────────────────────────┼────────────────────────────────────────┐
│              FastAPI 后端 (localhost:8000)                        │
│                                                                  │
│  POST /api/compute        ← 工作流DAG求值（增量计算）            │
│  POST /api/copilot/parse  ← LLM 自然语言→工作流操作               │
│  GET  /api/lifetable      ← 内置CL93M + 自定义生命表              │
│                                                                  │
│  ┌──────────────────────────────────────────┐                    │
│  │  actuarial-engine (纯Python计算库)         │                    │
│  │  LifeTable | SurvivalModel | PresentValue │                    │
│  │  NetPremium | Reserve | DAG | ASTEvaluator│                    │
│  └──────────────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────────┘
```

### 共享基础层：精算符号定义表 (Symbol Glossary)

这是用户"随时查看符号定义"的基础设施。从 `精算符号.md` 提取全部 13 章的符号→中文定义映射（120+ 条），支撑三个模块的交互体验。

```typescript
// glossary.ts — 符号→定义直查
interface GlossaryEntry {
  id: string;          // "gl_t_px"
  latex: string;       // "{}_t p_x"
  plainText: string;   // "_t p_x"（搜索用）
  definition: string;  // "x岁的个体活过x+t岁的概率"
  chapter: number;
  category: string;    // "生存概率"
  isLearned: boolean;
}
```

**三个模块中的使用场景：**

| 模块 | Glossary 如何参与 |
|------|------------------|
| **Module 1: 概念图谱** | 点击任意公式节点 → 右侧面板第一行显示符号的 Glossary 定义 + 课件来源章节 → 点击定义可溯源到原始 `_clean.md` 中的定理 |
| **Module 2: 工作流** | 鼠标悬停在任意节点的 LaTeX 符号上 → **Tooltip 弹出**该符号的中文定义 → 长按弹出完整 Glossary 卡片（含章节上下文） |
| **Module 3: Copilot** | 用户输入"解释 $A_x = 1 - d\\ddot{a}_x$" → Copilot 从 Glossary 查到 $A_x$=终身寿险精算现值, $d$=贴现率, $\\ddot{a}_x$=期初年金现值 → 生成自然语言解释："这个公式说明终身寿险和期初年金之间存在对偶关系：一元投资分拆为利息给付 $d\\ddot{a}_x$ 和本金返还 $A_x$" |

**定理解释（Theorem Explainer）：** 结合 Glossary + Formula Registry + Concept Edges，系统可以自动生成定理的自然语言解释。例如选中 $\delta\overline{a}_x + \overline{A}_x = 1$：
1. 从 Glossary 查 $\delta$ = "利息力"，$\overline{a}_x$ = "连续终身生存年金"，$\overline{A}_x$ = "连续终身寿险"
2. 从 Edges 查出这是 dual 关系
3. 拼接输出："该恒等式表示：个体投资 1 元，在生存期间连续获得利息 $\delta$（精算现值 $\delta\overline{a}_x$），死亡时返还 1 元本金（精算现值 $\overline{A}_x$），两部分之和恰好等于投资额。"

---

## 项目拆分（微调）

| 子项目 | 目录 | 说明 | 数据源 |
|--------|------|------|--------|
| **P0: 公式注册表 + 预设** | `actuarial-playground/src/registry/` | formulas.ts + presets.ts + edges.ts | `pdf_pptx/final/chapter*_clean.md` |
| **P1: 核心计算引擎** | `actuarial-engine/` | 纯 Python 数值计算库 | 公式注册表定义的函数 |
| **P2: 后端 API** | `actuarial-api/` | FastAPI 包装 | P1 |
| **P3: 前端** | `actuarial-playground/` | React Flow 图谱 + 工作流 + Copilot | P0, P2 |

**第一期聚焦：P0 + P1（地基）+ P3 Module 1+2（图谱 + 工作流 + 预设示例加载）** — 这是最小可验证单元。Copilot（P3 Module 3）放到第二期。

---

## 工作流可视化示例

### 示例一：一个例题的完整计算工作流（Module 2 画布）

以第十章例 10.3.2（5年期死亡险保单组）为例，在 Playground 的画布上：

```
                    ┌─────────────────────────────────┐
                    │  📋 输出：总净准备金 = 4,788 元    │
                    └──────────────┬──────────────────┘
                                   │
               ┌───────────────────┼───────────────────┐
               │                   │                   │
       ┌───────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
       │ _2V (750张)   │   │ _3V (500张)   │   │ _4V (250张)   │
       └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │  Fackler 递推      │
                         │ (_hV+P)(1+i)      │
                         │  = q·1 + p·_{h+1}V│
                         │  起点：_0V = 0    │
                         └─────────┬─────────┘
                                   │
                         ┌─────────┴─────────┐
                         │  P^1_{50:5|}       │
                         │  = A / ä           │
                         │  = 0.00655692      │
                         └─────────┬─────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               │                                       │
     ┌─────────┴─────────┐                   ┌─────────┴─────────┐
     │ A^1_{50:5|}       │                   │ ä_{50:5|}         │
     │ = Σ v^{k+1}·d/l   │                   │ = Σ v^k·l/l       │
     │ = 0.02892499      │                   │ = 4.41137118      │
     └─────────┬─────────┘                   └─────────┬─────────┘
               │                                       │
       ┌───────┴───────┐                       ┌───────┴───────┐
       │ d_50..d_54    │                       │ l_50..l_54    │
       │ v^k (贴现)    │                       │ v^k (贴现)    │
       │ q_50..q_54    │                       │ p_50..p_54    │
       └───────┬───────┘                       └───────┬───────┘
               │                                       │
       ┌───────┴───────────────────────────────────────┴───────┐
       │                      叶节点（输入层）                    │
       │  l_50=89509, l_51=88979, ..., l_55=86409              │
       │  i = 0.06 → v = 0.943396, d = 0.056604                │
       └───────────────────────────────────────────────────────┘
```

> **数据流方向**：生命表 + 利率 → 精算现值 (A, ä) → 净保费 P → Fackler 递推 → 各年准备金 → 保单组汇总。
> **What-If**：拖动利率 i: 6% → 3%，所有下游节点级联重算，实时更新。

### 示例二：概念溯源图（Module 1 图谱）

点击例 10.3.2 的节点 `_kV` 做"溯源"，高亮所有上游依赖路径：

```
         Ch10-12: _kV_x, _tV̄, Thiele 方程, Hattendorf 定理
                            │
         Ch8: P_x = A_x / ä_x, 平衡准则 E(L)=0
                    │
         ┌──────────┴──────────┐
         │ Ch4: 保险现值       │    │ Ch5: 年金现值        │
         │ Ā_x, A^1_{x:n}...  │    │ ā_x, ä_x, a_x...    │
         └──────────┬──────────┘    └──────────┬──────────┘
                    │                          │
         ┌──────────┴──────────────────────────┴──────────┐
         │          Ch1: _tp_x, _tq_x, l_x, d_x, μ_x     │
         │          s(t), ė_x, UDD/常数力/Balducci       │
         └──────────────────────┬─────────────────────────┘
                                │
         ┌──────────────────────┴─────────────────────────┐
         │     输入层：CL93M 生命表 + (i, δ, v, d)        │
         └───────────────────────────────────────────────┘
```

---

## Phase 0: 公式注册表 + 预设示例（P0）

这是整个系统的"内容骨架"。从 8 个 `_clean.md` 提取全部公式条目和例题。

### 提取范围

数据文件已在 `pdf_pptx/final/` 中，人工提取到 TypeScript：

| 章节 | FormulaEntry 条数 | PresetExample 条数 | 关键例题 |
|------|-------------------|---------------------|---------|
| Ch1 | ~15 | ~10 | 例1.2.1-1.2.3（De Moivre/指数），例1.3.3（s(x)），例1.5.2（CL93M） |
| Ch4 | ~20 | ~15 | 例4.2.2（3E20=0.8739），例4.3.1（Ā=0.11329），例4.3.3（q_{x+1}=0.54），例4.4.1（415.61元），例4.4.4（A77=0.810），例4.5.1（Var=900），例4.5.4（831.84） |
| Ch5 | ~18 | ~12 | 例5.3.3（ā_x=10），例5.4.1-5.4.4（年金分布+方差），例5.7.1-5.7.2（债券/贷款） |
| Ch8 | ~15 | ~5 | 例8.3.1（趸缴=5元），例8.4.1-8.4.4（连续保费+方差） |
| Ch9 | ~5 | ~2 | 例9.3.1-9.3.2（费用负荷保费） |
| Ch10 | ~12 | ~3 | 例10.2.1（De Moivre C_h），例10.3.2（保单组4788元），例10.5.1（Hattendorf 21904元） |
| Ch11 | ~10 | ~2 | 例11.5.1（Fackler递推），现金流分析 |
| Ch12 | ~8 | ~3 | 例12.2.2（799），例12.3.1（20V=0.40），例12.4.1（死亡力图） |
| **合计** | **~100** | **~50** | |

### Task 0.1: 完成公式注册表 TypeScript 数据

从当前的 ~35 条扩展到 ~100 条。逐章对照 `_clean.md`：
- 每个公式条目的 `definition` 字段直接摘自课件中的中文定义
- `formula_latex` 取自课件中的 LaTeX 公式（已验证正确）
- `dependencies` 根据课件中的推导路径（如 $A_x$ 依赖 ${}_t p_x$ 和 $q_x$）

### Task 0.2: 完成预设示例 TypeScript 数据

从每个 `_clean.md` 中提取所有例题。每条预设示例：
- 预置节点的参数精确匹配课件例题
- `expectedResults` 包含课件上的参考答案
- 用户加载后可立即验证"我算的对不对"

### Task 0.3: 完成概念依赖边

从课件中的推导关系（如 $\delta\overline{a}_x + \overline{A}_x = 1$）生成 `edges.ts`。

---

## Phase 1: 核心计算引擎（P1）

纯 Python 库 `actuarial-engine/`。实现所有在公式注册表中注册的函数。

### 主要模块（与原方案一致，微调）

```
actuarial-engine/
├── pyproject.toml
├── src/actuarial/
│   ├── __init__.py
│   ├── life_table.py           # LifeTable 类 + CL93M/CL93F 内置数据
│   ├── survival_model.py       # SurvivalModel (t_px, t_qx, e_x, μ_x)
│   ├── present_value.py        # PresentValueCalculator (A_x, a_x 全系列)
│   ├── net_premium.py          # NetPremiumCalculator (P_x 全系列)
│   ├── reserve.py              # ReserveCalculator (V 全系列)
│   ├── expense.py              # ExpenseLoadedPremium (Ch9)
│   ├── dag.py                  # DAG 拓扑排序 + 脏标记传播
│   └── ast_evaluator.py        # 公式 AST 求值器
└── tests/ (一一对应)
```

### 关键设计原则

- **纯函数**：所有计算无副作用
- **向量化**：numpy 数组运算，避免 Python 循环
- **数值验证**：每个模块的测试用例用课件例题的期望值做断言（如 `assert abs(result - 0.873899334) < 1e-6`）

### 需要实现的计算函数清单（对应对照 _clean.md）

**Ch1 生存模型：** `t_px(t,x,lt)`, `t_qx(t,x,lt)`, `curtate_ex(x,lt)`, `complete_ex(x,lt)`, `mu_x(t,x,lt)`, `u_given_t_qx(u,t,x,lt)`

**Ch4 保险现值：** `Ax_discrete(x,i,lt)`, `Ax_continuous(x,i,lt)`, `Ax_term_discrete(x,n,i,lt)`, `Ax_term_continuous(x,n,i,lt)`, `pure_endowment(x,n,i,lt)`, `endowment_insurance_discrete(x,n,i,lt)`, `endowment_insurance_continuous(x,n,i,lt)`, `deferred_Ax_discrete(x,m,i,lt)`, `increasing_Ax_discrete(x,i,lt)`, `decreasing_Ax_discrete(x,n,i,lt)`

**Ch5 年金现值：** `ax_due_discrete(x,i,lt)`, `ax_immediate_discrete(x,i,lt)`, `ax_continuous(x,i,lt)`, `ax_term_due_discrete(x,n,i,lt)`, `deferred_ax_due(x,n,i,lt)`, `certain_and_life_ax_due(x,n,i,lt)`

**Ch8 净保费：** `Px_discrete(x,i,lt)`, `Px_continuous(x,i,lt)`, `Px_term_discrete(x,n,i,lt)`, `h_pay_Px_discrete(x,h,i,lt)`, `Px_endowment_discrete(x,n,i,lt)`, `Px_semi_continuous(x,i,lt)`

**Ch10+11 准备金：** `kVx_discrete(x,k,i,lt)`, `kVx_endowment_discrete(x,n,k,i,lt)`, `h_pay_kVx(x,h,k,i,lt)`, `kVx_term_discrete(x,n,k,i,lt)`, `tV_continuous(x,t,i,lt)`

**Ch9 费用：** `expense_loaded_premium(...)`

---

## Phase 2: 后端 API（P2）

与原方案基本一致。唯一补充：增加一个专门服务课件示例的端点。

### 关键端点

| 端点 | 用途 |
|------|------|
| `POST /api/compute` | 工作流 DAG 求值（接收 {graph, changed_nodes}，返回 {results, trace}） |
| `GET /api/lifetable/default` | 返回内置生命表（CL93M）的 JSON 数据 |
| `POST /api/lifetable/custom` | 上传自定义生命表 |
| `POST /api/verify` | **v2 新增**：对比计算结果与课件期望值 |

`POST /api/verify` 的输入：
```json
{
  "preset_id": "ch4_ex_4_2_2",
  "computed_results": { "nEx": 0.87395 }
}
```
输出：
```json
{
  "match": false,
  "expected": { "nEx": 0.873899334 },
  "diff": 0.000050666,
  "tolerance": 1e-6
}
```

---

## Phase 3: 前端（P3）

### Task 3.1: 项目骨架

Vite + React + TypeScript 初始化，安装依赖（reactflow, katex, zustand）。

### Task 3.2: KaTeX 渲染 + 公式注册表加载

通用 KaTeX 组件，能渲染所有注册表中的 LaTeX（含 actuarialangle 的降级处理）。

### Task 3.3: Module 1 — 概念拓扑图谱

React Flow 渲染公式节点 + 依赖边。点击节点 → 右侧面板展示课件中的完整定义和公式。选中公式 → 溯源高亮。

**与 v1 的关键差异：** v2 的节点数据直接来自 `_clean.md`，而不只是 `精算符号.md`——所以点击节点弹出的详情面板会包含课件中的完整定理陈述和推导路径。

### Task 3.4: Module 2 — 工作流构建器

拖入节点（输入源/算子/输出）→ 连线 → 自动计算。

**与 v1 的关键差异：** v2 的左侧面板新增 **"📚 课件例题"** 区域，列出所有 PresetExample。点击例题自动在画布上生成完整工作流（节点+连线+参数），用户可立即运行并验证结果。

交互流程：
```
左侧 "📚 课件例题" 面板
  ├── 第一章：生存分布与生命表
  │   ├── 例1.2.1 De Moivre 分布
  │   ├── 例1.2.2 指数分布
  │   └── ...
  ├── 第四章：保险现值
  │   ├── 例4.2.2 3年期生存保险 (3E20=0.8739)
  │   ├── 例4.3.1 10年期寿险 (Ā=0.11329)
  │   └── ...
  └── ...
        │
        ▼ 点击
  画布自动生成工作流 → 自动计算 → 验证答案
        │
        ▼ 用户拖动滑块
  What-If 分析：i: 2.5% → 5%, x: 20 → 40, n: 3 → 5
```

---

## 第一期实施路径（6-8 周）

| 周 | 任务 | 产出 |
|----|------|------|
| **W1** | P0：完成 formulas.ts（100+ 条）+ presets.ts（50+ 条）| 完整的公式和例题数据库 |
| **W2-3** | P1：actuarial-engine 全部模块 + 课件例题作为测试用例 | `pip install` 可用的 Python 库 |
| **W4** | P2：FastAPI + `/compute` + `/verify` 端点 | 可独立运行的 API 服务 |
| **W5-6** | P3 Module 1+2：概念图谱 + 工作流 + 预设示例加载 | 可交互的前端 SPA |
| **W7-8** | 整合测试 + 部署 + 文档 | docker-compose up 即可启动 |

---

## 与 v1 的关键差异总结

1. **数据源**：`精算符号.md` → **8 个 `_clean.md` 课件文件**（含公式、定理、例题）
2. **新增预设示例系统**：50+ 个课件例题可一键加载到工作流
3. **新增 verify 端点**：自动对比用户计算结果与课件期望值
4. **FormulaEntry 新增字段**：`source_slide`（追溯课件页码），`proof`（来自课件的证明概要）
5. **第一期范围**：聚焦已学 8 章，跳过 Ch2/3/6/7/13（无课件数据源）
