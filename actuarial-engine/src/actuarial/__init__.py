"""actuarial-engine — 纯 Python 寿险精算计算引擎

覆盖章节：Ch1（生存模型）、Ch4（保险现值）、Ch5（年金现值）、
         Ch8（净保费）、Ch9（费用负荷）、Ch10-12（准备金）

所有计算使用 numpy 向量化，纯函数无副作用。
测试用例使用课件例题的期望值做断言。
"""

from actuarial.life_table import LifeTable, CL93M_TABLE, CL93F_TABLE, make_custom_table
from actuarial.survival_model import SurvivalModel
from actuarial.present_value import PresentValueCalculator
from actuarial.net_premium import NetPremiumCalculator
from actuarial.reserve import ReserveCalculator
from actuarial.expense import ExpenseCalculator
from actuarial.dag import ComputeDAG
from actuarial.ast_evaluator import ASTEvaluator

__version__ = "0.1.0"
__all__ = [
    "LifeTable",
    "CL93M_TABLE",
    "CL93F_TABLE",
    "make_custom_table",
    "SurvivalModel",
    "PresentValueCalculator",
    "NetPremiumCalculator",
    "ReserveCalculator",
    "ExpenseCalculator",
    "ComputeDAG",
    "ASTEvaluator",
]
