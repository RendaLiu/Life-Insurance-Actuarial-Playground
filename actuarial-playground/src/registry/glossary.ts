// ============================================================
// 精算符号定义表 (Glossary)
// 数据源：精算符号.md — 直接映射 符号 → 中文定义
// 用途：全局 tooltip、定理解释、Copilot 上下文
// ============================================================

export interface GlossaryEntry {
  id: string;
  latex: string;       // KaTeX 可渲染的符号
  plainText: string;   // 纯文本（搜索用）
  definition: string;   // 中文定义
  chapter: number;
  category: string;
  isLearned: boolean;
}

export const GLOSSARY: GlossaryEntry[] = [
  // ═══════════════════════════════════════════════
  // 第一章：生存分布与生命表
  // ═══════════════════════════════════════════════
  {
    id: "gl_mu_t",
    latex: "\\mu(t)",
    plainText: "μ(t)",
    definition: "新生儿的死亡力函数",
    chapter: 1, category: "死亡力", isLearned: true,
  },
  {
    id: "gl_s_t",
    latex: "s(t)",
    plainText: "s(t)",
    definition: "生存分布（生存函数）",
    chapter: 1, category: "生存分布", isLearned: true,
  },
  {
    id: "gl_K0",
    latex: "K(0)",
    plainText: "K(0)",
    definition: "新生儿未来生存的整年数",
    chapter: 1, category: "未来生存时间", isLearned: true,
  },
  {
    id: "gl_S0",
    latex: "S(0)",
    plainText: "S(0)",
    definition: "新生儿未来生存的分数时间",
    chapter: 1, category: "未来生存时间", isLearned: true,
  },
  {
    id: "gl_ering_e0",
    latex: "\\mathring{e}_0",
    plainText: "ė₀",
    definition: "新生儿的未来生存时间的期望（完全平均余命）",
    chapter: 1, category: "平均余命", isLearned: true,
  },
  {
    id: "gl_e0",
    latex: "e_0",
    plainText: "e₀",
    definition: "新生儿的未来生存整年数的期望",
    chapter: 1, category: "平均余命", isLearned: true,
  },
  {
    id: "gl_Tx",
    latex: "T(x)",
    plainText: "T(x)",
    definition: "x岁个体的未来生存时间（随机变量）",
    chapter: 1, category: "未来生存时间", isLearned: true,
  },
  {
    id: "gl_Kx",
    latex: "K(x)",
    plainText: "K(x)",
    definition: "x岁个体的未来生存的整年数",
    chapter: 1, category: "未来生存时间", isLearned: true,
  },
  {
    id: "gl_Sx",
    latex: "S(x)",
    plainText: "S(x)",
    definition: "x岁个体的未来分数生存时间",
    chapter: 1, category: "未来生存时间", isLearned: true,
  },
  {
    id: "gl_ering_ex",
    latex: "\\mathring{e}_x",
    plainText: "ėₓ",
    definition: "x岁个体的未来生存时间的期望（完全平均余命）",
    chapter: 1, category: "平均余命", isLearned: true,
  },
  {
    id: "gl_ex",
    latex: "e_x",
    plainText: "eₓ",
    definition: "x岁个体的未来生存整年数的期望",
    chapter: 1, category: "平均余命", isLearned: true,
  },
  {
    id: "gl_mu_x_t",
    latex: "\\mu_x(t)",
    plainText: "μₓ(t)",
    definition: "x岁个体的死亡力函数：μ_x(t) = μ(x+t)",
    chapter: 1, category: "死亡力", isLearned: true,
  },
  {
    id: "gl_t_px",
    latex: "{}_t p_x",
    plainText: "_t p_x",
    definition: "x岁的个体活过x+t岁的概率",
    chapter: 1, category: "生存概率", isLearned: true,
  },
  {
    id: "gl_t_qx",
    latex: "{}_t q_x",
    plainText: "_t q_x",
    definition: "x岁的个体死于x+t岁前的概率",
    chapter: 1, category: "死亡概率", isLearned: true,
  },
  {
    id: "gl_u_given_t_qx",
    latex: "{}_{u|t} q_x",
    plainText: "_{u|t} q_x",
    definition: "x岁的个体在x+u岁至x+u+t岁之间死亡的概率",
    chapter: 1, category: "延期死亡概率", isLearned: true,
  },
  {
    id: "gl_px",
    latex: "p_x",
    plainText: "pₓ",
    definition: "p_x = _1 p_x：x岁个体活过1年的概率",
    chapter: 1, category: "生存概率", isLearned: true,
  },
  {
    id: "gl_qx",
    latex: "q_x",
    plainText: "qₓ",
    definition: "q_x = _1 q_x：x岁个体在1年内死亡的概率",
    chapter: 1, category: "死亡概率", isLearned: true,
  },
  {
    id: "gl_u_given_qx",
    latex: "{}_{u|} q_x",
    plainText: "_{u|} q_x",
    definition: "_{u|} q_x = _{u|1} q_x：x岁个体在[x+u, x+u+1)内死亡的概率",
    chapter: 1, category: "死亡概率", isLearned: true,
  },
  {
    id: "gl_lx",
    latex: "l_x",
    plainText: "lₓ",
    definition: "生存群中活到x岁的个体数的期望",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_t_dx",
    latex: "{}_t d_x",
    plainText: "_t dₓ",
    definition: "生存群中在x到x+t岁之间死亡的个体数的期望",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_dx",
    latex: "d_x",
    plainText: "dₓ",
    definition: "d_x = _1 d_x：在x到x+1岁之间死亡的个体期望数",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_n_mx",
    latex: "{}_n m_x",
    plainText: "_n mₓ",
    definition: "中心死亡率：_n m_x = _n q_x / ∫_0^n _t p_x dt",
    chapter: 1, category: "中心死亡率", isLearned: true,
  },
  {
    id: "gl_mx",
    latex: "m_x",
    plainText: "mₓ",
    definition: "m_x = _1 m_x：一年期中心死亡率",
    chapter: 1, category: "中心死亡率", isLearned: true,
  },
  {
    id: "gl_t_Lx",
    latex: "{}_t L_x",
    plainText: "_t Lₓ",
    definition: "生存群中x岁的个体在年龄区间[x, x+t)内总的生存时间的期望",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_Lx",
    latex: "L_x",
    plainText: "Lₓ",
    definition: "L_x = _1 L_x：在[x, x+1)内总生存时间期望。有 L_x = a(x)l_x + (1−a(x))l_{x+1}",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_Tx_life",
    latex: "T_x",
    plainText: "Tₓ",
    definition: "生存群中x岁的个体总的未来生存时间的期望：T_x = ∫_0^∞ l_{x+s} ds",
    chapter: 1, category: "生命表", isLearned: true,
  },
  {
    id: "gl_q_select",
    latex: "q_{[x]+i}",
    plainText: "q_{[x]+i}",
    definition: "选择年龄为x岁的个体在x+i岁前死亡的概率",
    chapter: 1, category: "选择生命表", isLearned: true,
  },
  {
    id: "gl_Yx",
    latex: "Y_x",
    plainText: "Yₓ",
    definition: "Y_x = ∫_0^∞ T_{x+s} ds，生存群总未来生存时间的积分",
    chapter: 1, category: "生命表", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第二章：联合生命状态
  // ═══════════════════════════════════════════════
  {
    id: "gl_xy",
    latex: "(xy)",
    plainText: "(xy)",
    definition: "由个体(x)和(y)组成的联合生存状态",
    chapter: 2, category: "联合生命", isLearned: false,
  },
  {
    id: "gl_xy_bar",
    latex: "(\\overline{xy})",
    plainText: "(x̄ȳ)",
    definition: "由个体(x)和(y)组成的最后生存者状态",
    chapter: 2, category: "联合生命", isLearned: false,
  },
  {
    id: "gl_T_xy",
    latex: "T(xy)",
    plainText: "T(xy)",
    definition: "联合生存状态(xy)的未来生存时间",
    chapter: 2, category: "联合生命", isLearned: false,
  },
  {
    id: "gl_t_p_xy",
    latex: "{}_t p_{xy}",
    plainText: "_t p_{xy}",
    definition: "联合生存状态(xy)至少再活t年的概率",
    chapter: 2, category: "联合生命", isLearned: false,
  },
  {
    id: "gl_n_q_xy_1",
    latex: "{}_n q_{xy}^1",
    plainText: "_n q¹_{xy}",
    definition: "个体(x)先于个体(y)死亡，并且(x)在n年内死亡的概率",
    chapter: 2, category: "死亡次序", isLearned: false,
  },

  // ═══════════════════════════════════════════════
  // 第三章：多元衰减模型
  // ═══════════════════════════════════════════════
  {
    id: "gl_t_qx_j",
    latex: "{}_t q_x^{(j)}",
    plainText: "_t qₓ⁽ʲ⁾",
    definition: "在x+t岁之前由于原因j而衰减的概率",
    chapter: 3, category: "多元衰减", isLearned: false,
  },
  {
    id: "gl_t_qx_tau",
    latex: "{}_t q_x^{(\\tau)}",
    plainText: "_t qₓ⁽ᵗ⁾",
    definition: "在x+t岁之前总体衰减的概率",
    chapter: 3, category: "多元衰减", isLearned: false,
  },

  // ═══════════════════════════════════════════════
  // 第四章：保险现值
  // ═══════════════════════════════════════════════
  {
    id: "gl_pure_endowment",
    latex: "{}_n E_x",
    plainText: "_n Eₓ",
    definition: "单位保额的n年期生存保险保险人给付额的精算现值",
    chapter: 4, category: "保险现值", isLearned: true,
  },
  {
    id: "gl_ax_term_cont",
    latex: "\\overline{A}_{x:\\enclose{actuarial}{n}}^1",
    plainText: "Ā¹_{x:n}",
    definition: "单位保额的n年期死亡保险的精算现值（保额在个体死亡后立即给付）",
    chapter: 4, category: "定期寿险", isLearned: true,
  },
  {
    id: "gl_ax_term_disc",
    latex: "A_{x:\\enclose{actuarial}{n}}^1",
    plainText: "A¹_{x:n}",
    definition: "单位保额的n年期死亡保险的精算现值（保额在个体死亡的保单年度末给付）",
    chapter: 4, category: "定期寿险", isLearned: true,
  },
  {
    id: "gl_ax_cont",
    latex: "\\overline{A}_x",
    plainText: "Āₓ",
    definition: "单位保额的终身寿险的精算现值（保额在个体死亡后立即给付）",
    chapter: 4, category: "终身寿险", isLearned: true,
  },
  {
    id: "gl_ax_disc",
    latex: "A_x",
    plainText: "Aₓ",
    definition: "单位保额的终身寿险的精算现值（保额在个体死亡的保单年度末给付）",
    chapter: 4, category: "终身寿险", isLearned: true,
  },
  {
    id: "gl_endow_cont",
    latex: "\\overline{A}_{x:\\enclose{actuarial}{n}}",
    plainText: "Ā_{x:n}",
    definition: "单位保额的n年期生死合险的精算现值（死亡后立即给付或期满生存给付）",
    chapter: 4, category: "生死合险", isLearned: true,
  },
  {
    id: "gl_endow_disc",
    latex: "A_{x:\\enclose{actuarial}{n}}",
    plainText: "A_{x:n}",
    definition: "单位保额的n年期生死合险的精算现值（死亡保单年度末给付或期满生存给付）",
    chapter: 4, category: "生死合险", isLearned: true,
  },
  {
    id: "gl_def_ax_cont",
    latex: "{}_{m|}\\overline{A}_x",
    plainText: "_{m|}Āₓ",
    definition: "单位保额的延期m年终身寿险的精算现值（死亡后立即给付）",
    chapter: 4, category: "延期保险", isLearned: true,
  },
  {
    id: "gl_def_ax_disc",
    latex: "{}_{m|}A_x",
    plainText: "_{m|}Aₓ",
    definition: "单位保额的延期m年终身寿险的精算现值（死亡保单年度末给付）",
    chapter: 4, category: "延期保险", isLearned: true,
  },
  {
    id: "gl_ax_m",
    latex: "A_x^{(m)}",
    plainText: "Aₓ⁽ᵐ⁾",
    definition: "单位保额的终身寿险，每年分m个区间，保额在死亡的区间末给付",
    chapter: 4, category: "分期给付", isLearned: true,
  },
  {
    id: "gl_IAx_cont",
    latex: "(\\overline{I}\\overline{A})_x",
    plainText: "(ĪĀ)ₓ",
    definition: "标准年递增终身寿险的精算现值（死亡后立即给付）",
    chapter: 4, category: "变额保险", isLearned: true,
  },
  {
    id: "gl_IAx_disc",
    latex: "(IA)_x",
    plainText: "(IA)ₓ",
    definition: "标准年递增终身寿险的精算现值（死亡保单年度末给付）",
    chapter: 4, category: "变额保险", isLearned: true,
  },
  {
    id: "gl_DAx_cont",
    latex: "(\\overline{DA})_{x:\\enclose{actuarial}{n}}^1",
    plainText: "(D̄Ā)¹_{x:n}",
    definition: "标准年递减n年期寿险的精算现值（死亡后立即给付）",
    chapter: 4, category: "变额保险", isLearned: true,
  },
  {
    id: "gl_DAx_disc",
    latex: "(DA)_{x:\\enclose{actuarial}{n}}^1",
    plainText: "(DA)¹_{x:n}",
    definition: "标准年递减n年期寿险的精算现值（死亡保单年度末给付）",
    chapter: 4, category: "变额保险", isLearned: true,
  },
  {
    id: "gl_IAx_cont_cont",
    latex: "(\\overline{I}\\ \\overline{A})_x",
    plainText: "(Ī Ā)ₓ",
    definition: "连续递增终身寿险保险人给付额的精算现值",
    chapter: 4, category: "变额保险", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第五章：年金现值
  // ═══════════════════════════════════════════════
  {
    id: "gl_ax_cont_5",
    latex: "\\overline{a}_{x:\\enclose{actuarial}{n}}",
    plainText: "ā_{x:n}",
    definition: "给付率为1的n年期连续生存年金的精算现值",
    chapter: 5, category: "连续年金", isLearned: true,
  },
  {
    id: "gl_ax_cont_life",
    latex: "\\overline{a}_x",
    plainText: "āₓ",
    definition: "给付率为1的连续终身生存年金的精算现值",
    chapter: 5, category: "连续年金", isLearned: true,
  },
  {
    id: "gl_ax_due_term",
    latex: "\\ddot{a}_{x:\\enclose{actuarial}{n}}",
    plainText: "ä_{x:n}",
    definition: "每年年初给付一个单位的n年期生存年金的精算现值",
    chapter: 5, category: "期初年金", isLearned: true,
  },
  {
    id: "gl_ax_due_life",
    latex: "\\ddot{a}_x",
    plainText: "äₓ",
    definition: "每年年初给付一个单位的终身生存年金的精算现值",
    chapter: 5, category: "期初年金", isLearned: true,
  },
  {
    id: "gl_ax_imm_term",
    latex: "a_{x:\\enclose{actuarial}{n}}",
    plainText: "a_{x:n}",
    definition: "每年年末给付一个单位的n年期生存年金的精算现值",
    chapter: 5, category: "期末年金", isLearned: true,
  },
  {
    id: "gl_ax_imm_life",
    latex: "a_x",
    plainText: "aₓ",
    definition: "每年年末给付一个单位的终身生存年金的精算现值",
    chapter: 5, category: "期末年金", isLearned: true,
  },
  {
    id: "gl_def_ax_cont_5",
    latex: "{}_n|\\overline{a}_x",
    plainText: "_{n|}āₓ",
    definition: "给付率为1的延期n年的连续终身生存年金的精算现值",
    chapter: 5, category: "延期年金", isLearned: true,
  },
  {
    id: "gl_def_ax_due_5",
    latex: "{}_n|\\ddot{a}_x",
    plainText: "_{n|}äₓ",
    definition: "每年年初给付一个单位的延期n年的终身生存年金的精算现值",
    chapter: 5, category: "延期年金", isLearned: true,
  },
  {
    id: "gl_def_ax_imm_5",
    latex: "{}_n|a_x",
    plainText: "_{n|}aₓ",
    definition: "每年年末给付一个单位的延期n年的终身生存年金的精算现值",
    chapter: 5, category: "延期年金", isLearned: true,
  },
  {
    id: "gl_ax_certain_life",
    latex: "\\ddot{a}_{\\overline{x:\\enclose{actuarial}{n}}}",
    plainText: "ä_{x:n̄}",
    definition: "每年年初给付一个单位的n年确定期终身生存年金的精算现值",
    chapter: 5, category: "确定期年金", isLearned: true,
  },
  {
    id: "gl_ax_m_due",
    latex: "\\ddot{a}_x^{(m)}",
    plainText: "äₓ⁽ᵐ⁾",
    definition: "每年给付总额为1，分m次期初给付的终身生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },
  {
    id: "gl_ax_m_imm",
    latex: "a_x^{(m)}",
    plainText: "aₓ⁽ᵐ⁾",
    definition: "每年给付总额为1，分m次期末给付的终身生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },
  {
    id: "gl_ax_m_due_proportional",
    latex: "\\ddot{a}_x^{\\{m\\}}",
    plainText: "äₓ^{m}",
    definition: "比例期初终身生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },
  {
    id: "gl_ax_m_imm_complete",
    latex: "a_x^{\\{m\\}}",
    plainText: "aₓ^{m}",
    definition: "完全期末终身生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },
  {
    id: "gl_ax_acc_cont",
    latex: "\\overline{s}_{x:\\enclose{actuarial}{n}}",
    plainText: "s̄_{x:n}",
    definition: "给付率为1的n年期连续生存年金的精算终值",
    chapter: 5, category: "连续年金", isLearned: true,
  },
  {
    id: "gl_ax_acc_due",
    latex: "\\ddot{s}_{x:\\enclose{actuarial}{n}}",
    plainText: "s̈_{x:n}",
    definition: "每年年初给付一个单位的n年期生存年金的精算终值",
    chapter: 5, category: "期初年金", isLearned: true,
  },
  {
    id: "gl_ax_m_due_term",
    latex: "\\ddot{a}_{x:\\enclose{actuarial}{n}}^{(m)}",
    plainText: "ä_{x:n}⁽ᵐ⁾",
    definition: "每年给付总额为1，分m次期初给付的n年期生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },
  {
    id: "gl_ax_m_imm_term",
    latex: "a_{x:\\enclose{actuarial}{n}}^{(m)}",
    plainText: "a_{x:n}⁽ᵐ⁾",
    definition: "每年给付总额为1，分m次期末给付的n年期生存年金的精算现值",
    chapter: 5, category: "分期年金", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第八章：净保费
  // ═══════════════════════════════════════════════
  {
    id: "gl_P_ax_term_cont",
    latex: "\\overline{P}(\\overline{A}_{x:\\enclose{actuarial}{n}}^1)",
    plainText: "P̄(Ā¹_{x:n})",
    definition: "完全连续n年期寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_ax_cont",
    latex: "\\overline{P}(\\overline{A}_x)",
    plainText: "P̄(Āₓ)",
    definition: "完全连续终身寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_ax_endow_cont",
    latex: "\\overline{P}(\\overline{A}_{x:\\enclose{actuarial}{n}})",
    plainText: "P̄(Ā_{x:n})",
    definition: "完全连续n年期生死合险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_ax_term_disc",
    latex: "P_{x:\\enclose{actuarial}{n}}^1",
    plainText: "P¹_{x:n}",
    definition: "完全离散n年期寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_ax_disc",
    latex: "P_x",
    plainText: "Pₓ",
    definition: "完全离散终身寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_endow_disc",
    latex: "P_{x:\\enclose{actuarial}{n}}",
    plainText: "P_{x:n}",
    definition: "完全离散n年期生死合险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_h_P_ax_disc",
    latex: "{}_h P_x",
    plainText: "_h Pₓ",
    definition: "h年限期缴费的完全离散终身寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_P_semi_ax",
    latex: "P(\\overline{A}_x)",
    plainText: "P(Āₓ)",
    definition: "半连续终身寿险的年均衡净保费（保费离散，保额即付）",
    chapter: 8, category: "净保费", isLearned: true,
  },
  {
    id: "gl_Px_m",
    latex: "P_x^{(m)}",
    plainText: "Pₓ⁽ᵐ⁾",
    definition: "每年缴费m次的完全离散终身寿险的年均衡净保费",
    chapter: 8, category: "净保费", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第十章：净准备金基础
  // ═══════════════════════════════════════════════
  {
    id: "gl_Ch",
    latex: "C_h",
    plainText: "C_h",
    definition: "保险人在第h+1个保单年度的资金损失的现值",
    chapter: 10, category: "资金损失", isLearned: true,
  },
  {
    id: "gl_hV",
    latex: "{}_h V",
    plainText: "_h V",
    definition: "保险人在第h+1个保单年度末的净准备金",
    chapter: 10, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_Lambda_h",
    latex: "\\Lambda_h",
    plainText: "Λ_h",
    definition: "在考虑净准备金变化情况下，保险人在第h+1个保单年度的资金损失的现值",
    chapter: 10, category: "资金变化", isLearned: true,
  },
  {
    id: "gl_hs_V2",
    latex: "{}_{h+s} V^{(2)}",
    plainText: "_{h+s}V⁽²⁾",
    definition: "每年缴费两次的险种在年龄h+s岁时的净准备金",
    chapter: 10, category: "净准备金", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第十一章：完全离散净准备金
  // ═══════════════════════════════════════════════
  {
    id: "gl_kVx",
    latex: "{}_k V_x",
    plainText: "_k Vₓ",
    definition: "单位保额的完全离散终身寿险的净准备金",
    chapter: 11, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_kVx_term",
    latex: "{}_k V_{x:\\enclose{actuarial}{n}}^1",
    plainText: "_k V¹_{x:n}",
    definition: "单位保额的完全离散n年期寿险的净准备金",
    chapter: 11, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_k_h_Vx",
    latex: "{}_k^h V_x",
    plainText: "_k^h Vₓ",
    definition: "单位保额的完全离散终身寿险的净准备金（保费缴纳期h年）",
    chapter: 11, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_kVx_pure_endow",
    latex: "{}_k V_{x:\\enclose{actuarial}{n}}^{\\phantom{1}1}",
    plainText: "_k V¹_{x:n} (生存)",
    definition: "单位保额的完全离散n年期生存保险的净准备金",
    chapter: 11, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_kVx_endow",
    latex: "{}_k V_{x:\\enclose{actuarial}{n}}",
    plainText: "_k V_{x:n}",
    definition: "单位保额的完全离散n年期生死合险的净准备金",
    chapter: 11, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_k_kappa",
    latex: "{}_k \\kappa_x",
    plainText: "_k κₓ",
    definition: "精算累计成本：_k κ_x = A¹_{x:k} / _k E_x",
    chapter: 11, category: "精算累计成本", isLearned: true,
  },

  // ═══════════════════════════════════════════════
  // 第十二章：完全连续净准备金
  // ═══════════════════════════════════════════════
  {
    id: "gl_tV_cont",
    latex: "{}_t\\overline{V}",
    plainText: "_t V̄",
    definition: "完全连续险种在t时刻的净准备金",
    chapter: 12, category: "净准备金", isLearned: true,
  },
  {
    id: "gl_tV_ax_cont",
    latex: "{}_t\\overline{V}(\\overline{A}_x)",
    plainText: "_t V̄(Āₓ)",
    definition: "在x岁签单的完全连续终身寿险在t时刻的净准备金",
    chapter: 12, category: "净准备金", isLearned: true,
  },
];

// ═══════════════════════════════════════════════
// 查找辅助函数
// ═══════════════════════════════════════════════

export const GLOSSARY_BY_ID = new Map(GLOSSARY.map(g => [g.id, g]));

/** 按章节获取 */
export function getGlossaryByChapter(chapter: number): GlossaryEntry[] {
  return GLOSSARY.filter(g => g.chapter === chapter);
}

/** 全文搜索（在 plainText 和 definition 中模糊匹配） */
export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.toLowerCase();
  return GLOSSARY.filter(g =>
    g.plainText.toLowerCase().includes(q) ||
    g.definition.toLowerCase().includes(q) ||
    g.latex.toLowerCase().includes(q)
  );
}

/** 根据 formulaId 匹配 glossary 条目（用于公式详情面板展示对应符号定义） */
export function matchGlossaryForFormula(formulaId: string): GlossaryEntry[] {
  // 按 formulaId 中的关键词匹配
  const keywordMap: Record<string, string[]> = {
    "Ax_term_continuous": ["gl_ax_term_cont"],
    "Ax_term_discrete": ["gl_ax_term_disc"],
    "Ax_continuous": ["gl_ax_cont"],
    "Ax_discrete": ["gl_ax_disc"],
    "endowment_insurance_continuous": ["gl_endow_cont"],
    "endowment_insurance_discrete": ["gl_endow_disc"],
    "pure_endowment": ["gl_pure_endowment"],
    "deferred_Ax_continuous": ["gl_def_ax_cont"],
    "deferred_Ax_discrete": ["gl_def_ax_disc"],
    "increasing_IAx": ["gl_IAx_cont"],
    "increasing_IAx_discrete": ["gl_IAx_disc"],
    "decreasing_DAx_discrete": ["gl_DAx_disc"],
    "ax_continuous": ["gl_ax_cont_life"],
    "ax_term_continuous": ["gl_ax_cont_5"],
    "ax_due_discrete": ["gl_ax_due_life"],
    "ax_term_due_discrete": ["gl_ax_due_term"],
    "ax_immediate_discrete": ["gl_ax_imm_life"],
    "deferred_ax_continuous": ["gl_def_ax_cont_5"],
    "deferred_ax_due_discrete": ["gl_def_ax_due_5"],
    "t_px": ["gl_t_px"],
    "t_qx": ["gl_t_qx"],
    "lx": ["gl_lx"],
    "dx": ["gl_dx"],
    "mu_t": ["gl_mu_t"],
    "mu_x_t": ["gl_mu_x_t"],
    "complete_ex": ["gl_ering_ex"],
    "curtate_ex": ["gl_ex"],
    "Px_discrete": ["gl_P_ax_disc"],
    "Px_continuous": ["gl_P_ax_cont"],
    "Px_term_discrete": ["gl_P_ax_term_disc"],
    "Px_endowment_discrete": ["gl_P_endow_disc"],
    "h_pay_Px_discrete": ["gl_h_P_ax_disc"],
    "Px_semi_continuous": ["gl_P_semi_ax"],
    "Ch": ["gl_Ch"],
    "hV": ["gl_hV"],
    "Lambda_h": ["gl_Lambda_h"],
    "kVx_discrete": ["gl_kVx"],
    "kVx_endowment_discrete": ["gl_kVx_endow"],
    "kVx_premium_diff": ["gl_kVx"],
    "kVx_paidup": ["gl_kVx"],
    "kVx_retrospective": ["gl_kVx", "gl_k_kappa"],
    "tV_continuous": ["gl_tV_cont"],
    "tV_ax_continuous": ["gl_tV_ax_cont"],
  };

  const glIds = keywordMap[formulaId] || [];
  return glIds.map(id => GLOSSARY_BY_ID.get(id)!).filter(Boolean);
}
