# 第十一章：一些完全离散险种的净准备金

> 提取自 Chapter11(2026)(1).pptx 课件，公式全部经手修还原。

---

## 11.1 介绍

上一章讨论了一般的完全离散险种的净准备金。本章针对具体的险种——终身寿险和生死合险等——来进一步讨论。内容包括：

- 以终身寿险为例，建立未来损失量模型，给出净准备金的基本公式及损失量方差
- 生死合险的净准备金
- 终身寿险净准备金的深入讨论（定理 11.4.1 的三种表示法）
- 递推公式的应用
- 精算实务中生存保险和死亡保险的净准备金计算方法及现金流分析

---

## 11.2 终身寿险的未来损失量及净准备金

假设在 $x$ 岁投保的完全离散终身寿险，死亡保险金为 1 元，每年缴纳年均衡净保费 $P_x$ 元。

### 未来损失量

在第 $k$ 个保单年度末，保险人未来损失量：
$$\boxed{{}_k L_x = (v^{K(x)-k+1} - P_x \cdot \ddot{a}_{\overline{K(x)-k+1}|}) \cdot I\{K(x) \ge k\}}$$

### 净准备金

第 $k$ 个保单年度末的净准备金 ${}_k V_x$：
$${}_k V_x = E[{}_k L_x \mid K(x) \ge k]$$

利用定理 10.2.1：
$$\begin{aligned}
{}_k V_x &= E[(v^{K(x)-k+1} - P_x \cdot \ddot{a}_{\overline{K(x)-k+1}|}) \cdot I\{K(x) \ge k\} \mid K(x) \ge k] \\
&= E[v^{K(x+k)+1} - P_x \cdot \ddot{a}_{\overline{K(x+k)+1}|}] \\
&= A_{x+k} - P_x \cdot \ddot{a}_{x+k}
\end{aligned}$$

$$\boxed{{}_k V_x = A_{x+k} - P_x \cdot \ddot{a}_{x+k}}$$

这就是**将来法公式**：准备金 = 未来给付的精算现值 $-$ 未来保费的精算现值。

### 结论 11.2.1（损失量的方差）

关于损失量 ${}_k L_x$ 的方差：
$$\boxed{\text{Var}({}_k L_x \mid K(x) \ge k) = \frac{{}^2 A_{x+k} - (A_{x+k})^2}{(d \cdot \ddot{a}_x)^2}}$$

**证明：** 由 ${}_k L_x = \{v^{K(x)+1-k}(1 + \frac{P_x}{d}) - \frac{P_x}{d}\} \cdot I\{K(x) \ge k\}$：
$$\begin{aligned}
\text{Var}({}_k L_x \mid K(x) \ge k) &= \text{Var}\left[\left(v^{K(x)+1-k}\left(1 + \frac{P_x}{d}\right) - \frac{P_x}{d}\right) \cdot I\{K(x) \ge k\} \mid K(x) \ge k\right] \\
&= \text{Var}\left(v^{K(x+k)+1}\left(1 + \frac{P_x}{d}\right) - \frac{P_x}{d}\right) \\
&= \text{Var}(v^{K(x+k)+1}) \cdot \left(1 + \frac{P_x}{d}\right)^2 \\
&= \frac{{}^2 A_{x+k} - (A_{x+k})^2}{(d \cdot \ddot{a}_x)^2}
\end{aligned}$$

### 各种险种的净准备金公式汇总

**$n$ 年期死亡险：** 第 $k$ 个保单年度末的净准备金 ${}_k V_{x:\enclose{actuarial}{n}}^1$（$k < n$）：
$$\boxed{{}_k V_{x:\enclose{actuarial}{n}}^1 = A_{x+k:\enclose{actuarial}{n-k}}^1 - P_{x:\enclose{actuarial}{n}}^1 \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}}$$

**保费缴纳期为 $h$ 年的终身寿险：** 第 $k$ 个保单年度末的净准备金 ${}_k^h V_x$：
$$\boxed{{}_k^h V_x = \begin{cases}
A_{x+k} - {}_h P_x \cdot \ddot{a}_{x+k:\enclose{actuarial}{h-k}} & k < h \\
A_{x+k} & k \ge h
\end{cases}}$$

当缴费期结束（$k \ge h$），准备金就等于未来给付额的期望值。

**$n$ 年期生存保险：** 第 $k$ 个保单年度末的净准备金 ${}_k V_{x:\enclose{actuarial}{n}}^{\phantom{1}1}$（$k < n$）：
$$\boxed{{}_k V_{x:\enclose{actuarial}{n}}^{\phantom{1}1} = {}_{n-k}E_{x+k} - P_{x:\enclose{actuarial}{n}}^{\phantom{1}1} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}}$$

当 $k = n$ 时：${}_n V_{x:\enclose{actuarial}{n}}^{\phantom{1}1} = 1$（到期给付 1 元）

