"""ReserveCalculator — 净准备金计算器 (Ch10, Ch11, Ch12)

支持：
- 完全离散准备金 _k V_x (将来法/保费差/缴清保险/过去法/递推)
- 完全连续准备金 _t V̄ (将来法/Thiele ODE)
- Fackler 递推公式
- Hattendorf 定理方差分解
"""

import numpy as np
from typing import Optional, Tuple, List
from actuarial.life_table import LifeTable, CL93M_TABLE
from actuarial.present_value import PresentValueCalculator
from actuarial.net_premium import NetPremiumCalculator


class ReserveCalculator:
    """净准备金计算器。

    Parameters
    ----------
    pv : PresentValueCalculator
    premium : NetPremiumCalculator
    """

    def __init__(self,
                 pv: Optional[PresentValueCalculator] = None,
                 premium: Optional[NetPremiumCalculator] = None):
        self.pv = pv or PresentValueCalculator()
        self.premium = premium or NetPremiumCalculator(self.pv)

    @property
    def lt(self) -> LifeTable:
        return self.pv.lt

    # ═══════════════════════════════════════════════════════
    # Ch10: 一般理论
    # ═══════════════════════════════════════════════════════

    def C_h(self, h: int, x: int, benefit: float = 1.0,
            premium_amount: Optional[float] = None) -> Tuple[float, float]:
        """C_h = v·b_{h+1}·I(K=h) − π_h·I(K≥h)

        第 h+1 保单年度的资金损失（不考虑准备金变化）。

        Returns
        -------
        (E[C_h | K≥h], Var[C_h | K≥h])
        """
        if premium_amount is None:
            premium_amount, _, _ = self.premium.Px_discrete(x)

        q_xh = self.lt.qx[x + h] if x + h < len(self.lt.qx) else 1.0
        p_xh = 1.0 - q_xh
        v = self.pv.v

        # E[C_h | K≥h] = v·b·q_{x+h} − π·(1)
        expectation = v * benefit * q_xh - premium_amount

        # Var[C_h | K≥h] = v²·b²·q·p − (E[C_h|K≥h])²
        variance = (v ** 2) * (benefit ** 2) * q_xh * p_xh - expectation ** 2

        return float(expectation), float(variance)

    def hV_general(self, h: int, x: int,
                   benefits: Optional[List[float]] = None,
                   premiums: Optional[List[float]] = None) -> float:
        """_h V = 将来法：未来保额现值 − 未来保费现值

        _h V = Σ_{j=0}^∞ b_{h+j+1}·v^{j+1}·_{j|}q_{x+h} − Σ_{j=0}^∞ π_{h+j}·v^j·_j p_{x+h}
        """
        # 默认：终身寿险，保额1，均衡保费
        if premiums is None:
            P, _, _ = self.premium.Px_discrete(x)
            premiums = [P] * (self.lt.omega - x)

        if benefits is None:
            benefits = [1.0] * (self.lt.omega - x)

        max_j = self.lt.omega - (x + h)
        future_benefit_pv = 0.0
        future_premium_pv = 0.0
        v = self.pv.v

        for j in range(max_j):
            jpx_h = self.lt.t_px(float(j), float(x + h))
            if jpx_h <= 0:
                break
            q_xhj = self.lt.qx[x + h + j] if x + h + j < len(self.lt.qx) else 1.0

            # 保险现值
            b = benefits[j] if j < len(benefits) else benefits[-1] if benefits else 1.0
            future_benefit_pv += b * (v ** (j + 1)) * jpx_h * q_xhj

            # 保费现值
            pi = premiums[j] if j < len(premiums) else premiums[-1] if premiums else 0.0
            future_premium_pv += pi * (v ** j) * jpx_h

        return float(future_benefit_pv - future_premium_pv)

    # ═══════════════════════════════════════════════════════
    # Ch11: 完全离散准备金
    # ═══════════════════════════════════════════════════════

    def kVx_discrete(self, x: int, k: int,
                     P_override: Optional[float] = None) -> float:
        """_k V_x = A_{x+k} − P_x · ä_{x+k} (将来法)"""
        if P_override is None:
            P, _, _ = self.premium.Px_discrete(x)
        else:
            P = P_override

        Axk, _ = self.pv.Ax_discrete(x + k)
        axk, _ = self.pv.ax_due_discrete(x + k)

        return float(Axk - P * axk)

    def kVx_all(self, x: int, max_k: int,
                P_override: Optional[float] = None) -> np.ndarray:
        """计算所有 _k V_x for k = 0, 1, ..., max_k"""
        if P_override is None:
            P, _, _ = self.premium.Px_discrete(x)
        else:
            P = P_override

        reserves = np.zeros(max_k + 1)
        for k in range(max_k + 1):
            reserves[k] = self.kVx_discrete(x, k, P)
        return reserves

    def kVx_endowment_discrete(self, x: int, n: int, k: int) -> float:
        """_k V_{x:n} = A_{x+k:n−k} − P_{x:n} · ä_{x+k:n−k}"""
        if k >= n:
            return 1.0  # 期满

        P_en, _, _, _ = self.premium.Px_endowment_discrete(x, n)
        A_en, _ = self.pv.endowment_insurance_discrete(x + k, n - k)
        ax_en, _ = self.pv.ax_term_due_discrete(x + k, n - k)

        return float(A_en - P_en * ax_en)

    def kVx_premium_diff(self, x: int, k: int) -> float:
        """保费差公式：_k V_x = (P_{x+k} − P_x) · ä_{x+k}"""
        Px = self.premium.Px_discrete(x)[0]
        Pxk = self.premium.Px_discrete(x + k)[0]
        axk, _ = self.pv.ax_due_discrete(x + k)
        return float((Pxk - Px) * axk)

    def kVx_paidup(self, x: int, k: int) -> float:
        """缴清保险公式：_k V_x = (1 − P_x/P_{x+k}) · A_{x+k}"""
        Px = self.premium.Px_discrete(x)[0]
        Pxk = self.premium.Px_discrete(x + k)[0]
        if Pxk <= 0:
            return 0.0
        Axk, _ = self.pv.Ax_discrete(x + k)
        return float((1.0 - Px / Pxk) * Axk)

    def kVx_retrospective(self, x: int, k: int) -> float:
        """过去法：_k V_x = P_x · s̈_{x:k} − _k κ_x"""
        Px, _, _ = self.premium.Px_discrete(x)
        s_accum = self.pv.actuarial_accumulation(x, k)
        # _k κ_x = A¹_{x:k} / _k E_x
        A_term, _ = self.pv.Ax_term_discrete(x, k)
        kEx, _ = self.pv.pure_endowment(x, k)
        kappa = A_term / kEx if kEx > 0 else float('inf')
        return float(Px * s_accum - kappa)

    # ═══════════════════════════════════════════════════════
    # Fackler 递推
    # ═══════════════════════════════════════════════════════

    def fackler_step(self, V_k: float, P: float, x: int, k: int,
                     benefit: float = 1.0) -> float:
        """Fackler 递推一步：
        _{k+1}V = [(V_k + P)(1+i) − b·q_{x+k}] / p_{x+k}
        """
        q = self.lt.qx[x + k] if x + k < len(self.lt.qx) else 1.0
        p = 1.0 - q
        if p <= 0:
            return benefit  # 最后一年，保费退还
        return float(((V_k + P) * (1.0 + self.pv.i) - benefit * q) / p)

    def fackler_sequence(self, x: int, n: int, P: Optional[float] = None,
                         benefit: float = 1.0) -> np.ndarray:
        """用 Fackler 递推生成完整准备金序列 _0V, _1V, ..., _nV"""
        if P is None:
            P, _, _, _ = self.premium.Px_term_discrete(x, n)

        reserves = np.zeros(n + 1)
        reserves[0] = 0.0  # _0V = 0
        for k in range(n):
            reserves[k + 1] = self.fackler_step(reserves[k], P, x, k, benefit)
        return reserves

    # ═══════════════════════════════════════════════════════
    # Ch12: 完全连续准备金
    # ═══════════════════════════════════════════════════════

    def tV_continuous(self, x: int, t: float) -> float:
        """_t V̄(Ā_x) = Ā_{x+t} − P̄(Ā_x) · ā_{x+t}"""
        P_cont, _, _ = self.premium.Px_continuous(x)
        Axt, _ = self.pv.Ax_continuous(x + int(t))
        axt, _ = self.pv.ax_continuous(x + int(t))
        return float(Axt - P_cont * axt)

    def tV_ax_continuous(self, x: int, t: float) -> float:
        """用年金比表示：_t V̄ = 1 − ā_{x+t}/ā_x"""
        ax, _ = self.pv.ax_continuous(x)
        axt, _ = self.pv.ax_continuous(x + int(t))
        if ax <= 0:
            return 0.0
        return float(1.0 - axt / ax)

    def thiele_ode_rhs(self, t: float, x: int, V_t: float,
                       premium_rate: float, benefit: float = 1.0) -> float:
        """Thiele ODE 右端：
        dV/dt = π_t + [δ + μ_x(t)]·V_t − b_t·μ_x(t)

        可用于 ODE 求解器。
        """
        delta = self.pv.delta
        mu = self.lt.mu_x(t, float(x))
        return float(premium_rate + (delta + mu) * V_t - benefit * mu)

    # ═══════════════════════════════════════════════════════
    # Hattendorf 定理 (Ch10.5)
    # ═══════════════════════════════════════════════════════

    def hattendorf_variance(self, x: int, h: int, n: int,
                            benefits: Optional[List[float]] = None,
                            premiums: Optional[List[float]] = None) -> Tuple[float, np.ndarray]:
        """Hattendorf 定理：
        Var[_h L | K≥h] = Σ_{j=h}^{n-1} v^{2(j-h)} · Var[Λ_j | K≥j]

        其中 Λ_j 是第 j+1 年的资金损失（考虑准备金变化）：
        Λ_j = v·(b_{j+1} − _{j+1}V)·I(K=j) − (π_j + _j V − v·_{j+1}V)·I(K≥j)

        Returns
        -------
        (total_variance, per_year_variances)
        """
        if premiums is None:
            P, _, _, _ = self.premium.Px_term_discrete(x, n)
            premiums = [P] * n

        if benefits is None:
            benefits = [1.0] * n

        v = self.pv.v
        per_year_var = np.zeros(n - h)

        # 先计算准备金序列
        V = self.fackler_sequence(x, n, premiums[0], benefits[0])

        for j in range(h, n):
            q_xj = self.lt.qx[x + j] if x + j < len(self.lt.qx) else 1.0
            p_xj = 1.0 - q_xj
            V_j = V[j]
            V_j1 = V[j + 1] if j + 1 < len(V) else 0.0
            b_j1 = benefits[j] if j < len(benefits) else benefits[-1]
            pi_j = premiums[j] if j < len(premiums) else premiums[-1]

            # E[Λ_j | K≥j] = 0 (由准备金递推保证)
            # Var[Λ_j | K≥j] = [v·(b_{j+1} − _{j+1}V)]²·_1 p_{x+j}·q_{x+j}
            #   + [−(π_j + _j V − v·_{j+1}V)]²·_1 p_{x+j}·p_{x+j} − 0²
            death_term = v * (b_j1 - V_j1)
            survival_term = -(pi_j + V_j - v * V_j1)

            # 简化：Var[Λ_j] = E[Λ_j²] = (death_term)²·q + (survival_term)²·p
            var_lambda = (death_term ** 2) * q_xj + (survival_term ** 2) * p_xj
            per_year_var[j - h] = var_lambda

        # 总方差 = Σ_{j=h}^{n-1} v^{2(j-h)} · Var[Λ_j]
        # 需要条件概率：P(K≥j | K≥h) = _{j-h}p_{x+h}
        total_var = 0.0
        for j in range(h, n):
            j_h_px = self.lt.t_px(float(j - h), float(x + h))
            total_var += (v ** (2 * (j - h))) * per_year_var[j - h] * j_h_px

        return float(total_var), per_year_var

    def hattendorf_portfolio_variance(self, x: int, n: int,
                                      policy_counts: List[int],
                                      benefits: Optional[List[float]] = None,
                                      premiums: Optional[List[float]] = None) -> float:
        """多保单组的 Hattendorf 方差（如例 10.3.2 + 例 10.5.1）

        policy_counts[k]: 第k年末仍有效的保单数
        """
        # 每张保单的方差相同，独立保单的方差相加
        single_var, _ = self.hattendorf_variance(x, 0, n, benefits, premiums)
        return float(single_var * sum(policy_counts))
