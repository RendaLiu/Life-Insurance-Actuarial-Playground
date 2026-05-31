# 第十二章：完全连续险种的净准备金

> 提取自 Chapter12(L-2026)(1).pptx 课件，公式全部经手修还原。

---

## 12.1 引言

本章建立完全连续模型，给出净准备金的定义及计算公式。以终身寿险为例讨论净准备金的计算。最后通过综合例题解释各种净准备金公式的运用。

---

## 12.2 基本模型

考虑在 $x$ 岁投保的寿险，假设保费连续缴纳，死亡保险金在死亡后立即给付。记：

- $b_t$：在时刻 $t$ 给付的死亡保险金额
- $\pi_t$：时刻 $t$ 的保费缴纳率（连续缴纳）

在时刻 $t$，保险人在这个保单的未来损失量为：
$$\boxed{{}_t L = \left(b_{T(x)} \cdot v^{T(x)-t} - \int_t^{T(x)} \pi_s \cdot v^{s-t}\,\mathrm{d}s\right) \cdot I\{T(x) \ge t\}}$$

时刻 $t$ 的净准备金 ${}_t \overline{V}$ 定义为：
$$\boxed{{}_t \overline{V} = E[{}_t L \mid T(x) \ge t],\quad t > 0}$$

注意 $t$ 不必为整数。

### 结论 12.2.1（将来法公式）

$$\boxed{{}_t \overline{V} = \int_0^\infty [b_{t+s} \cdot \mu_x(t+s) - \pi_{t+s}] \cdot v^s \cdot {}_s p_{x+t}\,\mathrm{d}s}$$

**证明：** 利用定理 10.2.1 及净准备金的定义：
$$\begin{aligned}
{}_t \overline{V} &= E\left[\left(b_{T(x)} \cdot v^{T(x)-t} - \int_0^\infty I\{s < T(x)\} \cdot \pi_s \cdot v^{s-t}\,\mathrm{d}s\right) \cdot I\{T(x) > t\} \mid T(x) > t\right] \\
&= E\left[b_{T(x+t)+t} \cdot v^{T(x+t)} - \int_0^\infty I\{s < T(x+t)\} \cdot \pi_{t+s} \cdot v^s\,\mathrm{d}s\right] \\
&= \int_0^\infty b_{t+s} \cdot v^s \cdot {}_s p_{x+t} \cdot \mu_x(t+s)\,\mathrm{d}s - \int_0^\infty \pi_{t+s} \cdot v^s \cdot {}_{s}p_{x+t}\,\mathrm{d}s
\end{aligned}$$

### 例 12.2.1（Thiele 微分方程）

证明：
$$\boxed{\frac{\mathrm{d}}{\mathrm{d}t}{}_t \overline{V} = \pi_t + [\delta + \mu_x(t)] \cdot {}_t \overline{V} - b_t \cdot \mu_x(t)}$$

**证明：** 利用结论 12.2.1，将 ${}_t \overline{V}$ 改写为：
$$v^t \cdot {}_t p_x \cdot {}_t \overline{V} = \int_t^\infty [b_s \cdot \mu_x(s) - \pi_s] \cdot v^s \cdot {}_s p_x\,\mathrm{d}s$$

两边对 $t$ 求导。左边导数为：
$$\frac{\mathrm{d}}{\mathrm{d}t}(v^t \cdot {}_t p_x \cdot {}_t \overline{V}) = -\delta \cdot v^t \cdot {}_t p_x \cdot {}_t \overline{V} - v^t \cdot {}_t p_x \cdot \mu_x(t) \cdot {}_t \overline{V} + v^t \cdot {}_t p_x \cdot \frac{\mathrm{d}}{\mathrm{d}t}{}_t \overline{V}$$

右边导数为：$-[b_t \cdot \mu_x(t) - \pi_t] \cdot v^t \cdot {}_t p_x$

