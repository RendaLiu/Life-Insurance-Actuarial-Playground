# 第八章：净保费理论

> 提取自 chapter8(L-2026).pptx 课件，公式全部经手修还原。

---

## 8.1 介绍

投保人为得到保险合同规定的保障，需向保险人按期缴纳保费。在精算中，保费分为：

- **毛保费** = **净保费** + **附加保费**
- **净保费**：保险人在不考虑保险费用、风险因素及利润目标的情况下所收取的风险成本，用于对受益人给付保险金
- **附加保费**：由三部分组成——保险费用（签单、理赔等）、风险附加、利润部分
- **费用负荷保费** = 净保费 + 附加保费中的保险费用部分

净保费的计算需要给定利率和死亡概率（以生命表形式给出）。本章针对不同险种讨论净保费。

**平衡准则：** 投保人缴纳保费的精算现值 = 保险人给付保险金额的精算现值

用 $L$ 表示保险人的签单损失量：$L$ = 保险人未来给付额的现值 $-$ 投保人缴纳净保费的现值。则 $E(L) = 0$。

### 险种分类

| 类型 | 保费缴纳方式 | 保险金给付方式 |
|------|------------|--------------|
| **完全连续** | 连续缴纳 | 死亡后立即给付 |
| **完全离散** | 每年年初缴纳 | 死亡保单年度末给付 |
| **半连续** | 每年年初缴纳 | 死亡后立即给付 |

---

## 8.2 平衡准则的概率基础

设有 $n$ 个同质的被保险人，相互独立，投保同一险种。保险公司对 $n$ 个个体的未来给付现金流的现值分别记为 $X_1, \ldots, X_n$（独立同分布）。

当保单数目充分多时（$n \to \infty$），根据大数定律：
$$\frac{X_1 + \cdots + X_n}{n} \to E(X_1),\quad \text{a.s.}$$

因此在"公平"的情况下，被保险人缴纳的保费应等于 $E(X_1)$——这是平衡准则的理论基础。

---

## 8.3 趸缴净保费

一次性缴纳的保费中的净保费部分称为**趸缴净保费**。

设趸缴净保费为 $P$，保险人签单的损失量为 $L$ = 保险人对被保险人给付额的现值 $- P$。根据平衡准则 $E(L) = 0$：
$$P = \text{保险人对被保险人给付额的精算现值}$$

以终身寿险为例。设在 $x$ 岁投保，保险金额为一元，在个体死亡后立即给付。保险人给付额的现值为 $v^{T(x)}$，所以趸缴净保费：
$$P = E[v^{T(x)}] = \overline{A}_x$$

保险人的签单损失量 $L = v^{T(x)} - \overline{A}_x$，方差为：
$$\text{Var}(L) = \text{Var}(v^{T(x)}) = {}^2\overline{A}_x - (\overline{A}_x)^2$$

### 例 8.3.1

在 $x$ 岁签单的终身寿险保单，保险金额为 50 元，在死亡后立即给付。$T(x) \sim U(0, 100)$，利息力 $\delta = 0.10$。求趸缴净保费。

**解：** 单位保额的趸缴净保费：
$$\overline{A}_x = \int_0^{100} e^{-0.10t} \cdot \frac{1}{100}\,\mathrm{d}t = \frac{1 - e^{-10}}{10} = 0.1$$

所以此险种的趸缴净保费为 $50\overline{A}_x = 5$ 元。

---

## 8.4 完全连续险种

保费连续缴纳，死亡保险金在死亡后立即给付。

### 8.4.1 $n$ 年期寿险

在 $x$ 岁签单的 $n$ 年期寿险保单，死亡保险金为一元，年均衡净保费（连续缴纳率）记为 $\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}^1)$。

投保人终止缴纳保费的时刻为 $T(x) \land n$。保险人的签单损失量：
$$L = v^{T(x)} \cdot I\{T(x) \le n\} - \overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}^1) \cdot \overline{a}_{\overline{T(x)\land n|}}$$

