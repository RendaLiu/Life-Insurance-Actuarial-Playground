// ============================================================
// 课件例题预设工作流 — 完整推导链（定理节点 + 中间量 + 具体标签）
// ============================================================

import type { PresetExample } from "./types";
import { THEOREM_DEMOS } from "./theoremDemos";

type Pos = [number, number]
const IN = (id: string, fid: string, p: any, x: number, y: number, l?: string) =>
  ({ id, type: "input" as const, formulaId: fid, params: p, position: [x,y] as Pos, label: l })
const CP = (id: string, fid: string, p: any, x: number, y: number, l?: string) =>
  ({ id, type: "compute" as const, formulaId: fid, params: p, position: [x,y] as Pos, label: l })
const THM = (id: string, fid: string, x: number, y: number, l?: string) =>
  ({ id, type: "theorem" as const, formulaId: fid, params: {}, position: [x,y] as Pos, label: l })
const E = (f: string, t: string) => ({ from: f, to: t })

export const ALL_PRESETS: PresetExample[] = [

  // ════════════════════════════════════════════════════════
  // 第一章：生存分布与生命表
  // ════════════════════════════════════════════════════════

  {
    id: "ch1_ex_1_2_1", chapter: 1, section: "1.2 生存分布",
    title: "例1.2.1：De Moivre 的 s(t) 和 μ(t)",
    sourceSlide: "chapter1 PPTX Slide 11",
    description: "$f_X(t)=1/\\omega$。$F_X(t)=\\int_0^t f_X=t/\\omega$。$s(t)=1-F_X=(\\omega-t)/\\omega$。$\\mu(t)=f_X/s=1/(\\omega-t)$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:100},60,100, "\\omega=100"),
      THM("thm_s","thm_de_moivre_s",330,50, "s(t)=\\frac{\\omega-t}{\\omega}"),
      THM("thm_mu","thm_de_moivre_mu",330,180, "\\mu(t)=\\frac{1}{\\omega-t}"),
      CP("s30","survival_s",{t:30},600,50, "s(30)=\\frac{70}{100}=0.7"),
      CP("mu30","mu_x_t",{t:30,x:0},600,180, "\\mu(30)=\\frac{1}{70}"),
    ],
    edges: [E("omega","thm_s"),E("thm_s","s30"),E("omega","thm_mu"),E("thm_mu","mu30")],
    expectedResults: {s30:0.7, mu30:1/70},
  },
  {
    id: "ch1_ex_1_2_2", chapter: 1, section: "1.2 生存分布",
    title: "例1.2.2：指数分布的死亡力",
    sourceSlide: "chapter1 PPTX Slide 15",
    description: "$s(t)=e^{-\\lambda t}$。$\\mu(t)=-s'(t)/s(t)=\\lambda e^{-\\lambda t}/e^{-\\lambda t}=\\lambda$。",
    nodes: [
      IN("lambda","survival_s",{t:10},60,100, "s(t)=e^{-\\lambda t}"),
      THM("thm","thm_mu_def",330,50, "\\mu(t)=-\\frac{s'(t)}{s(t)}"),
      CP("mu","mu_t",{},600,50, "\\mu(t)=\\lambda\\ (\\text{常数})"),
    ],
    edges: [E("lambda","thm"),E("thm","mu")],
    expectedResults: {},
  },
  {
    id: "ch1_ex_1_2_3", chapter: 1, section: "1.2 生存分布",
    title: "例1.2.3：De Moivre 的 ė₀ 和 E(X²)",
    sourceSlide: "chapter1 PPTX Slide 25",
    description: "$f_X(t)=1/\\omega$。$s(t)=(\\omega-t)/\\omega$。$\\mathring{e}_0=\\int_0^\\omega s(t)dt=\\omega/2$。$E(X^2)=\\int_0^\\omega 2t\\cdot s(t)dt=\\omega^2/3$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:100},60,100, "\\omega=100"),
      THM("thm_s","thm_de_moivre_s",300,40, "s(t)=\\frac{\\omega-t}{\\omega}"),
      THM("thm_e0","thm_complete_ex_def",300,150, "\\mathring{e}_0 = \\int_0^{\\infty} s(t)dt"),
      CP("e0","complete_ex",{x:0},570,90, "\\mathring{e}_0=\\frac{100}{2}=50"),
    ],
    edges: [E("omega","thm_s"),E("thm_s","thm_e0"),E("thm_e0","e0")],
    expectedResults: {e0:50},
  },
  {
    id: "ch1_ex_1_3_3", chapter: 1, section: "1.3 x岁个体的生存分布",
    title: "例1.3.3：s(x)=√(1−x/100) 计算概率",
    sourceSlide: "chapter1 PPTX Slide 59",
    description: "$s(x)=(1-x/100)^{1/2}$。${}_tp_x=s(x+t)/s(x)$。${}_tq_x=1-{}_tp_x$。${}_{u|t}q_x={}_up_x\\cdot{}_tq_{x+u}$。",
    nodes: [
      IN("surv","survival_s",{},60,200, "s(x)=\\sqrt{1-x/100}"),
      CP("s19","survival_s",{t:19},340,20, "s(19)=\\sqrt{0.81}=0.9"),
      CP("s36","survival_s",{t:36},340,90, "s(36)=\\sqrt{0.64}=0.8"),
      CP("s51","survival_s",{t:51},340,160, "s(51)=\\sqrt{0.49}=0.7"),
      CP("s64","survival_s",{t:64},340,230, "s(64)=\\sqrt{0.36}=0.6"),
      THM("thm_tpx","thm_tpx_def",600,60, "{}_tp_x = \\frac{s(x+t)}{s(x)}"),
      CP("tpx","t_px",{t:17,x:19},870,20, "{}_{17}p_{19}=\\frac{s(36)}{s(19)}=\\frac{8}{9}"),
      CP("tqx","t_qx",{t:15,x:36},870,100, "{}_{15}q_{36}=1-\\frac{s(51)}{s(36)}=\\frac{1}{8}"),
      CP("utqx","u_given_t_qx",{u:15,t:13,x:36},870,180, "{}_{15|13}q_{36}=\\frac{1}{8}"),
    ],
    edges: [
      E("surv","s19"),E("surv","s36"),E("surv","s51"),E("surv","s64"),
      E("s19","thm_tpx"),E("s36","thm_tpx"),E("thm_tpx","tpx"),
      E("s36","tqx"),E("s51","tqx"),
      E("s36","utqx"),E("s51","utqx"),E("s64","utqx"),
    ],
    expectedResults: {tpx:8/9, tqx:1/8, utqx:1/8},
  },
  {
    id: "ch1_ex_1_4_1", chapter: 1, section: "1.4 随机生存群",
    title: "例1.4.1：l_x=1000(ω²−x²) 求 ė₀",
    sourceSlide: "chapter1 PPTX Slide 83",
    description: "$l_x=1000(\\omega^2-x^2)$。$s(x)=l_x/l_0$。$\\mathring{e}_0=\\int_0^\\omega s(x)dx=2\\omega/3$。",
    nodes: [
      IN("lx","lx",{x:0},60,100, "l_x=1000(\\omega^2-x^2)"),
      THM("thm","thm_complete_ex_x",350,100, "\\mathring{e}_0 = \\int s(x)dx"),
      CP("e0","complete_ex",{x:0},620,100, "\\mathring{e}_0=\\frac{2\\omega}{3}"),
    ],
    edges: [E("lx","thm"),E("thm","e0")],
    expectedResults: {},
  },
  {
    id: "ch1_ex_1_4_4", chapter: 1, section: "1.4 随机生存群",
    title: "例1.4.4：两个子群体生存概率",
    sourceSlide: "chapter1 PPTX Slide 97",
    description: "A(1600新生儿)+B(540个10岁)。$l_0=40,l_{10}=39,l_{70}=26$。${}_{70}p_0=l_{70}/l_0=26/40$。${}_{60}p_{10}=l_{70}/l_{10}=26/39$。",
    nodes: [
      IN("lt","lx",{},60,120, "l_0=40,l_{10}=39,l_{70}=26"),
      THM("thm","thm_tpx_from_l",340,50, "{}_tp_x = \\frac{l_{x+t}}{l_x}"),
      CP("tp70","t_px",{t:70,x:0},600,50, "{}_{70}p_0=\\frac{26}{40}=0.65"),
      CP("tp60","t_px",{t:60,x:10},600,150, "{}_{60}p_{10}=\\frac{26}{39}=0.667"),
    ],
    edges: [E("lt","thm"),E("thm","tp70"),E("thm","tp60")],
    expectedResults: {tp70:26/40, tp60:26/39},
  },
  {
    id: "ch1_ex_1_5_2", chapter: 1, section: "1.5 生命表",
    title: "例1.5.2：CL93M 计算 _tp_x 和 _tq_x",
    sourceSlide: "chapter1 PPTX Slide 129",
    description: "CL93M：$l_{20}=981140,l_{70}=687074,l_{100}=3911$。${}_{80}p_{20}=l_{100}/l_{20}=0.003986$。${}_{50}q_{20}=1-l_{70}/l_{20}=0.29972$。",
    nodes: [
      IN("cl93m","lx",{table:"CL93M"},60,120, "\\text{CL93M 生命表}"),
      THM("thm_p","thm_tpx_from_l",340,50, "{}_tp_x = \\frac{l_{x+t}}{l_x}"),
      THM("thm_q","thm_tpx_def",340,180, "{}_tq_x = 1-{}_tp_x"),
      CP("p80","t_px",{t:80,x:20},610,50, "{}_{80}p_{20}=\\frac{l_{100}}{l_{20}}=0.003986"),
      CP("q50","t_qx",{t:50,x:20},610,180, "{}_{50}q_{20}=1-\\frac{l_{70}}{l_{20}}=0.2997"),
    ],
    edges: [E("cl93m","thm_p"),E("thm_p","p80"),E("cl93m","thm_q"),E("thm_q","q50"),E("thm_p","q50")],
    expectedResults: {p80:0.003986, q50:0.29972},
  },

  // ════════════════════════════════════════════════════════
  // 第四章：保险现值
  // ════════════════════════════════════════════════════════

  {
    id: "ch4_ex_4_2_2", chapter: 4, section: "4.2 生存保险",
    title: "例4.2.2：3年期生存保险 — 完整推导",
    sourceSlide: "chapter4 PPTX Slide 13",
    description: "20岁,3年期,保额1000,1000人。$q_{20}=0.01,q_{21}=0.02,q_{22}=0.03,i=2.5\\%$。$p_x=1-q_x$。${}_3p_{20}=p_{20}p_{21}p_{22}$。$v^3=1.025^{-3}$。${}_3E_{20}=v^3\\cdot{}_3p_{20}$。",
    nodes: [
      IN("qx","lx",{l0:100000,qx:[0.01,0.02,0.03],start_age:20},60,330, "q_{20}=0.01,q_{21}=0.02,q_{22}=0.03"),
      IN("i","interest_rate",{i:0.025},60,50, "i=2.5\\%"),
      CP("p20","t_px",{t:1,x:20},310,250, "p_{20}=1-0.01=0.99"),
      CP("p21","t_px",{t:1,x:21},310,320, "p_{21}=1-0.02=0.98"),
      CP("p22","t_px",{t:1,x:22},310,390, "p_{22}=1-0.03=0.97"),
      CP("v","v_factor",{i:0.025,n:1},310,50, "v=1/1.025=0.9756"),
      CP("v3","v_factor",{i:0.025,n:3},310,140, "v^3=0.9286"),
      THM("thm_npx","thm_tpx_def",560,310, "{}_3p_{20}=p_{20}p_{21}p_{22}"),
      CP("npx","t_px",{t:3,x:20},560,390, "=0.941094"),
      THM("thm_nEx","thm_pure_endowment",810,220, "{}_nE_x = v^n\\cdot{}_np_x"),
      CP("nEx","pure_endowment",{x:20,n:3,i:0.025},1070,220, "{}_3E_{20}=0.873899"),
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
    id: "ch4_ex_4_3_1", chapter: 4, section: "4.3 定期死亡保险",
    title: "例4.3.1：均匀分布 Ā¹_{x:10}",
    sourceSlide: "chapter4 PPTX Slide 19",
    description: "$T\\sim U(0,80),\\delta=0.02$。$\\mu_x(t)=1/(80-t),{}_tp_x=(80-t)/80$。$\\overline{A}^1=\\frac{1}{80}\\int_0^{10}e^{-0.02s}ds=0.11329$。",
    nodes: [
      IN("dist","Tx",{distribution:"uniform",a:0,b:80},60,60, "T\\sim U(0,80)"),
      IN("i","interest_rate",{i:0.0202},60,280, "\\delta=0.02"),
      CP("mu","mu_x_t",{t:5,x:0},320,50, "\\mu_x(t)=\\frac{1}{80-t}"),
      CP("tpx","t_px",{t:5,x:0},320,150, "{}_tp_x=\\frac{80-t}{80}"),
      CP("delta","delta_factor",{i:0.0202},320,250, "\\delta=0.02"),
      THM("thm","thm_A_term_cont",580,110, "\\overline{A}^1 = \\int_0^n v^t{}_tp_x\\mu_x dt"),
      CP("A1","Ax_term_continuous",{x:0,n:10,i:0.0202},850,110, "=0.11329"),
    ],
    edges: [
      E("dist","mu"),E("dist","tpx"),E("i","delta"),
      E("mu","thm"),E("tpx","thm"),E("delta","thm"),E("thm","A1"),
    ],
    expectedResults: {A1:0.11329},
  },
  {
    id: "ch4_ex_4_3_3", chapter: 4, section: "4.3 定期死亡保险",
    title: "例4.3.3：方差法求 q_{x+1}",
    sourceSlide: "chapter4 PPTX Slide 33",
    description: "$i=0(v=1),\\mathrm{Var}(Z)=0.1771,q_x=0.50$。$P(Z=1)=q_x+p_xq_{x+1}$。$\\mathrm{Var}=P(Z=1)P(Z=0)$。解出 $q_{x+1}=0.54$。",
    nodes: [
      IN("qx","t_qx",{values:[0.50]},60,60, "q_x=0.50"),
      IN("i","interest_rate",{i:0},60,220, "i=0\\ (v=1)"),
      CP("v","v_factor",{i:0,n:1},310,220, "v=1"),
      CP("px","t_px",{t:1,x:0},310,310, "p_x=0.50"),
      THM("thm","thm_A_term_disc",560,140, "A^1 = vq_x + v^2p_xq_{x+1}"),
      CP("A1","Ax_term_discrete",{x:0,n:2,i:0},830,140, "A^1 = q_x + p_xq_{x+1}"),
    ],
    edges: [E("i","v"),E("qx","px"),E("qx","thm"),E("px","thm"),E("v","thm"),E("thm","A1")],
    expectedResults: {},
  },
  {
    id: "ch4_ex_4_3_5", chapter: 4, section: "4.3 定期死亡保险",
    title: "例4.3.5：变额寿险 P(Z≥1.5)",
    sourceSlide: "chapter4 PPTX Slide 39",
    description: "保额[1,2,3],q=[0.2,0.25,0.4],v=0.9。$Z=vI(K=0)+2v^2I(K=1)+3v^3I(K=2)$。$2v^2=1.62,3v^3=2.187$。$P(Z\\ge1.5)=0.44$。",
    nodes: [
      IN("qx","t_qx",{values:[0.2,0.25,0.4]},60,60, "q_x=0.2,q_{x+1}=0.25,q_{x+2}=0.4"),
      IN("i","interest_rate",{i:1/0.9-1},60,260, "v=0.9"),
      CP("v","v_factor",{i:1/0.9-1,n:1},310,200, "v=0.9"),
      CP("v2","v_factor",{i:1/0.9-1,n:2},310,290, "2v^2=1.62"),
      CP("v3","v_factor",{i:1/0.9-1,n:3},310,380, "3v^3=2.187"),
      CP("Z","Ax_term_discrete",{x:0,n:3,i:1/0.9-1},580,180, "Z \\text{ 的分布}"),
      CP("prob","Ax_term_discrete",{x:0,n:3,i:1/0.9-1},850,180, "P(Z\\ge1.5)=0.44"),
    ],
    edges: [E("i","v"),E("i","v2"),E("i","v3"),E("qx","Z"),E("v","Z"),E("Z","prob")],
    expectedResults: {},
  },
  {
    id: "ch4_ex_4_3_7", chapter: 4, section: "4.3 定期死亡保险",
    title: "例4.3.7：UDD 下 A¹ → Ā¹ 转换",
    sourceSlide: "chapter4 PPTX Slide 53",
    description: "$i=0.10,q_x=0.05,q_{x+1}=0.08$。$A^1=vq_x+v^2p_xq_{x+1}=0.1083$。UDD: $\\overline{A}^1=\\frac{i}{\\delta}A^1=0.114$。",
    nodes: [
      IN("qx","t_qx",{values:[0.05,0.08]},60,60, "q_x=0.05,q_{x+1}=0.08"),
      IN("i","interest_rate",{i:0.10},60,420, "i=10\\%"),
      CP("v","v_factor",{i:0.10,n:1},310,360, "v=0.9091"),
      CP("d","d_factor",{i:0.10},310,450, "d=0.0909"),
      CP("delta","delta_factor",{i:0.10},310,540, "\\delta=0.0953"),
      CP("px","t_px",{t:1,x:0},540,50, "p_x=0.95"),
      CP("A1_d","Ax_term_discrete",{x:0,n:2,i:0.10},540,140, "A^1=vq_x+v^2p_xq_{x+1}=0.1083"),
      THM("thm","thm_udd_relation",810,120, "\\overline{A}^1 = \\frac{i}{\\delta}A^1"),
      CP("A1_c","Ax_term_continuous",{x:0,n:2,i:0.10},1080,120, "=0.114"),
    ],
    edges: [
      E("i","v"),E("i","d"),E("i","delta"),
      E("qx","px"),E("qx","A1_d"),E("v","A1_d"),E("px","A1_d"),
      E("A1_d","thm"),E("d","thm"),E("delta","thm"),E("thm","A1_c"),
    ],
    expectedResults: {A1_d:0.1083, A1_c:0.114},
  },
  {
    id: "ch4_ex_4_4_1", chapter: 4, section: "4.4 终身死亡保险",
    title: "例4.4.1：常数死亡力 Ā_x + CLT",
    sourceSlide: "chapter4 PPTX Slide 65",
    description: "$\\mu=0.04,\\delta=0.06$,1000人。$\\overline{A}_x=\\frac{\\mu}{\\mu+\\delta}=0.4$。${}^2\\overline{A}_x=\\frac{\\mu}{\\mu+2\\delta}=0.25$。$\\mathrm{Var}=0.09$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,280, "\\delta=0.06"),
      CP("tpx","t_px",{t:10,x:0},310,50, "{}_tp_x=e^{-\\mu t}"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},310,240, "\\delta=0.06"),
      THM("thm","thm_constant_force_Ax",570,110, "\\overline{A}_x = \\frac{\\mu}{\\mu+\\delta}"),
      CP("Ax","Ax_continuous",{x:0,i:Math.exp(0.06)-1},840,110, "=\\frac{0.04}{0.10}=0.4"),
    ],
    edges: [
      E("i","delta"),E("mu","tpx"),
      E("tpx","thm"),E("mu","thm"),E("delta","thm"),E("thm","Ax"),
    ],
    expectedResults: {Ax:0.4},
  },
  {
    id: "ch4_ex_4_4_4", chapter: 4, section: "4.4 终身死亡保险",
    title: "例4.4.4：递推求 A₇₇",
    sourceSlide: "chapter4 PPTX Slide 87",
    description: "$A_{76}=0.800,vp_{76}=0.9,i=3\\%$。$v=0.9709$。$vq_{76}=v-vp_{76}=0.0709$。$A_{77}=(A_{76}-vq_{76})/(vp_{76})=0.810$。",
    nodes: [
      IN("known","Ax_discrete",{A76:0.800,vp76:0.9,i:0.03},60,60, "A_{76}=0.800,\\ vp_{76}=0.9"),
      IN("i","interest_rate",{i:0.03},60,240, "i=3\\%"),
      CP("v","v_factor",{i:0.03,n:1},310,180, "v=0.9709"),
      CP("vq","v_factor",{i:0.03,n:1},310,270, "vq_{76}=v-vp_{76}=0.0709"),
      THM("thm","thm_recurrence_Ax",570,140, "A_{76} = vq_{76} + vp_{76}A_{77}"),
      CP("A77","Ax_discrete",{x:77,i:0.03},840,140, "A_{77}=\\frac{0.800-0.0709}{0.9}=0.810"),
    ],
    edges: [E("i","v"),E("i","vq"),E("known","vq"),E("v","vq"),E("known","thm"),E("vq","thm"),E("thm","A77")],
    expectedResults: {A77:0.810},
  },
  {
    id: "ch4_ex_4_5_1", chapter: 4, section: "4.5 生死合险",
    title: "例4.5.1：De Moivre 特殊生死合险",
    sourceSlide: "chapter4 PPTX Slide 115",
    description: "60岁,死亡金[100,200,200],生存金200,ω=70,i=0。$q_{60}=q_{61}=q_{62}=0.1$。$E(Z)=190,\\mathrm{Var}=900$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:70},60,60, "\\omega=70\\ (q_x=0.1)"),
      IN("benefits","t_qx",{death:[100,200,200],survival:200},60,220, "b=[100,200,200],\\ \\text{生存金}=200"),
      CP("q60","t_qx",{t:1,x:60},330,50, "q_{60}=0.1"),
      CP("p60","t_px",{t:1,x:60},330,140, "p_{60}=0.9"),
      THM("thm","thm_endowment_decomp",590,100, "E(Z)=\\sum b_k\\cdot{}_kp_x\\cdot q_{x+k}+S\\cdot{}_3p_x"),
      CP("EZ","endowment_insurance_discrete",{x:60,n:3,i:0},860,100, "E(Z)=190"),
    ],
    edges: [
      E("omega","q60"),E("omega","p60"),
      E("q60","thm"),E("p60","thm"),E("benefits","thm"),E("thm","EZ"),
    ],
    expectedResults: {},
  },
  {
    id: "ch4_ex_4_5_4", chapter: 4, section: "4.5 生死合险",
    title: "例4.5.4：5年期生死合险方差",
    sourceSlide: "chapter4 PPTX Slide 135",
    description: "保额1000,$A_{60:\\overline{5|}}=0.7896,{}^2A_{65}=0.2836,{}^2A_{60}=0.2196$。$\\mathrm{Var}(Z)=B^2[{}^2A-(A)^2]=831.84$。",
    nodes: [
      IN("data","endowment_insurance_discrete",{A60_5:0.7896},60,60, "A_{60:\\overline{5|}}=0.7896"),
      IN("i","interest_rate",{i:0.05},60,220, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},310,220, "v"),
      THM("thm","thm_endowment_decomp",560,100, "\\mathrm{Var}(Z)=B^2[{}^2A-(A)^2]"),
      CP("varZ","endowment_insurance_discrete",{x:60,n:5,i:0.05},830,100, "=831.84"),
    ],
    edges: [E("i","v"),E("data","thm"),E("v","thm"),E("thm","varZ")],
    expectedResults: {},
  },
  {
    id: "ch4_ex_4_8_1", chapter: 4, section: "4.8 变额人寿保险",
    title: "例4.8.1：递推求 (IA)₃₆",
    sourceSlide: "chapter4 PPTX Slide 197",
    description: "$A_{35:\\overline{1|}}=0.9434,A_{35}=0.13,p_{35}=0.9964,(IA)_{35}=3.71$。$(IA)_{35}=A_{35:\\overline{1|}}+vp_{35}(IA)_{36}$。$(IA)_{36}=3.593$。",
    nodes: [
      IN("known","increasing_IAx_discrete",{A35_1:0.9434,A35:0.13,p35:0.9964,IA35:3.71},60,60, "(IA)_{35}=3.71"),
      IN("i","interest_rate",{i:0.05},60,240, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},310,240, "v=0.9524"),
      CP("vp35","v_factor",{i:0.05,n:1},310,330, "vp_{35}=0.9490"),
      THM("thm","thm_recurrence_Ax",580,140, "(IA)_{35}=A_{35:\\overline{1|}}+vp_{35}(IA)_{36}"),
      CP("IA36","increasing_IAx_discrete",{x:36,i:0.05},850,140, "(IA)_{36}=3.593"),
    ],
    edges: [E("i","v"),E("i","vp35"),E("known","vp35"),E("known","thm"),E("vp35","thm"),E("thm","IA36")],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // 第五章：年金现值
  // ════════════════════════════════════════════════════════

  {
    id: "ch5_ex_5_3_3", chapter: 5, section: "5.3 连续生存年金",
    title: "例5.3.3：常数死亡力 ā_x=1/(μ+δ)",
    sourceSlide: "chapter5 PPTX Slide 41",
    description: "$\\mu=0.04,\\delta=0.06$。$_tp_x=e^{-\\mu t},v^t=e^{-\\delta t}$。$\\overline{a}_x=\\int_0^\\infty e^{-(\\mu+\\delta)t}dt=\\frac{1}{\\mu+\\delta}=10$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,280, "\\delta=0.06"),
      CP("tpx","t_px",{t:10,x:0},310,50, "{}_tp_x=e^{-\\mu t}"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},310,240, "\\delta=0.06"),
      THM("thm_def","thm_ax_cont_def",560,50, "\\overline{a}_x = \\int v^t{}_tp_x dt"),
      THM("thm_cf","thm_ax_cont_cf",560,170, "= \\frac{1}{\\mu+\\delta}"),
      CP("ax","ax_continuous",{x:0,i:Math.exp(0.06)-1},830,110, "=\\frac{1}{0.10}=10"),
    ],
    edges: [
      E("i","delta"),E("mu","tpx"),
      E("tpx","thm_def"),E("delta","thm_def"),E("thm_def","thm_cf"),E("thm_cf","ax"),
    ],
    expectedResults: {ax:10},
  },
  {
    id: "ch5_ex_5_4_1", chapter: 5, section: "5.4 期初生存年金",
    title: "例5.4.1：90岁期初年金 ä₉₀ 完整推导",
    sourceSlide: "chapter5 PPTX Slide 87",
    description: "$l_{90}=100,l_{91}=72,l_{92}=39,l_{93}=0,i=6\\%$。${}_1p_{90}=72/100=0.72$。${}_2p_{90}=39/100=0.39$。$\\ddot{a}_{90}=1+v\\cdot{}_1p_{90}+v^2\\cdot{}_2p_{90}=2.026344$。",
    nodes: [
      IN("lx","lx",{l90:100,l91:72,l92:39,l93:0},60,300, "l_{90}=100,l_{91}=72,l_{92}=39"),
      IN("i","interest_rate",{i:0.06},60,50, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},310,50, "v=0.9434"),
      CP("v2","v_factor",{i:0.06,n:2},310,140, "v^2=0.8900"),
      THM("thm_p","thm_tpx_from_l",550,280, "{}_kp_{90}=\\frac{l_{90+k}}{l_{90}}"),
      CP("p1","t_px",{t:1,x:90},550,350, "{}_1p_{90}=0.72"),
      CP("p2","t_px",{t:2,x:90},550,420, "{}_2p_{90}=0.39"),
      THM("thm_a","thm_ax_due_disc",800,200, "\\ddot{a}_x = \\sum v^k{}_kp_x"),
      CP("ax","ax_due_discrete",{x:90,i:0.06},1070,200, "\\ddot{a}_{90}=2.026344"),
    ],
    edges: [
      E("i","v"),E("i","v2"),E("lx","thm_p"),
      E("thm_p","p1"),E("thm_p","p2"),
      E("v","thm_a"),E("v2","thm_a"),E("p1","thm_a"),E("p2","thm_a"),E("thm_a","ax"),
    ],
    expectedResults: {p1:0.72,p2:0.39,ax:2.026344},
  },
  {
    id: "ch5_ex_5_4_4", chapter: 5, section: "5.4 期初生存年金",
    title: "例5.4.4：期初年金方差",
    sourceSlide: "chapter5 PPTX Slide 117",
    description: "$\\ddot{a}_x=10,{}^2\\ddot{a}_x=6,i=1/24$。$d=i/(1+i)=0.04$。$\\mathrm{Var}(Y)=({}^2\\ddot{a}_x-\\ddot{a}_x^2)/d^2=106$。",
    nodes: [
      IN("known","ax_due_discrete",{ax:10,ax2:6,i:1/24},60,60, "\\ddot{a}_x=10,\\ {}^2\\ddot{a}_x=6"),
      IN("i","interest_rate",{i:1/24},60,220, "i=1/24"),
      CP("d","d_factor",{i:1/24},310,220, "d=0.04"),
      THM("thm","thm_identity_disc",560,100, "\\mathrm{Var}(Y)=\\frac{{}^2\\ddot{a}_x-\\ddot{a}_x^2}{d^2}"),
      CP("varY","ax_due_discrete",{x:0,i:1/24},830,100, "=106"),
    ],
    edges: [E("i","d"),E("known","thm"),E("d","thm"),E("thm","varY")],
    expectedResults: {},
  },
  {
    id: "ch5_ex_5_5_1", chapter: 5, section: "5.5 期末生存年金",
    title: "例5.5.1：ä_x 与 a_x 期望差",
    sourceSlide: "chapter5 PPTX Slide 133",
    description: "$i=0.06,A_x=0.20755$。$d=0.0566$。$\\ddot{a}_x=(1-A_x)/d=14$。$a_x=\\ddot{a}_x-1=13$。$E(Y)-E(Z)=7$。",
    nodes: [
      IN("known","ax_immediate_discrete",{i:0.06,Ax:0.20755},60,60, "A_x=0.20755"),
      IN("i","interest_rate",{i:0.06},60,280, "i=6\\%"),
      CP("d","d_factor",{i:0.06},310,240, "d=0.0566"),
      THM("thm_da","thm_identity_disc",550,50, "\\ddot{a}_x=\\frac{1-A_x}{d}"),
      CP("ax_due","ax_due_discrete",{x:0,i:0.06},810,50, "\\ddot{a}_x=14"),
      CP("ax_imm","ax_immediate_discrete",{x:0,i:0.06},810,170, "a_x=13"),
      THM("thm_diff","thm_ax_due_disc",550,240, "a_x = \\ddot{a}_x - 1"),
    ],
    edges: [
      E("i","d"),E("known","thm_da"),E("d","thm_da"),E("thm_da","ax_due"),
      E("ax_due","thm_diff"),E("thm_diff","ax_imm"),
    ],
    expectedResults: {},
  },
  {
    id: "ch5_ex_5_6_2", chapter: 5, section: "5.6 分m次给付",
    title: "例5.6.2：UDD 下 ä₉₀⁽²⁾",
    sourceSlide: "chapter5 PPTX Slide 157",
    description: "同例5.4.1数据,UDD假设。每年给付2次。$\\ddot{a}_{90}^{(2)}=1.7694$。",
    nodes: [
      IN("lx","lx",{l90:100,l91:72,l92:39,l93:0},60,150, "l_{90}=100,l_{91}=72,l_{92}=39"),
      IN("i","interest_rate",{i:0.06},60,50, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},310,50, "v=0.9434"),
      CP("p1","t_px",{t:1,x:90},310,150, "{}_1p_{90}=0.72"),
      THM("thm","thm_udd_relation",570,100, "\\ddot{a}_x^{(2)} \\text{ (UDD下分期给付)}"),
      CP("ax2","ax_due_discrete",{x:90,i:0.06},840,100, "\\ddot{a}_{90}^{(2)}=1.7694"),
    ],
    edges: [E("i","v"),E("lx","p1"),E("v","thm"),E("p1","thm"),E("thm","ax2")],
    expectedResults: {},
  },
  {
    id: "ch5_ex_5_7_1", chapter: 5, section: "5.7 年金在金融中",
    title: "例5.7.1：违约风险债券定价",
    sourceSlide: "chapter5 PPTX Slide 171",
    description: "$M=1000,C=70,e^{-10\\lambda}=0.98,i=6\\%$。债券价格 = 息票PV + 面值生存给付PV = 1057.24。",
    nodes: [
      IN("bond","t_px",{M:1000,C:70,survival:0.98,i:0.06},60,60, "M=1000,C=70"),
      IN("i","interest_rate",{i:0.06},60,220, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},310,220, "v=0.9434"),
      CP("v10","v_factor",{i:0.06,n:10},310,310, "v^{10}=0.5584"),
      THM("thm","thm_pure_endowment",570,140, "P=C\\cdot a_{\\overline{10|}}+M\\cdot v^{10}\\cdot{}_{10}p_x"),
      CP("price","ax_due_discrete",{i:0.06},840,140, "=1057.24"),
    ],
    edges: [E("i","v"),E("i","v10"),E("bond","thm"),E("v","thm"),E("v10","thm"),E("thm","price")],
    expectedResults: {},
  },
  {
    id: "ch5_ex_5_7_2", chapter: 5, section: "5.7 年金在金融中",
    title: "例5.7.2：CPR 贷款定价",
    sourceSlide: "chapter5 PPTX Slide 189",
    description: "3个月,月还1元,月利率$i=1\\%$,CPR $q=0.2$。贷款额$=\\sum v^k\\cdot{}_kp_x\\cdot P=2.940985$。",
    nodes: [
      IN("loan","ax_immediate_discrete",{n:3,P:1,i_monthly:0.01,q:0.2},60,60, "n=3,P=1,q=0.2"),
      IN("i","interest_rate",{i:0.01},60,220, "i=1\\%\\text{ (月)}"),
      CP("v","v_factor",{i:0.01,n:1},310,220, "v=0.9901"),
      CP("p","t_px",{t:1,x:0},310,310, "p_x=0.8"),
      THM("thm","thm_ax_due_disc",570,140, "L=\\sum v^k\\cdot{}_kp_x\\cdot P"),
      CP("val","ax_immediate_discrete",{i:0.01},840,140, "=2.940985"),
    ],
    edges: [E("i","v"),E("loan","p"),E("v","thm"),E("p","thm"),E("thm","val")],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // 第八章：净保费理论
  // ════════════════════════════════════════════════════════

  {
    id: "ch8_ex_8_3_1", chapter: 8, section: "8.3 趸缴净保费",
    title: "例8.3.1：均匀分布终身寿险趸缴",
    sourceSlide: "chapter8 PPTX Slide 276",
    description: "$T\\sim U(0,100),\\delta=0.10$,保额50。$\\overline{A}_x=\\frac{1}{100}\\int_0^{100}e^{-0.10t}dt=0.1$。趸缴=$50\\times0.1=5$。",
    nodes: [
      IN("dist","Tx",{distribution:"uniform",a:0,b:100},60,60, "T\\sim U(0,100)"),
      IN("i","interest_rate",{i:Math.exp(0.10)-1},60,280, "\\delta=0.10"),
      CP("mu","mu_x_t",{t:50,x:0},310,50, "\\mu_x(t)=\\frac{1}{100-t}"),
      CP("delta","delta_factor",{i:Math.exp(0.10)-1},310,240, "\\delta=0.10"),
      THM("thm","thm_Ax_cont_def",570,110, "\\overline{A}_x = \\int v^t{}_tp_x\\mu_x dt"),
      CP("Ax","Ax_continuous",{x:0,i:Math.exp(0.10)-1},840,110, "=0.1"),
    ],
    edges: [E("dist","mu"),E("i","delta"),E("mu","thm"),E("delta","thm"),E("thm","Ax")],
    expectedResults: {Ax:0.1},
  },
  {
    id: "ch8_ex_8_4_1", chapter: 8, section: "8.4 完全连续险种",
    title: "例8.4.1：P̄(Ā_x)=μ 三段推导",
    sourceSlide: "chapter8 PPTX Slide 483",
    description: "$\\mu,\\delta$常数。$\\overline{A}_x=\\frac{\\mu}{\\mu+\\delta}=0.4$。$\\overline{a}_x=\\frac{1}{\\mu+\\delta}=10$。$\\overline{P}=\\frac{\\overline{A}_x}{\\overline{a}_x}=\\mu=0.04$。",
    nodes: [
      IN("mu","mu_t",{mu:0.04},60,60, "\\mu=0.04"),
      IN("i","interest_rate",{i:Math.exp(0.06)-1},60,400, "\\delta=0.06"),
      CP("delta","delta_factor",{i:Math.exp(0.06)-1},310,360, "\\delta=0.06"),
      THM("thm_A","thm_constant_force_Ax",560,30, "\\overline{A}_x = \\frac{\\mu}{\\mu+\\delta}"),
      CP("Ax","Ax_continuous",{x:0,i:Math.exp(0.06)-1},830,30, "=0.4"),
      THM("thm_a","thm_ax_cont_cf",560,140, "\\overline{a}_x = \\frac{1}{\\mu+\\delta}"),
      CP("ax","ax_continuous",{x:0,i:Math.exp(0.06)-1},830,140, "=10"),
      THM("thm_P","thm_net_premium_cont",560,280, "\\overline{P} = \\frac{\\overline{A}_x}{\\overline{a}_x}"),
      CP("Pbar","Px_continuous",{x:0,i:Math.exp(0.06)-1},830,280, "=\\mu=0.04"),
    ],
    edges: [
      E("i","delta"),E("mu","thm_A"),E("delta","thm_A"),E("thm_A","Ax"),
      E("mu","thm_a"),E("delta","thm_a"),E("thm_a","ax"),
      E("Ax","thm_P"),E("ax","thm_P"),E("thm_P","Pbar"),
    ],
    expectedResults: {Ax:0.4,ax:10,Pbar:0.04},
  },
  {
    id: "ch8_ex_8_4_2", chapter: 8, section: "8.4 完全连续险种",
    title: "例8.4.2：UDD 离散→连续保费",
    sourceSlide: "chapter8 PPTX Slide 581",
    description: "$i=0.05,\\ddot{a}_x=1.68$,UDD。$A_x=1-d\\ddot{a}_x=0.92$。$\\overline{A}_x=\\frac{i}{\\delta}A_x=0.9428$。$P(\\overline{A}_x)=0.8042$。",
    nodes: [
      IN("known","Px_continuous",{i:0.05,ax_due:1.68},60,60, "\\ddot{a}_x=1.68"),
      IN("i","interest_rate",{i:0.05},60,340, "i=5\\%"),
      CP("d","d_factor",{i:0.05},310,280, "d=0.0476"),
      CP("delta","delta_factor",{i:0.05},310,370, "\\delta=0.0488"),
      THM("thm_id","thm_identity_disc",560,50, "A_x = 1-d\\ddot{a}_x"),
      CP("Ax_d","Ax_discrete",{x:0,i:0.05},810,50, "=0.92"),
      THM("thm_udd","thm_udd_relation",560,180, "\\overline{A}_x = \\frac{i}{\\delta}A_x"),
      CP("Ax_c","Ax_continuous",{x:0,i:0.05},810,180, "=0.9428"),
      THM("thm_P","thm_net_premium_cont",560,300, "\\overline{P}=\\frac{\\overline{A}_x}{\\ddot{a}_x}"),
      CP("P","Px_continuous",{x:0,i:0.05},810,300, "=0.8042"),
    ],
    edges: [
      E("i","d"),E("i","delta"),
      E("known","thm_id"),E("d","thm_id"),E("thm_id","Ax_d"),
      E("Ax_d","thm_udd"),E("d","thm_udd"),E("delta","thm_udd"),E("thm_udd","Ax_c"),
      E("Ax_c","thm_P"),E("known","thm_P"),E("thm_P","P"),
    ],
    expectedResults: {},
  },
  {
    id: "ch8_ex_8_4_4", chapter: 8, section: "8.4 完全连续险种",
    title: "例8.4.4：方差比求保费 — Var(L) 完整推导",
    sourceSlide: "chapter8 PPTX Slide 845 · 结论 8.4.2",
    description: "已知 $\\frac{\\mathrm{Var}(v^T)}{\\mathrm{Var}(L)}=0.36$，$\\overline{a}_x=10$。推导：由结论 8.4.2，$\\mathrm{Var}(L)=\\frac{\\mathrm{Var}(v^T)}{(\\delta\\overline{a}_x)^2}$。故 $\\frac{\\mathrm{Var}(v^T)}{\\mathrm{Var}(L)}=(\\delta\\overline{a}_x)^2=(1-\\overline{A}_x)^2=0.36$。$1-\\overline{A}_x=0.6$，$\\overline{A}_x=0.4$，$\\overline{P}=0.4/10=0.04$。",
    nodes: [
      IN("given1","Px_continuous",{var_ratio:0.36,ax:10},60,40, "\\overline{a}_x=10"),
      IN("given2","Px_continuous",{var_ratio:0.36},60,170, "\\frac{\\mathrm{Var}(v^T)}{\\mathrm{Var}(L)}=0.36"),
      // 结论 8.4.2: Var(L) 公式
      THM("thm_varL","thm_var_L_cont",360,30, "\\mathrm{Var}(L)=\\frac{\\mathrm{Var}(v^T)}{(\\delta\\overline{a}_x)^2}"),
      // 推导 Var 比值
      THM("thm_ratio","thm_var_L_cont",360,170, "\\frac{\\mathrm{Var}(v^T)}{\\mathrm{Var}(L)}=(\\delta\\overline{a}_x)^2"),
      CP("delta_ax","v_factor",{i:0.06,n:1},620,30, "\\delta\\overline{a}_x=\\sqrt{0.36}=0.6"),
      CP("delta","delta_factor",{i:0.0618365},620,140, "\\delta=0.6/10=0.06"),
      // 保险-年金恒等式
      THM("thm_id","thm_identity_disc",620,260, "\\overline{A}_x=1-\\delta\\overline{a}_x"),
      CP("Ax","v_factor",{i:0.0618365,n:1},880,120, "\\overline{A}_x=1-0.6=0.4"),
      // 净保费
      THM("thm_P","thm_net_premium_cont",880,260, "\\overline{P}=\\frac{\\overline{A}_x}{\\overline{a}_x}"),
      CP("Pbar","Px_continuous",{x:0,i:0.0618365},1120,180, "=\\frac{0.4}{10}=0.04"),
    ],
    edges: [
      E("given1","thm_varL"),E("given2","thm_varL"),
      E("thm_varL","thm_ratio"),E("given1","thm_ratio"),
      E("thm_ratio","delta_ax"),E("given1","delta_ax"),
      E("delta_ax","delta"),E("given1","delta"),
      E("given1","thm_id"),E("delta","thm_id"),
      E("thm_id","Ax"),E("given1","Ax"),
      E("Ax","thm_P"),E("given1","thm_P"),E("thm_P","Pbar"),
    ],
    expectedResults: {Pbar:0.04},
  },

  // ════════════════════════════════════════════════════════
  // 第十章：完全离散净准备金
  // ════════════════════════════════════════════════════════

  {
    id: "ch10_ex_10_2_1", chapter: 10, section: "10.2 未来损失量模型",
    title: "例10.2.1：De Moivre 的 C_h 分析",
    sourceSlide: "chapter10 PPTX Slide 413",
    description: "20岁,终身寿险,De Moivre ω=120,i=5%。$A_{20}=0.1985$。$\\ddot{a}_{20}=(1-A_{20})/d$。$P_{20}=A_{20}/\\ddot{a}_{20}=0.01179$。验证 $E(C_h|K\\ge h)=0$。",
    nodes: [
      IN("omega","de_moivre_mu",{omega:120},60,60, "\\omega=120"),
      IN("i","interest_rate",{i:0.05},60,380, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},310,320, "v=0.9524"),
      CP("d","d_factor",{i:0.05},310,410, "d=0.0476"),
      CP("A20","Ax_discrete",{x:20,i:0.05},560,40, "A_{20}=0.1985"),
      THM("thm_a","thm_identity_disc",560,140, "\\ddot{a}_{20}=\\frac{1-A_{20}}{d}"),
      CP("a20","ax_due_discrete",{x:20,i:0.05},830,40, "\\ddot{a}_{20}"),
      THM("thm_P","thm_net_premium",560,260, "P_{20}=\\frac{A_{20}}{\\ddot{a}_{20}}"),
      CP("P20","Px_discrete",{x:20,i:0.05},830,200, "P_{20}=0.01179"),
    ],
    edges: [
      E("i","v"),E("i","d"),
      E("omega","A20"),E("v","A20"),E("A20","thm_a"),E("d","thm_a"),E("thm_a","a20"),
      E("A20","thm_P"),E("a20","thm_P"),E("thm_P","P20"),
    ],
    expectedResults: {A20:0.1984791,P20:0.01179},
  },
  {
    id: "ch10_ex_10_3_2", chapter: 10, section: "10.3 净准备金的定义",
    title: "例10.3.2：5年期死亡险 — 完整准备金推导",
    sourceSlide: "chapter10 PPTX Slide 1343",
    description: "50岁,5年期,保额1000,i=6%,CL93M。$A^1=0.0289$,$\\ddot{a}=4.4114$。$P^1=A^1/\\ddot{a}=0.00656$。Fackler递推得${}_2V,{}_3V,{}_4V$。保单组总准备金=4788。",
    nodes: [
      IN("lt","lx",{table:"CL93M",start_age:50},60,400, "\\text{CL93M }l_{50},l_{51},\\dots"),
      IN("i","interest_rate",{i:0.06},60,40, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},310,40, "v=0.9434"),
      CP("d","d_factor",{i:0.06},310,130, "d=0.0566"),
      THM("thm_A","thm_A_term_disc",560,20, "A^1 = \\sum v^{k+1}{}_kp_xq_{x+k}"),
      THM("thm_a","thm_ax_due_disc",560,120, "\\ddot{a} = \\sum v^k{}_kp_x"),
      THM("thm_P","thm_net_premium",560,260, "P^1 = \\frac{A^1}{\\ddot{a}}"),
      THM("thm_V","thm_prospective_reserve",560,360, "{}_kV = A_{x+k} - P\\ddot{a}_{x+k}"),
      CP("A_term","Ax_term_discrete",{x:50,n:5,i:0.06},820,20, "=0.028925"),
      CP("a_term","ax_term_due_discrete",{x:50,n:5,i:0.06},820,120, "=4.411371"),
      CP("P_term","Px_term_discrete",{x:50,n:5,i:0.06},820,220, "=0.006557"),
      CP("V2","kVx_discrete",{x:50,k:2,i:0.06},820,320, "{}_2V"),
      CP("V3","kVx_discrete",{x:50,k:3,i:0.06},1090,320, "{}_3V"),
      CP("V4","kVx_discrete",{x:50,k:4,i:0.06},1090,420, "{}_4V"),
    ],
    edges: [
      E("i","v"),E("i","d"),
      E("lt","thm_A"),E("v","thm_A"),E("thm_A","A_term"),
      E("lt","thm_a"),E("v","thm_a"),E("thm_a","a_term"),
      E("A_term","thm_P"),E("a_term","thm_P"),E("thm_P","P_term"),
      E("A_term","thm_V"),E("P_term","thm_V"),E("thm_V","V2"),
      E("lt","V2"),E("v","V2"),
      E("V2","V3"),E("lt","V3"),
      E("V3","V4"),E("lt","V4"),
    ],
    expectedResults: {A_term:0.02892499,a_term:4.41137118,P_term:0.00655692},
  },
  {
    id: "ch10_ex_10_5_1", chapter: 10, section: "10.5 未来损失量的方差",
    title: "例10.5.1：Hattendorf 定理应用",
    sourceSlide: "chapter10 PPTX Slide 1912",
    description: "同例10.3.2。$\\mathrm{Var}(\\Lambda_h)=[v(b-{}_{h+1}V)]^2p_{x+h}q_{x+h}$。$\\mathrm{Var}({}_hL)=\\sum v^{2(j-h)}\\mathrm{Var}(\\Lambda_j)$。总方差=$1.0826\\times10^6$,95%CI=21904。",
    nodes: [
      IN("lt","lx",{table:"example_10_3_2"},60,60, "\\text{同例10.3.2}"),
      IN("i","interest_rate",{i:0.06},60,280, "i=6\\%"),
      CP("v","v_factor",{i:0.06,n:1},310,240, "v=0.9434"),
      CP("q50","t_qx",{t:1,x:50},310,330, "q_{50}"),
      CP("p50","t_px",{t:1,x:50},310,420, "p_{50}"),
      THM("thm_VL","thm_var_lambda",570,180, "\\mathrm{Var}(\\Lambda_h)=[v(b-{}_{h+1}V)]^2p_{x+h}q_{x+h}"),
      THM("thm_H","thm_hattendorf",570,310, "\\mathrm{Var}({}_hL)=\\sum v^{2(j-h)}\\mathrm{Var}(\\Lambda_j)"),
      CP("var","hattendorf",{x:50,h:0,i:0.06},860,240, "\\text{总方差}"),
    ],
    edges: [
      E("i","v"),E("lt","q50"),E("lt","p50"),
      E("v","thm_VL"),E("q50","thm_VL"),E("p50","thm_VL"),
      E("thm_VL","thm_H"),E("v","thm_H"),E("thm_H","var"),
    ],
    expectedResults: {},
  },

  // ════════════════════════════════════════════════════════
  // 第十二章：完全连续净准备金
  // ════════════════════════════════════════════════════════

  {
    id: "ch12_ex_12_2_2", chapter: 12, section: "12.2 基本模型",
    title: "例12.2.2：变额寿险 _{10}V̄",
    sourceSlide: "chapter12 PPTX Slide 362",
    description: "40岁,25年期,$b_t=1000\\overline{a}_{\\overline{25-t|}}$,$\\overline{A}_{50:\\overline{15|}}=0.60,i=5\\%,\\pi=200$。${}_{10}\\overline{V}=799$。",
    nodes: [
      IN("known","Ax_term_continuous",{A50_15:0.60},60,60, "\\overline{A}_{50:\\overline{15|}}=0.60"),
      IN("i","interest_rate",{i:0.05},60,240, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},310,240, "v=0.9524"),
      THM("thm","thm_prospective_reserve",570,110, "{}_{t}\\overline{V}=\\overline{A}_{x+t} - \\overline{P}\\cdot\\overline{a}_{x+t}"),
      CP("tV","tV_continuous",{x:40,t:10,i:0.05},850,110, "{}_{10}\\overline{V}=799"),
    ],
    edges: [E("i","v"),E("known","thm"),E("v","thm"),E("thm","tV")],
    expectedResults: {},
  },
  {
    id: "ch12_ex_12_3_1", chapter: 12, section: "12.3 终身寿险的净准备金",
    title: "例12.3.1：_{20}V̄(Ā₃₀)",
    sourceSlide: "chapter12 PPTX Slide 565",
    description: "$\\overline{A}_{50}=0.7,{}^2\\overline{A}_{30}=0.3,\\mathrm{Var}(L)=0.2$。先求$\\overline{A}_{30}=0.5$。${}_{20}\\overline{V}=1-\\overline{a}_{50}/\\overline{a}_{30}=0.40$。",
    nodes: [
      IN("known","tV_ax_continuous",{A50:0.7,A2_30:0.3,varL:0.2},60,60, "\\overline{A}_{50}=0.7"),
      IN("i","interest_rate",{i:0.05},60,280, "i=5\\%"),
      CP("v","v_factor",{i:0.05,n:1},310,280, "v=0.9524"),
      CP("A30","Ax_continuous",{x:30,i:0.05},560,50, "\\overline{A}_{30}=0.5"),
      THM("thm","thm_prospective_reserve",560,170, "{}_{20}\\overline{V}=1-\\frac{\\overline{a}_{50}}{\\overline{a}_{30}}"),
      CP("V20","tV_ax_continuous",{x:30,t:20,i:0.05},840,120, "=0.40"),
    ],
    edges: [E("i","v"),E("known","A30"),E("A30","thm"),E("known","thm"),E("thm","V20")],
    expectedResults: {},
  },
];

// ═══════════════════════════════════════════════════════
// 合并：例题 + 定理演示
// ═══════════════════════════════════════════════════════

export const ALL_PRESETS_WITH_DEMOS: PresetExample[] = [
  ...ALL_PRESETS,
  ...THEOREM_DEMOS,
];

export const PRESETS_BY_CHAPTER = new Map<number, PresetExample[]>();
ALL_PRESETS_WITH_DEMOS.forEach(p => {
  const arr = PRESETS_BY_CHAPTER.get(p.chapter) || [];
  arr.push(p);
  PRESETS_BY_CHAPTER.set(p.chapter, arr);
});

export function getPresetsByChapter(chapter: number): PresetExample[] {
  return ALL_PRESETS_WITH_DEMOS.filter(p => p.chapter === chapter);
}
