"""NetPremiumCalculator — 净保费计算器 (Ch8)

均衡净保费 = 精算现值(保险金) / 精算现值(年金)

支持完全连续、完全离散、半连续三种缴费模式。
"""

import numpy as np
from typing import Optional, Tuple
from actuarial.life_table import LifeTable, CL93M_TABLE
from actuarial.present_value import PresentValueCalculator


class NetPremiumCalculator:
    """净保费计算器。

    Parameters
    ----------
    pv : PresentValueCalculator
        精算现值计算器（已绑定生命表和利率）
    """

    def __init__(self, pv: Optional[PresentValueCalculator] = None):
        self.pv = pv or PresentValueCalculator()

    # ═══════════════════════════════════════════════════════
    # 完全连续险种
    # ═══════════════════════════════════════════════════════

    def Px_continuous(self, x: int) -> Tuple[float, float, float]:
        """P̄(Ā_x) = Ā_x / ā_x

        Returns
        -------
        (P, Ā_x, ā_x)
        """
        Ax, Ax2 = self.pv.Ax_continuous(x)
        ax, _ = self.pv.ax_continuous(x)
        if ax <= 0:
            return 0.0, Ax, ax
        return float(Ax / ax), Ax, ax

    def Px_term_continuous(self, x: int, n: int) -> Tuple[float, float, float, float]:
        """P̄(Ā¹_{x:n}) = Ā¹_{x:n} / ā_{x:n}"""
        Ax_term, Ax2_term = self.pv.Ax_term_continuous(x, n)
        ax_term, _ = self.pv.ax_term_continuous(x, n)
        if ax_term <= 0:
            return 0.0, Ax_term, 0.0, ax_term
        return float(Ax_term / ax_term), Ax_term, Ax2_term, ax_term

    # ═══════════════════════════════════════════════════════
    # 完全离散险种
    # ═══════════════════════════════════════════════════════

    def Px_discrete(self, x: int) -> Tuple[float, float, float]:
        """P_x = A_x / ä_x

        Returns
        -------
        (P_x, A_x, ä_x)
        """
        Ax, Ax2 = self.pv.Ax_discrete(x)
        ax_due, _ = self.pv.ax_due_discrete(x)
        if ax_due <= 0:
            return 0.0, Ax, ax_due
        return float(Ax / ax_due), Ax, ax_due

    def Px_term_discrete(self, x: int, n: int) -> Tuple[float, float, float, float]:
        """P¹_{x:n} = A¹_{x:n} / ä_{x:n}"""
        Ax_term, Ax2_term = self.pv.Ax_term_discrete(x, n)
        ax_term, _ = self.pv.ax_term_due_discrete(x, n)
        if ax_term <= 0:
            return 0.0, Ax_term, 0.0, ax_term
        return float(Ax_term / ax_term), Ax_term, Ax2_term, ax_term

    def Px_endowment_discrete(self, x: int, n: int) -> Tuple[float, float, float, float]:
        """P_{x:n} = A_{x:n} / ä_{x:n}"""
        A_en, A2_en = self.pv.endowment_insurance_discrete(x, n)
        ax_term, _ = self.pv.ax_term_due_discrete(x, n)
        if ax_term <= 0:
            return 0.0, A_en, 0.0, ax_term
        return float(A_en / ax_term), A_en, A2_en, ax_term

    def h_pay_Px_discrete(self, x: int, h: int) -> Tuple[float, float, float, float]:
        """_h P_x = A_x / ä_{x:h} — h年限期缴费的终身寿险净保费"""
        Ax, Ax2 = self.pv.Ax_discrete(x)
        ax_h, _ = self.pv.ax_term_due_discrete(x, h)
        if ax_h <= 0:
            return 0.0, Ax, 0.0, ax_h
        return float(Ax / ax_h), Ax, Ax2, ax_h

    # ═══════════════════════════════════════════════════════
    # 半连续险种
    # ═══════════════════════════════════════════════════════

    def Px_semi_continuous(self, x: int) -> Tuple[float, float, float]:
        """P(Ā_x) = Ā_x / ä_x — 保费离散缴纳、保额即时给付"""
        Ax_cont, Ax2_cont = self.pv.Ax_continuous(x)
        ax_due, _ = self.pv.ax_due_discrete(x)
        if ax_due <= 0:
            return 0.0, Ax_cont, ax_due
        return float(Ax_cont / ax_due), Ax_cont, ax_due

    # ═══════════════════════════════════════════════════════
    # 签单损失方差
    # ═══════════════════════════════════════════════════════

    def loss_variance_continuous(self, x: int) -> float:
        """完全连续险种签单损失方差：
        Var(L) = (²Ā_x − Ā_x²) / (δ·ā_x)²
        """
        Ax, Ax2 = self.pv.Ax_continuous(x)
        ax, _ = self.pv.ax_continuous(x)
        delta = self.pv.delta
        denom = (delta * ax) ** 2
        if denom <= 0:
            return float('inf')
        return float((Ax2 - Ax ** 2) / denom)

    def loss_variance_discrete(self, x: int) -> float:
        """完全离散险种签单损失方差：
        Var(L) = (²A_x − A_x²) / (d·ä_x)²
        """
        Ax, Ax2 = self.pv.Ax_discrete(x)
        ax_due, _ = self.pv.ax_due_discrete(x)
        d = self.pv.d
        denom = (d * ax_due) ** 2
        if denom <= 0:
            return float('inf')
        return float((Ax2 - Ax ** 2) / denom)

    # ═══════════════════════════════════════════════════════
    # 公式变换
    # ═══════════════════════════════════════════════════════

    def P_from_ax(self, ax: float, continuous: bool = False) -> float:
        """从年金现值反推保费：P = 1/ä − d（离散）或 P = 1/ā − δ（连续）"""
        if continuous:
            if ax <= 0:
                return float('inf')
            return 1.0 / ax - self.pv.delta
        else:
            if ax <= 0:
                return float('inf')
            return 1.0 / ax - self.pv.d

    def P_from_Ax(self, Ax: float, continuous: bool = False) -> float:
        """从保险现值反推保费：P = δ·A/(1−A) 或 P = d·A/(1−A)"""
        if Ax >= 1.0:
            return float('inf')
        factor = self.pv.delta if continuous else self.pv.d
        return float(factor * Ax / (1.0 - Ax))
