"""测试 LifeTable — 生命表类"""

import pytest
import numpy as np
from actuarial.life_table import LifeTable, CL93M_TABLE, CL93F_TABLE, make_custom_table


class TestCL93M:
    """CL93M 生命表关键值验证"""

    def test_cl93m_radix(self):
        lt = CL93M_TABLE
        assert lt.lx[0] == 1_000_000
        assert lt.radix == 1_000_000
        assert lt.label == "CL93M"

    def test_cl93m_l20(self):
        """课件例1.5.2：l₂₀ = 981,140"""
        l20 = CL93M_TABLE.lx[20]
        # CL93M l_20 应在 ~981,000 附近
        assert 978_000 < l20 < 984_000, f"l_20={l20}, expected ~981,140"

    def test_cl93m_l70(self):
        """课件例1.5.2: l₇₀ = 687,074"""
        l70 = CL93M_TABLE.lx[70]
        assert 680_000 < l70 < 695_000, f"l_70={l70}, expected ~687,074"

    def test_cl93m_l90(self):
        """课件例1.5.2: l₉₀ = 99,580"""
        l90 = CL93M_TABLE.lx[90]
        assert 95_000 < l90 < 105_000, f"l_90={l90}, expected ~99,580"

    def test_cl93m_l100(self):
        """课件例1.5.2: l₁₀₀ = 3,911"""
        l100 = CL93M_TABLE.lx[100]
        assert 3_500 < l100 < 4_500, f"l_100={l100}, expected ~3,911"

    def test_cl93m_omega(self):
        """极限年龄 l_ω = 0"""
        omega = CL93M_TABLE.omega
        assert CL93M_TABLE.lx[omega] <= 0
        assert CL93M_TABLE.lx[omega - 1] > 0

    def test_cl93m_qx_range(self):
        """q_x 应在 [0, 1] 范围内"""
        qx = CL93M_TABLE.qx
        valid = qx[:CL93M_TABLE.omega]
        assert np.all(valid >= 0)
        assert np.all(valid <= 1)

    def test_cl93m_px_complement(self):
        """p_x + q_x = 1"""
        px = CL93M_TABLE.px[:CL93M_TABLE.omega]
        qx = CL93M_TABLE.qx[:CL93M_TABLE.omega]
        assert np.allclose(px + qx, 1.0)

    def test_cl93m_dx_consistency(self):
        """d_x = l_x − l_{x+1}"""
        for x in range(CL93M_TABLE.omega):
            expected_dx = CL93M_TABLE.lx[x] - CL93M_TABLE.lx[x + 1]
            assert abs(CL93M_TABLE.dx[x] - expected_dx) < 1e-10


class TestCL93F:
    """CL93F 生命表基本检查"""

    def test_cl93f_radix(self):
        assert CL93F_TABLE.lx[0] == 1_000_000

    def test_cl93f_female_lower_mortality(self):
        """女性死亡率应整体低于男性"""
        # 老年段女性 l_x 应大于同年龄男性
        assert CL93F_TABLE.lx[70] > CL93M_TABLE.lx[70]


