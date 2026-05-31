# 第十章：完全离散险种的净准备金

> 提取自 chapter10(L-2026).pptx 课件，公式全部经手修还原。

---

## 10.1 介绍

在签单时，投保人缴纳的净保费的精算现值等于保险人未来给付额的精算现值（平衡准则）。当保单持续一段时间后，投保人未来缴纳的净保费可能不足以满足保险人未来给付的需要。因此，保险人需要提取**准备金**来确保未来给付能力。

- 准备金过低不足以保证未来给付
- 准备金过高会使剩余资金过少，不利于资金运用
- 适当的准备金水平有利于经营稳定及资金合理运用

准备金的计算基于生命表和利率。本章假定准备金计算与保费计算使用相同的生命表和利率，且只考虑净准备金（不考虑保险费用因素），讨论重点在**保单年度末的净准备金**。

后续章节安排：第十章讨论一般的完全离散险种的净准备金；第十一章讨论具体险种（终身寿险、生死合险等）；第十二章讨论完全连续险种的净准备金。

本章内容：建立保险人未来损失量模型 → 给出净准备金的定义及不同保单年度之间净准备金的递推公式 → 讨论未来损失量方差的计算方法（Hattendorf 定理）。

---

## 10.2 未来损失量模型

### 10.2.1 模型的表示法

假设 $h, k$ 为非负整数。签单时刻为 $t = 0$。

- **第一个保单年度**：$0 \le t < 1$，**第二个保单年度**：$1 \le t < 2$，依此类推
- 假设在 $x$ 岁签单，**死亡保险金在死亡保单年度末给付**，第 $j$ 个保单年度的死亡保险金记为 $b_j$
- **保费在每一年度初缴纳**，第 $j$ 个保单年度的保费为 $\pi_{j-1}$

> 注意：这里没有考虑生存给付的情况，也并未要求 $\pi_j$ 为由平衡准则确定的净保费。

### 生存状态的表示

个体 $(x)$ 在第 $h+1$ 个保单年度内死亡 $\iff$ $h \le T(x) < h+1 \iff K(x) = h$

个体 $(x)$ 在第 $h$ 个保单年度末仍生存 $\iff$ $T(x) \ge h \iff K(x) \ge h$

### 定理 10.2.1（条件期望的平移性质）

对非负函数 $g$：
$$\boxed{E[g(T(x)) \mid K(x) \ge h] = E[g(T(x+h) + h)]}$$

若 $E[g(T(x)) \mid K(x) \ge h] < \infty$，则：
$$\boxed{\text{Var}[g(T(x)) \mid K(x) \ge h] = \text{Var}(g(T(x+h) + h))}$$

**证明：**

(1) 利用条件期望的定义：
$$\begin{aligned}
E[g(T(x)) \mid K(x) \ge h] &= \frac{E[g(T(x)) \cdot I\{K(x) \ge h\}]}{P(K(x) \ge h)} \\
&= \frac{\int_h^\infty g(t) \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t}{{}_h p_x} \\
&= \frac{\int_0^\infty g(t+h) \cdot {}_{t+h}p_x \cdot \mu_x(t+h)\,\mathrm{d}t}{{}_h p_x} \\
&= \int_0^\infty g(t+h) \cdot {}_t p_{x+h} \cdot \mu_{x+h}(t)\,\mathrm{d}t \\
&= E[g(T(x+h) + h)]
\end{aligned}$$

(2) 由条件方差的定义及 (1)：
$$\begin{aligned}
\text{Var}[g(T(x)) \mid K(x) \ge h] &= E[g(T(x))^2 \mid K(x) \ge h] - (E[g(T(x)) \mid K(x) \ge h])^2 \\
&= E[g(T(x+h)+h)^2] - (E[g(T(x+h)+h)])^2 \\
&= \text{Var}(g(T(x+h) + h))
\end{aligned}$$

### 10.2.2 保单年度的资金变化量 $C_h$

在第 $h+1$ 个保单年度，保险人一方面在被保险人发生保险事故时要负责给付保险金，另一方面也可以得到有效保单的投保人缴纳的保费。

考虑到保费缴纳时刻与保险金给付时刻的不同，定义 $C_h$：

$$\boxed{C_h = v \cdot b_{h+1} \cdot I\{K(x) = h\} - \pi_h \cdot I\{K(x) \ge h\},\quad h = 0, 1, 2, \ldots}$$

$C_h$ 表示在第 $h+1$ 个保单年度，在时刻 $h$ 保险人的资金损失的现值。

由 $C_h$ 的定义，易证对 $h \ge j$：
$$C_h \cdot I\{K(x) \ge j\} = C_h \cdot I\{K(x) \ge h\} = C_h$$

**三种情况：**