利用 $E(L) = 0$：
$$\boxed{\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}^1) = \frac{\overline{A}_{x:\enclose{actuarial}{n}}^1}{\overline{a}_{x:\enclose{actuarial}{n}}}}$$

### 8.4.2 其他险种的年均衡净保费

**统一形式：**
$$\text{净保费} = \frac{\text{保险人给付额的精算现值}}{\text{保费缴纳期对应的生存年金}}$$

具体公式：

| 险种 | 年均衡净保费 |
|------|------------|
| 终身寿险 | $\overline{P}(\overline{A}_x) = \dfrac{\overline{A}_x}{\overline{a}_x}$ |
| $n$ 年期寿险 | $\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}^1) = \dfrac{\overline{A}_{x:\enclose{actuarial}{n}}^1}{\overline{a}_{x:\enclose{actuarial}{n}}}$ |
| $n$ 年期生死合险 | $\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) = \dfrac{\overline{A}_{x:\enclose{actuarial}{n}}}{\overline{a}_{x:\enclose{actuarial}{n}}}$ |
| $h$ 年缴费终身寿险 | ${}_h\overline{P}(\overline{A}_x) = \dfrac{\overline{A}_x}{\overline{a}_{x:\enclose{actuarial}{h}}}$ |
| $h$ 年缴费 $n$ 年期寿险 | ${}_h\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}^1) = \dfrac{\overline{A}_{x:\enclose{actuarial}{n}}^1}{\overline{a}_{x:\enclose{actuarial}{h}}}$ |
| 延期 $n$ 年连续年金 | $\overline{P}({}_{n|}\overline{a}_x) = \dfrac{{}_{n|}\overline{a}_x}{\overline{a}_{x:\enclose{actuarial}{n}}}$ |

**说明：**
- ${}_h\overline{P}(\overline{A}_x)$ 表示保费缴纳期为 $h$ 年的终身寿险年均衡净保费，投保人过了 $h$ 年后不需再缴纳保费
- $\overline{P}({}_{n|}\overline{a}_x)$ 表示延期 $n$ 年的连续生存年金的年均衡净保费，保费最多缴纳 $n$ 年

### 结论 8.4.1（恒等变形）

$$\boxed{\begin{aligned}
\text{(a)}&\quad \overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) = \frac{1}{\overline{a}_{x:\enclose{actuarial}{n}}} - \delta \\[4pt]
\text{(b)}&\quad \overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) = \frac{\delta \cdot \overline{A}_{x:\enclose{actuarial}{n}}}{1 - \overline{A}_{x:\enclose{actuarial}{n}}} \\[4pt]
\text{(c)}&\quad \overline{P}(\overline{A}_x) = \frac{1}{\overline{a}_x} - \delta,\qquad \overline{P}(\overline{A}_x) = \frac{\delta \cdot \overline{A}_x}{1 - \overline{A}_x}
\end{aligned}}$$

**证明（a）和（b）：**
$$\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) = \frac{\overline{A}_{x:\enclose{actuarial}{n}}}{\overline{a}_{x:\enclose{actuarial}{n}}} = \frac{1 - \delta \cdot \overline{a}_{x:\enclose{actuarial}{n}}}{\overline{a}_{x:\enclose{actuarial}{n}}} = \frac{1}{\overline{a}_{x:\enclose{actuarial}{n}}} - \delta$$
$$\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) = \frac{\overline{A}_{x:\enclose{actuarial}{n}}}{\overline{a}_{x:\enclose{actuarial}{n}}} = \frac{\overline{A}_{x:\enclose{actuarial}{n}}}{(1 - \overline{A}_{x:\enclose{actuarial}{n}})/\delta} = \frac{\delta \cdot \overline{A}_{x:\enclose{actuarial}{n}}}{1 - \overline{A}_{x:\enclose{actuarial}{n}}}$$

### 结论 8.4.1 的含义

**(a) 的含义：** $\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) + \delta = \frac{1}{\overline{a}_{x:\enclose{actuarial}{n}}}$