**延期 $n$ 年的期初生存年金：** 第 $k$ 个保单年度末的净准备金 ${}_k V({}_{n|}\ddot{a}_x)$：
$$\boxed{{}_k V({}_{n|}\ddot{a}_x) = \begin{cases}
{}_{n-k|}\ddot{a}_{x+k} - P({}_{n|}\ddot{a}_x) \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} & k < n \\
\ddot{a}_{x+k} & k \ge n
\end{cases}}$$

---

## 11.3 生死合险的净准备金

本节介绍 $n$ 年期生死合险的净准备金的一些计算公式（$k < n$）。

### 结论 11.3.1（保费差公式）

$$\boxed{{}_k V_{x:\enclose{actuarial}{n}} = (P_{x+k:\enclose{actuarial}{n-k}} - P_{x:\enclose{actuarial}{n}}) \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}}$$

**证明：** 利用 $A_{x+k:\enclose{actuarial}{n-k}} = P_{x+k:\enclose{actuarial}{n-k}} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}$：
$$\begin{aligned}
{}_k V_{x:\enclose{actuarial}{n}} &= A_{x+k:\enclose{actuarial}{n-k}} - P_{x:\enclose{actuarial}{n}} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} \\
&= P_{x+k:\enclose{actuarial}{n-k}} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} - P_{x:\enclose{actuarial}{n}} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} \\
&= (P_{x+k:\enclose{actuarial}{n-k}} - P_{x:\enclose{actuarial}{n}}) \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}
\end{aligned}$$

### 结论 11.3.2（缴清保险公式）

$$\boxed{{}_k V_{x:\enclose{actuarial}{n}} = \left(1 - \frac{P_{x:\enclose{actuarial}{n}}}{P_{x+k:\enclose{actuarial}{n-k}}}\right) \cdot A_{x+k:\enclose{actuarial}{n-k}}}$$

**证明：** 利用保费差公式：
$$\begin{aligned}
{}_k V_{x:\enclose{actuarial}{n}} &= (P_{x+k:\enclose{actuarial}{n-k}} - P_{x:\enclose{actuarial}{n}}) \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} \\
&= \left(1 - \frac{P_{x:\enclose{actuarial}{n}}}{P_{x+k:\enclose{actuarial}{n-k}}}\right) \cdot P_{x+k:\enclose{actuarial}{n-k}} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}} \\
&= \left(1 - \frac{P_{x:\enclose{actuarial}{n}}}{P_{x+k:\enclose{actuarial}{n-k}}}\right) \cdot A_{x+k:\enclose{actuarial}{n-k}}
\end{aligned}$$

缴清保险公式的含义：在时刻 $k$，保险人拥有准备金 ${}_k V_{x:\enclose{actuarial}{n}}$。如果此时投保人停止缴费，保险人可将准备金作为趸缴净保费，为 $(x+k)$ 岁的人购买一份保额为 $\frac{{}_k V_{x:\enclose{actuarial}{n}}}{A_{x+k:\enclose{actuarial}{n-k}}}$ 的生死合险——这就是**缴清保险**。

### 结论 11.3.3（后溯公式）

$$\boxed{{}_k V_{x:\enclose{actuarial}{n}} = P_{x:\enclose{actuarial}{n}} \cdot \ddot{s}_{x:\enclose{actuarial}{k}} - {}_k \kappa_x}$$

其中精算累计成本 ${}_k \kappa_x = \dfrac{A_{x:\enclose{actuarial}{k}}^1}{{}_k E_x}$。

**证明：** 利用定理 10.3.2 的过去法结论，将 $b_{h+1} = 1$（死亡保险金），$\pi_h = P_{x:\enclose{actuarial}{n}}$（均衡净保费）代入即得。

---

## 11.4 终身寿险的净准备金（深入讨论）

### 定理 11.4.1（三种表示法）

$$\boxed{\begin{aligned}
\text{(a) 保费差形式：}&\quad {}_k V_x = (P_{x+k} - P_x) \cdot \ddot{a}_{x+k} \\[4pt]
\text{(b) 保额差形式（缴清保险）：}&\quad {}_k V_x = \left(1 - \frac{P_x}{P_{x+k}}\right) \cdot A_{x+k} \\[4pt]
\text{(c) 过去法形式：}&\quad {}_k V_x = P_x \cdot \ddot{s}_{x:\enclose{actuarial}{k}} - {}_k \kappa_x
\end{aligned}}$$

其中 ${}_k \kappa_x$ 为精算累计成本。

**直观解释：**

**(a) 保费差形式：** $(x)$ 在 $x$ 岁签单时缴纳 $P_x$，而在 $x+k$ 岁签单的同类保单需缴纳 $P_{x+k}$。差额 $(P_{x+k} - P_x) \cdot \ddot{a}_{x+k}$ 即为准备金——老龄签单的保费更高，保险人需多储备的资金。

**(b) 保额差形式：** $A_{x+k}$ 是 $x+k$ 岁时需要的趸缴净保费，而 $(x)$ 实际只缴纳了 $\frac{P_x}{P_{x+k}} \cdot A_{x+k}$ 的趸缴等价保费。差额部分即准备金。

