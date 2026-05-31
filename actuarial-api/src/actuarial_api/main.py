"""寿险精算 Playground — FastAPI 后端

启动:
    uvicorn actuarial_api.main:app --reload --port 8000

端点:
    POST /api/compute         — 工作流 DAG 增量求值
    POST /api/verify          — 对比计算结果与课件期望值
    GET  /api/lifetable/{name}— 获取生命表数据
    POST /api/lifetable       — 上传自定义生命表
    GET  /api/presets         — 列出所有课件预设示例
    GET  /api/identity/verify — 验证保险-年金恒等式
    GET  /api/health          — 健康检查
"""

import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from actuarial_api.schemas import (
    ComputeRequest, ComputeResponse, ComputeNodeResult,
    VerifyRequest, VerifyResponse, VerifyNodeResult,
    LifeTableResponse, CustomLifeTableRequest,
    PresetSummary, PresetDetail, PresetListResponse,
    VerificationResult,
)
from actuarial_api.engine import (
    get_life_table, register_life_table,
    run_dag, build_formula_registry,
)
from actuarial.life_table import LifeTable, CL93M_TABLE, CL93F_TABLE

# ═══════════════════════════════════════════════════════════════
# App 初始化
# ═══════════════════════════════════════════════════════════════

app = FastAPI(
    title="寿险精算 Playground API",
    description="Life Insurance Actuarial Computation Engine",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — 允许前端开发服务器
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════
# 预设数据加载（从 TypeScript registry 的 JSON 镜像）
# ═══════════════════════════════════════════════════════════════

_PRESETS_FILE = Path(__file__).parent.parent.parent.parent / "actuarial-playground" / "src" / "registry"

# 硬编码预设摘要（从 presets.ts 提取，避免 Python 解析 TS）
_HARDCODED_PRESETS: list[dict] = [
    # Ch1
    {"id": "ch1_ex_1_2_1", "chapter": 1, "section": "1.2 生存分布", "title": "例1.2.1：De Moivre 分布的生存函数与死亡力", "description": "密度函数 f(t)=1/w。s(30)=0.7, μ(30)=1/70。", "expected": {"survival": 0.7, "mu_out": 1/70}},
    {"id": "ch1_ex_1_2_2", "chapter": 1, "section": "1.2 生存分布", "title": "例1.2.2：指数分布的死亡力", "description": "s(t)=e^{-λt}。求死亡力 μ(t)=λ。", "expected": {}},
    {"id": "ch1_ex_1_2_3", "chapter": 1, "section": "1.2 生存分布", "title": "例1.2.3：De Moivre 分布的完全平均余命", "description": "f(t)=1/w。e̊₀=0.5w=50。", "expected": {"e0_ring": 50}},
    {"id": "ch1_ex_1_3_3", "chapter": 1, "section": "1.3 x岁个体的生存分布", "title": "例1.3.3：已知 s(x)=√(1−x/100) 计算概率", "description": "₁₇p₁₉=8/9, ₁₅q₃₆=1/8, ₁₅|₁₃q₃₆=1/8。", "expected": {"tpx_17_19": 8/9, "tqx_15_36": 1/8, "u_t_qx": 1/8}},
    {"id": "ch1_ex_1_4_4", "chapter": 1, "section": "1.4 随机生存群", "title": "例1.4.4：随机生存群的概率计算", "description": "两个子群体，求生存概率。", "expected": {"tpx1": 26/40, "tpx2": 26/39}},
    {"id": "ch1_ex_1_5_2", "chapter": 1, "section": "1.5 生命表", "title": "例1.5.2：利用 CL93M 计算概率", "description": "CL93M: l₂₀=981140, l₇₀=687074, l₉₀=99580。₈₀p₂₀=0.003986, ₅₀q₂₀=0.29972。", "expected": {"p80_20": 0.003986, "q50_20": 0.29972}},
    # Ch4
    {"id": "ch4_ex_4_2_2", "chapter": 4, "section": "4.2 生存保险", "title": "例4.2.2：3年期生存保险", "description": "q₂₀=0.01, q₂₁=0.02, q₂₂=0.03, i=2.5%。₃E₂₀=0.873899334。", "expected": {"nEx": 0.873899334}},
    {"id": "ch4_ex_4_3_1", "chapter": 4, "section": "4.3 定期死亡保险", "title": "例4.3.1：10年期寿险（均匀分布）", "description": "T(x)~U(0,80), δ=0.02。Ā¹=0.11329。", "expected": {"ax_term": 0.11329}},
    {"id": "ch4_ex_4_3_7", "chapter": 4, "section": "4.3 定期死亡保险", "title": "例4.3.7：UDD假设下的A¹和Ā¹", "description": "i=0.10, q_x=0.05, q_{x+1}=0.08。A¹=0.1083, Ā¹=0.114。", "expected": {"ax_disc": 0.1083, "ax_cont": 0.114}},
    {"id": "ch4_ex_4_4_1", "chapter": 4, "section": "4.4 终身死亡保险", "title": "例4.4.1：终身寿险 + CLT", "description": "μ=0.04, δ=0.06。Ā_x=0.4。", "expected": {"ax_cont": 0.4}},
    {"id": "ch4_ex_4_4_4", "chapter": 4, "section": "4.4 终身死亡保险", "title": "例4.4.4：递推计算 A₇₇", "description": "A₇₆=0.800, v·p₇₆=0.9。A₇₇=0.810。", "expected": {"a77": 0.810}},
    # Ch5
    {"id": "ch5_ex_5_3_3", "chapter": 5, "section": "5.3 连续生存年金", "title": "例5.3.3：常数死亡力下的 ā_x", "description": "μ=0.04, δ=0.06。ā_x=1/(μ+δ)=10。", "expected": {"ax_cont": 10}},
    {"id": "ch5_ex_5_4_1", "chapter": 5, "section": "5.4 期初生存年金", "title": "例5.4.1：90岁期初年金", "description": "l₉₀=100, l₉₁=72, l₉₂=39, l₉₃=0, i=6%。ä₉₀=2.026344。", "expected": {"ax_due": 2.026344}},
    # Ch8
    {"id": "ch8_ex_8_3_1", "chapter": 8, "section": "8.3 趸缴净保费", "title": "例8.3.1：终身寿险趸缴净保费", "description": "T(x)~U(0,100), δ=0.10。Ā_x=0.1, 趸缴=5元。", "expected": {"ax_cont": 0.1}},
    {"id": "ch8_ex_8_4_1", "chapter": 8, "section": "8.4 完全连续险种", "title": "例8.4.1：常数死亡力下的 P̄(Ā_x)", "description": "μ(x)=μ常数。P̄(Ā_x)=μ=0.04。", "expected": {"p_cont": 0.04}},
    # Ch10
    {"id": "ch10_ex_10_2_1", "chapter": 10, "section": "10.2 未来损失量模型", "title": "例10.2.1：De Moivre 的 C_h", "description": "20岁签单，De Moivre ω=120, i=5%。A₂₀=0.1984791, P₂₀=0.01179。", "expected": {"a20": 0.1984791, "p20": 0.01179}},
    {"id": "ch10_ex_10_3_2", "chapter": 10, "section": "10.3 净准备金的定义", "title": "例10.3.2：5年期死亡险保单组", "description": "50岁签单5年期，i=6%，CL93M。保单组总准备金=4788元。", "expected": {"a_term": 0.02892499, "ax_due": 4.41137118, "p_term": 0.00655692}},
]


# ═══════════════════════════════════════════════════════════════
# Health
# ═══════════════════════════════════════════════════════════════

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "available_tables": ["CL93M", "CL93F"],
    }