考虑两种给付方式，对 $(x)$ 给付额的精算现值都等于 1：

**方式一：** 连续给付个体 $(x)$ 期限为 $n$ 年的生存年金，给付率为 $\frac{1}{\overline{a}_{x:\enclose{actuarial}{n}}}$。给付的生存年金精算现值为 1。

**方式二：** 个体 $(x)$ 投资一元，通过如下方式获得回报：
- 利息支付：在 $n$ 年内连续支付生存年金，支付率为 $\delta$
- 本金支付：若在 $n$ 年内死亡则在死亡时支付一元，否则在 $n$ 年末支付一元。这等价于以速率 $\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}})$ 连续给付生存年金

两种方式的连续支付率相同：$\overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) + \delta = \frac{1}{\overline{a}_{x:\enclose{actuarial}{n}}}$

**(b) 的含义：** 个体 $(x)$ 借款 $\overline{A}_{x:\enclose{actuarial}{n}}$ 元购买 $n$ 年期生死合险。通过以下方式还贷：
- 利息支付：在 $n$ 年内若生存则连续支付利息 $\delta \cdot \overline{A}_{x:\enclose{actuarial}{n}}$
- 本金返还：若在 $n$ 年内死亡则还款 $\overline{A}_{x:\enclose{actuarial}{n}}$ 元，否则在 $n$ 年末还款

在还款时，个体同时得到保险人给付的一元保险金。扣除还款后实际得到 $1 - \overline{A}_{x:\enclose{actuarial}{n}}$ 元。因此，得到一元给付额需以支付率 $\frac{\delta \cdot \overline{A}_{x:\enclose{actuarial}{n}}}{1 - \overline{A}_{x:\enclose{actuarial}{n}}}$ 来支付，即为年均衡净保费。

### 结论 8.4.2（签单损失量的方差）

$$\boxed{\begin{aligned}
\text{(a)}&\quad \text{对于 }n\text{ 年期生死合险：} \quad \text{Var}(L) = \frac{{}^2\overline{A}_{x:\enclose{actuarial}{n}} - (\overline{A}_{x:\enclose{actuarial}{n}})^2}{(\delta \cdot \overline{a}_{x:\enclose{actuarial}{n}})^2} \\[4pt]
\text{(b)}&\quad \text{对于终身寿险：} \quad \text{Var}(L) = \frac{{}^2\overline{A}_x - (\overline{A}_x)^2}{(\delta \cdot \overline{a}_x)^2}
\end{aligned}}$$

**证明（a）：** 由 $L$ 的表达式：
$$L = v^{T(x)\land n} - \overline{P}(\overline{A}_{x:\enclose{actuarial}{n}}) \cdot \overline{a}_{\overline{T(x)\land n|}} = v^{T(x)\land n}\left(1 + \frac{\overline{P}}{\delta}\right) - \frac{\overline{P}}{\delta}$$

所以：
$$\text{Var}(L) = \text{Var}(v^{T(x)\land n}) \cdot \left(1 + \frac{\overline{P}}{\delta}\right)^2 = \text{Var}(v^{T(x)\land n}) \cdot \left(\frac{1}{\delta \cdot \overline{a}_{x:\enclose{actuarial}{n}}}\right)^2$$

### 例 8.4.1

已知 $\mu(x) = \mu$（常数死亡力）。计算 $\overline{P}(\overline{A}_x)$。

**解：** $\overline{A}_x = \frac{\mu}{\mu + \delta}$，$\overline{a}_x = \frac{1}{\mu + \delta}$。年均衡净保费：
$$\overline{P}(\overline{A}_x) = \frac{\overline{A}_x}{\overline{a}_x} = \frac{\mu/(\mu+\delta)}{1/(\mu+\delta)} = \mu$$

> 常数死亡力下，年均衡净保费恰好等于死亡力。

### 例 8.4.2

