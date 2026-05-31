"""Pydantic 数据模型 — 所有 API 请求/响应"""

from pydantic import BaseModel, Field
from typing import Any, Optional, Literal


# ═══════════════════════════════════════════════════════════════
# 生命表
# ═══════════════════════════════════════════════════════════════

class LifeTableResponse(BaseModel):
    label: str
    radix: float
    omega: int
    lx: list[float]
    qx: list[float]


class CustomLifeTableRequest(BaseModel):
    label: str = "Custom"
    radix: float = 1_000_000.0
    lx: Optional[list[float]] = None
    qx: Optional[list[float]] = None
    start_age: int = 0


# ═══════════════════════════════════════════════════════════════
# 计算图
# ═══════════════════════════════════════════════════════════════

class DAGNode(BaseModel):
    id: str
    formula_id: str = Field(alias="formulaId")
    params: dict[str, Any] = {}


class DAGEdge(BaseModel):
    from_id: str = Field(alias="from")
    to_id: str = Field(alias="to")

    class Config:
        populate_by_name = True


class ComputeRequest(BaseModel):
    """POST /api/compute 请求体"""
    graph: dict = Field(description="包含 nodes 和 edges 的 DAG 定义")
    changed_nodes: Optional[list[str]] = Field(
        default=None, alias="changedNodes",
        description="参数发生变化的节点 ID 列表。None 表示全量求值。"
    )


class ComputeNodeResult(BaseModel):
    node_id: str
    formula_id: str
    value: Any = None
    status: str  # "ok" | "error"
    error: Optional[str] = None


class ComputeResponse(BaseModel):
    """POST /api/compute 响应"""
    results: dict[str, ComputeNodeResult]
    topological_order: list[str] = []
    error_nodes: list[str] = []
    compute_time_ms: float = 0.0


# ═══════════════════════════════════════════════════════════════
# 验证
# ═══════════════════════════════════════════════════════════════

class VerifyRequest(BaseModel):
    """POST /api/verify 请求体"""
    preset_id: str = Field(alias="presetId")
    computed_results: dict[str, float] = Field(alias="computedResults")
    tolerance: float = 1e-6


class VerifyNodeResult(BaseModel):
    expected: float
    actual: Optional[float] = None
    match: bool
    diff: Optional[float] = None
    error: Optional[str] = None


class VerifyResponse(BaseModel):
    """POST /api/verify 响应"""
    preset_id: str
    all_match: bool
    results: dict[str, VerifyNodeResult]
    summary: str


# ═══════════════════════════════════════════════════════════════
# 预设示例
# ═══════════════════════════════════════════════════════════════

class PresetSummary(BaseModel):
    id: str
    chapter: int
    section: str
    title: str
    description: str


class PresetDetail(PresetSummary):
    source_slide: str = ""
    nodes: list[dict]
    edges: list[dict]
    expected_results: dict[str, float]


class PresetListResponse(BaseModel):
    total: int
    by_chapter: dict[int, int]
    presets: list[PresetSummary]


# ═══════════════════════════════════════════════════════════════
# 公式/术语查询
# ═══════════════════════════════════════════════════════════════

class FormulaSummary(BaseModel):
    id: str
    symbol: str
    chapter: int
    category: str
    definition: str


class GlossaryEntry(BaseModel):
    id: str
    latex: str
    plain_text: str
    definition: str
    chapter: int
    category: str


class VerificationResult(BaseModel):
    """恒等式验证结果"""
    identity: str  # e.g. "δā_x + Ā_x = 1"
    lhs: float
    rhs: float = 1.0
    error: float
    ax: float
    A: float