1. **$K(x) > h$**（第 $h+1$ 年末仍生存）：$C_h = -\pi_h$（只收到保费，无需赔付）
2. **$K(x) = h$**（在第 $h+1$ 年内死亡）：$C_h = v \cdot b_{h+1} - \pi_h$
3. **$K(x) < h$**（此前已死亡）：$C_h = 0$（合同已终止）

### 定理 10.2.2（$C_h$ 的期望与方差）

$$\boxed{\begin{aligned}
(1)&\quad E[C_h \mid K(x) \ge h] = v \cdot b_{h+1} \cdot q_{x+h} - \pi_h \\[4pt]
(2)&\quad E[C_h] = (v \cdot b_{h+1} \cdot q_{x+h} - \pi_h) \cdot {}_h p_x \\[4pt]
(3)&\quad \text{Var}[C_h \mid K(x) \ge h] = (v \cdot b_{h+1})^2 \cdot p_{x+h} \cdot q_{x+h}
\end{aligned}}$$

其中 $K(x) \ge h$ 表示个体 $(x)$ 在第 $h$ 个保单年度末生存这一事件。

**证明：**

(1) 利用 $C_h$ 的定义及定理 10.2.1：
$$\begin{aligned}
E[C_h \mid K(x) \ge h] &= v \cdot b_{h+1} \cdot E[I\{K(x)=h\} \mid K(x) \ge h] - \pi_h \\
&= v \cdot b_{h+1} \cdot E[I\{K(x+h)=0\}] - \pi_h \\
&= v \cdot b_{h+1} \cdot q_{x+h} - \pi_h
\end{aligned}$$

(2) 当 $K(x) < h$ 时 $C_h = 0$，所以：
$$\begin{aligned}
E[C_h] &= E[C_h \cdot I\{K(x) \ge h\}] + E[C_h \cdot I\{K(x) < h\}] \\
&= E[C_h \mid K(x) \ge h] \cdot P(K(x) \ge h) \\
&= (v \cdot b_{h+1} \cdot q_{x+h} - \pi_h) \cdot {}_h p_x
\end{aligned}$$

(3)：
$$\begin{aligned}
\text{Var}[C_h \mid K(x) \ge h] &= \text{Var}(v \cdot b_{h+1} \cdot I\{K(x)=h\} \mid K(x) \ge h) \\
&= \text{Var}(v \cdot b_{h+1} \cdot I\{K(x+h)=0\}) \\
&= (v \cdot b_{h+1})^2 \cdot p_{x+h} \cdot q_{x+h}
\end{aligned}$$

### 例 10.2.1

在 20 岁签单的完全离散终身寿险保单，保险金额为一元，年保费为年均衡净保费。个体来自服从参数为 120 的 De Moivre 生存群。利率 $i = 0.05$。计算 $E(C_h)$ 和 $\text{Var}(C_h \mid K(20) \ge h)$。

**解：** 易证 $T(x+h) \sim U[0, 120-x-h]$。所以：

$$\begin{aligned}
A_{20} &= \sum_{j=0}^{99} v^{j+1} \cdot {}_{j}p_{20} \cdot q_{20+j}
= \sum_{j=0}^{99} 1.05^{-(j+1)} \cdot \frac{100-j}{100} \cdot \frac{1}{100-j} \\
&= \sum_{j=0}^{99} \frac{1.05^{-(j+1)}}{100}
= \frac{1 - 1.05^{-100}}{100(1 - 1.05^{-1}) \cdot 1.05} = 0.1984791
\end{aligned}$$

年均衡净保费：
$$P_{20} = \frac{d \cdot A_{20}}{1 - A_{20}} = \frac{0.05/1.05 \times 0.1984791}{1 - 0.1984791} = 0.01179$$

再利用定理 10.2.2：
$$\begin{aligned}
E(C_h) &= (v \cdot q_{20+h} - P_{20}) \cdot {}_h p_{20} \\
&= \left(\frac{1}{1.05} \cdot \frac{1}{100-h} - 0.01179\right) \cdot \frac{100-h}{100} \\[4pt]
\text{Var}[C_h \mid K(20) \ge h] &= v^2 \cdot p_{20+h} \cdot q_{20+h} \\
&= \left(\frac{1}{1.05}\right)^2 \cdot \frac{100-h-1}{100-h} \cdot \frac{1}{100-h}
\end{aligned}$$

### 10.2.3 损失量的表示

对于在 $x$ 岁投保的寿险保单，在第 $h$ 个保单年度末保险人的未来损失量记为 ${}_h L$，即在 $h$ 时刻保险人对个体 $(x)$ 未来给付额的现值减去未来投保人缴纳保费的现值。

${}_h L$ 可以表示为：
$${}_h L = \left(b_{K(x)+1} \cdot v^{K(x)+1-h} - \sum_{j=h}^{K(x)} \pi_j \cdot v^{j-h}\right) \cdot I\{K(x) \ge h\}$$