已知在每一年龄年 UDD 假设成立，利率 $i = 0.05$，$\ddot{a}_x = 1.68$。计算年均衡净保费 $\overline{P}(\overline{A}_x)$。

**解：** 由 $A_x + d \cdot \ddot{a}_x = 1$ 得：
$$A_x = 1 - d \cdot \ddot{a}_x = 1 - \frac{0.05}{1.05} \times 1.68 = 0.92$$

利用 UDD 假设：
$$\overline{A}_x = \frac{i}{\delta} \cdot A_x = \frac{0.05}{\ln(1.05)} \times 0.92 = 0.9428$$
$$\overline{P}(\overline{A}_x) = \frac{\delta \cdot \overline{A}_x}{1 - \overline{A}_x} = \frac{\ln(1.05) \times 0.9428}{1 - 0.9428} = 0.8042$$

### 例 8.4.3

在 $x$ 岁投保的保额为一元的完全连续终身寿险，常数死亡力假设下，计算签单损失量 $L$ 的方差。

**解：** 利用结论 8.4.2：
$$\text{Var}(L) = \frac{{}^2\overline{A}_x - (\overline{A}_x)^2}{(\delta \cdot \overline{a}_x)^2} = \frac{\frac{\mu}{\mu+2\delta} - \left(\frac{\mu}{\mu+\delta}\right)^2}{\left(\frac{\delta}{\mu+\delta}\right)^2} = \frac{\mu}{\mu + 2\delta}$$

### 例 8.4.4

在 $x$ 岁投保的保额为一元的完全连续终身寿险，已知 $\frac{\text{Var}(v^T)}{\text{Var}(L)} = 0.36$，$\overline{a}_x = 10$。计算年均衡净保费 $\overline{P}(\overline{A}_x)$。

**解：** 利用结论 8.4.2：
$$\text{Var}(L) = \text{Var}(v^{T(x)}) \cdot \left(\frac{1}{\delta \cdot \overline{a}_x}\right)^2 = \text{Var}(v^{T(x)}) \cdot \left(\frac{1}{1 - \overline{A}_x}\right)^2$$
$$\frac{\text{Var}(v^T)}{\text{Var}(L)} = (1 - \overline{A}_x)^2 = 0.36$$

解得 $\overline{A}_x = 0.4$，$\overline{P}(\overline{A}_x) = \frac{\overline{A}_x}{\overline{a}_x} = \frac{0.4}{10} = 0.04$。

---

## 8.5 完全离散险种

保费在每年年初缴纳，死亡保险金在保单年度末给付。对应的精算现值使用 $A$（非上划线）和 $\ddot{a}$ 记号。

### 8.5.1 $n$ 年期寿险

签单损失量：
$$L = v^{K(x)+1} \cdot I\{K(x) \le n-1\} - P_{x:\enclose{actuarial}{n}}^1 \cdot \ddot{a}_{\overline{(K(x)+1) \land n|}}$$

利用 $E(L) = 0$：
$$\boxed{P_{x:\enclose{actuarial}{n}}^1 = \frac{A_{x:\enclose{actuarial}{n}}^1}{\ddot{a}_{x:\enclose{actuarial}{n}}}}$$

### 8.5.2 其他险种公式

| 险种 | 年均衡净保费 |
|------|------------|
| 终身寿险 | $P_x = \dfrac{A_x}{\ddot{a}_x}$ |
| $n$ 年期寿险 | $P_{x:\enclose{actuarial}{n}}^1 = \dfrac{A_{x:\enclose{actuarial}{n}}^1}{\ddot{a}_{x:\enclose{actuarial}{n}}}$ |
| $n$ 年期生死合险 | $P_{x:\enclose{actuarial}{n}} = \dfrac{A_{x:\enclose{actuarial}{n}}}{\ddot{a}_{x:\enclose{actuarial}{n}}}$ |
| $n$ 年期生存保险 | $P_{x:\enclose{actuarial}{n}}^{\phantom{1}1} = \dfrac{{}_n E_x}{\ddot{a}_{x:\enclose{actuarial}{n}}}$ |
| $h$ 年缴费终身寿险 | ${}_h P_x = \dfrac{A_x}{\ddot{a}_{x:\enclose{actuarial}{h}}}$ |
| $h$ 年缴费 $n$ 年期寿险 | ${}_h P_{x:\enclose{actuarial}{n}}^1 = \dfrac{A_{x:\enclose{actuarial}{n}}^1}{\ddot{a}_{x:\enclose{actuarial}{h}}}$ |
| 延期 $n$ 年期初年金 | $P({}_{n|}\ddot{a}_x) = \dfrac{{}_{n|}\ddot{a}_x}{\ddot{a}_{x:\enclose{actuarial}{n}}}$ |

