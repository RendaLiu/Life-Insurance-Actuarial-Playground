"""ASTEvaluator — 公式抽象语法树求值器

支持将公式表达式解析为 AST 并求值。
用于 Copilot 模式：LLM 生成公式 → AST → 数值结果。

支持的运算：
- 四则运算: +, −, *, /, ^
- 精算函数: t_px, t_qx, Ax, ax, Px, kV, pure_endowment, ...
- 求和 Σ, 积分 ∫
"""

import ast
import operator
import math
import numpy as np
from typing import Any, Callable, Dict, Optional


# ═══════════════════════════════════════════════════════════════
# 安全 AST 节点类型
# ═══════════════════════════════════════════════════════════════

class ASTNode:
    """AST 基类"""
    pass


class NumberNode(ASTNode):
    def __init__(self, value: float):
        self.value = value

    def __repr__(self):
        return f"Number({self.value})"


class VariableNode(ASTNode):
    def __init__(self, name: str):
        self.name = name

    def __repr__(self):
        return f"Var({self.name})"


class BinaryOpNode(ASTNode):
    def __init__(self, op: str, left: ASTNode, right: ASTNode):
        self.op = op
        self.left = left
        self.right = right

    def __repr__(self):
        return f"({self.left} {self.op} {self.right})"


class UnaryOpNode(ASTNode):
    def __init__(self, op: str, operand: ASTNode):
        self.op = op
        self.operand = operand

    def __repr__(self):
        return f"({self.op}{self.operand})"


class FunctionCallNode(ASTNode):
    def __init__(self, name: str, args: list[ASTNode]):
        self.name = name
        self.args = args

    def __repr__(self):
        args_str = ", ".join(str(a) for a in self.args)
        return f"{self.name}({args_str})"


class SumNode(ASTNode):
    """Σ_{k=start}^{end} expression"""
    def __init__(self, var: str, start: ASTNode, end: ASTNode, body: ASTNode):
        self.var = var
        self.start = start
        self.end = end
        self.body = body

    def __repr__(self):
        return f"Σ({self.var}={self.start}..{self.end}) {self.body}"


class IntegralNode(ASTNode):
    """∫_{a}^{b} expression dt"""
    def __init__(self, var: str, lower: ASTNode, upper: ASTNode, body: ASTNode):
        self.var = var
        self.lower = lower
        self.upper = upper
        self.body = body

    def __repr__(self):
        return f"∫({self.var}={self.lower}..{self.upper}) {self.body}"


# ═══════════════════════════════════════════════════════════════
# 词法分析器
# ═══════════════════════════════════════════════════════════════

TOKENS = {
    '+', '-', '*', '/', '^', '**',
    '(', ')', ',', '=', '∑', '∫',
}

FUNCTIONS = {
    'sqrt', 'exp', 'log', 'ln', 'abs',
    't_px', 't_qx', 'px', 'qx',
    'Ax', 'Ax_term', 'Ax_continuous',
    'ax', 'ax_due', 'ax_term',
    'Px', 'kV', 'tV',
    'pure_endowment', 'nEx',
}


class Token:
    def __init__(self, type_: str, value: Any):
        self.type = type_
        self.value = value

    def __repr__(self):
        return f"Token({self.type}, {self.value})"


# ═══════════════════════════════════════════════════════════════
# AST 求值器
# ═══════════════════════════════════════════════════════════════

BINARY_OPS = {
    '+': operator.add,
    '-': operator.sub,
    '*': operator.mul,
    '/': lambda a, b: a / b if b != 0 else float('inf'),
    '^': lambda a, b: a ** b,
    '**': operator.pow,
}

UNARY_OPS = {
    '-': operator.neg,
    '+': operator.pos,
}

BUILTIN_FUNCTIONS = {
    'sqrt': math.sqrt,
    'exp': math.exp,
    'log': math.log,
    'ln': math.log,
    'abs': abs,
}