注意当 $h = 0$ 时：
$${}_0 L = b_{K(x)+1} \cdot v^{K(x)+1} - \sum_{j=0}^{K(x)} \pi_j \cdot v^j$$

### ${}_h L$ 的分解

可以将 ${}_h L$ 分解为各个保单年度的净损失的组合：

$$\begin{aligned}
{}_h L &= \sum_{j=h}^\infty b_{j+1} \cdot v^{j+1-h} \cdot I\{K(x)=j\} - \sum_{j=h}^\infty \pi_j \cdot v^{j-h} \cdot I\{K(x) \ge j\} \\
&= \sum_{j=h}^\infty v^{j-h} \cdot \left(v \cdot b_{j+1} \cdot I\{K(x)=j\} - \pi_j \cdot I\{K(x) \ge j\}\right) \\
&= \sum_{j=h}^\infty v^{j-h} \cdot C_j
\end{aligned}$$

### 定理 10.2.3（${}_h L$ 的递推分解）

对 $h = 0, 1, \ldots$：
$$\boxed{{}_h L = \sum_{j=h}^\infty v^{j-h} \cdot C_j = C_h + v \cdot {}_{h+1}L}$$

且：
$$\boxed{E[{}_h L \mid K(x) \ge h] = \sum_{j=0}^\infty b_{h+j+1} \cdot v^{j+1} \cdot {}_{j|}q_{x+h} - \sum_{j=0}^\infty \pi_{h+j} \cdot v^j \cdot {}_j p_{x+h}}$$

注意有：${}_h L \cdot I\{K(x) \ge j\} = {}_h L \cdot I\{K(x) \ge h\} = {}_h L$，$h \ge j$。

**证明（第二式）：**
$$\begin{aligned}
E[{}_h L \mid K(x) \ge h] &= E\left[\sum_{j=h}^\infty v^{j-h} \cdot C_j \mid K(x) \ge h\right] \\
&= \sum_{j=h}^\infty v^{j-h} \cdot E[C_j \cdot I\{K(x) \ge h\}] / P(K(x) \ge h) \\
&= \sum_{j=h}^\infty v^{j-h} \cdot E[C_j \cdot I\{K(x) \ge j\}] / P(K(x) \ge h) \\
&= \sum_{j=h}^\infty v^{j-h} \cdot E[C_j \mid K(x) \ge j] \cdot P(K(x) \ge j \mid K(x) \ge h)
\end{aligned}$$

再利用定理 10.2.2：
$$\begin{aligned}
E[{}_h L \mid K(x) \ge h] &= \sum_{j=h}^\infty v^{j-h} \cdot (v \cdot b_{j+1} \cdot q_{x+j} - \pi_j) \cdot {}_{j-h}p_{x+h} \\
&= \sum_{j=0}^\infty v^{j+1} \cdot b_{h+j+1} \cdot {}_{j|}q_{x+h} - \sum_{j=0}^\infty \pi_{h+j} \cdot v^j \cdot {}_j p_{x+h}
\end{aligned}$$

---

## 10.3 净准备金的定义

### 定义及基本公式

保险人在第 $h$ 个保单年度末的净准备金记为 ${}_h V$，它表示未来损失量 ${}_h L$ 在 $K(x) \ge h$ 条件下的期望：

$$\boxed{{}_h V = E[{}_h L \mid K(x) \ge h]}$$

其中 $K(x) \ge h$ 表示个体 $(x)$ 在第 $h$ 个保单年度末仍生存。对于在保单年度末已死亡的个体，保险合同已终止，不再考虑净准备金。

### 命题 10.3.1

$$\boxed{{}_h V = \sum_{j=0}^\infty b_{h+j+1} \cdot v^{j+1} \cdot {}_{j|}q_{x+h} - \sum_{j=0}^\infty \pi_{h+j} \cdot v^j \cdot {}_j p_{x+h}}$$

命题 10.3.1 的净准备金公式：
- 右边第一项 $\sum_{j=0}^\infty b_{h+j+1} \cdot v^{j+1} \cdot {}_{j|}q_{x+h}$ 是保险人未来给付额的精算现值
- 第二项 $\sum_{j=0}^\infty \pi_{h+j} \cdot v^j \cdot {}_j p_{x+h}$ 是投保人未来缴纳保费的精算现值
- 两个精算现值的差值为净准备金 ${}_h V$

### 例 10.3.1（几何增长保费）

某在 $x$ 岁签单的单位保额的终身寿险，保费于每年年初缴纳，保额在死亡年度末给付。设 $\pi_j = \pi(1+r)^j$。利用平衡准则，求 $\pi$ 及净准备金 ${}_h V$。

