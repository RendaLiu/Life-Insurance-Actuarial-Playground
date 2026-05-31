# 寿险精算 Playground

交互式寿险精算探索平台 — 概念图谱 + 可视化工作流 + AI Copilot。

**覆盖章节**：Ch1 (生存模型) / Ch4 (保险现值) / Ch5 (年金现值) / Ch8 (净保费) / Ch9 (费用负荷) / Ch10-12 (准备金理论)

---

## 项目架构

```
                    ┌─────────────────────────┐
                    │   前端 SPA (:5173)       │
                    │  React + React Flow      │
                    │  ┌───────┬───────┐       │
                    │  │ 概念图谱│ 工作流  │     │
                    │  └───┬───┴───┬───┘       │
                    │      └───────┘           │
                    └──────────┬──────────────┘
                               │ HTTP /api/
                    ┌──────────┴──────────────┐
                    │   FastAPI (:8000)        │
                    │   /compute  /verify      │
                    │   /lifetable /presets    │
                    └──────────┬──────────────┘
                               │
                    ┌──────────┴──────────────┐
                    │   actuarial-engine       │
                    │   LifeTable              │
                    │   SurvivalModel          │
                    │   PresentValueCalculator │
                    │   NetPremiumCalculator   │
                    │   ReserveCalculator      │
                    │   ComputeDAG             │
                    └─────────────────────────┘
```

## 快速启动

### Docker (推荐)

```bash
docker-compose up --build
# → 前端: http://localhost:5173
# → API文档: http://localhost:8000/docs
```

### 本地开发

**Windows:**
```cmd
start-dev.bat
```

**Linux/macOS:**
```bash
chmod +x start-dev.sh && ./start-dev.sh
```

### 手动启动

```bash
# Terminal 1: 安装并启动后端
cd actuarial-engine && pip install -e .
cd ../actuarial-api && pip install -e .
uvicorn actuarial_api.main:app --reload --port 8000

# Terminal 2: 安装并启动前端
cd actuarial-playground && npm install && npm run dev
# → http://localhost:5173
```

## 子项目

| 子项目 | 技术栈 | 测试 |
|--------|--------|------|
| `actuarial-engine/` | Python 3.11+ / numpy / scipy | 98 tests ✅ |
| `actuarial-api/` | FastAPI / Pydantic / uvicorn | 20 tests ✅ |
| `actuarial-playground/` | React 18 / React Flow / KaTeX / Zustand / Vite | tsc 零错误 ✅ |

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/health` | 健康检查 + 可用生命表 |
| `GET` | `/api/lifetable/{name}` | 获取 CL93M/CL93F 完整生命表 |
| `POST` | `/api/lifetable` | 上传自定义生命表 |
| `POST` | `/api/compute` | 工作流 DAG 增量求值 |
| `POST` | `/api/verify` | 对比计算结果与课件期望值 |
| `GET` | `/api/presets` | 列出所有课件预设 (支持 ?chapter=4) |
| `GET` | `/api/presets/{id}` | 获取预设详情 (含完整 DAG) |
| `GET` | `/api/identity/verify` | 验证保险-年金恒等式 |

### Compute 请求示例

```json
POST /api/compute
{
  "graph": {
    "nodes": [
      {"id": "n1", "formulaId": "pure_endowment", "params": {"x": 20, "n": 3}},
      {"id": "n2", "formulaId": "t_px", "params": {"t": 3, "x": 20}}
    ],
    "edges": [{"from": "n2", "to": "n1"}],
    "interest_rate": 0.025
  },
  "changedNodes": ["n2"]
}
```

### Verify 请求示例

```json
POST /api/verify
{
  "presetId": "ch4_ex_4_2_2",
  "computedResults": {"nEx": 0.87395},
  "tolerance": 1e-6
}
```

响应：
```json
{
  "preset_id": "ch4_ex_4_2_2",
  "all_match": false,
  "results": {
    "nEx": {
      "expected": 0.873899334,
      "actual": 0.87395,
      "match": false,
      "diff": 0.000050666
    }
  },
  "summary": "✗ 存在差异，请检查计算参数"
}
```

## 数据来源

```
课件 PPTX (8章)
    │
    ├──→ 课件/Markdown/chapter*_clean.md    ← 手工修复的 Clean Markdown
    │
    └──→ actuarial-playground/src/registry/
         ├── types.ts        ← 核心类型定义
         ├── categories.ts   ← 13章分类 (8已学)
         ├── glossary.ts     ← 120+ 符号定义 (精算符号.md)
         ├── formulas.ts     ← 70 公式条目 (_clean.md 课件)
         ├── edges.ts        ← 200+ 概念依赖边
         ├── presets.ts      ← 27 课件例题预设工作流
         └── index.ts        ← 统一导出
```

## 课件例题验证清单

| 例题 | 公式 | 期望值 | 验证 |
|------|------|--------|------|
| 例1.2.1 | s(30), μ(30) | 0.7, 1/70 | ✅ |
| 例1.2.3 | ė₀ | 50 | ✅ |
| 例1.3.3 | ₁₇p₁₉, ₁₅q₃₆, ₁₅\|₁₃q₃₆ | 8/9, 1/8, 1/8 | ✅ |
| 例1.5.2 | ₈₀p₂₀, ₅₀q₂₀ | 0.003986, 0.29972 | ✅ |
| 例4.2.2 | ₃E₂₀ | 0.873899334 | ✅ |
| 例4.3.1 | Ā¹_{x:10} | 0.11329 | ✅ |
| 例4.3.7 | A¹, Ā¹ | 0.1083, 0.114 | ✅ |
| 例4.4.1 | Ā_x | 0.4 | ✅ |
| 例5.3.3 | ā_x | 10 | ✅ |
| 例5.4.1 | ä₉₀ | 2.026344 | ✅ |
| 例8.4.1 | P̄(Ā_x) | μ = 0.04 | ✅ |
| 例10.3.2 | P¹_{50:5} | 0.00655692 | ✅ |

## 开发路线

| Phase | 内容 | 状态 |
|-------|------|------|
| P0 | 公式注册表 + 预设示例 (数据层) | ✅ |
| P1 | actuarial-engine (计算引擎) | ✅ |
| P2 | actuarial-api (后端 API) | ✅ |
| P3 | 前端 SPA (概念图谱 + 工作流) | ✅ |
| P4 | Docker 部署 + 文档 | ✅ |
| P5 | Module 3: Copilot (LLM → 工作流) | 🔜 |