令两边相等并除以 $v^t \cdot {}_t p_x$：
$$\frac{\mathrm{d}}{\mathrm{d}t}{}_t \overline{V} = \pi_t + [\delta + \mu_x(t)] \cdot {}_t \overline{V} - b_t \cdot \mu_x(t)$$

**Thiele 微分方程的含义：**
$$\text{准备金变化率} = \underbrace{\pi_t}_{\text{保费收入}} + \underbrace{\delta \cdot {}_t \overline{V}}_{\text{利息收入}} - \underbrace{[b_t - {}_t \overline{V}] \cdot \mu_x(t)}_{\text{死亡风险净成本}}$$

### 例 12.2.2

一个在 40 岁投保的完全连续的 25 年期寿险，保险金额为 $b_t = 1000 \cdot \overline{a}_{\overline{25-t|}}$。已知 $A_{50:\enclose{actuarial}{15}} = 0.60$，$i = 0.05$。每一时刻的保费缴纳率为 200。计算第 10 个保单年度末的净准备金 ${}_{10}\overline{V}$。

**解：** 在第 10 年底，保险人未来给付额的现值为：
$$Z = v^{T(50)} \cdot 1000 \cdot \overline{a}_{\overline{25-T(50)-10|}} \cdot I\{T(50) \le 15\}$$

给付额的精算现值：
$$\begin{aligned}
E(Z) &= \int_0^{15} v^t \cdot 1000 \cdot \frac{1 - v^{15-t}}{\delta} \cdot {}_t p_{50} \cdot \mu_{50}(t)\,\mathrm{d}t \\
&= \frac{1000}{\delta}\left\{\int_0^{15} v^t \cdot {}_t p_{50} \cdot \mu_{50}(t)\,\mathrm{d}t - v^{15} \int_0^{15} {}_t p_{50} \cdot \mu_{50}(t)\,\mathrm{d}t\right\} \\
&= \frac{1000}{\delta}\{\overline{A}_{50:\enclose{actuarial}{15}}^1 - v^{15} \cdot {}_{15}q_{50}\} \\
&= \frac{1000}{\delta}\{\overline{A}_{50:\enclose{actuarial}{15}} + {}_{15}E_{50} - v^{15}\} = \frac{1000}{\delta}(0.6 - 1.05^{-15}) = 2439
\end{aligned}$$

未来保费收入的精算现值：
$$200 \cdot \overline{a}_{50:\enclose{actuarial}{15}} = 200 \times \frac{1 - A_{50:\enclose{actuarial}{15}}}{\delta} = 1640$$

因此：${}_{10}\overline{V} = 2439 - 1640 = 799$

---

## 12.3 终身寿险的净准备金

在 $x$ 岁投保的终身寿险，死亡保险金为 1 元，年均衡净保费缴纳率记为 $\overline{P}(\overline{A}_x)$。

### 损失量与净准备金

保险人对个体 $(x)$ 在时刻 $t$ 的未来损失量：
$${}_t L = (v^{T(x)-t} - \overline{P}(\overline{A}_x) \cdot \overline{a}_{\overline{T(x)-t|}}) \cdot I\{T(x) > t\}$$

时刻 $t$ 的净准备金：
$$\boxed{{}_t \overline{V}(\overline{A}_x) = E[{}_t L \mid T(x) \ge t] = \overline{A}_{x+t} - \overline{P}(\overline{A}_x) \cdot \overline{a}_{x+t}}$$

### 结论 12.3.1（损失量的方差）

$$\boxed{\text{Var}[{}_t L \mid T(x) > t] = \frac{{}^2\overline{A}_{x+t} - (\overline{A}_{x+t})^2}{(\delta \cdot \overline{a}_x)^2}}$$

### 结论 12.3.2（净准备金的五种公式）