**解：** 利用平衡准则：
$$\sum_{j=0}^\infty v^{j+1} \cdot {}_{j|}q_x = \sum_{j=0}^\infty \pi(1+r)^j \cdot v^j \cdot {}_j p_x = \pi \sum_{j=0}^\infty \left(\frac{1+r}{1+i}\right)^j \cdot {}_j p_x$$

可解得：
$$\pi = \frac{\sum_{j=0}^\infty v^{j+1} \cdot {}_{j|}q_x}{\sum_{j=0}^\infty \left(\frac{1+r}{1+i}\right)^j \cdot {}_j p_x} = \frac{A_x}{\sum_{j=0}^\infty \left(\frac{1+r}{1+i}\right)^j \cdot {}_j p_x}$$

对于前面得到的 $\pi$：
$$\begin{aligned}
{}_h V &= \sum_{j=0}^\infty v^{j+1} \cdot {}_{j|}q_{x+h} - \sum_{j=0}^\infty \pi(1+r)^{h+j} \cdot v^j \cdot {}_j p_{x+h} \\
&= A_{x+h} - (1+r)^h \cdot \pi \sum_{j=0}^\infty \left(\frac{1+r}{1+i}\right)^j \cdot {}_j p_{x+h}
\end{aligned}$$

### 定理 10.3.2（净准备金的递推公式）

**第一式（递推关系）：**
$$\boxed{{}_h V = v \cdot b_{h+1} \cdot q_{x+h} - \pi_h + v \cdot {}_{h+1}V \cdot p_{x+h},\quad h = 0, 1, 2, \ldots}$$

**第二式（过去法/后溯法）：** 在平衡准则下（即 ${}_0 V = 0$）：
$$\boxed{{}_k V = \sum_{h=0}^{k-1} \frac{(1+i)^{k-h}}{{}_{k-h}p_{x+h}} \cdot (\pi_h - v \cdot b_{h+1} \cdot q_{x+h}),\quad k = 1, 2, \ldots}$$

**证明（第一式）：** 利用定理 10.2.3：
$$\begin{aligned}
{}_h V &= E[{}_h L \mid K(x) \ge h] \\
&= E[C_h + v \cdot {}_{h+1}L \mid K(x) \ge h] \\
&= E[C_h \mid K(x) \ge h] + v \cdot E[{}_{h+1}L \mid K(x) \ge h] \\
&= v \cdot b_{h+1} \cdot q_{x+h} - \pi_h + v \cdot E[{}_{h+1}L \cdot I\{K(x) \ge h\}] / P(K(x) \ge h) \\
&= v \cdot b_{h+1} \cdot q_{x+h} - \pi_h + v \cdot E[{}_{h+1}L \cdot I\{K(x) \ge h+1\}] / P(K(x) \ge h) \\
&= v \cdot b_{h+1} \cdot q_{x+h} - \pi_h + v \cdot \frac{P(K(x) \ge h+1)}{P(K(x) \ge h)} \cdot E[{}_{h+1}L \mid K(x) \ge h+1] \\
&= v \cdot b_{h+1} \cdot q_{x+h} - \pi_h + v \cdot p_{x+h} \cdot {}_{h+1}V
\end{aligned}$$

**证明（第二式）：** 第一式可整理为：
$$v \cdot {}_{h+1}V \cdot p_{x+h} - {}_h V = \pi_h - v \cdot b_{h+1} \cdot q_{x+h}$$

两边乘以 $\frac{(1+i)^{k-h}}{{}_{k-h}p_{x+h}}$（$k > h$）：
$$\frac{(1+i)^{k-h-1} \cdot {}_{h+1}V}{{}_{k-h-1}p_{x+h+1}} - \frac{(1+i)^{k-h} \cdot {}_h V}{{}_{k-h}p_{x+h}} = (\pi_h - v \cdot b_{h+1} \cdot q_{x+h}) \cdot \frac{(1+i)^{k-h}}{{}_{k-h}p_{x+h}}$$

对 $h = 0, 1, \ldots, k-1$ 求和，左边级数相消：
$$\sum_{h=0}^{k-1} \left[\frac{(1+i)^{k-h-1} \cdot {}_{h+1}V}{{}_{k-h-1}p_{x+h+1}} - \frac{(1+i)^{k-h} \cdot {}_h V}{{}_{k-h}p_{x+h}}\right] = {}_k V - (1+i)^k \cdot \frac{{}_0 V}{{}_k p_x} = {}_k V$$

故第二式成立。

### 定理 10.3.2 的含义

**第一式的含义：** 可将准备金的公式整理为：
$$\pi_h + {}_h V = v \cdot (b_{h+1} - {}_{h+1}V) \cdot q_{x+h} + v \cdot {}_{h+1}V$$

