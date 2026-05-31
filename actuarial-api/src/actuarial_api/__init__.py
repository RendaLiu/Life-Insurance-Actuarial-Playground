"""actuarial-api — FastAPI 后端

为寿险精算 Playground 提供：
- POST /api/compute     — 工作流 DAG 增量求值
- POST /api/verify      — 对比计算结果与课件期望值
- GET  /api/lifetable   — 生命表数据
- GET  /api/presets     — 预设示例
"""