# ═══════════════════════════════════════════════════════════════
# Life Table 端点
# ═══════════════════════════════════════════════════════════════

@app.get("/api/lifetable/{name}", response_model=LifeTableResponse)
async def get_lifetable(name: str):
    """获取命名的生命表数据"""
    try:
        lt = get_life_table(name)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Life table '{name}' not found")
    return LifeTableResponse(
        label=lt.label,
        radix=lt.radix,
        omega=lt.omega,
        lx=lt.lx.tolist(),
        qx=lt.qx.tolist(),
    )


@app.post("/api/lifetable", response_model=LifeTableResponse)
async def create_lifetable(req: CustomLifeTableRequest):
    """上传自定义生命表"""
    if req.lx is not None:
        import numpy as np
        lt = LifeTable(lx=np.array(req.lx), label=req.label, radix=req.radix)
    elif req.qx is not None:
        lt = LifeTable.custom(
            l0=req.radix, qx=req.qx,
            start_age=req.start_age, label=req.label
        )
    else:
        raise HTTPException(status_code=400, detail="Either lx or qx must be provided")

    register_life_table(req.label, lt)
    return LifeTableResponse(
        label=lt.label,
        radix=lt.radix,
        omega=lt.omega,
        lx=lt.lx.tolist(),
        qx=lt.qx.tolist(),
    )


# ═══════════════════════════════════════════════════════════════
# Compute 端点
# ═══════════════════════════════════════════════════════════════

