"""测试 ASTEvaluator — 公式 AST 求值器"""

import pytest
import numpy as np
from actuarial.ast_evaluator import (
    ASTEvaluator, ASTNode,
    NumberNode, VariableNode, BinaryOpNode, FunctionCallNode, SumNode,
)


class TestASTConstruction:
    """AST 节点构造"""

    def test_number_node(self):
        n = NumberNode(3.14)
        assert n.value == 3.14

    def test_variable_node(self):
        v = VariableNode("x")
        assert v.name == "x"

    def test_binary_op_node(self):
        left = NumberNode(1)
        right = NumberNode(2)
        op = BinaryOpNode("+", left, right)
        assert op.op == "+"

    def test_function_call_node(self):
        args = [NumberNode(1), NumberNode(2)]
        fn = FunctionCallNode("max", args)
        assert fn.name == "max"
        assert len(fn.args) == 2


class TestASTEvaluation:
    """求值"""

    def test_number(self):
        evaluator = ASTEvaluator()
        assert evaluator.evaluate(NumberNode(42.0)) == 42.0

    def test_variable(self):
        evaluator = ASTEvaluator(variables={"x": 10.0, "y": 20.0})
        assert evaluator.evaluate(VariableNode("x")) == 10.0
        assert evaluator.evaluate(VariableNode("y")) == 20.0

    def test_unknown_variable(self):
        evaluator = ASTEvaluator()
        with pytest.raises(NameError):
            evaluator.evaluate(VariableNode("unknown"))

    def test_binary_ops(self):
        evaluator = ASTEvaluator()
        tests = [
            ("+", 3, 4, 7),
            ("-", 10, 3, 7),
            ("*", 6, 7, 42),
            ("/", 10, 2, 5),
            ("^", 2, 3, 8),
        ]
        for op, a, b, expected in tests:
            node = BinaryOpNode(op, NumberNode(a), NumberNode(b))
            assert abs(evaluator.evaluate(node) - expected) < 1e-10, f"op={op}"

    def test_builtin_functions(self):
        evaluator = ASTEvaluator()
        node = FunctionCallNode("sqrt", [NumberNode(16)])
        assert evaluator.evaluate(node) == 4.0

        node2 = FunctionCallNode("exp", [NumberNode(0)])
        assert abs(evaluator.evaluate(node2) - 1.0) < 1e-10

    def test_actuarial_function(self):
        def mock_t_px(t, x):
            return 1.0 - 0.01 * t

        evaluator = ASTEvaluator(
            actuarial_functions={"t_px": mock_t_px}
        )
        node = FunctionCallNode("t_px", [NumberNode(10), NumberNode(30)])
        assert abs(evaluator.evaluate(node) - 0.9) < 1e-10

    def test_nested_expression(self):
        """复杂嵌套表达式：(2 + 3) * (x + 1) where x = 4"""
        # (2 + 3) = 5
        left = BinaryOpNode("+", NumberNode(2), NumberNode(3))
        # (x + 1) = 5
        right = BinaryOpNode("+", VariableNode("x"), NumberNode(1))
        # 5 * 5 = 25
        root = BinaryOpNode("*", left, right)

        evaluator = ASTEvaluator(variables={"x": 4.0})
        assert evaluator.evaluate(root) == 25.0


class TestEvalString:
    """eval_string 方法"""

    def test_simple_arithmetic(self):
        evaluator = ASTEvaluator(variables={"x": 10, "y": 20})
        assert evaluator.eval_string("x + y") == 30.0
        assert evaluator.eval_string("2 + 3 * 4") == 14.0
        assert evaluator.eval_string("(2 + 3) * 4") == 20.0

    def test_builtins(self):
        evaluator = ASTEvaluator()
        assert evaluator.eval_string("sqrt(16)") == 4.0
        assert evaluator.eval_string("exp(0)") == 1.0
        assert evaluator.eval_string("abs(-5)") == 5.0

    def test_pi_e(self):
        evaluator = ASTEvaluator()
        assert abs(evaluator.eval_string("pi") - 3.1415926535) < 1e-5
        assert abs(evaluator.eval_string("e") - 2.7182818) < 1e-5

    def test_error_handling(self):
        evaluator = ASTEvaluator()
        with pytest.raises(ValueError):
            evaluator.eval_string("import os")  # 不安全调用
