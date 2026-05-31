"""测试 SurvivalModel — 生存模型

验证课件例题：
- 例1.2.1：De Moivre 分布，s(30)=0.7, μ(30)=1/70
- 例1.2.3：De Moivre 分布，e̊₀=50
- 例1.3.3：s(x)=√(1−x/100)，₁₇p₁₉=8/9, ₁₅q₃₆=1/8, ₁₅|₁₃q₃₆=1/8
"""

import pytest
import numpy as np
from actuarial.survival_model import (
    SurvivalModel,
    de_moivre_mu, de_moivre_survival, de_moivre_t_px,
    gompertz_mu, gompertz_survival,
    makeham_mu, makeham_survival,
    weibull_mu, weibull_survival,
    exponential_mu, exponential_survival,
)


class TestDeMoivre:
    """De Moivre (1729) 生存模型"""

    def test_mu_t(self):
        """例1.2.1：μ(t) = 1/(ω−t)。t=30, ω=100 → μ=1/70"""
        assert abs(de_moivre_mu(30, omega=100) - 1.0 / 70.0) < 1e-12

    def test_mu_t_at_limit(self):
        """t → ω 时 μ → ∞"""
        assert de_moivre_mu(99.999, omega=100) > 100
        # t ≥ ω 返回 inf
        assert de_moivre_mu(100, omega=100) == float('inf')

    def test_survival(self):
        """例1.2.1：s(30) = 1 − 30/100 = 0.7"""
        assert abs(de_moivre_survival(30, omega=100) - 0.7) < 1e-12
        assert abs(de_moivre_survival(0, omega=100) - 1.0) < 1e-12
        assert abs(de_moivre_survival(100, omega=100) - 0.0) < 1e-12

    def test_t_px(self):
        """De Moivre: _t p_x = (ω−x−t)/(ω−x)"""
        # 例1.2.1：_30 p_0 = 0.7
        assert abs(de_moivre_t_px(30, 0, omega=100) - 0.7) < 1e-12
        # _20 p_30 = (100−30−20)/(100−30) = 50/70 = 5/7
        assert abs(de_moivre_t_px(20, 30, omega=100) - 5.0 / 7.0) < 1e-12

    def test_complete_ex(self):
        """例1.2.3：De Moivre 下 e̊₀ = ω/2 = 50"""
        model = SurvivalModel.de_moivre(omega=100)
        e0 = model.complete_ex(0)
        assert abs(e0 - 50.0) < 1.0, f"e̊₀ = {e0}, expected ~50"


class TestCustomSurvival:
    """自定义生存函数"""

    def test_example_1_3_3(self):
        """例1.3.3：s(x) = √(1−x/100), 0≤x≤100

        计算结果：
        - ₁₇p₁₉ = s(36)/s(19) = √(1−0.36)/√(1−0.19) = √0.64/√0.81 = 0.8/0.9 = 8/9
        - ₁₅q₃₆ = 1 − ₁₅p₃₆ = 1 − s(51)/s(36) = 1 − √0.49/√0.64 = 1 − 0.7/0.8 = 1/8
        - ₁₅|₁₃q₃₆ = ₁₅p₃₆ · ₁₃q₅₁ = (s(51)/s(36)) · (1−s(64)/s(51))
          = (0.7/0.8) · (1−0.6/0.7) = (7/8)·(1/7) = 1/8
        """

        def s_custom(t):
            if t >= 100:
                return 0.0
            return np.sqrt(1.0 - t / 100.0)

        model = SurvivalModel(survival_func=s_custom)

        # ₁₇p₁₉
        tpx = model.t_px(17, 19)
        assert abs(tpx - 8.0 / 9.0) < 1e-12, f"17p19 = {tpx}, expected 8/9"

        # ₁₅q₃₆
        tqx = model.t_qx(15, 36)
        assert abs(tqx - 1.0 / 8.0) < 1e-12, f"15q36 = {tqx}, expected 1/8"

        # ₁₅|₁₃q₃₆
        u_t_qx = model.u_given_t_qx(15, 13, 36)
        assert abs(u_t_qx - 1.0 / 8.0) < 1e-12, f"15|13q36 = {u_t_qx}, expected 1/8"


class TestExponential:
    """指数分布"""

    def test_mu_constant(self):
        """指数分布死亡力为常数"""
        lam = 0.04
        assert abs(exponential_mu(0, lam) - 0.04) < 1e-12
        assert abs(exponential_mu(50, lam) - 0.04) < 1e-12

    def test_survival(self):
        """s(t) = e^{−λt}"""
        lam = 0.04
        assert abs(exponential_survival(10, lam) - np.exp(-0.4)) < 1e-12

    def test_complete_ex(self):
        """常数死亡力下 e̊_x = 1/μ"""
        mu = 0.04
        model = SurvivalModel.constant_force(mu=mu, max_age=120)
        e0 = model.complete_ex(0)
        expected = 1.0 / mu  # 25
        assert abs(e0 - expected) < 1.0, f"e̊₀ = {e0}, expected ~{expected}"


class TestGompertz:
    """Gompertz 死亡力"""

    def test_mu_increases(self):
        """Gompertz: μ(t) 随 t 递增"""
        B, C = 0.0001, 1.08
        assert gompertz_mu(60, B, C) > gompertz_mu(20, B, C)


class TestMakeham:
    """Makeham 死亡力"""

    def test_mu_greater_than_gompertz(self):
        """Makeham 包含额外的常数项 A"""
        A, B, C = 0.001, 0.0001, 1.08
        for t in [20, 40, 60]:
            assert makeham_mu(t, A, B, C) > gompertz_mu(t, B, C)


class TestWeibull:
    """Weibull 死亡力"""

    def test_mu_power_law(self):
        """μ(t) = k·t^n"""
        k, n = 0.001, 1.5
        assert abs(weibull_mu(10, k, n) - 0.001 * (10 ** 1.5)) < 1e-10


class TestSurvivalModelFromLT:
    """从 LifeTable 构造的 SurvivalModel"""

    def test_t_px_delegates(self):
        """应委托给 LifeTable.t_px()"""
        from actuarial.life_table import CL93M_TABLE
        model = SurvivalModel.from_life_table(CL93M_TABLE)
        assert abs(model.t_px(10, 20) - CL93M_TABLE.t_px(10, 20)) < 1e-12