class TestLifeTableTPX:
    """t_px 计算"""

    def test_t_px_zero(self):
        """_0 p_x = 1"""
        assert CL93M_TABLE.t_px(0.0, 30.0) == 1.0

    def test_t_px_negative(self):
        """t ≤ 0 时 _t p_x = 1"""
        assert CL93M_TABLE.t_px(-1.0, 30.0) == 1.0

    def test_t_px_beyond_omega(self):
        """超过极限年龄后 _t p_x = 0"""
        omega = CL93M_TABLE.omega
        assert CL93M_TABLE.t_px(float(omega + 10), 0.0) == 0.0

    def test_t_px_identity_kpx(self):
        """_k p_x = l_{x+k} / l_x (整数 k)"""
        for x, k in [(20, 10), (30, 20), (50, 15)]:
            expected = CL93M_TABLE.lx[x + k] / CL93M_TABLE.lx[x]
            actual = CL93M_TABLE.t_px(float(k), float(x))
            assert abs(actual - expected) < 1e-12, f"_t_px({k},{x}) failed: {actual} vs {expected}"

    def test_1_px_equals_px(self):
        """_1 p_x = p_x"""
        for x in [20, 30, 50, 70]:
            expected = CL93M_TABLE.px[x]
            actual = CL93M_TABLE.t_px(1.0, float(x))
            assert abs(actual - expected) < 1e-12

    def test_fractional_udd(self):
        """UDD 假设下 _0.5 p_x = 1 − 0.5·q_x"""
        x = 50
        q = CL93M_TABLE.qx[x]
        expected = 1.0 - 0.5 * q
        actual = CL93M_TABLE.t_px(0.5, float(x), assumption="udd")
        assert abs(actual - expected) < 1e-12

    def test_fractional_constant_force(self):
        """常数死亡力下 _t p_x = p_x^t"""
        x = 50
        p = CL93M_TABLE.px[x]
        t = 0.5
        expected = p ** t
        actual = CL93M_TABLE.t_px(t, float(x), assumption="constant_force")
        # 允许小的数值误差（指数插值 vs 锚点近似）
        assert abs(actual - expected) < 1e-4


class TestLifeTableTQX:
    """t_qx 计算"""

    def test_t_qx_complement(self):
        """_t q_x = 1 − _t p_x"""
        for t, x in [(1, 30), (5, 40), (10, 50)]:
            assert abs(CL93M_TABLE.t_qx(float(t), float(x))
                       - (1.0 - CL93M_TABLE.t_px(float(t), float(x)))) < 1e-12


class TestLifeTableCustom:
    """自定义生命表"""

    def test_custom_from_qx(self):
        """从 q_x 序列构造"""
        lt = LifeTable.custom(l0=100000.0, qx=[0.01, 0.02, 0.03], start_age=20)
        assert lt.lx[20] == 100000.0
        assert abs(lt.lx[21] - 99000.0) < 1e-10  # 100000 * 0.99
        assert abs(lt.lx[22] - 97020.0) < 1e-10  # 99000 * 0.98

    def test_de_moivre(self):
        """De Moivre 生命表：l_x = l_0(1 − x/ω)"""
        omega = 100.0
        lt = LifeTable.de_moivre(omega=omega)
        assert lt.lx[0] == 1_000_000
        assert lt.lx[50] == 500_000  # 一半
        assert lt.lx[int(omega)] == 0.0

    def test_de_moivre_t_px(self):
        """De Moivre: _t p_x = (ω−x−t)/(ω−x)"""
        omega = 100.0
        lt = LifeTable.de_moivre(omega=omega)
        # _30 p_0 = (100-0-30)/100 = 0.7
        assert abs(lt.t_px(30, 0) - 0.7) < 1e-12


class TestLifeTableCompleteEX:
    """平均余命"""

    def test_de_moivre_complete_ex(self):
        """De Moivre: e̊₀ = ω/2"""
        omega = 100.0
        lt = LifeTable.de_moivre(omega=omega)
        e0 = lt.complete_ex(0, assumption="udd")
        # 期望 ≈ 50（精确值 = ω/2 = 50）
        assert abs(e0 - 50.0) < 1.0, f"e̊₀ = {e0}, expected ~50"

    def test_cl93m_complete_ex_increasing(self):
        """平均余命应随年龄递减"""
        e20 = CL93M_TABLE.complete_ex(20)
        e50 = CL93M_TABLE.complete_ex(50)
        e70 = CL93M_TABLE.complete_ex(70)
        assert e20 > e50 > e70, f"e20={e20}, e50={e50}, e70={e70}"


class TestMakeCustomTable:
    """make_custom_table 便捷函数"""

    def test_basic(self):
        lt = make_custom_table(l0=100000.0, qx=[0.01, 0.02, 0.03])
        assert lt.lx[0] == 100000.0
        assert abs(lt.qx[0] - 0.01) < 1e-10
