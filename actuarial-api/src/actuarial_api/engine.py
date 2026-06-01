"""Engine bridge — 连接 FastAPI 与 actuarial-engine

管理 LifeTable 缓存、PresentValueCalculator、NetPremiumCalculator、
ReserveCalculator 的单例/工厂创建。
"""

import time
from typing import Optional
from functools import lru_cache

import numpy as np

from actuarial.life_table import LifeTable, CL93M_TABLE, CL93F_TABLE
from actuarial.present_value import PresentValueCalculator
from actuarial.net_premium import NetPremiumCalculator
from actuarial.reserve import ReserveCalculator
from actuarial.expense import ExpenseCalculator
from actuarial.dag import ComputeDAG, ComputeNode, ComputeTrace


# ═══════════════════════════════════════════════════════════════
# 缓存的引擎实例
# ═══════════════════════════════════════════════════════════════

_lt_cache: dict[str, LifeTable] = {
    "CL93M": CL93M_TABLE,
    "CL93F": CL93F_TABLE,
}


def get_life_table(name: str = "CL93M") -> LifeTable:
    """获取命名的生命表"""
    if name in _lt_cache:
        return _lt_cache[name]
    raise KeyError(f"Life table '{name}' not found. Available: {list(_lt_cache.keys())}")


def register_life_table(name: str, lt: LifeTable) -> None:
    """注册自定义生命表"""
    _lt_cache[name] = lt


def make_calculators(lt: LifeTable, i: float = 0.035):
    """创建完整的计算器套件"""
    pv = PresentValueCalculator(lt, i=i)
    premium = NetPremiumCalculator(pv)
    reserve = ReserveCalculator(pv, premium)
    expense = ExpenseCalculator(pv)
    return {
        "pv": pv,
        "premium": premium,
        "reserve": reserve,
        "expense": expense,
    }


# ═══════════════════════════════════════════════════════════════
# 公式注册表 — formula_id → compute_fn 映射
# ═══════════════════════════════════════════════════════════════

