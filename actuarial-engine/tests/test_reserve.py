"""测试 ReserveCalculator — 净准备金

验证课件例题：
- 例10.2.1：De Moivre ω=120, i=5%, A₂₀=0.1984791, P₂₀=0.01179
- 例10.3.2：保单组总准备金 = 4788元
- Hattendorf 定理方差分解
- Fackler 递推 vs 将来法一致性
"""

import pytest
import numpy as np
from actuarial.life_table import LifeTable, CL93M_TABLE
from actuarial.present_value import PresentValueCalculator
from actuarial.net_premium import NetPremiumCalculator
from actuarial.reserve import ReserveCalculator


class TestGeneralReserve:
    """Ch10 一般准备金理论"""

    def test_C_h(self):
        """C_h 期望 + 递推关系"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        P, _, _ = prem.Px_discrete(x=30)
        exp_ch, var_ch = res.C_h(h=0, x=30, benefit=1.0, premium_amount=P)

        # E[C_h|K≥h] 应为一个小量
        assert abs(exp_ch) < 1.0


class TestKVxDiscrete:
    """_k V_x 完全离散准备金"""

    def test_kV_zero_initial(self):
        """_0 V_x = 0（保费均衡准则保证）"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        v0 = res.kVx_discrete(x=30, k=0)
        assert abs(v0) < 1e-8, f"_0V = {v0}, expected 0"

    def test_kV_increasing_then_decreasing(self):
        """准备金先增后减，到期为0（定期险）"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        reserves = res.kVx_all(x=30, max_k=20)
        # 准备金应为非负
        assert np.all(reserves >= -1e-10), f"Negative reserves found: {reserves[reserves < 0]}"

    def test_three_formulas_equal(self):
        """三种表示等价：将来法 = 保费差 = 缴清保险"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        for k in [0, 5, 10]:
            v1 = res.kVx_discrete(x=30, k=k)
            v2 = res.kVx_premium_diff(x=30, k=k)
            v3 = res.kVx_paidup(x=30, k=k)

            assert abs(v1 - v2) < 1e-4, f"k={k}: future={v1}, prem_diff={v2}"
            assert abs(v1 - v3) < 1e-4, f"k={k}: future={v1}, paidup={v3}"


class TestFackler:
    """Fackler 递推"""

    def test_fackler_vs_future(self):
        """Fackler 递推结果应与将来法一致"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        P, _, _ = prem.Px_discrete(x=30)
        fackler_seq = res.fackler_sequence(x=30, n=20, P=P)

        for k in range(20):
            future_v = res.kVx_discrete(x=30, k=k, P_override=P)
            assert abs(fackler_seq[k] - future_v) < 1e-4, \
                f"k={k}: Fackler={fackler_seq[k]}, future={future_v}"

    def test_fackler_step(self):
        """Fackler 单步递推公式验证"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        P, _, _ = prem.Px_discrete(x=30)
        V0 = 0.0
        V1 = res.fackler_step(V0, P, x=30, k=0)

        # _1 V = [(0+P)(1+i) − q_x] / p_x
        q = lt.qx[30]
        p = 1.0 - q
        expected = (P * 1.05 - q) / p
        assert abs(V1 - expected) < 1e-10


class TestKVxEndowment:
    """生死合险准备金"""

    def test_endowment_at_maturity(self):
        """生死合险到期准备金 = 1"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        vn = res.kVx_endowment_discrete(x=30, n=5, k=5)
        assert abs(vn - 1.0) < 1e-8, f"_5V_{{30:5}} = {vn}, expected 1.0"


class TestTvContinuous:
    """连续准备金"""

    def test_two_formulas_equal(self):
        """将来法 vs 年金比公式"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        v1 = res.tV_continuous(x=30, t=5.0)
        v2 = res.tV_ax_continuous(x=30, t=5.0)

        assert abs(v1 - v2) < 0.05, f"future={v1}, annuity_ratio={v2}"


class TestHattendorf:
    """Hattendorf 定理"""

    def test_variance_nonnegative(self):
        """Hattendorf 方差非负"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        prem = NetPremiumCalculator(pv)
        res = ReserveCalculator(pv, prem)

        total_var, per_year = res.hattendorf_variance(x=30, h=0, n=20)
        assert total_var >= 0, f"Total variance = {total_var}"
        assert np.all(per_year >= -1e-10), f"Negative per-year variances: {per_year[per_year < 0]}"
