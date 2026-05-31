"""ComputeDAG — 计算图引擎

支持：
- 拓扑排序
- 脏标记传播
- 增量求值（仅重算变更节点的下游）
- 与前端 PresetExample 格式兼容
"""

from collections import deque
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
from enum import Enum


class NodeStatus(Enum):
    CLEAN = "clean"
    DIRTY = "dirty"
    COMPUTING = "computing"
    ERROR = "error"


@dataclass
class ComputeNode:
    """计算图中的一个节点"""
    id: str
    formula_id: str
    params: Dict[str, Any] = field(default_factory=dict)
    compute_fn: Optional[Callable[..., Any]] = None

    # 运行时状态
    status: NodeStatus = NodeStatus.CLEAN
    result: Any = None
    error: Optional[str] = None

    # 拓扑
    dependencies: List[str] = field(default_factory=list)   # 我依赖的节点 ID
    dependents: List[str] = field(default_factory=list)     # 依赖我的节点 ID


@dataclass
class ComputeEdge:
    """计算图中的边"""
    from_id: str
    to_id: str


@dataclass
class ComputeResult:
    """单次计算任务的结果"""
    node_id: str
    formula_id: str
    value: Any
    status: str  # "ok" | "error"
    error: Optional[str] = None


@dataclass
class ComputeTrace:
    """完整计算追踪"""
    results: Dict[str, ComputeResult] = field(default_factory=dict)
    topological_order: List[str] = field(default_factory=list)
    error_nodes: List[str] = field(default_factory=list)


