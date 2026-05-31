"""ExpenseCalculator — 费用负荷保费计算器 (Ch9)

费用负荷保费 G = 净保费 + 费用附加

费用分类（课件 Ch9）：
- α: 新契约费（按保额比例）
- β: 保费收取费用（按毛保费比例）
- γ: 维持费用（按保额或固定金额）
- 初年度附加: α' + β'·G + γ'
- 续年度附加: β''·G + γ''

均衡准则：G·ä = E(Z) + E(费用)
→ G = (A + PV(费用)) / ä
"""

import numpy as np
from typing import Optional, Tuple
from actuarial.present_value import PresentValueCalculator


class ExpenseCalculator:
    """费用负荷保费计算器。

    Parameters
    ----------
    pv : PresentValueCalculator
    """

    def __init__(self, pv: Optional[PresentValueCalculator] = None):
        self.pv = pv or PresentValueCalculator()

    def expense_loaded_premium(self, x: int, n: int,
                                net_premium: Optional[float] = None,
                                alpha: float = 0.0,
                                beta: float = 0.0,
                                gamma: float = 0.0,
                                alpha_prime: float = 0.0,
                                beta_prime: float = 0.0,
                                gamma_prime: float = 0.0,
                                beta_double_prime: float = 0.0,
                                gamma_double_prime: float = 0.0,
                                benefit: float = 1.0) -> Tuple[float, dict]:
        """计算费用负荷保费 G。

        费用公式（每年）：
        - 初年度: α·b + β·G + γ
        - 续年度: β'·G + γ'

        均衡条件：G · ä = A + PV(初年费用) + PV(续年费用)

        Returns
        -------
        (G, breakdown) where breakdown = {
            'net_premium': 净保费,
            'expense_loading': 费用附加,
            'pv_expenses': 费用现值,
            'ax': 年金现值,
            'Ax': 保险现值,
        }
        """
        # 精算现值
        Ax, _ = self.pv.Ax_term_discrete(x, n, benefit)
        ax, _ = self.pv.ax_term_due_discrete(x, n)

        # 初年度费用现值（时刻0即付）
        pv_first_year = alpha * benefit + gamma_prime

        # 续年度费用现值
        pv_renewal = 0.0
        v = self.pv.v
        for k in range(1, n):
            kpx = self.pv.lt.t_px(float(k), float(x))
            pv_renewal += (v ** k) * kpx * gamma_double_prime

        pv_expenses = pv_first_year + pv_renewal

        # 费用负荷保费求解：
        # G·ä = (benefit·A + PV(expenses)) + β·G + β'·G·ä_{1:n-1}
        # G·(ä − β − β'·ä_{1:}) = benefit·A + PV(expenses)
        ax_renewal = 0.0
        for k in range(1, n):
            kpx = self.pv.lt.t_px(float(k), float(x))
            ax_renewal += (v ** k) * kpx

        effective_ax = ax - beta_prime * 1.0 - beta_double_prime * ax_renewal

        if effective_ax <= 0:
            G = float('inf')
        else:
            G = (Ax * benefit + pv_expenses) / effective_ax

        net_p = net_premium if net_premium is not None else (Ax / ax if ax > 0 else 0.0)

        return float(G), {
            'net_premium': float(net_p),
            'expense_loading': float(G - net_p),
            'pv_expenses': float(pv_expenses),
            'ax': float(ax),
            'Ax': float(Ax),
        }

    def simple_expense_premium(self, net_premium: float,
                                expense_load_rate: float = 0.10) -> float:
        """简化版费用负荷保费：G = net_premium / (1 − expense_load_rate)"""
        return net_premium / (1.0 - expense_load_rate)