**(c) 过去法形式：** ${}_k V_x = (\text{已缴保费的累积}) - (\text{已承担风险的累积})$。其中 $\ddot{s}_{x:\enclose{actuarial}{k}} = \frac{\ddot{a}_{x:\enclose{actuarial}{k}}}{{}_k E_x}$ 是精算终值因子，${}_k \kappa_x = \frac{A_{x:\enclose{actuarial}{k}}^1}{{}_k E_x}$ 是精算累计成本。

### 结论 11.4.2（准备金的其他恒等变形）

$$\boxed{\begin{aligned}
{}_k V_x &= 1 - \frac{\ddot{a}_{x+k}}{\ddot{a}_x} \\[4pt]
{}_k V_x &= \frac{P_{x+k} - P_x}{P_{x+k} + d} \\[4pt]
{}_k V_x &= \frac{A_{x+k} - A_x}{1 - A_x}
\end{aligned}}$$

**推导：** 利用 $P_x = \frac{1}{\ddot{a}_x} - d$ 及 ${}_k V_x = A_{x+k} - P_x \cdot \ddot{a}_{x+k}$，代入 $A_x = 1 - d \cdot \ddot{a}_x$ 等恒等关系即得。这三个公式分别从年金、保费差、保额差的角度表达了准备金的比例关系。

### 递推公式（Fackler 公式）

同定理 10.3.2 应用于终身寿险：
$${}_k V_x + P_x = v \cdot q_{x+k} + v \cdot p_{x+k} \cdot {}_{k+1}V_x$$

或等价地：
$$({}_k V_x + P_x)(1+i) = q_{x+k} \cdot 1 + p_{x+k} \cdot {}_{k+1}V_x$$

含义：年初资金 $({}_k V_x + P_x)$ 经一年投资后，应等于年末期望支出（死亡赔付概率 $\times$ 赔付额 + 生存概率 $\times$ 准备金）。

递推形式（从 ${}_0 V_x = 0$ 开始正向计算）：
$${}_{k+1}V_x = \frac{({}_k V_x + P_x)(1+i) - q_{x+k}}{p_{x+k}}$$

---

## 11.5 递推公式的应用

### 例 11.5.1（现金流分析表格方法）

在 $x$ 岁签单的 $n$ 年期死亡险，保额为 1000 元。每年年初缴纳均衡净保费。计算各年净准备金的表格方法：

| 列 | 含义 | 公式 |
|----|------|------|
| (1) $h$ | 保单年度 | $h = 1, 2, \ldots$ |
| (2) 保费收入 | $l_{x+h-1} \cdot P \cdot 1000$ | 年初缴费总额 |
| (3) 死亡给付 | $1000 \cdot d_{x+h-1}$ | 年末死亡赔付 |
| (4) 剩余资金 | $\{(4)_{h-1} + (2)_h\} \cdot (1+i) - (3)_h$ | $(4)_0 = 0$ |
| (5) 净准备金 ${}_h V$ | $(4)_h / l_{x+h}$ | 每生存个体的准备金 |

---

## 11.6 净准备金的计算方法及现金流分析

### 生存保险的净准备金

在实务中利用生命表计算：
$${}_k V_{x:\enclose{actuarial}{n}}^{\phantom{1}1} = \frac{{}_{n-k}E_{x+k} - P_{x:\enclose{actuarial}{n}}^{\phantom{1}1} \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}}{l_{x+k} \cdot v^{x+k}}$$

### 死亡保险的净准备金

$${}_k V_{x:\enclose{actuarial}{n}}^1 = A_{x+k:\enclose{actuarial}{n-k}}^1 - P_{x:\enclose{actuarial}{n}}^1 \cdot \ddot{a}_{x+k:\enclose{actuarial}{n-k}}$$

计算可利用递推公式逐年前推，或利用将来法公式直接计算。

### 现金流分析的基本原理

根据 CL93M 生命表和给定利率，可以计算出每一年末的净准备金数值。典型特征：
- **终身寿险的准备金**随时间递增，最终趋近于 1
- **生死合险的准备金**在到期时刻等于 1
- **生存保险的准备金**呈上升趋势，到期时等于 1

---

## 11.7 精算累计成本 ${}_k \kappa_x$

$$\boxed{{}_k \kappa_x = \frac{A_{x:\enclose{actuarial}{k}}^1}{{}_k E_x}}$$

表示 $x$ 岁到 $x+k$ 岁之间，单位保额的死亡保险在时刻 $k$ 的精算累积值——即过去 $k$ 年内保险人承担的死亡风险的成本（累计到时刻 $k$）。

过去法公式：
$${}_k V_x = P_x \cdot \ddot{s}_{x:\enclose{actuarial}{k}} - {}_k \kappa_x$$

即：准备金 = 已收保费的累积 $-$ 已承担风险的精算成本。
