"""SurvivalModel — 生存模型计算

提供独立于生命表的分析生存分布函数：
- De Moivre, Gompertz, Makeham, Weibull 死亡力模型
- t_px, t_qx, u|_t q_x
- complete/curtate 平均余命
- 各种分数年龄假设下的 μ_x(t)
"""

import numpy as np
from typing import Optional, Callable
from actuarial.life_table import LifeTable


# ═══════════════════════════════════════════════════════════════
# 死亡力模型（解析形式）
# ═══════════════════════════════════════════════════════════════

def de_moivre_mu(t: float, omega: float = 100.0) -> float:
    """De Moivre 死亡力: μ(t) = 1/(ω−t), 0 ≤ t < ω"""
    if t >= omega:
        return float('inf')
    return 1.0 / (omega - t)


def de_moivre_survival(t: float, omega: float = 100.0) -> float:
    """De Moivre 生存分布: s(t) = 1 − t/ω"""
    if t >= omega:
        return 0.0
    return 1.0 - t / omega


def de_moivre_t_px(t: float, x: float, omega: float = 100.0) -> float:
    """De Moivre 下 x 岁个体 _t p_x = (ω−x−t)/(ω−x)"""
    if x + t >= omega:
        return 0.0
    if x >= omega:
        return 0.0
    return (omega - x - t) / (omega - x)


def gompertz_mu(t: float, B: float, C: float = 1.0) -> float:
    """Gompertz 死亡力: μ(t) = B·C^t, B>0, C≥1"""
    return B * (C ** t)


def gompertz_survival(t: float, B: float, C: float = 1.0) -> float:
    """Gompertz 生存分布: s(t) = exp(−B·(C^t−1)/ln C)"""
    if C == 1.0:
        return np.exp(-B * t)
    return np.exp(-B * (C**t - 1) / np.log(C))


def makeham_mu(t: float, A: float, B: float, C: float = 1.0) -> float:
    """Makeham 死亡力: μ(t) = A + B·C^t"""
    return A + gompertz_mu(t, B, C)


def makeham_survival(t: float, A: float, B: float, C: float = 1.0) -> float:
    """Makeham 生存分布: s(t) = exp(−At − B·(C^t−1)/ln C)"""
    return np.exp(-A * t) * gompertz_survival(t, B, C)


def weibull_mu(t: float, k: float, n: float) -> float:
    """Weibull 死亡力: μ(t) = k·t^n, k>0, n>0"""
    return k * (t ** n)


def weibull_survival(t: float, k: float, n: float) -> float:
    """Weibull 生存分布: s(t) = exp(−k·t^{n+1}/(n+1))"""
    return np.exp(-k * (t ** (n + 1)) / (n + 1))


def exponential_mu(t: float, lam: float) -> float:
    """指数分布死亡力: μ(t) = λ（常数）"""
    return lam


def exponential_survival(t: float, lam: float) -> float:
    """指数分布生存: s(t) = e^{−λt}"""
    return np.exp(-lam * t)


# ═══════════════════════════════════════════════════════════════
# SurvivalModel 类
# ═══════════════════════════════════════════════════════════════

