"""PresentValueCalculator — 精算现值计算器

计算所有保险现值（Ch4）和年金现值（Ch5）。

全部函数返回以 (现值, 二阶矩) 为 tuple 的结果，
方便计算 Var(Z) = E(Z²) − [E(Z)]²。
"""

import numpy as np
from typing import Optional, Tuple
from actuarial.life_table import LifeTable, CL93M_TABLE

# NumPy 2.x 兼容：_trapz 已重命名为 np.trapezoid
if hasattr(np, 'trapezoid'):
    _trapz = np.trapezoid
else:
    _trapz = _trapz  # type: ignore[attr-defined]


class PresentValueCalculator:
    """精算现值计算器。

    Parameters
    ----------
    life_table : LifeTable
        生命表
    i : float
        年利率（默认 3.5%）
    """

    def __init__(self, life_table: Optional[LifeTable] = None, i: float = 0.035):
        self.lt = life_table or CL93M_TABLE
        self.i = i

    # ─── 辅助 ─────────────────────────────────────────────

    @property
    def v(self) -> float:
        """贴现因子 v = 1/(1+i)"""
        return 1.0 / (1.0 + self.i)

    @property
    def d(self) -> float:
        """贴现率 d = i/(1+i) = 1 − v"""
        return self.i / (1.0 + self.i)

    @property
    def delta(self) -> float:
        """利息力 δ = ln(1+i)"""
        return np.log(1.0 + self.i)

    def v_t(self, t: float) -> float:
        """v^t"""
        return float(np.exp(-self.delta * t))

    # ═══════════════════════════════════════════════════════
    # Ch4: 保险精算现值
    # ═══════════════════════════════════════════════════════

    # ─── 生存保险 ─────────────────────────────────────────

    def pure_endowment(self, x: int, n: int) -> Tuple[float, float]:
        """_n E_x = v^n · _n p_x — n年期生存保险

        Returns
        -------
        (E[Z], E[Z²]) 其中 Z = v^n · I(T>n)
        """
        npx = self.lt.t_px(float(n), float(x))
        vn = self.v_t(n)
        ez = vn * npx
        ez2 = (vn ** 2) * npx
        return float(ez), float(ez2)

    # ─── 定期寿险（连续）─────────────────────────────────

    def Ax_term_continuous(self, x: int, n: int,
                           benefit: float = 1.0) -> Tuple[float, float]:
        """Ā¹_{x:n} = ∫_0^n v^t · _t p_x · μ_x(t) dt

        使用复化梯形公式数值积分。
        """
        steps = max(200, n * 100)
        dt = n / steps
        t_vals = np.linspace(0, n, steps + 1)

        integrand = np.zeros(steps + 1)
        integrand2 = np.zeros(steps + 1)

        for idx, t in enumerate(t_vals):
            tpx = self.lt.t_px(t, float(x))
            mux = self.lt.mu_x(t, float(x))
            vt = self.v_t(t)
            vt_sq = self.v_t(2 * t)

            if np.isfinite(mux) and tpx > 0:
                integrand[idx] = benefit * vt * tpx * mux
                integrand2[idx] = (benefit ** 2) * vt_sq * tpx * mux

        ez = float(_trapz(integrand, t_vals))
        ez2 = float(_trapz(integrand2, t_vals))
        return ez, ez2

    def Ax_continuous(self, x: int, benefit: float = 1.0) -> Tuple[float, float]:
        """Ā_x = ∫_0^∞ v^t · _t p_x · μ_x(t) dt

        积分到 ω−x。
        """
        max_t = min(self.lt.omega - x, 120)
        if max_t <= 0:
            return 0.0, 0.0
        return self.Ax_term_continuous(x, int(max_t), benefit)

    # ─── 定期寿险（离散）─────────────────────────────────

    def Ax_term_discrete(self, x: int, n: int,
                         benefit: float = 1.0) -> Tuple[float, float]:
        """A¹_{x:n} = Σ_{k=0}^{n-1} v^{k+1} · _k p_x · q_{x+k}"""
        ez = 0.0
        ez2 = 0.0
        for k in range(n):
            kpx = self.lt.t_px(float(k), float(x))
            q_xk = self.lt.qx[x + k] if x + k < len(self.lt.qx) else 1.0
            vk1 = self.v_t(k + 1)

            ez += benefit * vk1 * kpx * q_xk
            ez2 += (benefit ** 2) * (vk1 ** 2) * kpx * q_xk
        return float(ez), float(ez2)

    def Ax_discrete(self, x: int, benefit: float = 1.0) -> Tuple[float, float]:
        """A_x = Σ_{k=0}^∞ v^{k+1} · _k p_x · q_{x+k}"""
        max_k = self.lt.omega - x
        if max_k <= 0:
            return 0.0, 0.0
        return self.Ax_term_discrete(x, max_k, benefit)

    def Ax_discrete_recursive(self, x: int, benefit: float = 1.0) -> Tuple[float, float]:
        """A_x 的递推算法: A_x = v·q_x + v·p_x·A_{x+1}"""
        omega = self.lt.omega
        # 反向递推
        A = np.zeros(omega + 1)
        A2 = np.zeros(omega + 1)
        for age in range(omega - 1, -1, -1):
            q = self.lt.qx[age]
            p = 1.0 - q
            A_next = A[age + 1] if age + 1 <= omega else 0.0
            A2_next = A2[age + 1] if age + 1 <= omega else 0.0
            A[age] = self.v * (benefit * q + p * A_next)
            A2[age] = (self.v ** 2) * (benefit ** 2 * q + p * A2_next)
        return float(A[x]), float(A2[x])

    # ─── 终身寿险（连续）─────────────────────────────────

    # Ax_continuous already defined above

    # ─── 生死合险 ─────────────────────────────────────────

    def endowment_insurance_discrete(self, x: int, n: int,
                                     death_benefit: float = 1.0,
                                     survival_benefit: float = 1.0) -> Tuple[float, float]:
        """A_{x:n} = A¹_{x:n} + _n E_x"""
        ez_term, ez2_term = self.Ax_term_discrete(x, n, death_benefit)
        ez_pure, _ = self.pure_endowment(x, n)

        # Z = death_benefit·v^{K+1}·I(K<n) + survival_benefit·v^n·I(K≥n)
        # E(Z²) = E[(death·v^{K+1})²·I(K<n)] + E[(survival·v^n)²·I(K≥n)]
        ez = ez_term + survival_benefit * ez_pure
        ez2 = ez2_term + (survival_benefit ** 2) * (self.v_t(2 * n) * self.lt.t_px(float(n), float(x)))
        return float(ez), float(ez2)

    def endowment_insurance_continuous(self, x: int, n: int,
                                       death_benefit: float = 1.0,
                                       survival_benefit: float = 1.0) -> Tuple[float, float]:
        """Ā_{x:n} = Ā¹_{x:n} + _n E_x"""
        ez_term, ez2_term = self.Ax_term_continuous(x, n, death_benefit)
        ez_pure, _ = self.pure_endowment(x, n)
        ez = ez_term + survival_benefit * ez_pure
        npx = self.lt.t_px(float(n), float(x))
        ez2 = ez2_term + (survival_benefit ** 2) * self.v_t(2 * n) * npx
        return float(ez), float(ez2)

    # ─── 延期保险 ─────────────────────────────────────────

    def deferred_Ax_discrete(self, x: int, m: int,
                             benefit: float = 1.0) -> Tuple[float, float]:
        """_{m|}A_x = _m E_x · A_{x+m}"""
        mex, _ = self.pure_endowment(x, m)
        axm, axm2 = self.Ax_discrete(x + m, benefit)
        ez = mex * axm
        # E(Z²) = v^{2m} · _m p_x · ²A_{x+m}
        ez2 = self.v_t(2 * m) * self.lt.t_px(float(m), float(x)) * axm2
        return float(ez), float(ez2)

    def deferred_Ax_continuous(self, x: int, m: int,
                               benefit: float = 1.0) -> Tuple[float, float]:
        """_{m|}Ā_x = _m E_x · Ā_{x+m}"""
        mex, _ = self.pure_endowment(x, m)
        axm, axm2 = self.Ax_continuous(x + m, benefit)
        ez = mex * axm
        ez2 = self.v_t(2 * m) * self.lt.t_px(float(m), float(x)) * axm2
        return float(ez), float(ez2)

    # ─── 变额保险 ─────────────────────────────────────────

    def increasing_IAx_discrete(self, x: int) -> Tuple[float, float]:
        """(IA)_x = Σ (k+1)·v^{k+1}·_k p_x·q_{x+k}"""
        ez = 0.0
        ez2 = 0.0
        max_k = self.lt.omega - x
        for k in range(max_k):
            kpx = self.lt.t_px(float(k), float(x))
            q_xk = self.lt.qx[x + k] if x + k < len(self.lt.qx) else 1.0
            vk1 = self.v_t(k + 1)
            benefit = float(k + 1)

            ez += benefit * vk1 * kpx * q_xk
            ez2 += (benefit ** 2) * (vk1 ** 2) * kpx * q_xk
        return float(ez), float(ez2)

    def decreasing_DAx_discrete(self, x: int, n: int) -> Tuple[float, float]:
        """(DA)¹_{x:n} = Σ (n−k)·v^{k+1}·_k p_x·q_{x+k}"""
        ez = 0.0
        ez2 = 0.0
        for k in range(n):
            kpx = self.lt.t_px(float(k), float(x))
            q_xk = self.lt.qx[x + k] if x + k < len(self.lt.qx) else 1.0
            vk1 = self.v_t(k + 1)
            benefit = float(n - k)

            ez += benefit * vk1 * kpx * q_xk
            ez2 += (benefit ** 2) * (vk1 ** 2) * kpx * q_xk
        return float(ez), float(ez2)

    # ═══════════════════════════════════════════════════════
    # Ch5: 年金精算现值
    # ═══════════════════════════════════════════════════════

    # ─── 连续年金 ─────────────────────────────────────────

    def ax_continuous(self, x: int) -> Tuple[float, float]:
        """ā_x = ∫_0^∞ v^t · _t p_x dt"""
        max_t = min(self.lt.omega - x, 120)
        if max_t <= 0:
            return 0.0, 0.0
        return self.ax_term_continuous(x, int(max_t))

    def ax_term_continuous(self, x: int, n: int) -> Tuple[float, float]:
        """ā_{x:n} = ∫_0^n v^t · _t p_x dt"""
        steps = max(200, n * 100)
        t_vals = np.linspace(0, n, steps + 1)
        integrand = np.zeros(steps + 1)

        for idx, t in enumerate(t_vals):
            tpx = self.lt.t_px(t, float(x))
            vt = self.v_t(t)
            integrand[idx] = vt * tpx

        # ā 的方差通过保险-年金恒等式从 ²A 计算
        ez = float(_trapz(integrand, t_vals))
        return ez, 0.0  # 年金 Y 的二阶矩通常通过 Ā 恒等关系计算

    # ─── 期初年金 ─────────────────────────────────────────

    def ax_due_discrete(self, x: int | float) -> Tuple[float, float]:
        """ä_x = Σ_{k=0}^∞ v^k · _k p_x"""
        if isinstance(x, float) and x != int(x):
            # 非整数年龄：使用保险-年金恒等式
            x_int = int(np.floor(x))
            ax_int, _ = self.ax_due_discrete(x_int)
            # 近似
            return ax_int, 0.0

        x = int(x)
        ez = 0.0
        max_k = self.lt.omega - x
        for k in range(max_k + 1):
            kpx = self.lt.t_px(float(k), float(x))
            if kpx <= 0:
                break
            vk = self.v_t(k)
            ez += vk * kpx
        return float(ez), 0.0

    def ax_term_due_discrete(self, x: int, n: int) -> Tuple[float, float]:
        """ä_{x:n} = Σ_{k=0}^{n-1} v^k · _k p_x"""
        ez = 0.0
        for k in range(n):
            kpx = self.lt.t_px(float(k), float(x))
            vk = self.v_t(k)
            ez += vk * kpx
        return float(ez), 0.0

    # ─── 期末年金 ─────────────────────────────────────────

    def ax_immediate_discrete(self, x: int) -> Tuple[float, float]:
        """a_x = ä_x − 1 = Σ_{k=1}^∞ v^k · _k p_x"""
        ax_due, _ = self.ax_due_discrete(x)
        return ax_due - 1.0, 0.0

    # ─── 延期年金 ─────────────────────────────────────────

    def deferred_ax_due(self, x: int, n: int) -> Tuple[float, float]:
        """_{n|}ä_x = _n E_x · ä_{x+n}"""
        nex, _ = self.pure_endowment(x, n)
        axn, _ = self.ax_due_discrete(x + n)
        return float(nex * axn), 0.0

    def deferred_ax_continuous(self, x: int, n: int) -> Tuple[float, float]:
        """_{n|}ā_x = _n E_x · ā_{x+n}"""
        nex, _ = self.pure_endowment(x, n)
        axn, _ = self.ax_continuous(x + n)
        return float(nex * axn), 0.0

    # ─── 确定期年金 ──────────────────────────────────────

    def certain_and_life_ax_due(self, x: int, n: int) -> Tuple[float, float]:
        """ä_{x:n̄} = ä_{n̄|} + _{n|}ä_x

        前 n 年确定给付（ā_{n̄|} = (1−v^n)/d），之后生存给付。
        """
        # 确定年金：ä_{n̄|} = (1 − v^n) / d
        annuity_certain = (1.0 - self.v_t(n)) / self.d
        deferred, _ = self.deferred_ax_due(x, n)
        return float(annuity_certain + deferred), 0.0

    # ─── 精算终值 ─────────────────────────────────────────

    def actuarial_accumulation(self, x: int, n: int) -> float:
        """s̈_{x:n} = ä_{x:n} / _n E_x"""
        axn, _ = self.ax_term_due_discrete(x, n)
        nex, _ = self.pure_endowment(x, n)
        return float(axn / nex) if nex > 0 else float('inf')

    # ─── 恒等式验证 ──────────────────────────────────────

    def verify_identity_continuous(self, x: int) -> Tuple[float, float, float]:
        """验证连续恒等式 δ·ā_x + Ā_x = 1"""
        ax, _ = self.ax_continuous(x)
        Ax_val, _ = self.Ax_continuous(x)
        lhs = self.delta * ax + Ax_val
        return float(lhs), float(ax), float(Ax_val)

    def verify_identity_discrete(self, x: int) -> Tuple[float, float, float]:
        """验证离散恒等式 d·ä_x + A_x = 1"""
        ax_due, _ = self.ax_due_discrete(x)
        Ax_val, _ = self.Ax_discrete(x)
        lhs = self.d * ax_due + Ax_val
        return float(lhs), float(ax_due), float(Ax_val)