class ComputeDAG:
    """计算有向无环图引擎。

    用法：
        dag = ComputeDAG()
        dag.add_node("n1", ComputeNode(id="n1", formula_id="t_px", params={"t":10,"x":30}))
        dag.add_edge("n1", "n2")
        trace = dag.evaluate()
    """

    def __init__(self):
        self.nodes: Dict[str, ComputeNode] = {}
        self.edges: List[ComputeEdge] = []
        self._adj_in: Dict[str, Set[str]] = {}   # node → 上游节点集合
        self._adj_out: Dict[str, Set[str]] = {}  # node → 下游节点集合

    # ─── 图构建 ───────────────────────────────────────────

    def add_node(self, node: ComputeNode) -> None:
        """添加节点"""
        self.nodes[node.id] = node
        if node.id not in self._adj_in:
            self._adj_in[node.id] = set()
        if node.id not in self._adj_out:
            self._adj_out[node.id] = set()

    def add_edge(self, from_id: str, to_id: str) -> None:
        """添加有向边 from → to（from 的输出是 to 的输入）"""
        self.edges.append(ComputeEdge(from_id=from_id, to_id=to_id))
        self._adj_out.setdefault(from_id, set()).add(to_id)
        self._adj_in.setdefault(to_id, set()).add(from_id)
        # 更新节点依赖关系
        if to_id in self.nodes:
            self.nodes[to_id].dependencies.append(from_id)
        if from_id in self.nodes:
            self.nodes[from_id].dependents.append(to_id)

    def remove_node(self, node_id: str) -> None:
        """删除节点及其关联边"""
        if node_id in self.nodes:
            # 删除入边
            for upstream in list(self._adj_in.get(node_id, set())):
                self._adj_out[upstream].discard(node_id)
            # 删除出边
            for downstream in list(self._adj_out.get(node_id, set())):
                self._adj_in[downstream].discard(node_id)
            # 删除节点
            del self.nodes[node_id]
            self._adj_in.pop(node_id, None)
            self._adj_out.pop(node_id, None)
            # 清理边列表
            self.edges = [e for e in self.edges
                          if e.from_id != node_id and e.to_id != node_id]

    def update_param(self, node_id: str, **params) -> None:
        """更新节点参数并将该节点及其所有下游标记为 dirty"""
        if node_id not in self.nodes:
            raise KeyError(f"Node '{node_id}' not found")
        self.nodes[node_id].params.update(params)
        self._mark_dirty_downstream(node_id)

    # ─── 脏标记传播 ─────────────────────────────────────

    def _mark_dirty_downstream(self, node_id: str) -> None:
        """从 node_id 开始，向下游传播脏标记（BFS）"""
        queue = deque([node_id])
        visited = set()

        while queue:
            curr = queue.popleft()
            if curr in visited:
                continue
            visited.add(curr)

            if curr in self.nodes:
                self.nodes[curr].status = NodeStatus.DIRTY
                self.nodes[curr].result = None

            for downstream in self._adj_out.get(curr, set()):
                if downstream not in visited:
                    queue.append(downstream)

    def _mark_all_dirty(self) -> None:
        """将所有节点标记为 dirty"""
        for node in self.nodes.values():
            node.status = NodeStatus.DIRTY
            node.result = None

    # ─── 拓扑排序 ────────────────────────────────────────

    def topological_sort(self) -> List[str]:
        """返回节点的拓扑排序列表（Kahn 算法）"""
        in_degree = {nid: len(self._adj_in.get(nid, set())) for nid in self.nodes}
        queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
        result = []

        while queue:
            curr = queue.popleft()
            result.append(curr)
            for downstream in self._adj_out.get(curr, set()):
                in_degree[downstream] -= 1
                if in_degree[downstream] == 0:
                    queue.append(downstream)

        if len(result) != len(self.nodes):
            # 检测循环
            remaining = set(self.nodes.keys()) - set(result)
            raise ValueError(f"Cycle detected in DAG! Nodes involved: {remaining}")

        return result

    # ─── 求值 ────────────────────────────────────────────

    def evaluate(self, changed_nodes: Optional[List[str]] = None) -> ComputeTrace:
        """增量求值计算图。

        Parameters
        ----------
        changed_nodes : list[str] or None
            参数发生变化的节点 ID 列表。None 表示全量求值。

        Returns
        -------
        ComputeTrace 包含每个节点的计算结果
        """
        if changed_nodes:
            for nid in changed_nodes:
                if nid in self.nodes:
                    self._mark_dirty_downstream(nid)
        else:
            self._mark_all_dirty()

        trace = ComputeTrace()
        try:
            topo = self.topological_sort()
        except ValueError as e:
            # 有环时将错误注入所有节点
            for nid in self.nodes:
                trace.results[nid] = ComputeResult(
                    node_id=nid,
                    formula_id=self.nodes[nid].formula_id,
                    value=None,
                    status="error",
                    error=str(e),
                )
            return trace

        trace.topological_order = topo

        # 按拓扑序求值
        for nid in topo:
            node = self.nodes[nid]
            if node.status != NodeStatus.DIRTY:
                # 干净节点：跳过
                if node.result is not None:
                    trace.results[nid] = ComputeResult(
                        node_id=nid,
                        formula_id=node.formula_id,
                        value=node.result,
                        status="ok",
                    )
                continue

            node.status = NodeStatus.COMPUTING

            try:
                # 收集上游结果
                upstream_results = {}
                for dep_id in node.dependencies:
                    dep_node = self.nodes.get(dep_id)
                    if dep_node and dep_node.result is not None:
                        upstream_results[dep_id] = dep_node.result
                    elif dep_id in trace.results:
                        upstream_results[dep_id] = trace.results[dep_id].value

                if node.compute_fn is not None:
                    result = node.compute_fn(node.params, upstream_results)
                else:
                    result = node.params.get("value", None)

                node.result = result
                node.status = NodeStatus.CLEAN
                node.error = None

                trace.results[nid] = ComputeResult(
                    node_id=nid,
                    formula_id=node.formula_id,
                    value=result,
                    status="ok",
                )

            except Exception as e:
                node.status = NodeStatus.ERROR
                node.error = str(e)
                trace.results[nid] = ComputeResult(
                    node_id=nid,
                    formula_id=node.formula_id,
                    value=None,
                    status="error",
                    error=str(e),
                )
                trace.error_nodes.append(nid)

                # 将下游标记为 dirty（因为有错误上游）
                self._mark_dirty_downstream(nid)

        return trace

    # ─── 导入/导出 ──────────────────────────────────────

    def to_dict(self) -> dict:
        """导出为字典（兼容前端 PresetExample 格式）"""
        return {
            "nodes": [
                {
                    "id": n.id,
                    "formula_id": n.formula_id,
                    "params": n.params,
                    "dependencies": n.dependencies,
                }
                for n in self.nodes.values()
            ],
            "edges": [
                {"from": e.from_id, "to": e.to_id}
                for e in self.edges
            ],
        }

    @classmethod
    def from_preset(cls, preset: dict,
                    registry: Optional[Dict[str, Callable]] = None) -> "ComputeDAG":
        """从预设示例（PresetExample）加载计算图。

        Parameters
        ----------
        preset : dict
            包含 nodes 和 edges 的预设定义
        registry : dict
            formula_id → 计算函数 的映射
        """
        dag = cls()

        # 先添加所有节点
        for n_data in preset.get("nodes", []):
            node = ComputeNode(
                id=n_data["id"],
                formula_id=n_data.get("formulaId", n_data.get("formula_id", "")),
                params=n_data.get("params", {}),
            )
            if registry and node.formula_id in registry:
                node.compute_fn = registry[node.formula_id]
            dag.add_node(node)

        # 再添加边
        for e_data in preset.get("edges", []):
            from_id = e_data.get("from", e_data.get("from_id", ""))
            to_id = e_data.get("to", e_data.get("to_id", ""))
            dag.add_edge(from_id, to_id)

        return dag

    def verify_against_expected(self, expected: Dict[str, float],
                                 tolerance: float = 1e-6) -> Dict[str, dict]:
        """验证计算结果与期望值。

        Returns
        -------
        { node_id: { "expected": ..., "actual": ..., "match": bool, "diff": float } }
        """
        result = {}
        for nid, expected_val in expected.items():
            node = self.nodes.get(nid)
            actual = node.result if node else None
            if actual is None:
                result[nid] = {
                    "expected": expected_val,
                    "actual": None,
                    "match": False,
                    "diff": None,
                    "error": "Node not found or not computed",
                }
            else:
                diff = abs(float(actual) - expected_val)
                result[nid] = {
                    "expected": expected_val,
                    "actual": float(actual),
                    "match": diff < tolerance,
                    "diff": diff,
                }
        return result