对在第 $h$ 个保单年度末仍生存的个体 $(x)$，保险人的净准备金为 ${}_h V$ 元，个体 $(x)$ 在第 $h+1$ 个保单年度初缴纳保费 $\pi_h$ 元，二者之和为 ${}_h V + \pi_h$。在第 $h+1$ 个保单年度初，这笔资金分配如下：

1. 在第 $h+1$ 个保单年度末，个体 $(x)$ 拥有 ${}_{h+1}V$，贴现到年初为 $v \cdot {}_{h+1}V$
2. 若个体在第 $h+1$ 个保单年度内死亡，则可得到额外给付 $b_{h+1} - {}_{h+1}V$ 元，额外给付额的精算现值为 $v \cdot (b_{h+1} - {}_{h+1}V) \cdot q_{x+h}$

$b_{h+1} - {}_{h+1}V$ 称为**第 $h+1$ 个保单年度的风险净额**——保单年度的死亡保险金与年末净准备金的差额。

**第二式的含义（过去法/后溯法）：** 在确定生存模型下：

$x$ 岁的 $l_x$ 个人投保，在后续各年死亡人数分别为 $d_{x+h}$。在第 $h+1$ 个保单年度，共有 $l_{x+h}$ 个个体缴纳保费 $\pi_h$，缴纳总额为 $l_{x+h} \cdot \pi_h$ 元；在这一年度死亡人数为 $d_{x+h}$，死亡给付总额为 $b_{h+1} \cdot d_{x+h}$ 元。因此本年度保费剩余额为 $l_{x+h} \cdot \pi_h - v \cdot b_{h+1} \cdot d_{x+h}$ 元。

将各年度的剩余累计到第 $k$ 个保单年度末，得到总的保费剩余：
$$\sum_{h=0}^{k-1} (l_{x+h} \cdot \pi_h - v \cdot b_{h+1} \cdot d_{x+h}) \cdot (1+i)^{k-h}$$

在第 $k$ 年末共有 $l_{x+k}$ 人生存，每个生存的个体平均享有的剩余保费额度为：
$$\frac{\sum_{h=0}^{k-1} (l_{x+h} \cdot \pi_h - v \cdot b_{h+1} \cdot d_{x+h}) \cdot (1+i)^{k-h}}{l_{x+k}} = {}_k V$$

即：
$$\boxed{l_{x+k} \cdot {}_k V = \sum_{h=0}^{k-1} (l_{x+h} \cdot \pi_h - v \cdot b_{h+1} \cdot d_{x+h}) \cdot (1+i)^{k-h}}$$

这称为**过去法（后溯法）**：以保险人过去的收入与支出的差异来计算准备金。而以保险人未来的支出与收入的差异来解释准备金的方法称为**将来法**。

### 例 10.3.1（续）（延期年金 + 死亡保险）

对 $x$ 岁的个体给付延期 $n$ 年的生存年金，年金从 $x+n$ 岁开始给付，在每年年初给付一元。在延期期间，在个体死亡的年末给付死亡保险金，死亡保险金额等于当年年末的净准备金。利用平衡准则计算每年的均衡净保费及年末的净准备金。

**解：** 设每年净保费为 $\pi$。对 $h = 0, 1, \ldots, n-1$，有 $b_{h+1} = {}_{h+1}V$。利用定理 10.3.2：
$${}_h V = v \cdot q_{x+h} \cdot {}_{h+1}V - \pi + v \cdot p_{x+h} \cdot {}_{h+1}V = v \cdot {}_{h+1}V - \pi$$

因此 $\pi = v \cdot {}_{h+1}V - {}_h V$。两边乘以 $v^h$：
$$v^h \cdot \pi = v^{h+1} \cdot {}_{h+1}V - v^h \cdot {}_h V$$

对 $h = 0, 1, \ldots, k-1$ 求和（$k \le n$）：
$$\pi \cdot \ddot{a}_{\overline{k|}} = v^k \cdot {}_k V - {}_0 V$$

当 $k = n$ 时：$v^n \cdot {}_n V - {}_0 V = \pi \cdot \ddot{a}_{\overline{n|}}$。由于 ${}_0 V = 0$ 且 ${}_n V = \ddot{a}_{x+n}$：
$$\pi = \frac{v^n \cdot \ddot{a}_{x+n}}{\ddot{a}_{\overline{n|}}}$$

及：
$${}_k V = \pi \cdot \ddot{s}_{\overline{k|}},\quad k = 1, 2, \ldots, n-1$$

当 $k \ge n$ 时，${}_k V = \ddot{a}_{x+k}$。

### 例 10.3.2（5 年期死亡险 + 保单组）

50 岁的个体投保 5 年期死亡险，保险金额为 1000 元，保险金在死亡年底给付。投保人每年缴纳相同数额的净保费。利率 $i = 6\%$。已知：

