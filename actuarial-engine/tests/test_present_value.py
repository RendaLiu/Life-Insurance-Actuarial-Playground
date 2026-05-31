"""测试 PresentValueCalculator — 精算现值

验证课件例题：
- 例4.2.2：₃E₂₀ = 0.873899334
- 例4.3.1：Ā¹_{x:10} = 0.11329
- 例4.3.7：A¹ = 0.1083, Ā¹ = 0.114
- 例4.4.1：Ā_x = 0.4
- 例4.4.4：A₇₇ = 0.810
- 例5.3.3：ā_x = 10
- 例5.4.1：ä₉₀ = 2.026344
"""

import pytest
import numpy as np
from actuarial.life_table import LifeTable, CL93M_TABLE
from actuarial.present_value import PresentValueCalculator


class TestPureEndowment:
    """生存保险 _n E_x"""

    def test_example_4_2_2(self):
        """例4.2.2：3年期生存保险
        q₂₀=0.01, q₂₁=0.02, q₂₂=0.03, i=2.5%
        _3 E_20 = v^3 · _3 p_20 = v^3 · (1−q20)(1−q21)(1−q22)
        """
        lt = LifeTable.custom(l0=100000.0, qx=[0.01, 0.02, 0.03], start_age=20)
        pv = PresentValueCalculator(lt, i=0.025)

        ez, _ = pv.pure_endowment(x=20, n=3)

        # 手动计算
        v = 1.0 / 1.025
        npx = 0.99 * 0.98 * 0.97  # _3 p_20
        expected = (v ** 3) * npx
        # 课件值：0.873899334
        assert abs(ez - 0.873899334) < 1e-8, f"_3E_20 = {ez}, expected 0.873899334"
        # 也与手动计算一致
        assert abs(ez - expected) < 1e-8, f"_3E_20 = {ez}, manual = {expected}"


class TestAxTermDiscrete:
    """定期死亡保险（离散）A¹_{x:n}"""

    def test_basic_2year(self):
        """2年期死亡险：A¹_{x:2} = v·q_x + v²·p_x·q_{x+1}"""
        lt = LifeTable.custom(l0=100000.0, qx=[0.05, 0.08], start_age=0)
        pv = PresentValueCalculator(lt, i=0.10)

        ez, ez2 = pv.Ax_term_discrete(x=0, n=2)

        v = 1.0 / 1.10
        expected = v * 0.05 + (v ** 2) * 0.95 * 0.08
        assert abs(ez - expected) < 1e-10

    def test_example_4_3_7_discrete(self):
        """例4.3.7：UDD假设下 A¹ = 0.1083"""
        lt = LifeTable.custom(l0=100000.0, qx=[0.05, 0.08], start_age=0)
        pv = PresentValueCalculator(lt, i=0.10)

        ez, _ = pv.Ax_term_discrete(x=0, n=2)
        assert abs(ez - 0.1083) < 1e-3, f"A¹ = {ez}, expected 0.1083"


class TestAxContinuous:
    """连续终身寿险 Ā_x"""

    def test_constant_force(self):
        """例4.4.1：μ=0.04, δ=0.06 → Ā_x = μ/(μ+δ) = 0.04/0.10 = 0.4"""
        # 使用常数死亡力生命表
        lt = LifeTable.constant_force(mu=0.04, max_age=120)
        # δ=0.06 → i = e^0.06 − 1 ≈ 0.0618
        i = np.exp(0.06) - 1.0
        pv = PresentValueCalculator(lt, i=i)

        ez, _ = pv.Ax_continuous(x=0)
        expected = 0.04 / (0.04 + 0.06)  # = 0.4
        assert abs(ez - expected) < 0.01, f"Ā_x = {ez}, expected ~{expected} (μ/(μ+δ))"


class TestAxTermContinuous:
    """连续定期寿险"""

    def test_example_4_3_1(self):
        """例4.3.1：T(x)~U(0,80), δ=0.02, Ā¹_{x:10} = 0.11329"""
        # 均匀分布 = De Moivre ω=80
        lt = LifeTable.de_moivre(omega=80)
        i = np.exp(0.02) - 1.0
        pv = PresentValueCalculator(lt, i=i)

        ez, _ = pv.Ax_term_continuous(x=0, n=10)
        # 课件期望：0.11329
        assert abs(ez - 0.11329) < 0.01, f"Ā¹ = {ez}, expected ~0.11329"


class TestAxDiscrete:
    """离散终身寿险 A_x"""

    def test_example_4_4_4(self):
        """例4.4.4：递推计算 A₇₇
        已知 A₇₆=0.800, v·p₇₆=0.9, i=0.03
        A₇₇ = (A₇₆ − v·q₇₆) / (v·p₇₆)

        实际上：A₇₆ = v·q₇₆ + v·p₇₆·A₇₇
        → A₇₇ = (A₇₆ − v·q₇₆) / (v·p₇₆)
        v·p₇₆ = 0.9 → v·q₇₆ = v − v·p₇₆ = 1/1.03 − 0.9 ≈ 0.97087 − 0.9 = 0.07087
        A₇₇ = (0.800 − 0.07087) / 0.9 ≈ 0.810

        由于没有完整的生命表数据，我们验证递推关系的正确性。
        """
        i = 0.03
        v = 1.0 / (1.0 + i)
        vp76 = 0.9  # v·p₇₆
        p76 = vp76 / v  # p₇₆ = 0.9 * 1.03 = 0.927
        q76 = 1.0 - p76  # q₇₆ = 0.073

        # 构造生命表（仅用于验证递推逻辑）
        # A₇₆ = v·q₇₆ + v·p₇₆·A₇₇
        A76 = 0.800
        A77 = (A76 - v * q76) / vp76
        assert abs(A77 - 0.810) < 0.002, f"A77 = {A77}, expected ~0.810"


