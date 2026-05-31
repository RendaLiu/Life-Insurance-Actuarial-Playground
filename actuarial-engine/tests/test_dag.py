"""测试 ComputeDAG — 计算图引擎"""

import pytest
import numpy as np
from actuarial.dag import ComputeDAG, ComputeNode, ComputeTrace


class TestDAGConstruction:
    """图构建"""

    def test_add_node(self):
        dag = ComputeDAG()
        node = ComputeNode(id="n1", formula_id="t_px", params={"t": 10, "x": 30})
        dag.add_node(node)
        assert "n1" in dag.nodes

    def test_add_edge(self):
        dag = ComputeDAG()
        dag.add_node(ComputeNode(id="n1", formula_id="input"))
        dag.add_node(ComputeNode(id="n2", formula_id="output"))
        dag.add_edge("n1", "n2")

        assert "n2" in dag._adj_out["n1"]
        assert "n1" in dag._adj_in["n2"]
        assert "n1" in dag.nodes["n2"].dependencies

    def test_remove_node(self):
        dag = ComputeDAG()
        dag.add_node(ComputeNode(id="n1", formula_id="a"))
        dag.add_node(ComputeNode(id="n2", formula_id="b"))
        dag.add_edge("n1", "n2")
        dag.remove_node("n1")

        assert "n1" not in dag.nodes
        assert len(dag.edges) == 0


class TestTopologicalSort:
    """拓扑排序"""

    def test_linear_chain(self):
        dag = ComputeDAG()
        for i in range(5):
            dag.add_node(ComputeNode(id=f"n{i}", formula_id=f"f{i}"))
        dag.add_edge("n0", "n1")
        dag.add_edge("n1", "n2")
        dag.add_edge("n2", "n3")
        dag.add_edge("n3", "n4")

        topo = dag.topological_sort()
        assert topo == ["n0", "n1", "n2", "n3", "n4"]

    def test_diamond(self):
        """菱形图：n0 → n1, n0 → n2, n1 → n3, n2 → n3"""
        dag = ComputeDAG()
        for i in range(4):
            dag.add_node(ComputeNode(id=f"n{i}", formula_id=f"f{i}"))
        dag.add_edge("n0", "n1")
        dag.add_edge("n0", "n2")
        dag.add_edge("n1", "n3")
        dag.add_edge("n2", "n3")

        topo = dag.topological_sort()
        # n0 第一, n3 最后, n1/n2 在中间
        assert topo[0] == "n0"
        assert topo[-1] == "n3"
        assert set(topo[1:3]) == {"n1", "n2"}

    def test_cycle_detection(self):
        """检测循环"""
        dag = ComputeDAG()
        dag.add_node(ComputeNode(id="a", formula_id="f1"))
        dag.add_node(ComputeNode(id="b", formula_id="f2"))
        dag.add_edge("a", "b")
        dag.add_edge("b", "a")  # 形成环

        with pytest.raises(ValueError, match="Cycle"):
            dag.topological_sort()


class TestDirtyPropagation:
    """脏标记传播"""

    def test_mark_dirty_downstream(self):
        dag = ComputeDAG()
        dag.add_node(ComputeNode(id="n0", formula_id="input"))
        dag.add_node(ComputeNode(id="n1", formula_id="mid"))
        dag.add_node(ComputeNode(id="n2", formula_id="output"))
        dag.add_node(ComputeNode(id="n3", formula_id="unrelated"))
        dag.add_edge("n0", "n1")
        dag.add_edge("n1", "n2")

        dag.update_param("n0", t=20.0)

        from actuarial.dag import NodeStatus
        assert dag.nodes["n0"].status == NodeStatus.DIRTY
        assert dag.nodes["n1"].status == NodeStatus.DIRTY
        assert dag.nodes["n2"].status == NodeStatus.DIRTY
        assert dag.nodes["n3"].status == NodeStatus.CLEAN  # 未受影响


class TestEvaluate:
    """求值"""

    def test_evaluate_with_compute_fn(self):
        """测试带计算函数的求值"""
        dag = ComputeDAG()

        def compute_tpx(params, upstream):
            t = params.get("t", 1)
            x = params.get("x", 20)
            # 简单模拟：_t p_x = 1 − 0.01·t
            return 1.0 - 0.01 * t

        dag.add_node(ComputeNode(
            id="life_table", formula_id="life_table",
            params={"table": "test"}, compute_fn=lambda p, u: "lt_data"
        ))
        dag.add_node(ComputeNode(
            id="tpx", formula_id="t_px",
            params={"t": 10, "x": 30}, compute_fn=compute_tpx,
            dependencies=["life_table"]
        ))
        dag.add_edge("life_table", "tpx")

        trace = dag.evaluate()
        assert trace.results["tpx"].status == "ok"
        assert abs(trace.results["tpx"].value - 0.9) < 1e-10

    def test_incremental_evaluate(self):
        """增量求值：只有变更节点的下游被重算"""
        dag = ComputeDAG()
        compute_count = {"tpx": 0, "output": 0}

        def counting_tpx(params, upstream):
            compute_count["tpx"] += 1
            return 1.0

        def counting_output(params, upstream):
            compute_count["output"] += 1
            upstream_val = upstream.get("tpx", 0)
            return upstream_val * 2.0

        dag.add_node(ComputeNode(id="tpx", formula_id="t_px",
                                  params={}, compute_fn=counting_tpx))
        dag.add_node(ComputeNode(id="output", formula_id="output",
                                  params={}, compute_fn=counting_output,
                                  dependencies=["tpx"]))
        dag.add_edge("tpx", "output")

        # 首次求值
        dag.evaluate()
        assert compute_count["tpx"] == 1
        assert compute_count["output"] == 1

        # 增量求值（只有 output 变 dirty）
        dag.update_param("tpx", x=50)
        dag.evaluate(changed_nodes=["tpx"])
        # tpx 被标记 dirty 后重算，output 也被标记 dirty
        assert compute_count["tpx"] >= 2
        assert compute_count["output"] >= 2


class TestFromPreset:
    """从预设导入"""

    def test_from_preset_dict(self):
        """从 PresetExample 格式导入"""
        preset = {
            "nodes": [
                {"id": "n1", "formulaId": "t_px", "params": {"t": 10, "x": 30}},
                {"id": "n2", "formulaId": "Ax", "params": {}},
                {"id": "n3", "formulaId": "Px", "params": {}},
            ],
            "edges": [
                {"from": "n1", "to": "n2"},
                {"from": "n2", "to": "n3"},
            ],
        }

        dag = ComputeDAG.from_preset(preset)
        assert len(dag.nodes) == 3
        assert len(dag.edges) == 2
        assert "n1" in dag.nodes["n2"].dependencies


class TestVerifyAgainstExpected:
    """验证期望值"""

    def test_verification(self):
        dag = ComputeDAG()
        dag.add_node(ComputeNode(id="n1", formula_id="test",
                                  params={"value": 0.8739}))
        dag.nodes["n1"].result = 0.8739  # 手动设置结果

        result = dag.verify_against_expected({"n1": 0.873899334}, tolerance=1e-3)
        assert result["n1"]["match"] is True

        result2 = dag.verify_against_expected({"n1": 0.8740}, tolerance=1e-8)
        assert result2["n1"]["match"] is False