def build_formula_registry(lt: LifeTable, i: float = 0.035) -> dict:
    """构建 formula_id → (params, upstream) → result 的计算函数映射

    这是连接前端 formulaId 和后端 actuarial-engine 的桥梁。
    """
    calc = make_calculators(lt, i)
    pv = calc["pv"]
    prem = calc["premium"]
    res = calc["reserve"]
    exp = calc["expense"]

    registry = {}

    # ─── Ch1: 生存模型 ───
    registry["t_px"] = lambda p, u: lt.t_px(float(p.get("t", 1)), float(p.get("x", 0)))
    registry["t_qx"] = lambda p, u: lt.t_qx(float(p.get("t", 1)), float(p.get("x", 0)))
    registry["complete_ex"] = lambda p, u: lt.complete_ex(float(p.get("x", 0)))
    registry["curtate_ex"] = lambda p, u: lt.curtate_ex(float(p.get("x", 0)))
    registry["mu_x_t"] = lambda p, u: lt.mu_x(float(p.get("t", 0)), float(p.get("x", 0)))

    # ─── Ch4: 保险现值 ───
    registry["pure_endowment"] = lambda p, u: pv.pure_endowment(
        int(p.get("x", 0)), int(p.get("n", 1)))[0]
    registry["Ax_term_continuous"] = lambda p, u: pv.Ax_term_continuous(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["Ax_term_discrete"] = lambda p, u: pv.Ax_term_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["Ax_continuous"] = lambda p, u: pv.Ax_continuous(
        int(p.get("x", 0)))[0]
    registry["Ax_discrete"] = lambda p, u: pv.Ax_discrete(
        int(p.get("x", 0)))[0]
    registry["endowment_insurance_discrete"] = lambda p, u: pv.endowment_insurance_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["endowment_insurance_continuous"] = lambda p, u: pv.endowment_insurance_continuous(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["deferred_Ax_discrete"] = lambda p, u: pv.deferred_Ax_discrete(
        int(p.get("x", 0)), int(p.get("m", 5)))[0]
    registry["deferred_Ax_continuous"] = lambda p, u: pv.deferred_Ax_continuous(
        int(p.get("x", 0)), int(p.get("m", 5)))[0]
    registry["increasing_IAx_discrete"] = lambda p, u: pv.increasing_IAx_discrete(
        int(p.get("x", 0)))[0]
    registry["decreasing_DAx_discrete"] = lambda p, u: pv.decreasing_DAx_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]

    # ─── Ch5: 年金现值 ───
    registry["ax_continuous"] = lambda p, u: pv.ax_continuous(
        int(p.get("x", 0)))[0]
    registry["ax_term_continuous"] = lambda p, u: pv.ax_term_continuous(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["ax_due_discrete"] = lambda p, u: pv.ax_due_discrete(
        int(p.get("x", 0)))[0]
    registry["ax_term_due_discrete"] = lambda p, u: pv.ax_term_due_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["ax_immediate_discrete"] = lambda p, u: pv.ax_immediate_discrete(
        int(p.get("x", 0)))[0]
    registry["deferred_ax_due_discrete"] = lambda p, u: pv.deferred_ax_due(
        int(p.get("x", 0)), int(p.get("n", 5)))[0]
    registry["deferred_ax_continuous"] = lambda p, u: pv.deferred_ax_continuous(
        int(p.get("x", 0)), int(p.get("n", 5)))[0]
    registry["certain_and_life_ax_due"] = lambda p, u: pv.certain_and_life_ax_due(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["actuarial_accumulation"] = lambda p, u: pv.actuarial_accumulation(
        int(p.get("x", 0)), int(p.get("n", 10)))

    # ─── Ch8: 净保费 ───
    registry["Px_continuous"] = lambda p, u: prem.Px_continuous(int(p.get("x", 0)))[0]
    registry["Px_term_continuous"] = lambda p, u: prem.Px_term_continuous(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["Px_discrete"] = lambda p, u: prem.Px_discrete(int(p.get("x", 0)))[0]
    registry["Px_term_discrete"] = lambda p, u: prem.Px_term_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["Px_endowment_discrete"] = lambda p, u: prem.Px_endowment_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)))[0]
    registry["h_pay_Px_discrete"] = lambda p, u: prem.h_pay_Px_discrete(
        int(p.get("x", 0)), int(p.get("h", 10)))[0]
    registry["Px_semi_continuous"] = lambda p, u: prem.Px_semi_continuous(
        int(p.get("x", 0)))[0]

    # ─── Ch10-12: 准备金 ───
    registry["kVx_discrete"] = lambda p, u: res.kVx_discrete(
        int(p.get("x", 0)), int(p.get("k", 0)))
    registry["kVx_endowment_discrete"] = lambda p, u: res.kVx_endowment_discrete(
        int(p.get("x", 0)), int(p.get("n", 10)), int(p.get("k", 0)))
    registry["kVx_premium_diff"] = lambda p, u: res.kVx_premium_diff(
        int(p.get("x", 0)), int(p.get("k", 0)))
    registry["kVx_paidup"] = lambda p, u: res.kVx_paidup(
        int(p.get("x", 0)), int(p.get("k", 0)))
    registry["kVx_retrospective"] = lambda p, u: res.kVx_retrospective(
        int(p.get("x", 0)), int(p.get("k", 0)))
    registry["tV_continuous"] = lambda p, u: res.tV_continuous(
        int(p.get("x", 0)), float(p.get("t", 0)))
    registry["tV_ax_continuous"] = lambda p, u: res.tV_ax_continuous(
        int(p.get("x", 0)), float(p.get("t", 0)))

    # ─── Ch9: 费用 ───
    registry["expense_loaded_premium"] = lambda p, u: exp.expense_loaded_premium(
        int(p.get("x", 0)), int(p.get("n", 10)),
        gamma_prime=float(p.get("gamma_prime", 0.01)),
        gamma_double_prime=float(p.get("gamma_double_prime", 0.005)),
    )[0]

    # ─── 经济假设参数 ───
    registry["interest_rate"] = lambda p, u: float(p.get("i", 0.035))

    # ─── 中间计算步骤（用于展示推导链）───
    registry["v_factor"] = lambda p, u: float((1.0 + float(p.get("i", 0.035))) ** (-float(p.get("n", p.get("t", 1)))))
    registry["v_power"] = lambda p, u: float((1.0 + float(p.get("i", 0.035))) ** (-float(p.get("n", p.get("t", 1)))))
    registry["d_factor"] = lambda p, u: float(p.get("i", 0.035)) / (1.0 + float(p.get("i", 0.035)))
    registry["delta_factor"] = lambda p, u: float(np.log(1.0 + float(p.get("i", 0.035))))

    return registry


def _build_life_table_from_graph(nodes: list[dict]) -> tuple[LifeTable, float]:
    """从图的节点中提取生命表定义和利率。

    支持的生命表 IN 节点类型：
    - formulaId="lx" + params={l0, qx[], start_age} → 自定义生命表
    - formulaId="de_moivre_mu" + params={omega} → De Moivre 生命表
    - formulaId="mu_t" + params={mu} → 常数死亡力生命表
    - formulaId="Tx" + params={distribution:"uniform", b} → 均匀分布 = De Moivre
    - formulaId="t_px" + params={i|delta|v} → 经济假设（利率）

    支持多种利率表示：
    - i: 年有效利率
    - delta: 利息力 → i = exp(delta) - 1
    - v: 贴现因子 → i = 1/v - 1

    Returns (LifeTable, interest_rate)
    """
    import numpy as np

    lt = CL93M_TABLE
    i = 0.035

    for node in nodes:
        fid = node.get("formulaId", node.get("formula_id", ""))
        params = node.get("params", {})

        # 提取利率（优先级：i > delta > v）
        # interest_rate 或 t_px 节点携带利率参数
        if fid in ("interest_rate",):
            if "i" in params:
                i = float(params["i"])
        elif "i" in params and isinstance(params["i"], (int, float)):
            if fid not in ("lx", "v_factor", "d_factor", "delta_factor"):
                i = float(params["i"])
        elif "delta" in params and isinstance(params["delta"], (int, float)):
            delta = float(params["delta"])
            i = np.exp(delta) - 1.0
        elif "v" in params and isinstance(params["v"], (int, float)):
            v = float(params["v"])
            if v > 0 and v < 1:
                i = 1.0 / v - 1.0

        # 自定义生命表：lx 节点携带 qx 数组
        if fid == "lx" and "qx" in params:
            qx = params["qx"]
            if isinstance(qx, list) and len(qx) > 0:
                l0 = float(params.get("l0", 100000))
                start_age = int(params.get("start_age", 0))
                lt = LifeTable.custom(l0=l0, qx=qx, start_age=start_age,
                                      label=f"custom_{start_age}")
                register_life_table("__custom__", lt)

        # 自定义生命表：lx 节点携带直接 l_x 值 (如 l90=100, l91=72, ...)
        if fid == "lx":
            lx_direct = {}
            for k, v in params.items():
                if k.startswith("l") and len(k) > 1 and isinstance(v, (int, float)):
                    try:
                        age = int(k[1:])
                        lx_direct[age] = float(v)
                    except ValueError:
                        pass
            if len(lx_direct) >= 2 and "qx" not in params:
                max_age = max(lx_direct.keys())
                lx_arr = np.zeros(max_age + 2)
                for age, val in sorted(lx_direct.items()):
                    lx_arr[age] = val
                lt = LifeTable(lx=lx_arr, label="custom_lx_direct",
                               radix=float(max(lx_direct.values())))
                register_life_table("__custom__", lt)

        # 自定义生命表：从 t_qx 节点的 values 数组提取
        if fid in ("t_qx", "qx") and "values" in params:
            qx_vals = params["values"]
            if isinstance(qx_vals, list) and len(qx_vals) > 0:
                lt = LifeTable.custom(l0=100000.0, qx=qx_vals, start_age=0,
                                      label="custom_qx_values")
                register_life_table("__custom__", lt)

        # De Moivre 生命表
        if fid == "de_moivre_mu" and "omega" in params:
            omega = float(params["omega"])
            lt = LifeTable.de_moivre(omega=omega)
            register_life_table("__demoivre__", lt)

        # 常数死亡力
        if fid == "mu_t" and "mu" in params:
            mu = float(params["mu"])
            lt = LifeTable.constant_force(mu=mu, max_age=120)
            register_life_table("__constant_force__", lt)

        # U(0,omega) 均匀分布（= De Moivre）
        if fid == "Tx" and "distribution" in params:
            if params.get("distribution") == "uniform":
                b = float(params.get("b", 100))
                lt = LifeTable.de_moivre(omega=b)
                register_life_table("__uniform__", lt)

    return lt, i


def run_dag(graph: dict, lt_name: str = "CL93M", i: float = 0.035,
            changed_nodes: Optional[list[str]] = None) -> ComputeTrace:
    """执行完整 DAG 求值流程

    自动从图的 IN 节点中提取生命表定义和利率参数。
    """
    t0 = time.perf_counter()

    # 从图中提取生命表和利率
    nodes = graph.get("nodes", [])
    lt, i = _build_life_table_from_graph(nodes)

    # 也检查 graph 顶层是否有 interest_rate
    if "interest_rate" in graph:
        i = float(graph["interest_rate"])

    registry = build_formula_registry(lt, i)

    dag = ComputeDAG.from_preset(graph, registry)
    trace = dag.evaluate(changed_nodes=changed_nodes)

    elapsed_ms = (time.perf_counter() - t0) * 1000
    return trace, elapsed_ms