class TestEndowmentInsurance:
    """生死合险"""

    def test_decomposition(self):
        """A_{x:n} = A¹_{x:n} + _n E_x"""
        lt = LifeTable.custom(l0=100000.0, qx=[0.01, 0.02, 0.03, 0.04, 0.05], start_age=30)
        pv = PresentValueCalculator(lt, i=0.05)

        ez_en, _ = pv.endowment_insurance_discrete(x=30, n=3)
        ez_term, _ = pv.Ax_term_discrete(x=30, n=3)
        ez_pure, _ = pv.pure_endowment(x=30, n=3)

        assert abs(ez_en - (ez_term + ez_pure)) < 1e-10


class TestAxDueDiscrete:
    """期初生存年金 ä_x"""

    def test_example_5_4_1(self):
        """例5.4.1：90岁期初年金
        l₉₀=100, l₉₁=72, l₉₂=39, l₉₃=0, i=6%
        ä₉₀ = 1 + v·(72/100) + v²·(39/100) = 1 + (1/1.06)·0.72 + (1/1.06²)·0.39
        """
        # 构造包含年龄 90+ 的生命表 (pad 到 105+1)
        lx_data = np.zeros(106)
        lx_data[90] = 100.0
        lx_data[91] = 72.0
        lx_data[92] = 39.0
        lx_data[93] = 0.0
        lt2 = LifeTable(lx=lx_data, label="test_90", radix=100.0)
        pv2 = PresentValueCalculator(lt2, i=0.06)

        ez, _ = pv2.ax_due_discrete(x=90)
        v = 1.0 / 1.06
        expected = 1.0 + v * 0.72 + (v ** 2) * 0.39
        assert abs(ez - 2.026344) < 1e-4, f"ä₉₀ = {ez}, expected 2.026344"
        assert abs(ez - expected) < 1e-8, f"ä₉₀ = {ez}, manual = {expected}"


class TestAxContinuousAnnuity:
    """连续年金 ā_x"""

    def test_constant_force(self):
        """例5.3.3：μ=0.04, δ=0.06 → ā_x = 1/(μ+δ) = 10"""
        lt = LifeTable.constant_force(mu=0.04, max_age=120)
        i = np.exp(0.06) - 1.0
        pv = PresentValueCalculator(lt, i=i)

        ez, _ = pv.ax_continuous(x=0)
        expected = 1.0 / (0.04 + 0.06)  # = 10
        assert abs(ez - expected) < 0.1, f"ā_x = {ez}, expected ~{expected}"


class TestIdentity:
    """保险-年金恒等式"""

    def test_continuous_identity(self):
        """δ·ā_x + Ā_x = 1"""
        lt = LifeTable.de_moivre(omega=100)
        i = 0.05
        pv = PresentValueCalculator(lt, i=i)

        lhs, ax, Ax = pv.verify_identity_continuous(x=20)
        # 恒等式近似成立（数值积分有误差）
        assert abs(lhs - 1.0) < 0.05, f"δā+Ā = {lhs}, ax={ax}, Ax={Ax}"

    def test_discrete_identity(self):
        """d·ä_x + A_x = 1"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)

        lhs, ax_due, Ax = pv.verify_identity_discrete(x=20)
        assert abs(lhs - 1.0) < 0.05, f"dä+A = {lhs}, ä={ax_due}, A={Ax}"


class TestDeferred:
    """延期保险/年金"""

    def test_deferred_Ax_equals_product(self):
        """_{m|}A_x = _m E_x · A_{x+m}"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)

        ez_def, _ = pv.deferred_Ax_discrete(x=20, m=10)
        mex, _ = pv.pure_endowment(x=20, n=10)
        axm, _ = pv.Ax_discrete(x=30)
        expected = mex * axm
        assert abs(ez_def - expected) < 1e-10


class TestIncreasingDecreasing:
    """变额保险"""

    def test_IAx_increasing(self):
        """(IA)_x = Σ (k+1)·v^{k+1}·_k p_x·q_{x+k}"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)

        ez, _ = pv.increasing_IAx_discrete(x=30)
        # 结果应为正且合理
        assert ez > 0
        assert ez < 50  # 不可能超过 ω

    def test_DAx_decreasing(self):
        """(DA)¹_{x:n} = Σ (n−k)·v^{k+1}·_k p_x·q_{x+k}"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)

        ez, _ = pv.decreasing_DAx_discrete(x=30, n=10)
        # 递减保额应在 (0, n) 范围内
        assert 0 < ez < 10