### 恒等变形

由 $d \cdot \ddot{a}_x + A_x = 1$：
$$P_x = \frac{1 - d \cdot \ddot{a}_x}{\ddot{a}_x} = \frac{1}{\ddot{a}_x} - d$$
$$P_x = \frac{d \cdot A_x}{1 - A_x}$$

### 签单损失量的方差（对应结论 8.4.2 的离散版本）

$$\text{Var}(L) = \frac{{}^2 A_x - (A_x)^2}{(d \cdot \ddot{a}_x)^2} \quad \text{（终身寿险）}$$
$$\text{Var}(L) = \frac{{}^2 A_{x:\enclose{actuarial}{n}} - (A_{x:\enclose{actuarial}{n}})^2}{(d \cdot \ddot{a}_{x:\enclose{actuarial}{n}})^2} \quad \text{（n年期生死合险）}$$

---

## 8.6 半连续险种

保费在每年年初缴纳，但死亡保险金在死亡后立即给付。

| 险种 | 年均衡净保费 |
|------|------------|
| 终身寿险 | $P(\overline{A}_x) = \dfrac{\overline{A}_x}{\ddot{a}_x}$ |
| $n$ 年期寿险 | $P(\overline{A}_{x:\enclose{actuarial}{n}}^1) = \dfrac{\overline{A}_{x:\enclose{actuarial}{n}}^1}{\ddot{a}_{x:\enclose{actuarial}{n}}}$ |
| $h$ 年缴费终身寿险 | ${}_h P(\overline{A}_x) = \dfrac{\overline{A}_x}{\ddot{a}_{x:\enclose{actuarial}{h}}}$ |

在 UDD 假设下：$P(\overline{A}_x) = \frac{i}{\delta} \cdot P_x$

---

## 8.7 每年缴纳 $m$ 次保费的险种

每年缴费 $m$ 次，死亡给付在死亡的保单年度末进行。

| 险种 | 年均衡净保费 |
|------|------------|
| 终身寿险 | $P_x^{(m)} = \dfrac{A_x}{\ddot{a}_x^{(m)}}$ |
| $h$ 年缴费 $n$ 年期生死合险 | ${}_h P_{x:\enclose{actuarial}{n}}^{(m)} = \dfrac{A_{x:\enclose{actuarial}{n}}}{\ddot{a}_{x:\enclose{actuarial}{n}}^{(m)}}$ |

在 UDD 假设下：$P_x^{(m)} = \dfrac{A_x}{\alpha(m) \cdot \ddot{a}_x - \beta(m)}$

此外，如果在死亡后立即给付且每年缴纳 $m$ 次保费：
$$P^{(m)}(\overline{A}_x) = \frac{\overline{A}_x}{\ddot{a}_x^{(m)}}$$

---

## 8.8 精算实务中净保费的计算

利用生命表计算 $\ddot{a}_{x:\enclose{actuarial}{n}}$：
$$\ddot{a}_{x:\enclose{actuarial}{n}} = \frac{\sum_{k=x}^{x+n-1} l_k \cdot v^k}{l_x \cdot v^x}$$

然后利用各险种的净保费公式计算对应的 $P$ 值。

表 8.1 给出了根据 CL93M 计算的各种净保费的结果（利率 $i = 0.04$）。
