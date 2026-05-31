# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a "寿险精算" (Life Insurance Actuarial Science) course folder inside a PKU finance fourth-semester Obsidian vault. It contains PDF lecture slides, structured Markdown notes, AND the **寿险精算 Playground** — a full-stack interactive actuarial exploration platform.

## Course Materials

- **Textbook**: 寿险精算基础 by 杨静平 (z-library PDF in this folder)
- **PDF slides**: Chapters 1, 4, 5, 8, 9, 10, 11, 12 — note that chapters 2, 3, 6, 7, 13 are referenced in the notation file but have no PDF slides here
- **Lecture notes**: `寿险精算 第十章.md` covers Chapter 10 (net premium reserves / 净准备金) in depth

## Key Reference: 精算符号.md

`精算符号.md` is the central actuarial notation reference covering all 13 chapters. It maps each standard actuarial symbol (e.g., ${}_t p_x$, $\ddot{a}_x$, ${}_k V_x$) to its Chinese/English definition. When asked to explain a symbol, consult this file first.

## Note-Taking Conventions

Chapter notes use custom LaTeX macros defined at the top of each `.md` file. The Chapter 10 notes define:

```latex
\newcommand{\leftsub}[2]{\ _{#2}{#1}}        % left subscript: \leftsub{V}{h} → {}_h V
\newcommand{\Theorem}[2]{\boxed{\textbf{定理{#1}：}\\ #2}}
\newcommand{\EE}{\mathbb E}
\newcommand{\EOF}[1]{\mathbb E \left[ #1 \right]}
\newcommand{\Var}[1]{\text{Var}\left[ #1 \right]}
```

When writing new notes, reproduce these macros if they are used. The `\leftsub` macro is particularly important — actuarial notation frequently places subscripts on the left (e.g., ${}_h V$ for net premium reserve at year $h$).

## Obsidian Context

This folder is part of an Obsidian vault. Markdown files may contain Obsidian-specific syntax (wikilinks, embeds, callouts). When editing `.md` files, preserve any existing Obsidian syntax. The parent `四下/CLAUDE.md` covers the broader vault structure and course listing.

## LaTeX Math

All math is inline LaTeX (`$...$`) or display (`$$...$$`). Actuarial notation makes heavy use of:
- `\enclose{actuarial}{n}` for n-year term markers (requires `actuarialangle` package, may not render on all platforms)
- Left subscripts via `{}_t p_x` or the custom `\leftsub` macro
- `\overline` for continuous-time variants (e.g., $\overline{A}_x$)
- Overbars for joint-life last-survivor notation (e.g., $\overline{xy}$)

## 寿险精算 Playground

Full-stack interactive actuarial exploration platform. See [README.md](README.md) for full docs.

### Sub-projects

| Project | Dir | Stack | Tests |
|---------|-----|-------|-------|
| P0: Data Registry | `actuarial-playground/src/registry/` | TypeScript | — |
| P1: Engine | `actuarial-engine/` | Python 3.11 + numpy + scipy | 98/98 |
| P2: API | `actuarial-api/` | FastAPI + Pydantic | 20/20 |
| P3: Frontend | `actuarial-playground/` | React 18 + React Flow + KaTeX + Zustand | tsc 零错误 |

### Quick Start

```bash
# Docker
docker-compose up --build     # → frontend :5173, API :8000

# Local dev
start-dev.bat                 # Windows
./start-dev.sh                # Linux/macOS

# Manual
cd actuarial-engine && pip install -e .
cd actuarial-api && pip install -e . && uvicorn actuarial_api.main:app --reload --port 8000
cd actuarial-playground && npm install && npm run dev
```

### Key Files

- `pdf_pptx/final/chapter*_clean.md` — Cleaned lecture slides with verified LaTeX
- `精算符号.md` — 120+ actuarial symbol definitions (source for glossary.ts)
- `docs/superpowers/plans/2026-05-30-actuarial-playground.md` — Full implementation plan
- `actuarial-engine/src/actuarial/life_table.py` — CL93M/CL93F with PCHIP interpolation
- `actuarial-api/src/actuarial_api/engine.py` — formula_id → compute_fn registry (30+ formulas)
- `actuarial-playground/src/registry/presets.ts` — 27 preset examples with expected results
