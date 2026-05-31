"""测试 ExpenseCalculator — 费用负荷保费 (Ch9)"""

import pytest
import numpy as np
from actuarial.life_table import LifeTable
from actuarial.present_value import PresentValueCalculator
from actuarial.expense import ExpenseCalculator


class TestExpenseLoadedPremium:
    """费用负荷保费 G"""

    def test_g_gt_net_premium(self):
        """G > 净保费（费用附加为正）"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        calc = ExpenseCalculator(pv)

        G, breakdown = calc.expense_loaded_premium(
            x=30, n=20,
            gamma_prime=0.01,  # 初年固定费用
            gamma_double_prime=0.005,  # 续年固定费用
        )
        assert G > breakdown['net_premium'], f"G={G}, net={breakdown['net_premium']}"

    def test_simple_expense_premium(self):
        """简化版：G = net / (1−rate)"""
        calc = ExpenseCalculator()
        G = calc.simple_expense_premium(net_premium=100.0, expense_load_rate=0.15)
        assert abs(G - 100.0 / 0.85) < 1e-10


class TestExpenseBreakdown:
    """费用分解"""

    def test_all_nonnegative(self):
        """G 的所有组成部分非负"""
        lt = LifeTable.de_moivre(omega=100)
        pv = PresentValueCalculator(lt, i=0.05)
        calc = ExpenseCalculator(pv)

        G, breakdown = calc.expense_loaded_premium(
            x=30, n=20,
            gamma_prime=0.02,
            gamma_double_prime=0.01,
        )

        assert G >= 0
        assert breakdown['net_premium'] >= 0
        assert breakdown['expense_loading'] >= 0
        assert breakdown['pv_expenses'] >= 0
        assert breakdown['ax'] > 0
        assert breakdown['Ax'] > 0