@app.post("/api/compute", response_model=ComputeResponse)
async def compute(req: ComputeRequest):
    """执行工作流 DAG 求值

    接收前端传来的 graph = {nodes: [...], edges: [...]}，
    运行计算图引擎，返回每个节点的计算结果。
    """
    i = req.graph.get("interest_rate", req.graph.get("i", 0.035))

    try:
        trace, elapsed_ms = run_dag(
            graph=req.graph,
            lt_name="CL93M",
            i=float(i),
            changed_nodes=req.changed_nodes,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compute error: {e}")

    # 转换 ComputeTrace → ComputeResponse
    results = {}
    for nid, cr in trace.results.items():
        results[nid] = ComputeNodeResult(
            node_id=cr.node_id,
            formula_id=cr.formula_id,
            value=cr.value,
            status=cr.status,
            error=cr.error,
        )

    return ComputeResponse(
        results=results,
        topological_order=trace.topological_order,
        error_nodes=trace.error_nodes,
        compute_time_ms=elapsed_ms,
    )


# ═══════════════════════════════════════════════════════════════
# Verify 端点
# ═══════════════════════════════════════════════════════════════

@app.post("/api/verify", response_model=VerifyResponse)
async def verify(req: VerifyRequest):
    """对比用户计算结果与课件期望值"""
    # 查找预设
    preset = None
    for p in _HARDCODED_PRESETS:
        if p["id"] == req.preset_id:
            preset = p
            break

    if preset is None:
        raise HTTPException(status_code=404, detail=f"Preset '{req.preset_id}' not found")

    expected = preset["expected"]
    results = {}
    all_match = True

    for node_id, expected_val in expected.items():
        actual = req.computed_results.get(node_id)
        if actual is None:
            results[node_id] = VerifyNodeResult(
                expected=expected_val,
                actual=None,
                match=False,
                error="Not computed",
            )
            all_match = False
        else:
            diff = abs(float(actual) - expected_val)
            match = diff < req.tolerance
            if not match:
                all_match = False
            results[node_id] = VerifyNodeResult(
                expected=expected_val,
                actual=float(actual),
                match=match,
                diff=diff,
            )

    summary = "✓ 全部验证通过！" if all_match else "✗ 存在差异，请检查计算参数"
    return VerifyResponse(
        preset_id=req.preset_id,
        all_match=all_match,
        results=results,
        summary=summary,
    )


# ═══════════════════════════════════════════════════════════════
# Presets 端点
# ═══════════════════════════════════════════════════════════════

@app.get("/api/presets", response_model=PresetListResponse)
async def list_presets(chapter: Optional[int] = Query(None, description="按章节筛选")):
    """列出所有课件预设示例"""
    filtered = _HARDCODED_PRESETS
    if chapter is not None:
        filtered = [p for p in _HARDCODED_PRESETS if p["chapter"] == chapter]

    by_chapter = {}
    for p in filtered:
        ch = p["chapter"]
        by_chapter[ch] = by_chapter.get(ch, 0) + 1

    presets = [
        PresetSummary(
            id=p["id"],
            chapter=p["chapter"],
            section=p["section"],
            title=p["title"],
            description=p["description"],
        )
        for p in filtered
    ]

    return PresetListResponse(
        total=len(presets),
        by_chapter=by_chapter,
        presets=presets,
    )


@app.get("/api/presets/{preset_id}", response_model=PresetDetail)
async def get_preset(preset_id: str):
    """获取单个预设的详细信息（含 DAG nodes/edges/expectedResults）"""
    preset = None
    for p in _HARDCODED_PRESETS:
        if p["id"] == preset_id:
            preset = p
            break

    if preset is None:
        raise HTTPException(status_code=404, detail=f"Preset '{preset_id}' not found")

    # 尝试从 TypeScript 文件加载完整节点/边/期望值
    nodes, edges = _load_preset_graph(preset_id)

    return PresetDetail(
        id=preset["id"],
        chapter=preset["chapter"],
        section=preset["section"],
        title=preset["title"],
        description=preset["description"],
        source_slide=preset.get("source_slide", ""),
        nodes=nodes,
        edges=edges,
        expected_results=preset.get("expected", {}),
    )


def _load_preset_graph(preset_id: str) -> tuple[list[dict], list[dict]]:
    """从 presets.ts 加载完整的 DAG 图定义（简化版：返回硬编码关键预设）"""
    # 关键预设的完整图定义
    graphs = {
        "ch4_ex_4_2_2": (
            [
                {"id": "lt_custom", "type": "input", "formulaId": "lx", "params": {"l0": 100000, "qx": [0.01, 0.02, 0.03], "start_age": 20}, "position": [100, 250]},
                {"id": "econ", "type": "input", "formulaId": "t_px", "params": {"i": 0.025}, "position": [100, 50]},
                {"id": "nEx", "type": "compute", "formulaId": "pure_endowment", "params": {"x": 20, "n": 3, "i": 0.025}, "position": [450, 150]},
            ],
            [
                {"from": "lt_custom", "to": "nEx"},
                {"from": "econ", "to": "nEx"},
            ],
        ),
        "ch5_ex_5_4_1": (
            [
                {"id": "lt", "type": "input", "formulaId": "lx", "params": {"l90": 100, "l91": 72, "l92": 39, "l93": 0}, "position": [100, 100]},
                {"id": "econ", "type": "input", "formulaId": "t_px", "params": {"i": 0.06}, "position": [100, 280]},
                {"id": "ax_due", "type": "compute", "formulaId": "ax_due_discrete", "params": {"x": 90, "i": 0.06}, "position": [450, 190]},
            ],
            [
                {"from": "lt", "to": "ax_due"},
                {"from": "econ", "to": "ax_due"},
            ],
        ),
        "ch10_ex_10_3_2": (
            [
                {"id": "lt_full", "type": "input", "formulaId": "lx", "params": {"table": "CL93M", "start_age": 50}, "position": [100, 300]},
                {"id": "econ", "type": "input", "formulaId": "t_px", "params": {"i": 0.06}, "position": [100, 80]},
                {"id": "a_term", "type": "compute", "formulaId": "Ax_term_discrete", "params": {"x": 50, "n": 5, "i": 0.06}, "position": [400, 50]},
                {"id": "ax_due", "type": "compute", "formulaId": "ax_term_due_discrete", "params": {"x": 50, "n": 5, "i": 0.06}, "position": [400, 190]},
                {"id": "p_term", "type": "compute", "formulaId": "Px_term_discrete", "params": {"x": 50, "n": 5, "i": 0.06}, "position": [650, 120]},
                {"id": "v2", "type": "compute", "formulaId": "kVx_discrete", "params": {"x": 50, "k": 2, "i": 0.06}, "position": [400, 340]},
                {"id": "v3", "type": "compute", "formulaId": "kVx_discrete", "params": {"x": 50, "k": 3, "i": 0.06}, "position": [550, 340]},
                {"id": "v4", "type": "compute", "formulaId": "kVx_discrete", "params": {"x": 50, "k": 4, "i": 0.06}, "position": [700, 340]},
                {"id": "total", "type": "output", "formulaId": "kVx_discrete", "params": {}, "position": [900, 120]},
            ],
            [
                {"from": "lt_full", "to": "a_term"},
                {"from": "lt_full", "to": "ax_due"},
                {"from": "econ", "to": "a_term"},
                {"from": "econ", "to": "ax_due"},
                {"from": "a_term", "to": "p_term"},
                {"from": "ax_due", "to": "p_term"},
                {"from": "p_term", "to": "v2"},
                {"from": "p_term", "to": "v3"},
                {"from": "p_term", "to": "v4"},
                {"from": "lt_full", "to": "v2"},
                {"from": "lt_full", "to": "v3"},
                {"from": "lt_full", "to": "v4"},
            ],
        ),
    }

    if preset_id in graphs:
        return graphs[preset_id]

    # 返回默认空图
    return [], []


# ═══════════════════════════════════════════════════════════════
# Identity Verification
# ═══════════════════════════════════════════════════════════════

@app.get("/api/identity/verify", response_model=VerificationResult)
async def verify_identity(
    x: int = Query(30, description="签约年龄"),
    i: float = Query(0.05, description="利率"),
    identity: str = Query("continuous", description="continuous | discrete"),
):
    """验证保险-年金恒等式"""
    from actuarial.present_value import PresentValueCalculator

    lt = get_life_table("CL93M")
    pv = PresentValueCalculator(lt, i=i)

    if identity == "continuous":
        lhs, ax, A = pv.verify_identity_continuous(x)
        return VerificationResult(
            identity="δ·ā_x + Ā_x = 1",
            lhs=lhs,
            rhs=1.0,
            error=abs(lhs - 1.0),
            ax=ax,
            A=A,
        )
    else:
        lhs, ax, A = pv.verify_identity_discrete(x)
        return VerificationResult(
            identity="d·ä_x + A_x = 1",
            lhs=lhs,
            rhs=1.0,
            error=abs(lhs - 1.0),
            ax=ax,
            A=A,
        )