$$\begin{aligned}
l_{50} &= 89509.00, & l_{51} &= 88979.11, & l_{52} &= 88407.68 \\
l_{53} &= 87791.26, & l_{54} &= 87126.20, & l_{55} &= 86408.60
\end{aligned}$$

现在这类保单共有 1500 个。其中 750 个保单恰好已投保两年，500 个保单已投保三年，250 个保单已投保四年。保险金额有 1000 元和 3000 元两种，在每保单年度两种面值的保单数目相同。计算现在总的净准备金。

**解：**

(1) 先计算年均衡净保费：

死亡险的精算现值：
$$\begin{aligned}
A_{50:\enclose{actuarial}{5}}^1 &= \frac{v \cdot d_{50} + v^2 \cdot d_{51} + v^3 \cdot d_{52} + v^4 \cdot d_{53} + v^5 \cdot d_{54}}{l_{50}} \\
&= 0.02892499
\end{aligned}$$

生存年金的精算现值：
$$\begin{aligned}
\ddot{a}_{50:\enclose{actuarial}{5}} &= 1 + v \cdot \frac{l_{51}}{l_{50}} + v^2 \cdot \frac{l_{52}}{l_{50}} + v^3 \cdot \frac{l_{53}}{l_{50}} + v^4 \cdot \frac{l_{54}}{l_{50}} \\
&= 4.41137118
\end{aligned}$$

年均衡净保费：
$$P_{50:\enclose{actuarial}{5}}^1 = \frac{A_{50:\enclose{actuarial}{5}}^1}{\ddot{a}_{50:\enclose{actuarial}{5}}} = 0.00655692$$

(2) 净准备金的计算。利用递推公式：
$${}_h V + 1000 \cdot P_{50:\enclose{actuarial}{5}}^1 = 1000 \cdot v \cdot q_{50+h} + v \cdot {}_{h+1}V \cdot p_{50+h}$$

两边同乘 $l_{50+h}(1+i)$，整理得：
$$l_{50+h} \cdot ({}_h V + 1000 \cdot P_{50:\enclose{actuarial}{5}}^1) \cdot (1+i) - 1000 \cdot d_{50+h} = {}_{h+1}V \cdot l_{50+h+1}$$

即：
$${}_{h+1}V = \frac{l_{50+h} \cdot ({}_h V + 1000 \cdot P_{50:\enclose{actuarial}{5}}^1) \cdot (1+i) - 1000 \cdot d_{50+h}}{l_{50+h+1}}$$

其中 ${}_0 V = 0$。递推可计算出各年净准备金。

(3) 保单组的总净准备金：
$$375 \cdot (1+3) \times {}_2 V + 250 \cdot (1+3) \times {}_3 V + 125 \cdot (1+3) \times {}_4 V = 4788 \text{ 元}$$

> 现金流分析见 Slides 54-55 的详细表格，包含每个保单年度的保费收入、死亡给付、剩余资金和准备金计算。

---

## 10.4 保单年度的资金变化（考虑净准备金）

定义 $\Lambda_h$ 表示在考虑净准备金变化的情况下，保险人在第 $h+1$ 个保单年度的资金损失的现值：

$$\boxed{\Lambda_h = v \cdot b_{h+1} \cdot I\{K(x)=h\} + v \cdot {}_{h+1}V \cdot I\{K(x) \ge h+1\} - (\pi_h + {}_h V) \cdot I\{K(x) \ge h\}}$$

$\Lambda_h$ 与 $C_h$ 的关系：
$$\Lambda_h = C_h + v \cdot {}_{h+1}V \cdot I\{K(x) \ge h+1\} - {}_h V \cdot I\{K(x) \ge h\}$$

$\Lambda_h$ 的另一种形式：
$$\boxed{\Lambda_h = v \cdot (b_{h+1} - {}_{h+1}V) \cdot I\{K(x)=h\} - (\pi_h + {}_h V - v \cdot {}_{h+1}V) \cdot I\{K(x) \ge h\}}$$

- 右边第一项是对死亡个体额外给付的风险净额的现值，只有个体死亡时才给付
- 右边第二项对于生存到第 $h$ 个保单年度末的个体是确定的额度
- 注意 $\Lambda_h \cdot I\{K(x) \ge j\} = \Lambda_h \cdot I\{K(x) \ge h\} = \Lambda_h$，$h \ge j$

### 结论 10.4.1

对非负整数 $h, j, g$：