class SurvivalModel:
    """x 岁个体的生存模型。

    可以从 LifeTable 或解析生存函数构造。

    Parameters
    ----------
    life_table : LifeTable or None
        经验生命表（优先）
    survival_func : callable or None
        解析生存函数 s(t) = P(X > t)，新生儿的生存分布
    label : str
        模型描述
    """

    def __init__(self,
                 life_table: Optional[LifeTable] = None,
                 survival_func: Optional[Callable[[float], float]] = None,
                 label: str = "SurvivalModel"):
        self.life_table = life_table
        self._survival_func = survival_func
        self.label = label

    # ─── 生存/死亡概率 ─────────────────────────────────────

    def t_px(self, t: float, x: float) -> float:
        """_t p_x = P(T(x) > t)"""
        if t <= 0:
            return 1.0

        if self.life_table is not None:
            return self.life_table.t_px(t, x)

        if self._survival_func is not None:
            # _t p_x = s(x+t) / s(x)
            s_x = self._survival_func(x)
            if s_x <= 0:
                return 0.0
            return self._survival_func(x + t) / s_x

        raise ValueError("No life table or survival function provided")

    def t_qx(self, t: float, x: float) -> float:
        """_t q_x = P(T(x) ≤ t)"""
        return 1.0 - self.t_px(t, x)

    def u_given_t_qx(self, u: float, t: float, x: float) -> float:
        """_{u|}_t q_x = _u p_x · _t q_{x+u}"""
        upx = self.t_px(u, x)
        tqx_u = self.t_qx(t, x + u)
        return upx * tqx_u

    # ─── 死亡力 ───────────────────────────────────────────

    def mu_x(self, t: float, x: float) -> float:
        """μ_x(t) = f_{T(x)}(t) / _t p_x

        如果使用生命表，委托给 LifeTable.mu_x()
        """
        if self.life_table is not None:
            return self.life_table.mu_x(t, x)

        # 从解析生存函数计算
        if self._survival_func is not None:
            # μ(x+t) = −s'(x+t)/s(x+t)
            eps = 1e-6
            s1 = self._survival_func(x + t)
            s2 = self._survival_func(x + t + eps)
            if s1 <= 0:
                return float('inf')
            deriv = (s1 - s2) / eps
            return float(deriv / s1)

        raise ValueError("No model available")

    # ─── 平均余命 ─────────────────────────────────────────

    def curtate_ex(self, x: float) -> float:
        """整年平均余命 e_x = E[K(x)] = Σ_{k=1}^∞ _k p_x"""
        if self.life_table is not None:
            return self.life_table.curtate_ex(x)

        result = 0.0
        max_k = 150  # 安全上限
        for k in range(1, max_k):
            kpx = self.t_px(float(k), x)
            if kpx < 1e-15:
                break
            result += kpx
        return result

    def complete_ex(self, x: float, n_points: int = 5000) -> float:
        """完全平均余命 e̊_x = E[T(x)] = ∫_0^∞ _t p_x dt"""
        if self.life_table is not None:
            return self.life_table.complete_ex(x)

        # 数值积分
        max_t = 120.0
        dt = max_t / n_points
        t_values = np.linspace(0, max_t, n_points + 1)
        integrand = np.array([self.t_px(t, x) for t in t_values])

        # 梯形法则
        if hasattr(np, 'trapezoid'):
            result = np.trapezoid(integrand, t_values)
        else:
            result = np.trapz(integrand, t_values)
        return float(result)

    # ─── 工厂方法 ─────────────────────────────────────────

    @classmethod
    def from_life_table(cls, lt: LifeTable) -> "SurvivalModel":
        return cls(life_table=lt, label=f"LifeTable({lt.label})")

    @classmethod
    def de_moivre(cls, omega: float = 100.0) -> "SurvivalModel":
        """De Moivre 模型：f_X(t) = 1/ω, 0 ≤ t < ω"""
        lt = LifeTable.de_moivre(omega=omega)
        return cls(life_table=lt, label=f"De Moivre(ω={omega})")

    @classmethod
    def constant_force(cls, mu: float, max_age: int = 120) -> "SurvivalModel":
        """常数死亡力模型：μ(t) ≡ μ"""
        lt = LifeTable.constant_force(mu=mu, max_age=max_age)
        return cls(life_table=lt, label=f"ConstantForce(μ={mu})")

    @classmethod
    def exponential(cls, lam: float) -> "SurvivalModel":
        """指数分布：s(t) = e^{−λt}"""
        return cls(
            survival_func=lambda t: exponential_survival(t, lam),
            label=f"Exponential(λ={lam})"
        )

    @classmethod
    def uniform(cls, omega: float = 100.0) -> "SurvivalModel":
        """均匀分布（等同于 De Moivre）"""
        return cls.de_moivre(omega=omega)