$$\boxed{\begin{aligned}
\text{(a) 保费差公式：}&\quad {}_t \overline{V}(\overline{A}_x) = (\overline{P}(\overline{A}_{x+t}) - \overline{P}(\overline{A}_x)) \cdot \overline{a}_{x+t} \\[4pt]
\text{(b) 缴清保险公式：}&\quad {}_t \overline{V}(\overline{A}_x) = \left(1 - \frac{\overline{P}(\overline{A}_x)}{\overline{P}(\overline{A}_{x+t})}\right) \cdot \overline{A}_{x+t} \\[4pt]
\text{(c) 后溯公式：}&\quad {}_t \overline{V}(\overline{A}_x) = \overline{P}(\overline{A}_x) \cdot \overline{s}_{x:\enclose{actuarial}{t}} - {}_t \kappa_x \\[4pt]
\text{(d) 年金比公式：}&\quad {}_t \overline{V}(\overline{A}_x) = 1 - \frac{\overline{a}_{x+t}}{\overline{a}_x} \\[4pt]
&\quad {}_t \overline{V}(\overline{A}_x) = \frac{\overline{P}(\overline{A}_{x+t}) - \overline{P}(\overline{A}_x)}{\overline{P}(\overline{A}_{x+t}) + \delta} \\[4pt]
&\quad {}_t \overline{V}(\overline{A}_x) = \frac{\overline{A}_{x+t} - \overline{A}_x}{1 - \overline{A}_x}
\end{aligned}}$$

其中连续情况下的精算累计成本定义为 ${}_t \kappa_x = \frac{\overline{A}_{x:\enclose{actuarial}{t}}^1}{{}_t E_x}$。

### 例 12.3.1

在 30 岁投保的完全连续终身寿险，保额为 1 元。保费按照平衡准则来确定。$L$ 表示保险人的签单损失量。已知 $\overline{A}_{50} = 0.7$，${}^2\overline{A}_{30} = 0.3$，$\text{Var}(L) = 0.2$。计算第 20 年末的净准备金 ${}_{20}\overline{V}(\overline{A}_{30})$。

**解：** 由：
$$\text{Var}(L) = \frac{{}^2\overline{A}_{30} - (\overline{A}_{30})^2}{(1 - \overline{A}_{30})^2} = \frac{0.3 - (\overline{A}_{30})^2}{(1 - \overline{A}_{30})^2} = 0.2$$

解得 $\overline{A}_{30} = 0.5$。

因此：
$${}_{20}\overline{V}(\overline{A}_{30}) = \frac{\overline{A}_{50} - \overline{A}_{30}}{1 - \overline{A}_{30}} = \frac{0.7 - 0.5}{1 - 0.5} = 0.40$$

---

## 12.4 综合例子

### 例 12.4.1（死亡力图形比较）

个体 $(x)$ 的 5 年期完全连续的定期寿险保单，利息力 $\delta = 0.10$。下面五种死亡力假设对应的图形中（横轴为时间 $t$，纵轴为死亡力 $\mu_x(t)$），在第 2 年末哪种假设下的净准备金最高？

**解：** 五种死亡力记为 $\mu_x^A(t), \ldots, \mu_x^E(t)$，对应的净准备金记为 ${}_t \overline{V}^A, \ldots, {}_t \overline{V}^E$。

根据完全连续险种净准备金的将来法公式和死亡力图形的关系：
$${}_2 \overline{V} = \overline{A}_{x+2:\enclose{actuarial}{3}}^1 - \overline{P} \cdot \overline{a}_{x+2:\enclose{actuarial}{3}}$$

其中：
$$\overline{A}_{x:\enclose{actuarial}{5}}^1 = 1 - \delta \cdot \overline{a}_{x:\enclose{actuarial}{5}} - {}_5 E_x = 1 - \int_0^5 e^{-\delta t} \cdot e^{-\int_0^t \mu_x(s)\,\mathrm{d}s}\,\mathrm{d}t - e^{-5\delta} \cdot e^{-\int_0^5 \mu_x(s)\,\mathrm{d}s}$$

对于给定的图形关系，可比较各假设下的精算现值和准备金大小。关键因素：时刻 2 之后的死亡力越高，意味着剩余保险期内的期望赔付越高，准备金也越高。
