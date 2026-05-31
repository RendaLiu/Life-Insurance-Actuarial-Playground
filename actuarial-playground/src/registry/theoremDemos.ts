// ============================================================
// 定理演示 — 每个结论/定理/公式的完整推导链
// IN → 中间量 → 定义定理 → 最终结果
// ============================================================

import type { PresetExample } from "./types";

type Pos = [number, number]
const IN = (id: string, fid: string, p: any, x: number, y: number, l?: string) =>
  ({ id, type: "input" as const, formulaId: fid, params: p, position: [x,y] as Pos, label: l })
const CP = (id: string, fid: string, p: any, x: number, y: number, l?: string) =>
  ({ id, type: "compute" as const, formulaId: fid, params: p, position: [x,y] as Pos, label: l })
const THM = (id: string, fid: string, x: number, y: number, l?: string) =>
  ({ id, type: "theorem" as const, formulaId: fid, params: {}, position: [x,y] as Pos, label: l })
const E = (f: string, t: string) => ({ from: f, to: t })

export const THEOREM_DEMOS: PresetExample[] = [

  // ════════════════════════════════════════════════════════
  // Ch1: 生存分布与生命表
  // ════════════════════════════════════════════════════════

  {
    id: "demo_de_moivre",
    chapter: 0, section: "例 1.2.1",
    title: "De Moivre 分布：f_X → F_X → s → μ 完整推导",
    sourceSlide: "chapter1_clean.md · 例 1.2.1",
    description: "已知 $f_X(t)=1/\\omega$。推导：$F_X(t)=\\int_0^t f_X=t/\\omega$，$s(t)=1-F_X=(\\omega-t)/\\omega$，$\\mu(t)=f_X/s=1/(\\omega-t)$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:100},60,100, "\\omega=100"),
      THM("thm_s","thm_de_moivre_s",330,60, "s(t)=\\frac{\\omega-t}{\\omega}"),
      THM("thm_mu","thm_de_moivre_mu",330,180, "\\mu(t)=\\frac{1}{\\omega-t}"),
      CP("s30","survival_s",{t:30},600,60, "s(30)=\\frac{70}{100}=0.7"),
      CP("mu30","mu_x_t",{t:30,x:0},600,180, "\\mu(30)=\\frac{1}{70}"),
    ],
    edges: [E("omega","thm_s"),E("thm_s","s30"),E("omega","thm_mu"),E("thm_mu","mu30")],
    expectedResults: {s30:0.7, mu30:1/70},
  },
  {
    id: "demo_mu_to_s",
    chapter: 0, section: "结论 1.2.1",
    title: "死亡力→生存分布：s(t)=exp(−∫μ) 的验证",
    sourceSlide: "chapter1_clean.md · 结论 1.2.1",
    description: "$s(t)=\\exp(-\\int_0^t\\mu(s)ds)$。已知 $\\mu(t)=1/(\\omega-t)$，积分得 $s(t)=(\\omega-t)/\\omega$。取 $t=30,\\omega=100$ 验证。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:100},60,100, "\\omega=100"),
      THM("thm_mu","thm_mu_def",330,50, "\\mu(t)=\\frac{f_X(t)}{s(t)}"),
      THM("thm_s","thm_s_from_mu",330,180, "s(t)=\\exp(-\\int_0^t\\mu)"),
      CP("s30","survival_s",{t:30},600,60, "s(30)=0.7"),
      CP("mu30","mu_x_t",{t:30,x:0},600,180, "\\mu(30)=1/70"),
    ],
    edges: [E("omega","thm_mu"),E("omega","thm_s"),E("thm_mu","mu30"),E("thm_s","s30")],
    expectedResults: {s30:0.7, mu30:1/70},
  },
  {
    id: "demo_complete_ex",
    chapter: 0, section: "结论 1.2.2",
    title: "完全平均余命：ė₀ = ∫ s(t) dt 完整推导",
    sourceSlide: "chapter1_clean.md · 结论 1.2.2",
    description: "$\\mathring{e}_0=\\int_0^\\infty s(t)dt$。De Moivre 下 $s(t)=(\\omega-t)/\\omega$，$\\mathring{e}_0=\\int_0^\\omega\\frac{\\omega-t}{\\omega}dt=\\omega/2$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:100},60,100, "\\omega=100"),
      THM("thm_s","thm_de_moivre_s",300,50, "s(t)=\\frac{\\omega-t}{\\omega}"),
      CP("st","survival_s",{t:30},550,50, "s(30)=0.7"),
      THM("thm_e0","thm_complete_ex_def",300,200, "\\mathring{e}_0 = \\int_0^{\\infty} s(t)dt"),
      CP("e0","complete_ex",{x:0},550,200, "\\mathring{e}_0=\\frac{100}{2}=50"),
    ],
    edges: [E("omega","thm_s"),E("thm_s","st"),E("thm_s","thm_e0"),E("thm_e0","e0")],
    expectedResults: {st:0.7, e0:50},
  },
  {
    id: "demo_tpx_def",
    chapter: 0, section: "结论 1.3.1",
    title: "_t p_x = s(x+t)/s(x) 推导与验证",
    sourceSlide: "chapter1_clean.md · 1.3.1",
    description: "${}_tp_x=s(x+t)/s(x)$。以 $s(x)=\\sqrt{1-x/100}$ 为例：$s(19),s(36),s(51),s(64)$ 是中间量。",
    nodes: [
      IN("surv","survival_s",{},60,160, "s(x)=\\sqrt{1-x/100}"),
      CP("s19","survival_s",{t:19},320,20, "s(19)=0.9"),
      CP("s36","survival_s",{t:36},320,90, "s(36)=0.8"),
      CP("s51","survival_s",{t:51},320,160, "s(51)=0.7"),
      CP("s64","survival_s",{t:64},320,230, "s(64)=0.6"),
      THM("thm_tpx","thm_tpx_def",560,90, "{}_tp_x = \\frac{s(x+t)}{s(x)}"),
      CP("tpx","t_px",{t:17,x:19},810,40, "{}_{17}p_{19}=\\frac{0.8}{0.9}=\\frac{8}{9}"),
      CP("tqx","t_qx",{t:15,x:36},810,140, "{}_{15}q_{36}=1-\\frac{0.7}{0.8}=\\frac{1}{8}"),
    ],
    edges: [
      E("surv","s19"),E("surv","s36"),E("surv","s51"),E("surv","s64"),
      E("s19","thm_tpx"),E("s36","thm_tpx"),E("thm_tpx","tpx"),
      E("s36","tqx"),E("s51","tqx"),
    ],
    expectedResults: {tpx:8/9, tqx:1/8},
  },
  {
    id: "demo_tpx_from_l",
    chapter: 0, section: "结论 1.5.1",
    title: "_t p_x = l_{x+t}/l_x 生命表计算",
    sourceSlide: "chapter1_clean.md · 结论 1.5.1",
    description: "${}_tp_x=l_{x+t}/l_x$。CL93M: $l_{20}=981140,l_{70}=687074,l_{100}=3911$。${}_{80}p_{20}=l_{100}/l_{20}=0.003986$。",
    nodes: [
      IN("cl93m","lx",{table:"CL93M"},60,120, "\\text{CL93M }l_x"),
      THM("thm","thm_tpx_from_l",330,50, "{}_tp_x = \\frac{l_{x+t}}{l_x}"),
      CP("l20","lx",{x:20},560,50, "l_{20}=981140"),
      CP("l70","lx",{x:70},560,130, "l_{70}=687074"),
      CP("l100","lx",{x:100},560,210, "l_{100}=3911"),
      CP("p80_20","t_px",{t:80,x:20},810,80, "{}_{80}p_{20}=\\frac{3911}{981140}=0.003986"),
      CP("q50_20","t_qx",{t:50,x:20},810,180, "{}_{50}q_{20}=1-\\frac{l_{70}}{l_{20}}=0.2997"),
    ],
    edges: [
      E("cl93m","thm"),E("cl93m","l20"),E("cl93m","l70"),E("cl93m","l100"),
      E("l20","p80_20"),E("l100","p80_20"),E("thm","p80_20"),
      E("l20","q50_20"),E("l70","q50_20"),
    ],
    expectedResults: {p80_20:0.003986, q50_20:0.29972},
  },
  {
    id: "demo_mortality_models",
    chapter: 0, section: "1.2 死亡力模型",
    title: "Gompertz / Makeham / Weibull 对比",
    sourceSlide: "chapter1_clean.md · 死亡力表",
    description: "Gompertz: $\\mu(t)=BC^t$。Makeham: $\\mu(t)=A+BC^t$。Weibull: $\\mu(t)=kt^n$。在 $t=50$ 处的值。",
    nodes: [
      IN("params","gompertz_mu",{B:0.0001,C:1.08},60,50, "B=0.0001,C=1.08"),
      THM("thm_g","thm_mu_def",350,50, "\\text{Gompertz }\\mu(t)=BC^t"),
      CP("gomp50","gompertz_mu",{B:0.0001,C:1.08,t:50},600,50, "\\mu_G(50)"),
      THM("thm_mk","thm_mu_def",350,170, "\\text{Makeham }\\mu(t)=A+BC^t"),
      CP("make50","makeham_mu",{A:0.001,B:0.0001,C:1.08,t:50},600,170, "\\mu_M(50)"),
      THM("thm_w","thm_mu_def",350,290, "\\text{Weibull }\\mu(t)=kt^n"),
      CP("weib50","weibull_mu",{k:0.001,n:1.5,t:50},600,290, "\\mu_W(50)"),
    ],
    edges: [
      E("params","thm_g"),E("thm_g","gomp50"),
      E("params","thm_mk"),E("thm_mk","make50"),
      E("params","thm_w"),E("thm_w","weib50"),
    ],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // Ch4: 保险现值
  // ════════════════════════════════════════════════════════

  {
    id: "demo_pure_endowment",
    chapter: 0, section: "结论 4.2.1",
    title: "生存保险 _nE_x = v^n·_n p_x 完整推导",
    sourceSlide: "chapter4_clean.md · 结论 4.2.1",
    description: "${}_3E_{20}=v^3\\cdot{}_3p_{20}$。$p_{20}=1-q_{20}=0.99,p_{21}=0.98,p_{22}=0.97$。${}_3p_{20}=p_{20}p_{21}p_{22}=0.9411$。$v^3=1.025^{-3}=0.9286$。",
    nodes: [
      IN("qx","lx",{l0:100000,qx:[0.01,0.02,0.03],start_age:20},60,280, "q_{20}=0.01,q_{21}=0.02,q_{22}=0.03"),
      IN("i","interest_rate",{i:0.025},60,50, "i=2.5\\%"),
      CP("p20","t_px",{t:1,x:20},300,220, "p_{20}=0.99"),
      CP("p21","t_px",{t:1,x:21},300,290, "p_{21}=0.98"),
      CP("p22","t_px",{t:1,x:22},300,360, "p_{22}=0.97"),
      CP("v","v_factor",{i:0.025,n:1},300,50, "v=1/1.025"),
      CP("v3","v_factor",{i:0.025,n:3},300,130, "v^3=0.9286"),
      THM("thm_npx","thm_tpx_def",540,290, "{}_3p_{20}=p_{20}p_{21}p_{22}"),
      CP("npx","t_px",{t:3,x:20},540,360, "=0.941094"),
      THM("thm_nEx","thm_pure_endowment",780,200, "{}_nE_x = v^n\\cdot{}_np_x"),
      CP("nEx","pure_endowment",{x:20,n:3,i:0.025},1040,200, "{}_3E_{20}=0.873899"),
    ],
    edges: [
      E("i","v"),E("i","v3"),
      E("qx","p20"),E("qx","p21"),E("qx","p22"),
      E("p20","thm_npx"),E("p21","thm_npx"),E("p22","thm_npx"),E("thm_npx","npx"),
      E("npx","thm_nEx"),E("v3","thm_nEx"),E("thm_nEx","nEx"),
    ],
    expectedResults: {p20:0.99,p21:0.98,p22:0.97,npx:0.941094,v3:0.928599,nEx:0.873899334},
  },
  {
    id: "demo_A_term_disc",
    chapter: 0, section: "结论 4.3.3",
    title: "离散定期寿险 A¹ = Σ v^{k+1}·_k p_x·q_{x+k}",
    sourceSlide: "chapter4_clean.md · 结论 4.3.3",
    description: "$A^1=vq_x+v^2p_xq_{x+1}$。$q_x=0.05,q_{x+1}=0.08,i=10\\%$。$v=1/1.1=0.9091$。$p_x=0.95$。",
    nodes: [
      IN("qx","t_qx",{values:[0.05,0.08]},60,60, "q_x=0.05,q_{x+1}=0.08"),
      IN("i","interest_rate",{i:0.10},60,220, "i=10\\%"),
      CP("v","v_factor",{i:0.10,n:1},310,180, "v=1/1.1"),
      CP("p","t_px",{t:1,x:0},310,270, "p_x=0.95"),
      THM("thm","thm_A_term_disc",550,130, "A^1 = \\sum v^{k+1}{}_kp_xq_{x+k}"),
      CP("A1","Ax_term_discrete",{x:0,n:2,i:0.10},820,130, "A^1=vq_x+v^2p_xq_{x+1}=0.1083"),
    ],
    edges: [
      E("i","v"),E("qx","p"),E("qx","thm"),E("v","thm"),E("p","thm"),E("thm","A1"),
    ],
    expectedResults: {A1:0.1083},
  },
  {
    id: "demo_A_term_cont",
    chapter: 0, section: "结论 4.3.1",
    title: "连续定期寿险 Ā¹ = ∫ v^t·_t p_x·μ_x(t) dt",
    sourceSlide: "chapter4_clean.md · 结论 4.3.1",
    description: "$\\overline{A}^1=\\frac{1}{80}\\int_0^{10}e^{-0.02s}ds=0.11329$。$T\\sim U(0,80),\\delta=0.02$。",
    nodes: [
      IN("dist","Tx",{distribution:"uniform",a:0,b:80},60,60, "T\\sim U(0,80)"),
      IN("i","interest_rate",{i:0.0202},60,220, "\\delta=0.02"),
      CP("mu","mu_x_t",{t:5,x:0},310,50, "\\mu(t)=\\frac{1}{80-t}"),
      CP("tpx","t_px",{t:5,x:0},310,140, "{}_tp_x=\\frac{80-t}{80}"),
      CP("delta","delta_factor",{i:0.0202},310,230, "\\delta=0.02"),
      THM("thm","thm_A_term_cont",560,120, "\\overline{A}^1 = \\int_0^n v^t{}_tp_x\\mu_x(t)dt"),
      CP("A1","Ax_term_continuous",{x:0,n:10,i:0.0202},830,120, "=0.11329"),
    ],
    edges: [
      E("dist","mu"),E("dist","tpx"),E("i","delta"),
      E("mu","thm"),E("tpx","thm"),E("delta","thm"),E("thm","A1"),
    ],
    expectedResults: {A1:0.11329},
  },
  {
    id: "demo_udd_relation",
    chapter: 0, section: "结论 4.3.4",
    title: "UDD 关系 Ā¹ = (i/δ)·A¹ 完整推导",
    sourceSlide: "chapter4_clean.md · 结论 4.3.4",
    description: "UDD 下 $\\overline{A}^1=\\frac{i}{\\delta}A^1$。$i=10\\%$，$d=0.0909$，$\\delta=0.0953$，$i/\\delta=1.0492$。",
    nodes: [
      IN("qx","t_qx",{values:[0.05,0.08]},60,60, "q_x=0.05,q_{x+1}=0.08"),
      IN("i","interest_rate",{i:0.10},60,380, "i=10\\%"),
      CP("v","v_factor",{i:0.10,n:1},300,320, "v=0.9091"),
      CP("d","d_factor",{i:0.10},300,410, "d=0.0909"),
      CP("delta","delta_factor",{i:0.10},300,500, "\\delta=0.0953"),
      CP("A1_d","Ax_term_discrete",{x:0,n:2,i:0.10},540,40, "A^1=0.1083"),
      THM("thm_udd","thm_udd_relation",540,240, "\\overline{A}^1 = \\frac{i}{\\delta}A^1\\ \\text{(UDD)}"),
      CP("A1_c","Ax_term_continuous",{x:0,n:2,i:0.10},810,130, "\\overline{A}^1=0.114"),
    ],
    edges: [
      E("i","v"),E("i","d"),E("i","delta"),
      E("qx","A1_d"),E("v","A1_d"),
      E("A1_d","thm_udd"),E("d","thm_udd"),E("delta","thm_udd"),E("thm_udd","A1_c"),
    ],
    expectedResults: {A1_d:0.1083, A1_c:0.114},
  },
  {
    id: "demo_constant_force_Ax",
    chapter: 0, section: "结论 4.4.1",
    title: "常数死亡力 Ā_x = μ/(μ+δ) 推导",
    sourceSlide: "chapter4_clean.md · 结论 4.4.1",
    description: "$\\mu,\\delta$ 常数时：$_tp_x=e^{-\\mu t}$，$v^t=e^{-\\delta t}$。$\\overline{A}_x=\\int_0^\\infty e^{-\\delta t}e^{-\\mu t}\\mu dt=\\frac{\\mu}{\\mu+\\delta}$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,260, "\\delta=0.06"),
      CP("tpx","t_px",{t:10,x:0},320,40, "{}_tp_x=e^{-\\mu t}"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},320,220, "\\delta=0.06"),
      THM("thm_def","thm_Ax_cont_def",560,40, "\\overline{A}_x = \\int v^t{}_tp_x\\mu_x dt"),
      THM("thm_cf","thm_constant_force_Ax",560,170, "= \\frac{\\mu}{\\mu+\\delta}"),
      CP("Ax","Ax_continuous",{x:0,i:Math.exp(0.06)-1},830,100, "=\\frac{0.04}{0.10}=0.4"),
    ],
    edges: [
      E("i","delta"),E("mu","tpx"),
      E("tpx","thm_def"),E("mu","thm_def"),E("delta","thm_def"),
      E("thm_def","thm_cf"),E("thm_cf","Ax"),
    ],
    expectedResults: {Ax:0.4},
  },
  {
    id: "demo_recurrence_Ax",
    chapter: 0, section: "结论 4.4.2",
    title: "递推公式 A_x = v·q_x + v·p_x·A_{x+1}",
    sourceSlide: "chapter4_clean.md · 结论 4.4.2",
    description: "$A_{76}=vq_{76}+vp_{76}A_{77}$。已知 $A_{76}=0.800,vp_{76}=0.9,i=3\\%$。$v=0.9709$，$vq_{76}=v-vp_{76}=0.0709$。",
    nodes: [
      IN("known","Ax_discrete",{A76:0.800,vp76:0.9,i:0.03},60,60, "A_{76}=0.800,\\ vp_{76}=0.9"),
      IN("i","interest_rate",{i:0.03},60,220, "i=3\\%"),
      CP("v","v_factor",{i:0.03,n:1},300,160, "v=0.9709"),
      CP("vq","v_factor",{i:0.03,n:1},300,250, "vq_{76}=v-vp_{76}=0.0709"),
      THM("thm","thm_recurrence_Ax",550,140, "A_x = vq_x + vp_x A_{x+1}"),
      CP("A77","Ax_discrete",{x:77,i:0.03},820,140, "A_{77}=\\frac{0.800-0.0709}{0.9}=0.810"),
    ],
    edges: [
      E("i","v"),E("i","vq"),E("known","vq"),E("v","vq"),
      E("known","thm"),E("vq","thm"),E("thm","A77"),
    ],
    expectedResults: {A77:0.810},
  },
  {
    id: "demo_endowment_decomp",
    chapter: 0, section: "结论 4.5.1",
    title: "生死合险分解 A_{x:n} = A¹_{x:n} + _nE_x",
    sourceSlide: "chapter4_clean.md · 结论 4.5.1",
    description: "生死合险 = 死亡保险 + 生存保险。验证 $A_{30:\\overline{3|}}=A^1_{30:\\overline{3|}}+{}_3E_{30}$。",
    nodes: [
      IN("qx","lx",{l0:100000,qx:[0.01,0.02,0.03],start_age:30},60,250, "q_{30}=0.01,q_{31}=0.02,q_{32}=0.03"),
      IN("i","interest_rate",{i:0.05},60,50, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},320,50, "v"),
      CP("A1","Ax_term_discrete",{x:30,n:3,i:0.05},560,40, "A^1_{30:\\overline{3|}}"),
      CP("nEx","pure_endowment",{x:30,n:3,i:0.05},560,150, "{}_3E_{30}"),
      THM("thm","thm_pure_endowment",800,90, "A_{x:n} = A^1_{x:n} + {}_nE_x"),
      CP("A_en","endowment_insurance_discrete",{x:30,n:3,i:0.05},1060,90, "A_{30:\\overline{3|}}"),
    ],
    edges: [
      E("i","v"),E("qx","A1"),E("v","A1"),E("qx","nEx"),E("v","nEx"),
      E("A1","thm"),E("nEx","thm"),E("thm","A_en"),
    ],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // Ch5: 年金现值
  // ════════════════════════════════════════════════════════

  {
    id: "demo_ax_cont_def",
    chapter: 0, section: "结论 5.3.1",
    title: "连续年金 ā_x = ∫ v^t·_t p_x dt",
    sourceSlide: "chapter5_clean.md · 结论 5.3.1",
    description: "$\\overline{a}_x=\\int_0^\\infty v^t\\cdot{}_tp_x dt$。常数力下 $_tp_x=e^{-\\mu t},v^t=e^{-\\delta t}$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,260, "\\delta=0.06"),
      CP("tpx","t_px",{t:10,x:0},320,40, "{}_tp_x=e^{-\\mu t}"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},320,220, "\\delta=0.06"),
      THM("thm_def","thm_ax_cont_def",560,40, "\\overline{a}_x = \\int v^t{}_tp_x dt"),
      THM("thm_cf","thm_ax_cont_cf",560,170, "= \\frac{1}{\\mu+\\delta}"),
      CP("ax","ax_continuous",{x:0,i:Math.exp(0.06)-1},830,100, "=\\frac{1}{0.10}=10"),
    ],
    edges: [
      E("i","delta"),E("mu","tpx"),
      E("tpx","thm_def"),E("delta","thm_def"),E("thm_def","thm_cf"),E("thm_cf","ax"),
    ],
    expectedResults: {ax:10},
  },
  {
    id: "demo_ax_due_disc",
    chapter: 0, section: "结论 5.4.1",
    title: "期初年金 ä_x = Σ v^k·_k p_x 完整推导",
    sourceSlide: "chapter5_clean.md · 结论 5.4.1",
    description: "$\\ddot{a}_{90}=1+v\\cdot{}_1p_{90}+v^2\\cdot{}_2p_{90}$。$l_{90}=100,l_{91}=72,l_{92}=39$。${}_1p_{90}=0.72,{}_2p_{90}=0.39$。",
    nodes: [
      IN("lx","lx",{l90:100,l91:72,l92:39,l93:0},60,280, "l_{90}=100,l_{91}=72,l_{92}=39"),
      IN("i","interest_rate",{i:0.06},60,50, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},300,50, "v=0.9434"),
      CP("v2","v_factor",{i:0.06,n:2},300,140, "v^2=0.8900"),
      THM("thm_p","thm_tpx_from_l",520,240, "{}_kp_{90}=\\frac{l_{90+k}}{l_{90}}"),
      CP("p1","t_px",{t:1,x:90},520,310, "{}_1p_{90}=0.72"),
      CP("p2","t_px",{t:2,x:90},520,380, "{}_2p_{90}=0.39"),
      THM("thm_a","thm_ax_due_disc",770,180, "\\ddot{a}_x = \\sum v^k{}_kp_x"),
      CP("ax","ax_due_discrete",{x:90,i:0.06},1040,180, "\\ddot{a}_{90}=2.026344"),
    ],
    edges: [
      E("i","v"),E("i","v2"),E("lx","thm_p"),
      E("thm_p","p1"),E("thm_p","p2"),
      E("v","thm_a"),E("v2","thm_a"),E("p1","thm_a"),E("p2","thm_a"),E("thm_a","ax"),
    ],
    expectedResults: {p1:0.72,p2:0.39,ax:2.026344},
  },
  {
    id: "demo_identity_disc",
    chapter: 0, section: "结论 5.5.3",
    title: "保险-年金恒等式 d·ä_x + A_x = 1",
    sourceSlide: "chapter5_clean.md · 恒等式",
    description: "$d\\cdot\\ddot{a}_x+A_x=1$。$i=5\\%,d=0.0476$。验算恒等式成立。",
    nodes: [
      IN("i","interest_rate",{i:0.05},60,120, "i=5\\%"),
      CP("d","d_factor",{i:0.05},300,60, "d=0.0476"),
      CP("ax","ax_due_discrete",{x:30,i:0.05},540,40, "\\ddot{a}_{30}"),
      CP("Ax","Ax_discrete",{x:30,i:0.05},540,150, "A_{30}"),
      THM("thm","thm_identity_disc",780,90, "d\\ddot{a}_x + A_x = 1"),
    ],
    edges: [E("i","d"),E("d","ax"),E("d","thm"),E("ax","thm"),E("Ax","thm")],
    expectedResults: {},
  },
  {
    id: "demo_certain_and_life",
    chapter: 0, section: "结论 5.3.6",
    title: "确定期+终身年金 ä_{x:n̄} = ä_{n̄|} + _{n|}ä_x",
    sourceSlide: "chapter5_clean.md · 结论 5.3.6",
    description: "前 $n$ 年确定给付 + $n$ 年后生存给付。$n=10,i=5\\%$。",
    nodes: [
      IN("i","interest_rate",{i:0.05},60,50, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},300,50, "v"),
      CP("an","v_factor",{i:0.05,n:10},540,40, "\\ddot{a}_{\\overline{10|}}=\\frac{1-v^{10}}{d}"),
      CP("def_ax","deferred_ax_due_discrete",{x:30,n:10,i:0.05},540,160, "{}_{10|}\\ddot{a}_{30}"),
      THM("thm","thm_ax_due_disc",780,100, "\\ddot{a}_{\\overline{x:\\overline{n|}}} = \\ddot{a}_{\\overline{n|}} + {}_{n|}\\ddot{a}_x"),
      CP("total","certain_and_life_ax_due",{x:30,n:10,i:0.05},1040,100, "\\ddot{a}_{\\overline{30:\\overline{10|}}}"),
    ],
    edges: [E("i","v"),E("i","an"),E("v","def_ax"),E("an","thm"),E("def_ax","thm"),E("thm","total")],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // Ch8: 净保费
  // ════════════════════════════════════════════════════════

  {
    id: "demo_net_premium_disc",
    chapter: 0, section: "结论 8.3.1",
    title: "离散净保费 P_x = A_x/ä_x 完整推导",
    sourceSlide: "chapter8_clean.md · 平衡准则",
    description: "$P_x=A_x/\\ddot{a}_x$。平衡准则 $E(L)=0$ 的必然结果。$P_x=1/\\ddot{a}_x-d=dA_x/(1-A_x)$。",
    nodes: [
      IN("i","interest_rate",{i:0.05},60,80, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},300,50, "v"),
      CP("d","d_factor",{i:0.05},300,150, "d"),
      CP("Ax","Ax_discrete",{x:30,i:0.05},540,40, "A_{30}"),
      CP("ax","ax_due_discrete",{x:30,i:0.05},540,150, "\\ddot{a}_{30}"),
      THM("thm","thm_net_premium",780,90, "P_x = \\frac{A_x}{\\ddot{a}_x}"),
      CP("Px","Px_discrete",{x:30,i:0.05},1040,90, "P_{30}"),
    ],
    edges: [E("i","v"),E("i","d"),E("v","Ax"),E("v","ax"),E("Ax","thm"),E("ax","thm"),E("thm","Px")],
    expectedResults: {},
  },
  {
    id: "demo_net_premium_cont",
    chapter: 0, section: "结论 8.4.1",
    title: "连续净保费 P̄ = Ā_x/ā_x = μ 三段推导",
    sourceSlide: "chapter8_clean.md · 结论 8.4.1",
    description: "常数力下：$\\overline{A}_x=\\mu/(\\mu+\\delta)$，$\\overline{a}_x=1/(\\mu+\\delta)$，$\\overline{P}=\\overline{A}_x/\\overline{a}_x=\\mu$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,400, "\\delta=0.06"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},300,360, "\\delta=0.06"),
      THM("thm_Ax","thm_constant_force_Ax",540,30, "\\overline{A}_x = \\frac{\\mu}{\\mu+\\delta}"),
      CP("Ax","Ax_continuous",{x:0,i:Math.exp(0.06)-1},810,30, "=0.4"),
      THM("thm_ax","thm_ax_cont_cf",540,140, "\\overline{a}_x = \\frac{1}{\\mu+\\delta}"),
      CP("ax","ax_continuous",{x:0,i:Math.exp(0.06)-1},810,140, "=10"),
      THM("thm_P","thm_net_premium_cont",540,280, "\\overline{P} = \\frac{\\overline{A}_x}{\\overline{a}_x}"),
      CP("Pbar","Px_continuous",{x:0,i:Math.exp(0.06)-1},810,280, "=\\mu=0.04"),
    ],
    edges: [
      E("i","delta"),E("mu","thm_Ax"),E("delta","thm_Ax"),E("thm_Ax","Ax"),
      E("mu","thm_ax"),E("delta","thm_ax"),E("thm_ax","ax"),
      E("Ax","thm_P"),E("ax","thm_P"),E("thm_P","Pbar"),
    ],
    expectedResults: {Ax:0.4,ax:10,Pbar:0.04},
  },

  // ════════════════════════════════════════════════════════
  // Ch10-12: 准备金
  // ════════════════════════════════════════════════════════

  {
    id: "demo_prospective_reserve",
    chapter: 0, section: "定理 10.3.1",
    title: "将来法准备金 _kV = A_{x+k}−P·ä_{x+k}",
    sourceSlide: "chapter10_clean.md · 定理 10.3.1",
    description: "${}_kV_x = A_{x+k} - P_x\\cdot\\ddot{a}_{x+k}$。先算 $A_{30},P_{30}$，再算 ${}_5V_{30}$。De Moivre ω=100,i=5%。",
    nodes: [
      IN("demoivre","de_moivre_mu",{omega:100},60,300, "\\omega=100"),
      IN("i","interest_rate",{i:0.05},60,50, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},300,50, "v"),
      CP("Ax30","Ax_discrete",{x:30,i:0.05},540,40, "A_{30}"),
      CP("ax30","ax_due_discrete",{x:30,i:0.05},540,130, "\\ddot{a}_{30}"),
      CP("P30","Px_discrete",{x:30,i:0.05},540,220, "P_{30}=A_{30}/\\ddot{a}_{30}"),
      THM("thm","thm_prospective_reserve",790,130, "{}_kV = A_{x+k} - P\\ddot{a}_{x+k}"),
      CP("V5","kVx_discrete",{x:30,k:5,i:0.05},1060,130, "{}_5V_{30}"),
    ],
    edges: [
      E("i","v"),E("demoivre","Ax30"),E("v","Ax30"),E("demoivre","ax30"),E("v","ax30"),
      E("Ax30","P30"),E("ax30","P30"),
      E("Ax30","thm"),E("P30","thm"),E("thm","V5"),
    ],
    expectedResults: {},
  },
  {
    id: "demo_fackler",
    chapter: 0, section: "定理 11.4.1",
    title: "Fackler 递推 _{k+1}V = ((_kV+P)(1+i)−q)/p",
    sourceSlide: "chapter11_clean.md · 定理 11.4.1",
    description: "${}_0V=0$，递推：${}_1V=((0+P)(1+i)-q_x)/p_x$，${}_2V=(({}_1V+P)(1+i)-q_{x+1})/p_{x+1}$。",
    nodes: [
      IN("demoivre","de_moivre_mu",{omega:100},60,250, "\\omega=100"),
      IN("i","interest_rate",{i:0.05},60,50, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},300,50, "v"),
      CP("P","Px_discrete",{x:30,i:0.05},530,50, "P_{30}"),
      CP("q30","t_qx",{t:1,x:30},530,140, "q_{30}"),
      CP("p30","t_px",{t:1,x:30},530,230, "p_{30}"),
      THM("thm","thm_fackler",770,130, "{}_{k+1}V = \\frac{({}_kV+P)(1+i)-q}{p}"),
      CP("V1","kVx_discrete",{x:30,k:1,i:0.05},1040,50, "{}_1V"),
      CP("V2","kVx_discrete",{x:30,k:2,i:0.05},1040,210, "{}_2V"),
    ],
    edges: [
      E("i","v"),E("demoivre","P"),E("v","P"),
      E("demoivre","q30"),E("demoivre","p30"),
      E("P","thm"),E("q30","thm"),E("p30","thm"),E("v","thm"),
      E("thm","V1"),E("V1","V2"),
    ],
    expectedResults: {},
  },
  {
    id: "demo_hattendorf",
    chapter: 0, section: "定理 10.5.1",
    title: "Hattendorf 定理：Var(_hL) = Σ v^{2(j−h)}·Var(Λ_j) — 以 h=0 为例",
    sourceSlide: "chapter10_clean.md · 定理 10.5.1",
    description: "De Moivre ω=100,x=30,i=5%,保额b=1。推导：_0V=0 → P → _1V(Fackler) → Λ₀ → Var(Λ₀) → Hattendorf 求和。展示 Λ_h 的死亡路径与生存路径分解。",
    nodes: [
      IN("demoivre","de_moivre_mu",{omega:100},60,60, "\\omega=100\\ (x=30)"),
      IN("i","interest_rate",{i:0.05},60,480, "i=5\\%"),
      // 基础量
      CP("q30","t_qx",{t:1,x:30},300,50, "q_{30}"),
      CP("p30","t_px",{t:1,x:30},300,140, "p_{30}=1-q_{30}"),
      CP("v","v_factor",{i:0.05,n:1},300,420, "v=1/1.05"),
      CP("d","d_factor",{i:0.05},300,510, "d=i/(1+i)"),
      // 保费
      CP("A30","Ax_discrete",{x:30,i:0.05},540,40, "A_{30}"),
      CP("ax30","ax_due_discrete",{x:30,i:0.05},540,130, "\\ddot{a}_{30}"),
      THM("thm_P","thm_net_premium",540,240, "P = \\frac{A}{\\ddot{a}}"),
      CP("P30","Px_discrete",{x:30,i:0.05},780,40, "P_{30}"),
      // Fackler → _1V
      THM("thm_fackler","thm_fackler",780,160, "{}_{1}V = \\frac{(0+P)(1+i)-q_{30}}{p_{30}}"),
      CP("V1","kVx_discrete",{x:30,k:1,i:0.05},1040,40, "{}_1V"),
      // Λ₀ 分解
      THM("thm_lambda","thm_lambda_h",780,300, "\\Lambda_0 = v(1-{}_1V)I(K=0) - (P-v{}_1V)I(K\\ge 0)"),
      CP("death_term","v_factor",{i:0.05,n:1},1040,260, "v(1-{}_1V)\\ \\text{(死亡项)}"),
      CP("surv_term","v_factor",{i:0.05,n:1},1040,350, "-(P-v{}_1V)\\ \\text{(生存项)}"),
      // Var(Λ₀)
      THM("thm_varL","thm_var_lambda",1040,430, "\\mathrm{Var}(\\Lambda_0) = (\\text{death})^2\\cdot q + (\\text{surv})^2\\cdot p"),
      // Hattendorf 总方差
      THM("thm_hatt","thm_hattendorf",1280,200, "\\mathrm{Var}({}_0L) = \\sum v^{2j}\\mathrm{Var}(\\Lambda_j)"),
      CP("total_var","hattendorf",{x:30,h:0,i:0.05},1540,200, "\\mathrm{Var}({}_0L)"),
    ],
    edges: [
      E("i","v"),E("i","d"),
      E("demoivre","q30"),E("demoivre","p30"),
      E("demoivre","A30"),E("v","A30"),
      E("demoivre","ax30"),E("v","ax30"),
      E("A30","thm_P"),E("ax30","thm_P"),E("thm_P","P30"),
      E("P30","thm_fackler"),E("q30","thm_fackler"),E("p30","thm_fackler"),E("v","thm_fackler"),
      E("thm_fackler","V1"),
      E("V1","thm_lambda"),E("P30","thm_lambda"),E("v","thm_lambda"),
      E("thm_lambda","death_term"),E("thm_lambda","surv_term"),
      E("death_term","thm_varL"),E("surv_term","thm_varL"),E("q30","thm_varL"),E("p30","thm_varL"),
      E("thm_varL","thm_hatt"),E("v","thm_hatt"),
      E("thm_hatt","total_var"),
    ],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // 工具公式
  // ════════════════════════════════════════════════════════

  {
    id: "demo_v_d_delta",
    chapter: 0, section: "利率转换",
    title: "i → v, d, δ 三要素转换",
    sourceSlide: "基础公式",
    description: "$v=\\frac{1}{1+i}$，$d=\\frac{i}{1+i}$，$\\delta=\\ln(1+i)$。三者满足 $v=1-d=e^{-\\delta}$。",
    nodes: [
      IN("i","interest_rate",{i:0.05},60,120, "i=5\\%"),
      THM("thm_v","thm_pure_endowment",340,30, "v = \\frac{1}{1+i}"),
      CP("v","v_factor",{i:0.05,n:1},600,30, "=0.9524"),
      THM("thm_d","thm_identity_disc",340,130, "d = \\frac{i}{1+i} = 1-v"),
      CP("d","d_factor",{i:0.05},600,130, "=0.0476"),
      THM("thm_delta","thm_identity_disc",340,230, "\\delta = \\ln(1+i)"),
      CP("delta","delta_factor",{i:0.05},600,230, "=0.0488"),
    ],
    edges: [E("i","thm_v"),E("thm_v","v"),E("i","thm_d"),E("thm_d","d"),E("i","thm_delta"),E("thm_delta","delta")],
    expectedResults: {v:0.95238,d:0.047619},
  },
];
