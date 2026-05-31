// ============================================================
// 寿险精算章节分类
// 数据源：8个 _clean.md 课件文件（Ch1/4/5/8/9/10/11/12）
// ============================================================

import type { ChapterCategory } from "./types";

export const CHAPTERS: ChapterCategory[] = [
  // ─── 已学部分（有 PPTX 课件）───
  {
    chapter: 1,
    title: "生存分布与生命表",
    description: "基础生存模型：μ(t), s(t), T(x), K(x), l_x, d_x, e_x, UDD/常数死亡力/Balducci假设",
    isLearned: true,
  },
  {
    chapter: 2,
    title: "联合生命状态",
    description: "(xy) 联合生存状态与 (x̄ȳ) 最后生存者状态",
    isLearned: false,  // 无课件
  },
  {
    chapter: 3,
    title: "多元衰减模型",
    description: "多原因衰减：q_x^(j), μ_x^(τ), 绝对衰减率",
    isLearned: false,  // 无课件
  },
  {
    chapter: 4,
    title: "保险现值",
    description: "A_x 系列 — 终身/定期/生死合险/延期/递增递减，死亡后立即给付 vs 保单年度末给付",
    isLearned: true,
  },
  {
    chapter: 5,
    title: "年金现值",
    description: "a_x 系列 — 连续/期初/期末/延期/确定期/分期给付，金融应用（债券/贷款）",
    isLearned: true,
  },
  {
    chapter: 6,
    title: "联合生命保险与年金",
    description: "A_{xy}, a_{xy} 系列",
    isLearned: false,  // 无课件
  },
  {
    chapter: 7,
    title: "养老金精算",
    description: "R(x,h,t), AS, ES, 工资比例系数",
    isLearned: false,  // 无课件
  },
  {
    chapter: 8,
    title: "净保费理论",
    description: "P 系列 — 平衡准则，完全连续/完全离散/半连续/分期缴费的均衡净保费",
    isLearned: true,
  },
  {
    chapter: 9,
    title: "费用负荷保费",
    description: "保险费用分类、费用负荷保费计算、考虑退保因素的模型",
    isLearned: true,
  },
  {
    chapter: 10,
    title: "净准备金（一般理论）",
    description: "C_h 模型、净准备金定义、递推公式、Λ_h、Hattendorf 定理",
    isLearned: true,
  },
  {
    chapter: 11,
    title: "净准备金（完全离散）",
    description: "_kV_x 三种表示法、生死合险/限期缴费/递推公式、现金流分析",
    isLearned: true,
  },
  {
    chapter: 12,
    title: "净准备金（完全连续）",
    description: "Thiele 微分方程、_tV̄ 将来法、五种公式",
    isLearned: true,
  },
  {
    chapter: 13,
    title: "净准备金（一般形式）",
    description: "半连续、分期缴费的准备金一般形式",
    isLearned: false,  // 无课件
  },
  {
    chapter: 0,
    title: "定理演示",
    description: "核心定理/结论/公式的交互式演示，给定输入 → 计算输出",
    isLearned: true,
  },
];

/** 按 chapter 快速查找 */
export const CHAPTER_BY_NUM = new Map(CHAPTERS.map(c => [c.chapter, c]));

/** 仅已学章节 */
export const LEARNED_CHAPTERS = CHAPTERS.filter(c => c.isLearned);