$$\boxed{\begin{aligned}
\text{(a)}&\quad {}_h L = \sum_{j=h}^\infty v^{j-h} \cdot \Lambda_j + {}_h V \cdot I\{K(x) \ge h\},\quad h = 0, 1, 2, \ldots \\[4pt]
\text{(b)}&\quad E[\Lambda_h \mid K(x) \ge g] = 0,\quad h \ge g \\[4pt]
\text{(c)}&\quad E(\Lambda_h) = 0 \\[4pt]
\text{(d)}&\quad \text{Var}[\Lambda_h \mid K(x) \ge h] = [v \cdot (b_{h+1} - {}_{h+1}V)]^2 \cdot p_{x+h} \cdot q_{x+h} \\[4pt]
\text{(e)}&\quad \text{Cov}(\Lambda_h, \Lambda_j \mid K(x) \ge g) = 0,\quad h > j \ge g
\end{aligned}}$$

**证明要点：**

(a) 由定理 10.2.3 和 $\Lambda_h$ 的表达式，级数消去 ${}_j V$ 项即得。

(b) 利用 $\Lambda_h$ 的表达式及定理 10.3.2：
$$\begin{aligned}
E[\Lambda_h \mid K(x) \ge g] &= [v \cdot (b_{h+1} - {}_{h+1}V) \cdot q_{x+h} - (\pi_h + {}_h V - v \cdot {}_{h+1}V)] \cdot {}_{h-g}p_{x+g} \\
&= (v \cdot b_{h+1} \cdot q_{x+h} - \pi_h - {}_h V + v \cdot p_{x+h} \cdot {}_{h+1}V) \cdot {}_{h-g}p_{x+g} \\
&= 0
\end{aligned}$$

(c) $E(\Lambda_h) = E[\Lambda_h \mid K(x) \ge h] \cdot P(K(x) \ge h) = 0$

(d) 当 $K(x) \ge h$ 时，$\Lambda_h = (v \cdot b_{h+1} - v \cdot {}_{h+1}V) \cdot I\{K(x)=h\} + v \cdot {}_{h+1}V - (\pi_h + {}_h V)$，所以：
$$\begin{aligned}
\text{Var}[\Lambda_h \mid K(x) \ge h] &= \text{Var}[(v \cdot b_{h+1} - v \cdot {}_{h+1}V) \cdot I\{K(x)=h\} \mid K(x) \ge h] \\
&= (v \cdot b_{h+1} - v \cdot {}_{h+1}V)^2 \cdot \text{Var}[I\{K(x+h)=0\}] \\
&= [v \cdot (b_{h+1} - {}_{h+1}V)]^2 \cdot p_{x+h} \cdot q_{x+h}
\end{aligned}$$

(e) 当 $h > j \ge g$ 且 $h \le K(x)$ 时，$K(x) > j$，$\Lambda_j = v \cdot {}_{j+1}V - \pi_j - {}_j V$（确定性）。利用 (b) 可证协方差为零——不同保单年度之间的 $\Lambda$ 互不相关。

### 例 10.4.1

同例 10.3.2 的数据。计算 $\text{Var}(\Lambda_h \mid K(50) \ge h)$，$h = 0, 1, 2, 3, 4$。

**解：** 利用公式：
$$\text{Var}(\Lambda_h \mid K(50) \ge h) = [v \cdot (1000 - {}_{h+1}V)]^2 \cdot p_{50+h} \cdot q_{50+h}$$

---

## 10.5 未来损失量的方差 —— Hattendorf 定理

### 定理 10.5.1（Hattendorf）

$$\boxed{\begin{aligned}
\text{(1)}&\quad \text{Var}[{}_h L \mid K(x) \ge h] = \sum_{j=h}^\infty v^{2(j-h)} \cdot \text{Var}[\Lambda_j \mid K(x) \ge h] \\[4pt]
\text{(2)}&\quad \text{Var}[({}_j L - {}_j V \cdot I\{K(x) \ge j\}) \mid K(x) \ge h] = \text{Var}[{}_j L \mid K(x) \ge j] \cdot {}_{j-h}p_{x+h},\quad j \ge h \\[4pt]
\text{(3)}&\quad \text{Var}[{}_h L \mid K(x) \ge h] = \text{Var}[\Lambda_h \mid K(x) \ge h] + v^2 \cdot p_{x+h} \cdot \text{Var}[{}_{h+1}L \mid K(x) \ge h+1] \\[4pt]
\text{(4)}&\quad \text{Var}[{}_h L \mid K(x) \ge h] = \sum_{j=h}^\infty v^{2(j-h)} \cdot [v \cdot (b_{j+1} - {}_{j+1}V)]^2 \cdot {}_{j-h}p_{x+h} \cdot p_{x+j} \cdot q_{x+j}
\end{aligned}}$$

**证明：**

