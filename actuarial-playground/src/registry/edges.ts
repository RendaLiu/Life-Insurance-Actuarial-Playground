// ============================================================
// 概念溯源边 — 公式之间的依赖/等价/对偶关系
// 数据源：_clean.md 课件中的推导路径 + 精算知识
// ============================================================

import type { ConceptEdge } from "./types";
import { ALL_FORMULAS, FORMULA_BY_ID } from "./formulas";

/** 从各公式的 dependencies 字段自动生成 "depends_on" 边 */
function generateDependencyEdges(): ConceptEdge[] {
  const edges: ConceptEdge[] = [];
  for (const f of ALL_FORMULAS) {
    for (const depId of f.dependencies) {
      // 只添加存在的依赖
      if (FORMULA_BY_ID.has(depId)) {
        edges.push({
          source: depId,
          target: f.id,
          relation: "depends_on",
        });
      }
    }
  }
  return edges;
}

/** 手动补充的跨章节恒等式 + 对偶关系 + 推广关系 */
const MANUAL_EDGES: ConceptEdge[] = [
  // ═══ 保险-年金对偶恒等式 ═══
  {
    source: "Ax_continuous",
    target: "ax_continuous",
    relation: "dual",
    latex: "\\delta\\overline{a}_x + \\overline{A}_x = 1",
  },
  {
    source: "Ax_discrete",
    target: "ax_due_discrete",
    relation: "dual",
    latex: "d\\ddot{a}_x + A_x = 1",
  },
  {
    source: "insurance_annuity_identity_cont",
    target: "insurance_annuity_identity_disc",
    relation: "dual",
    latex: "\\text{连续} \\leftrightarrow \\text{离散}",
  },

  // ═══ UDD 推广 ═══
  {
    source: "udd_assumption",
    target: "udd_ax_ax_relation",
    relation: "generalizes",
    latex: "\\overline{A} = \\frac{i}{\\delta} A",
  },

  // ═══ 保费-准备金-年金链 ═══
  {
    source: "Px_discrete",
    target: "kVx_discrete",
    relation: "depends_on",
    latex: "{}_k V_x = A_{x+k} - P_x \\cdot \\ddot{a}_{x+k}",
  },
  {
    source: "Px_continuous",
    target: "tV_ax_continuous",
    relation: "depends_on",
    latex: "{}_t \\overline{V} = \\overline{A}_{x+t} - \\overline{P} \\cdot \\overline{a}_{x+t}",
  },
  {
    source: "kVx_discrete",
    target: "fackler_recursion",
    relation: "depends_on",
    latex: "{}_{k+1}V = \\frac{({}_kV+P)(1+i)-q}{p}",
  },
  {
    source: "tV_ax_continuous",
    target: "thiele_ode",
    relation: "depends_on",
    latex: "\\frac{d}{dt}{}_t\\overline{V} = \\pi + (\\delta+\\mu){}_t\\overline{V} - b\\mu",
  },

  // ═══ 生死合险 = 死亡 + 生存 ═══
  {
    source: "Ax_term_discrete",
    target: "endowment_insurance_discrete",
    relation: "depends_on",
    latex: "A_{x:n} = A^1_{x:n} + {}_n E_x",
  },
  {
    source: "pure_endowment",
    target: "endowment_insurance_discrete",
    relation: "depends_on",
  },

  // ═══ 延期 = 纯生存 × 迁后 ═══
  {
    source: "pure_endowment",
    target: "deferred_Ax_discrete",
    relation: "depends_on",
    latex: "{}_m|A_x = {}_m E_x \\cdot A_{x+m}",
  },
  {
    source: "pure_endowment",
    target: "deferred_ax_due_discrete",
    relation: "depends_on",
    latex: "{}_n|\\ddot{a}_x = {}_n E_x \\cdot \\ddot{a}_{x+n}",
  },

  // ═══ t_px → _t q_x 对偶 ═══
  {
    source: "t_px",
    target: "t_qx",
    relation: "dual",
    latex: "{}_t q_x = 1 - {}_t p_x",
  },

  // ═══ 死亡力 → 生存分布 ═══
  {
    source: "mu_t",
    target: "survival_s",
    relation: "depends_on",
    latex: "s(t) = \\exp(-\\int_0^t \\mu)",
  },
  {
    source: "mu_t",
    target: "de_moivre_mu",
    relation: "generalizes",
    latex: "\\mu(t) = \\frac{1}{\\omega-t}",
  },
  {
    source: "mu_t",
    target: "gompertz_mu",
    relation: "generalizes",
    latex: "\\mu(t) = B \\cdot C^t",
  },
  {
    source: "gompertz_mu",
    target: "makeham_mu",
    relation: "generalizes",
    latex: "\\mu(t) = A + B \\cdot C^t",
  },

  // ═══ l_x → d_x ═══
  {
    source: "lx",
    target: "dx",
    relation: "depends_on",
    latex: "d_x = l_x - l_{x+1}",
  },

  // ═══ ä_x ↔ a_x ═══
  {
    source: "ax_due_discrete",
    target: "ax_immediate_discrete",
    relation: "dual",
    latex: "a_x = \\ddot{a}_x - 1",
  },

  // ═══ Hattendorf 链条 ═══
  {
    source: "Ch",
    target: "hV",
    relation: "depends_on",
    latex: "{}_h V = E[{}_h L|K\\ge h]",
  },
  {
    source: "hV",
    target: "Lambda_h",
    relation: "depends_on",
    latex: "\\Lambda_h = ... + v{}_{h+1}V - {}_h V",
  },
  {
    source: "Lambda_h",
    target: "hattendorf",
    relation: "depends_on",
    latex: "\\text{Var} = \\sum v^{2(j-h)} \\text{Var}[\\Lambda_j]",
  },
];

/** 全部溯源边 = 自动生成的 + 手动补充的 */
export const ALL_CONCEPT_EDGES: ConceptEdge[] = [
  ...generateDependencyEdges(),
  ...MANUAL_EDGES,
];

/** 仅"依赖"关系边（用于工作流模式） */
export const DEPENDENCY_EDGES = ALL_CONCEPT_EDGES.filter(e => e.relation === "depends_on");