class ASTEvaluator:
    """公式 AST 求值器。

    Parameters
    ----------
    variables : dict
        变量名 → 值的映射
    actuarial_functions : dict
        精算函数名 → callable 的映射
    """

    def __init__(self,
                 variables: Optional[Dict[str, float]] = None,
                 actuarial_functions: Optional[Dict[str, Callable]] = None):
        self.variables = variables or {}
        self.actuarial_functions = actuarial_functions or {}

    def evaluate(self, node: ASTNode) -> float:
        """递归求值 AST 节点"""
        if isinstance(node, NumberNode):
            return node.value
        elif isinstance(node, VariableNode):
            if node.name in self.variables:
                return self.variables[node.name]
            raise NameError(f"Variable '{node.name}' not found")
        elif isinstance(node, BinaryOpNode):
            left = self.evaluate(node.left)
            right = self.evaluate(node.right)
            if node.op in BINARY_OPS:
                return BINARY_OPS[node.op](left, right)
            raise ValueError(f"Unknown binary operator: {node.op}")
        elif isinstance(node, UnaryOpNode):
            operand = self.evaluate(node.operand)
            if node.op in UNARY_OPS:
                return UNARY_OPS[node.op](operand)
            raise ValueError(f"Unknown unary operator: {node.op}")
        elif isinstance(node, FunctionCallNode):
            args = [self.evaluate(a) for a in node.args]
            if node.name in BUILTIN_FUNCTIONS:
                return BUILTIN_FUNCTIONS[node.name](*args)
            if node.name in self.actuarial_functions:
                return self.actuarial_functions[node.name](*args)
            raise NameError(f"Function '{node.name}' not found")
        elif isinstance(node, SumNode):
            start = int(self.evaluate(node.start))
            end = int(self.evaluate(node.end))
            total = 0.0
            for k in range(start, end + 1):
                self.variables[node.var] = float(k)
                total += self.evaluate(node.body)
            return total
        elif isinstance(node, IntegralNode):
            lower = self.evaluate(node.lower)
            upper = self.evaluate(node.upper)
            # 数值积分：复化梯形法则
            steps = max(100, int((upper - lower) * 100))
            t_vals = np.linspace(lower, upper, steps + 1)
            integrand = np.zeros(steps + 1)
            for i, t in enumerate(t_vals):
                self.variables[node.var] = t
                integrand[i] = self.evaluate(node.body)
            if hasattr(np, 'trapezoid'):
                return float(np.trapezoid(integrand, t_vals))
            else:
                return float(np.trapz(integrand, t_vals))  # type: ignore[attr-defined]
        else:
            raise TypeError(f"Unknown AST node type: {type(node)}")

    def eval_string(self, expr_str: str) -> float:
        """求值字符串表达式（使用 Python 内置 ast 模块进行安全求值）"""
        expr_str = expr_str.strip()

        # 安全替代
        expr_str = expr_str.replace('^', '**')

        # 使用受限的 eval
        allowed_names = {
            **BUILTIN_FUNCTIONS,
            **self.actuarial_functions,
            **self.variables,
            'pi': math.pi,
            'e': math.e,
            'inf': float('inf'),
        }

        # 安全编译
        try:
            tree = ast.parse(expr_str, mode='eval')
            code = compile(tree, '<actuarial>', 'eval')
            result = eval(code, {"__builtins__": {}}, allowed_names)
            return float(result)
        except Exception as e:
            raise ValueError(f"Failed to evaluate '{expr_str}': {e}")

    # ─── AST 构建辅助 ────────────────────────────────────

    @staticmethod
    def number(value: float) -> NumberNode:
        return NumberNode(value)

    @staticmethod
    def var(name: str) -> VariableNode:
        return VariableNode(name)

    @staticmethod
    def binop(op: str, left: ASTNode, right: ASTNode) -> BinaryOpNode:
        return BinaryOpNode(op, left, right)

    @staticmethod
    def call(name: str, *args: ASTNode) -> FunctionCallNode:
        return FunctionCallNode(name, list(args))

    @staticmethod
    def summation(var: str, start: ASTNode, end: ASTNode,
                  body: ASTNode) -> SumNode:
        return SumNode(var, start, end, body)

    @staticmethod
    def integral(var: str, lower: ASTNode, upper: ASTNode,
                 body: ASTNode) -> IntegralNode:
        return IntegralNode(var, lower, upper, body)