(1) 对 $j \ge h$，利用结论 10.4.1(a)：
$$\begin{aligned}
\text{Var}[({}_j L - {}_j V \cdot I\{K(x) \ge j\}) \mid K(x) \ge h] &= \text{Var}\left[\sum_{l=j}^\infty v^{l-j} \cdot \Lambda_l \mid K(x) \ge h\right] \\
&= \sum_{l=j}^\infty v^{2(l-j)} \cdot \text{Var}[\Lambda_l \mid K(x) \ge h]
\end{aligned}$$

令 $j = h$，便得 (1)。

(2) 由上式及 $E[\Lambda_l \mid K(x) \ge h] = 0$：
$$\begin{aligned}
\text{Var}[({}_j L - {}_j V \cdot I\{K(x) \ge j\}) \mid K(x) \ge h] &= \sum_{l=j}^\infty v^{2(l-j)} \cdot E[(\Lambda_l)^2 \mid K(x) \ge h] \\
&= \sum_{l=j}^\infty v^{2(l-j)} \cdot E[(\Lambda_l)^2 \mid K(x) \ge l] \cdot P(K(x) \ge l \mid K(x) \ge h) \\
&= \left\{\sum_{l=j}^\infty v^{2(l-j)} \cdot \text{Var}[\Lambda_l \mid K(x) \ge j]\right\} \cdot {}_{j-h}p_{x+h} \\
&= \text{Var}[{}_j L \mid K(x) \ge j] \cdot {}_{j-h}p_{x+h}
\end{aligned}$$

(3) 由 (1)：
$$\begin{aligned}
\text{Var}[{}_h L \mid K(x) \ge h] &= E[(\Lambda_h)^2 \mid K(x) \ge h] + \sum_{l=h+1}^\infty v^{2(l-h)} \cdot E[(\Lambda_l)^2 \mid K(x) \ge h] \\
&= \text{Var}[\Lambda_h \mid K(x) \ge h] + v^2 \sum_{l=h+1}^\infty v^{2(l-h-1)} \cdot E[(\Lambda_l)^2 \mid K(x) \ge h]
\end{aligned}$$

再利用 $j = h+1$ 时的 (1) 式：
$$\text{Var}[{}_h L \mid K(x) \ge h] = \text{Var}[\Lambda_h \mid K(x) \ge h] + v^2 \cdot p_{x+h} \cdot \text{Var}[{}_{h+1}L \mid K(x) \ge h+1]$$

(4) 由 (3) 和结论 10.4.1(d) 递推即得：
$$\text{Var}[{}_h L \mid K(x) \ge h] = \sum_{j=h}^\infty v^{2(j-h)} \cdot [v \cdot (b_{j+1} - {}_{j+1}V)]^2 \cdot {}_{j-h}p_{x+h} \cdot p_{x+j} \cdot q_{x+j}$$

### Hattendorf 定理的含义

保险人未来损失量的方差可以分解为**未来各个保单年度资金损失量方差的和**，各年度之间互不相关。这为在实务中计算未来损失量在不同置信水平下的分位点提供了理论依据——通过中心极限定理的正态近似来确定所需的最低资金额度。

### 例 10.5.1

同例 10.3.2 的数据。

(1) 利用 Hattendorf 定理计算 $\text{Var}({}_h L \mid K(50) \ge h)$，$h = 0, 1, 2, 3, 4$。

**解：** 利用递推公式：
$$\text{Var}({}_h L \mid K(50) \ge h) = \text{Var}(\Lambda_h \mid K(50) \ge h) + v^2 \cdot p_{50+h} \cdot \text{Var}[{}_{h+1}L \mid K(50) \ge h+1]$$

先计算 $\text{Var}({}_4 L \mid K(50) \ge 4) = \text{Var}(\Lambda_4 \mid K(50) \ge 4)$，然后向前递推。

(2) 计算保单组的未来损失量的方差（假设个体相互独立）：
$$\begin{aligned}
\text{总方差} = &\; 375 \times \text{Var}({}_2 L \mid K(50) \ge 2) \\
&+ 375 \times 3^2 \times \text{Var}({}_2 L \mid K(50) \ge 2) \\
&+ 250 \times (1+3^2) \times \text{Var}({}_3 L \mid K(50) \ge 3) \\
&+ 125 \times (1+3^2) \times \text{Var}({}_4 L \mid K(50) \ge 4) \\
= &\; 1.0826 \times 10^6
\end{aligned}$$

(3) 计算所需资金的最低额度。前面已算出总净准备金为 4788 元。设总损失量为 $Z$：
$$P(Z > u) = P\left(\frac{Z - E(Z)}{\sqrt{\text{Var}(Z)}} > \frac{u - E(Z)}{\sqrt{\text{Var}(Z)}}\right) = 0.95$$

根据中心极限定理：
$$\frac{u - 4788}{\sqrt{1.0826 \times 10^6}} \approx 1.645$$

得 $u \approx 21904$ 元。
