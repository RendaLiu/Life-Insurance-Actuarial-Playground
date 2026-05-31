# 第四章：死亡保险的精算现值

> 提取自 chapter4(2026).pptx 课件，公式经手修及数值验证。

---

## 4.1 介绍

死亡保险是以人的死亡为给付条件的险种，若被保险人在保险期限内死亡则保险人给付保险金，否则保险人不予给付。根据保险期限的不同，可将死亡保险分为**定期死亡保险（定期寿险）**和**终身死亡保险（终身寿险）**。

本章主要对以下基本险种建立随机给付模型：生存保险、定期寿险、终身寿险、生死合险、延期死亡保险等。模型分为两类：
- **死亡保险金在死亡的保单年度末给付**（完全离散）
- **死亡保险金在死亡后立即给付**（完全连续）

利率假设为常数 $i$，利息力 $\delta = \ln(1+i)$，贴现率 $d = \frac{i}{1+i}$，贴现因子 $v = \frac{1}{1+i}$。

对正整数 $m$：$i^{(m)} = m((1+i)^{1/m}-1)$，$d^{(m)} = m(1-v^{1/m})$。

除特别说明，$(x)$ 均指某年龄为 $x$ 岁的个体，$x$ 为整数。

---

## 4.2 生存保险

在 $x$ 岁投保的保额为一元的 $n$ 年期生存保险：当被保险人生存至第 $n$ 年末保险期满时，保险人给付一元生存保险金，保险合同终止。

保险人给付额的现值：

$$Z = v^n \cdot I\{T(x) > n\}$$

精算现值记为 ${}_n E_x$（在寿险中也记作 $A_{x:\enclose{actuarial}{n}}^{\phantom{1}1}$）。

### 结论 4.2.1

$${}_n E_x = E(Z) = v^n \cdot E[I\{T(x) > n\}] = v^n \cdot {}_n p_x$$

$$l_x \cdot {}_n E_x = v^n \cdot l_{x+n}$$

### 例 4.2.1

证明并解释：对 $n \ge 1$，有

$$(1+i) \cdot l_x \cdot {}_n E_x = l_{x+1} \cdot {}_{n-1}E_{x+1}$$

### 例 4.2.2

某在 20 岁投保的 3 年期生存保险，生存保险金为 1000 元。共有 1000 个 20 岁的个体投保，每人缴纳保费 $1000 \cdot {}_3 E_{20}$ 元。已知：

- $q_{20} = 0.01,\; q_{21} = 0.02,\; q_{22} = 0.03$
- 利率 $i = 0.025$

计算 ${}_3 E_{20}$，并分析保险人在这个保单组的资金变动情况。

**解：**

$$\begin{aligned}
{}_3 E_{20} &= v^3 \cdot {}_3 p_{20} = 1.025^{-3} \cdot p_{20} \cdot p_{21} \cdot p_{22} \\
&= 1.025^{-3} \cdot (1 - q_{20})(1 - q_{21})(1 - q_{22}) \\
&= 1.025^{-3} \cdot (1-0.01)(1-0.02)(1-0.03) \\
&= 0.873899334
\end{aligned}$$

---

## 4.3 定期死亡保险

定期死亡保险（定期寿险），是以被保险人在合约期限内死亡为保险事故，由保险人负责给付保险金的死亡险。若保险期满被保险人仍生存，则保险人不予给付。

本节讨论签单年龄为 $x$ 岁的 $n$ 年期死亡保险保单，保险金额为一元。

### 4.3.1 死亡后立即给付

被保险人死亡时刻为 $T(x)$，保险人给付时刻亦为 $T(x)$。保险人给付额的现值：

$$Z = v^{T(x)} \cdot I\{T(x) \le n\}$$

精算现值记为 $\overline{A}_{x:\enclose{actuarial}{n}}^1$。

#### 结论 4.3.1

$$\overline{A}_{x:\enclose{actuarial}{n}}^1 = \int_0^n v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

记 ${}^j\overline{A}_{x:\enclose{actuarial}{n}}^1 = \overline{A}_{x:\enclose{actuarial}{n}}^1 @ j\delta$，其中 $@j\delta$ 表示计算时采用的利息力为 $j\delta$。

#### 结论 4.3.2

$$E(Z^j) = \int_0^n e^{-\delta j t} \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t = {}^j\overline{A}_{x:\enclose{actuarial}{n}}^1$$

即 $E(Z^j)@\delta = E(Z)@j\delta$：以利息力 $\delta$ 计算的 $Z$ 的 $j$ 阶矩等于以利息力 $j\delta$ 计算的 $Z$ 的精算现值。

#### 例 4.3.1

已知个体 $(x)$ 的未来生存时间 $T$ 的密度为 $f_T(t) = 1/80,\; 0 \le t \le 80$。个体 $(x)$ 投保 10 年期寿险，死亡保险金为一元，在死亡后立即给付。利息力为 $\delta = 0.02$。求保险人给付额的现值 $Z$ 的精算现值、方差和 0.90 分位点。

**解：** 现值 $Z = e^{-0.02 T(x)} \cdot I\{T(x) \le 10\}$。

精算现值：
$$\overline{A}_{x:10|}^1 = \frac{1}{80}\int_0^{10} e^{-0.02s}\,\mathrm{d}s = 0.11329$$

利用结论 4.3.2 计算 $Z$ 的二阶矩：
$${}^2\overline{A}_{x:10|}^1 = \frac{1}{80}\int_0^{10} e^{-0.04s}\,\mathrm{d}s = 0.10302$$

方差：
$$\text{Var}(Z) = E(Z^2) - (EZ)^2 = 0.10302 - (0.11329)^2 = 0.0902$$

对 $y > 0$：
$$\begin{aligned}
P(Z \le y) &= P(T > 10) + P(T \le 10, e^{-0.02T} \le y) \\
&= \frac{70}{80} + P\left(-\frac{\ln y}{0.02} \le T \le 10\right) \\
&= \frac{70}{80} + \frac{50\ln(y) + 10}{80} = 0.9
\end{aligned}$$

解得 $y = 0.85214$，即 $Z$ 的 0.90 分位点为 0.85214。

#### 例 4.3.2

证明：对 $0 < m < n$，有

$$\overline{A}_{x:\enclose{actuarial}{n}}^1 = \overline{A}_{x:\enclose{actuarial}{m}}^1 + {}_m E_x \cdot \overline{A}_{x+m:\enclose{actuarial}{n-m}}^1$$

**证明：**

$$\begin{aligned}
\overline{A}_{x:\enclose{actuarial}{n}}^1 &= \int_0^n v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t \\
&= \int_0^m v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t + \int_m^n v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t \\
&= \overline{A}_{x:\enclose{actuarial}{m}}^1 + \int_0^{n-m} v^{t+m} \cdot {}_{t+m}p_x \cdot \mu_x(t+m)\,\mathrm{d}t \\
&= \overline{A}_{x:\enclose{actuarial}{m}}^1 + v^m \cdot {}_m p_x \cdot \int_0^{n-m} v^t \cdot {}_t p_{x+m} \cdot \mu_{x+m}(t)\,\mathrm{d}t \\
&= \overline{A}_{x:\enclose{actuarial}{m}}^1 + {}_m E_x \cdot \overline{A}_{x+m:\enclose{actuarial}{n-m}}^1
\end{aligned}$$

### 4.3.2 死亡的保单年度末给付

在个体 $(x)$ 死亡的保单年度末给付保险金时，给付的时刻为 $K(x) + 1$。

$$Z = v^{K(x)+1} \cdot I\{T(x) \le n\}$$

精算现值记为 $A_{x:\enclose{actuarial}{n}}^1$。

#### 结论 4.3.3

$$A_{x:\enclose{actuarial}{n}}^1 = \sum_{j=0}^{n-1} v^{j+1} \cdot {}_{j|}q_x$$

#### 例 4.3.3

在 $x$ 岁签单的两年期死亡险保单，保险金额为一元，在死亡保单年度末给付。已知 $\text{Var}(Z) = 0.1771$，$q_x = 0.50$，$i = 0$。计算 $q_{x+1}$。

**解：** 由 $i = 0$，$v = 1$，现值 $Z = I\{T(x) \le 2\} = I\{K(x) \le 1\}$。

$$\begin{aligned}
P(Z = 1) &= P(K(x) = 0) + P(K(x) = 1) = q_x + p_x \cdot q_{x+1} = 0.50 + 0.50 \cdot q_{x+1} \\
P(Z = 0) &= 1 - P(Z = 1) = 0.50 - 0.50 \cdot q_{x+1}
\end{aligned}$$

$$\text{Var}(Z) = P(Z = 1) \cdot P(Z = 0) = (0.50 + 0.50q_{x+1})(0.50 - 0.50q_{x+1}) = 0.25 - 0.25q_{x+1}^2 = 0.1771$$

解得 $q_{x+1} = 0.54$。

#### 例 4.3.4

证明下面的等式：

$$A_{x:\enclose{actuarial}{n}}^1 = v \cdot q_x + v \cdot p_x \cdot A_{x+1:\enclose{actuarial}{n-1}}^1$$

$$l_x \cdot A_{x:\enclose{actuarial}{n}}^1 = \sum_{j=0}^{n-1} v^{j+1} \cdot d_{x+j}$$

#### 例 4.3.5

在 $x$ 岁签单的三年期寿险，不同保单年度的死亡概率与保险金额：

| 保单年度 $t$ | 保险金额 | $q_{x+t-1}$ |
|:---:|:---:|:---:|
| 1 | 1 | 0.2 |
| 2 | 2 | 0.25 |
| 3 | 3 | 0.4 |

已知 $v = 0.9$，死亡保险金在死亡保单年度末给付。计算保险人给付额现值超过 1.50 的概率。

**解：** 保险人给付额的现值：

$$Z = v \cdot I\{K(x)=0\} + 2v^2 \cdot I\{K(x)=1\} + 3v^3 \cdot I\{K(x)=2\}$$

由 $v = 0.9$：$2v^2 = 1.62$，$3v^3 = 2.187$。

$$\begin{aligned}
P(Z \ge 1.5) &= P(K(x)=1 \text{ 或 } K(x)=2) \\
&= P(K(x)=1) + P(K(x)=2) \\
&= (1-0.2) \times 0.25 + (1-0.2) \times (1-0.25) \times 0.4 = 0.44
\end{aligned}$$

#### 例 4.3.6

证明并解释：

$$l_x(1+i)A_{x:\enclose{actuarial}{n}}^1 = d_x \cdot (1 - A_{x+1:\enclose{actuarial}{n-1}}^1) + l_x \cdot A_{x+1:\enclose{actuarial}{n-1}}^1$$

**证明：** 由递推公式：

$$(1+i)A_{x:\enclose{actuarial}{n}}^1 = q_x + p_x \cdot A_{x+1:\enclose{actuarial}{n-1}}^1 = q_x(1 - A_{x+1:\enclose{actuarial}{n-1}}^1) + A_{x+1:\enclose{actuarial}{n-1}}^1$$

将 $q_x = d_x/l_x$ 代入，整理得证。

### 4.3.3 不同的给付时刻精算现值之间的关系

#### 结论 4.3.4

设在每一年龄年 UDD 假设成立，则：

$$\overline{A}_{x:\enclose{actuarial}{n}}^1 = \frac{i}{\delta} \cdot A_{x:\enclose{actuarial}{n}}^1$$

#### 例 4.3.7

已知在每一年龄年 UDD 假设成立。给定 $i = 0.10$，$q_x = 0.05$，$q_{x+1} = 0.08$。计算 $\overline{A}_{x:2|}^1$。

**解：**

$$A_{x:2|}^1 = v \cdot q_x + v^2 \cdot p_x \cdot q_{x+1} = \frac{0.05}{1.1} + \frac{0.95 \times 0.08}{1.1^2} = 0.1083$$

利用结论 4.3.4：
$$\overline{A}_{x:2|}^1 = \frac{i}{\delta} \cdot A_{x:2|}^1 = \frac{0.10}{\ln(1.1)} \times 0.1083 = 0.114$$

---

## 4.4 终身死亡保险

终身死亡保险（终身寿险）的保险期限是终生的。在理论上终身寿险可以看作定期寿险当 $n \to \infty$ 的极限情况。本节假设个体在 $x$ 岁投保终身寿险，死亡保险金为一元。

### 4.4.1 死亡后立即给付

在死亡后立即给付时，保险人给付额的现值为 $Z = v^{T(x)}$。精算现值记为 $\overline{A}_x$。

$$\overline{A}_x = E(Z) = \int_0^\infty v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

记 ${}^j\overline{A}_x = \overline{A}_x @ j\delta$，易证 $E(Z^j) = {}^j\overline{A}_x$。

#### 例 4.4.1

1000 个 $x$ 岁独立的个体投保终身寿险。死亡保险金为一元，在死亡后立即给付。死亡力为常数 $\mu = 0.04$。死亡给付由某投资基金提供，投资基金的利息力 $\delta = 0.06$。计算 $t = 0$ 时所需资金的最低额度为多少时，使得足以支付未来死亡保险金的概率为 0.95。

**解：** 记 1000 个个体的未来生存时间为 $T_1(x), T_2(x), \ldots, T_{1000}(x)$。总给付额的现值为 $\sum_{j=1}^{1000} v^{T_j(x)}$。

$$\overline{A}_x = \int_0^\infty e^{-\delta t} \cdot e^{-\mu t} \cdot \mu\,\mathrm{d}t = \frac{\mu}{\mu + \delta} = \frac{0.04}{0.10} = 0.4$$

$${}^2\overline{A}_x = \overline{A}_x @ 2\delta = \frac{\mu}{\mu + 2\delta} = \frac{0.04}{0.14} = 0.25$$

$$\text{Var}(v^{T(x)}) = {}^2\overline{A}_x - (\overline{A}_x)^2 = 0.25 - 0.16 = 0.09$$

设 $u$ 为满足题目要求的最低资金。利用中心极限定理：

$$P\left(\sum v^{T_j(x)} \le u\right) = P\left(\frac{\sum v^{T_j(x)} - 1000\overline{A}_x}{\sqrt{1000 \cdot \text{Var}(v^{T_1(x)})}} \le \frac{u - 400}{\sqrt{90}}\right) \approx \Phi\left(\frac{u - 400}{\sqrt{90}}\right)$$

正态分布 0.95 分位点为 1.645，故 $\frac{u - 400}{\sqrt{90}} \approx 1.645$，得 $u \approx 415.61$ 元。

#### 例 4.4.2

证明：$\frac{\mathrm{d}}{\mathrm{d}x}\overline{A}_x = \delta\overline{A}_x + \mu(x)(\overline{A}_x - 1)$

**证明：** 由 $\overline{A}_x = \int_0^\infty v^t \cdot {}_t p_x \cdot \mu(x+t)\,\mathrm{d}t = \int_0^\infty e^{-\delta t} \cdot e^{-\int_x^{x+t} \mu(s)\,\mathrm{d}s} \cdot \mu(x+t)\,\mathrm{d}t$，利用分部积分：

$$\overline{A}_x = 1 - \delta\int_0^\infty v^t \cdot e^{-\int_x^{x+t} \mu(s)\,\mathrm{d}s}\,\mathrm{d}t$$

对 $x$ 求导即可得证。

### 4.4.2 死亡保单年度末给付

在死亡的保单年度末给付时，$Z = v^{K(x)+1}$。精算现值记为 $A_x$。

#### 结论 4.4.1

$$A_x = \sum_{j=0}^\infty v^{j+1} \cdot {}_{j|}q_x$$

#### 结论 4.4.2

$$\begin{aligned}
l_x \cdot A_x &= \sum_{j=0}^\infty v^{j+1} \cdot d_{x+j} \\
A_x &= v \cdot q_x + v \cdot p_x \cdot A_{x+1} \\
l_x(1+i)A_x &= l_x \cdot A_{x+1} + d_x \cdot (1 - A_{x+1})
\end{aligned}$$

#### 例 4.4.3

证明并解释：$(1+i)A_x = A_{x+1} + q_x(1 - A_{x+1}) = q_x + p_x \cdot A_{x+1}$

#### 例 4.4.4

给定 $A_{76} = 0.800$，$v \cdot p_{76} = 0.9$，$i = 0.03$，计算 $A_{77}$。

**解：** 利用 $i = 0.03$，$v = 1/1.03$：

$$p_{76} = v \cdot p_{76} \times 1.03 = 0.9 \times 1.03 = 0.927$$
$$q_{76} = 1 - p_{76} = 0.073$$

由 $A_{76} = v \cdot q_{76} + v \cdot p_{76} \cdot A_{77}$：
$$0.800 = \frac{0.073}{1.03} + 0.9 \cdot A_{77}$$

解得 $A_{77} = 0.810$。

#### 结论 4.4.3

在每一年龄年 UDD 假设下：
$$\overline{A}_x = \frac{i}{\delta} \cdot A_x$$

#### 例 4.4.5

已知在每一年龄年 UDD 假设成立。利率 $i = 0.05$，$q_{35} = 0.01$，$A_{36} = 0.185$。计算 $\overline{A}_{35}$。

**解：** 利用 UDD 假设：
$$A_{36} = \frac{i}{\delta} \cdot \overline{A}_{36} \;\Longrightarrow\; \overline{A}_{36} = A_{36} \cdot \frac{\delta}{i} = 0.185 \times \frac{\ln(1.05)}{0.05} = 0.1805$$

再利用 $\overline{A}_{35} = \overline{A}_{35:\enclose{actuarial}{1}}^1 + v \cdot p_{35} \cdot \overline{A}_{36}$：
$$\overline{A}_{35} = \frac{0.01}{1.05} + \frac{(1-0.01) \times 0.1805}{1.05} = 0.1797$$

---

## 4.5 生死合险

生死合险（两全保险）：当被保险人在保险期内死亡时保险人负责给付死亡保险金，当被保险人生存至保险届满时保险人负责给付生存保险金。

本节讨论在 $x$ 岁签单的 $n$ 年期两全保险，保险金额均为一元。

### 4.5.1 死亡后立即给付

对于个体 $(x)$ 的 $n$ 年期生死合险，保险人给付时刻等于死亡时刻 $T(x)$ 与保险期限 $n$ 的最小值。记 $T(x) \land n = \min\{T(x), n\}$。

$$Z = v^{T(x) \land n}$$

精算现值记为 $\overline{A}_{x:\enclose{actuarial}{n}}$。记 ${}^j\overline{A}_{x:\enclose{actuarial}{n}} = \overline{A}_{x:\enclose{actuarial}{n}} @ j\delta$。

#### 结论 4.5.1

$$\overline{A}_{x:\enclose{actuarial}{n}} = \overline{A}_{x:\enclose{actuarial}{n}}^1 + {}_n E_x$$

**证明：** 分别记死亡保险和生存保险的现值为 $Z_1 = v^{T(x)}I\{T(x) \le n\}$ 和 $Z_2 = v^n I\{T(x) > n\}$，则 $Z = Z_1 + Z_2$。两边取期望即得。

#### 结论 4.5.2

对整数 $0 < m < n$：
$$\overline{A}_{x:\enclose{actuarial}{n}} = \overline{A}_{x:\enclose{actuarial}{m}} + {}_m E_x \cdot \overline{A}_{x+m:\enclose{actuarial}{n-m}}$$

#### 结论 4.5.3

$$\text{Var}(Z) = \text{Var}(Z_1) + \text{Var}(Z_2) - 2\overline{A}_{x:\enclose{actuarial}{n}}^1 \cdot {}_n E_x$$

由结论 4.5.3 知：$\text{Var}(Z) < \text{Var}(Z_1) + \text{Var}(Z_2)$，即生死合险的方差小于其对应的生存保险和死亡保险的方差和——生死合险可起到**降低保险人风险**的作用。

#### 例 4.5.1

某在 60 岁签单的特殊的 3 年期生死合险：第一保单年度死亡保险金为 100 元，后两年死亡保险金为 200 元，生存保险金为 200 元。死亡保险金在死亡后立即给付。个体来自死亡率遵从 De Moivre 法则的群体，参数 $\omega = 70$。利率 $i = 0$。计算保险人给付额的现值的方差。

**解：** 由第一章结论，$T(60)$ 服从 $[0, 10]$ 上的均匀分布。由 $i = 0$：

$$Z = 100 \cdot I\{K(60) = 0\} + 200 \cdot I\{K(60) \ge 1\}$$

$$\begin{aligned}
E(Z) &= 100 \cdot P(K(60)=0) + 200 \cdot P(K(60) \ge 1) = 100 \times \frac{1}{10} + 200 \times \frac{9}{10} = 190 \\
E(Z^2) &= 100^2 \times \frac{1}{10} + 200^2 \times \frac{9}{10} = 37000
\end{aligned}$$

$$\text{Var}(Z) = EZ^2 - (E(Z))^2 = 37000 - 190^2 = 900$$

### 4.5.2 死亡保单年度末给付

若个体 $(x)$ 死亡，保险人在个体 $(x)$ 的死亡保单年度末给付保险金，给付时刻为 $(K(x)+1) \land n = \min\{K(x)+1, n\}$。

$$Z = v^{(K(x)+1) \land n}$$

精算现值记为 $A_{x:\enclose{actuarial}{n}}$。

$$A_{x:\enclose{actuarial}{n}} = \sum_{j=0}^{n-1} v^{j+1} \cdot {}_{j|}q_x + v^n \cdot {}_n p_x = A_{x:\enclose{actuarial}{n}}^1 + {}_n E_x$$

记 ${}^j A_{x:\enclose{actuarial}{n}} = A_{x:\enclose{actuarial}{n}} @ j\delta$，易证 ${}^j A_{x:\enclose{actuarial}{n}} = E(Z^j)$。

#### 结论 4.5.4

对正整数 $m < n$：
$$A_{x:\enclose{actuarial}{n}} = A_{x:\enclose{actuarial}{m}} + {}_m E_x \cdot A_{x+m:\enclose{actuarial}{n-m}}$$

#### 例 4.5.2

已知 $A_{x} = 0.25$，$A_{x+20} = 0.40$，$A_{x:\enclose{actuarial}{20}} = 0.3$。计算 $A_{x:\enclose{actuarial}{20}}^1$ 和 $A_{x:\enclose{actuarial}{20}}^{\phantom{1}1}$。

**解：** 由 $A_x = A_{x:\enclose{actuarial}{20}}^1 + {}_{20}E_x \cdot A_{x+20}$ 以及 $A_{x:\enclose{actuarial}{20}} = A_{x:\enclose{actuarial}{20}}^1 + A_{x:\enclose{actuarial}{20}}^{\phantom{1}1}$，代入求解即可。

#### 例 4.5.3

解释等式：$(1+i)A_{x:\enclose{actuarial}{n}} = q_x(1 - A_{x+1:\enclose{actuarial}{n-1}}) + A_{x+1:\enclose{actuarial}{n-1}}$

**解：** 在确定生存群中，$x$ 岁的个体缴纳 $A_{x:\enclose{actuarial}{n}}$ 元，在一年末资金总额为 $(1+i)A_{x:\enclose{actuarial}{n}}$ 元。一年末不论个体是否生存，都可享有 $A_{x+1:\enclose{actuarial}{n-1}}$ 元。若个体在一年内死亡（概率 $q_x$），则可在年末得到额外的给付 $1 - A_{x+1:\enclose{actuarial}{n-1}}$ 元。因此期望给付额 = $q_x(1 - A_{x+1:\enclose{actuarial}{n-1}}) + A_{x+1:\enclose{actuarial}{n-1}}$，正好等于年末资金额。

#### 例 4.5.4

个体 (60) 的五年期生死合险，保额为 1000 元，死亡给付在死亡的保单年度末进行。记保险人给付额的现值为 Z。已知：

$$A_{60:5|} = 0.7896,\; {}^2 A_{65} = 0.2836,\; {}^2 A_{60} = 0.2196,\; {}^2 A_{60:5|}^{\phantom{1}1} = 0.5649$$

计算 Var(Z)。

**解：** 由 ${}^2 A_{60} = {}^2 A_{60:5|}^1 + {}^2 A_{60:5|}^{\phantom{1}1} \cdot {}^2 A_{65}$：

$${}^2 A_{60:5|}^1 = {}^2 A_{60} - {}^2 A_{60:5|}^{\phantom{1}1} \cdot {}^2 A_{65} = 0.0594$$

$${}^2 A_{60:5|} = {}^2 A_{60:5|}^1 + {}^2 A_{60:5|}^{\phantom{1}1} = 0.6243$$

$$\text{Var}(Z) = 1000^2 \cdot ({}^2 A_{60:5|} - (A_{60:5|})^2) = 831.84$$

### 4.5.3 不同死亡给付时刻的精算现值之间的关系

#### 结论 4.5.5

在每一年龄年 UDD 假设下：

$$\overline{A}_{x:\enclose{actuarial}{n}} = A_{x:\enclose{actuarial}{n}}^1 + \frac{i - \delta}{\delta} \cdot {}_n E_x$$

---

## 4.6 延期死亡保险

对于个体 $(x)$ 的延期 $m$ 年的终身死亡保险：若被保险人 $(x)$ 在签单后的 $m$ 年内死亡，则保险人不承担给付责任；当个体 $(x)$ 在签单 $m$ 年后死亡时，保险人负责给付死亡保险金。保险金为一元。

### 4.6.1 死亡后立即给付

$$Z = v^{T(x)} \cdot I\{T(x) > m\}$$

精算现值记为 ${}_{m|}\overline{A}_x$。

$${}_{m|}\overline{A}_x = E(v^{T(x)} \cdot I\{T(x) > m\}) = \int_m^\infty v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

#### 结论 4.6.1

$${}_{m|}\overline{A}_x = {}_m E_x \cdot \overline{A}_{x+m}$$

#### 例 4.6.1

在 $x$ 岁签单的延期 5 年的终身寿险，保险金额为一元，在死亡后立即给付。个体的死亡力为 $\mu = 0.10$，利息力 $\delta = 0.10$。计算保险人给付额的现值的期望和方差。

**解：** 保险人给付额的现值 $Z = v^{T(x)} \cdot I\{T(x) > 5\}$。

$$\begin{aligned}
{}_{5|}\overline{A}_x &= \int_5^\infty e^{-\delta t} \cdot e^{-\mu t} \cdot \mu\,\mathrm{d}t = \frac{\mu \cdot e^{-5(\mu+\delta)}}{\mu + \delta} = \frac{0.10 \cdot e^{-1}}{0.20} = 0.18394 \\
{}^2_{5|}\overline{A}_x &= \int_5^\infty e^{-2\delta t} \cdot e^{-\mu t} \cdot \mu\,\mathrm{d}t = \frac{\mu \cdot e^{-5(\mu+2\delta)}}{\mu + 2\delta} = \frac{0.10 \cdot e^{-1.5}}{0.30} = 0.074377
\end{aligned}$$

$$\text{Var}(Z) = {}^2_{5|}\overline{A}_x - ({}_{5|}\overline{A}_x)^2 = 0.0405$$

### 4.6.2 死亡的保单年度末给付

$$Z = v^{K(x)+1} \cdot I\{T(x) > m\}$$

精算现值记为 ${}_{m|}A_x$。

$${}_{m|}A_x = E(v^{K(x)+1} \cdot I\{T(x) > m\}) = \sum_{j=m}^\infty v^{j+1} \cdot {}_{j|}q_x$$

#### 结论 4.6.2

$${}_{m|}A_x = {}_m E_x \cdot A_{x+m}$$

#### 例 4.6.2

证明：$A_x = A_{x:\enclose{actuarial}{m}}^1 + {}_{m|}A_x$

**证明：** $A_x = E(v^{K(x)+1}) = E[v^{K(x)+1}I\{K(x) < m\}] + E[v^{K(x)+1}I\{K(x) \ge m\}] = A_{x:\enclose{actuarial}{m}}^1 + {}_{m|}A_x$

此外，$(x)$ 的保额为一元的延期 $m$ 年的 $n$ 年期寿险：
$${}_{m|n}A_x = A_{x:\enclose{actuarial}{m}}^1 - A_{x:\enclose{actuarial}{n+m}}^1$$

---

## 4.7 每年划分为 $m$ 个区间的情况

将每年划分为 $m$ 个等间隔的区间（如 $m=12$ 按月，$m=4$ 按季）。对于个体 $(x)$，$S(x)$ 为未来生存时间 $T(x)$ 的小数部分，令 $\Gamma(x)$ 为 $m \cdot S(x)$ 的整数部分。则有：

$$K(x) + \frac{\Gamma(x)}{m} \le T(x) < K(x) + \frac{\Gamma(x)+1}{m}$$

即个体 $(x)$ 在第 $K(x)+1$ 个保单年度的第 $\Gamma(x)+1$ 个区间内死亡。

#### 定理 4.7.1

已知在每一年龄年 UDD 假设成立。对 $j = 0, 1, \ldots, m-1$，有 $P(\Gamma(x) = j) = \frac{1}{m}$，且 $\Gamma(x)$ 与 $K(x)$ 独立。

#### 结论 4.7.2

在 $x$ 岁签单的死亡险，假设在死亡的区间末给付一元死亡保险金，保险人给付额的现值为 $v^{K(x) + (\Gamma(x)+1)/m}$。对应的精算现值记为 $A_x^{(m)}$：

$$A_x^{(m)} = \sum_{j=0}^\infty \sum_{l=0}^{m-1} v^{j + \frac{l+1}{m}} \cdot {}_{j+l/m|\frac{1}{m}}q_x$$

#### 结论 4.7.3

设在每一年龄年 UDD 假设成立，则：

$$A_x^{(m)} = \frac{i}{i^{(m)}} \cdot A_x$$

注：令 $m \to \infty$，$A_x^{(m)} \to \overline{A}_x$。

---

## 4.8 变额人寿保险

保险金额因死亡时间的不同而变化的死亡保险称为变额保险。按给付时间分为三类：
- (a) 在死亡后立即给付
- (b) 在死亡年度末给付
- (c) 每年分为 $m$ 个区间，在死亡的区间末给付

令 $b_t$ 表示个体在时刻 $t$ 得到的死亡保险金额度。三种情况下死亡给付额的现值分别为：
$$b_{T(x)} \cdot v^{T(x)},\quad b_{K(x)+1} \cdot v^{K(x)+1},\quad b_{K(x)+(\Gamma(x)+1)/m} \cdot v^{K(x)+(\Gamma(x)+1)/m}$$

#### 定理 4.8.1

(a), (b), (c) 对应的精算现值分别为：

$$\begin{aligned}
\text{(a)} &\quad \int_0^\infty b_t \cdot v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t \\
\text{(b)} &\quad \sum_{j=0}^\infty b_{j+1} \cdot v^{j+1} \cdot {}_{j|}q_x \\
\text{(c)} &\quad \sum_{j=0}^\infty \sum_{l=0}^{m-1} b_{j+(l+1)/m} \cdot v^{j+(l+1)/m} \cdot {}_{j+l/m|\frac{1}{m}}q_x
\end{aligned}$$

### 4.8.2 标准年递增终身寿险

个体 $(x)$ 的标准年递增终身寿险：在投保后的第一年内死亡给付一元，第二年内死亡给付两元，依此递增。

**结论 4.8.2：**

$$(\overline{IA})_x = \int_0^\infty \lceil t \rceil \cdot v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t = \sum_{j=0}^\infty (j+1)\int_j^{j+1} v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

$$(IA)_x = \sum_{j=0}^\infty (j+1) \cdot v^{j+1} \cdot {}_{j|}q_x$$

### 4.8.3 标准年递减 $n$ 年期寿险

若被保险人 $(x)$ 在投保的第一年内死亡则保险人给付 $n$ 元，第二年内死亡给付 $n-1$ 元，依次类推。

**结论 4.8.3：**

$$(\overline{DA})_{x:\enclose{actuarial}{n}}^1 = \sum_{j=0}^{n-1} (n-j) \int_j^{j+1} v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

$$(DA)_{x:\enclose{actuarial}{n}}^1 = \sum_{j=0}^{n-1} (n-j) \cdot v^{j+1} \cdot {}_{j|}q_x$$

### 4.8.4 连续递增终身寿险

个体 $(x)$ 的连续递增终身寿险：若在 $t$ 时刻死亡则保险人立即给付 $t$ 元保险金。

$$(\overline{I}\overline{A})_x = \int_0^\infty t \cdot v^t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t$$

**结论 4.8.4：**
$$(\overline{I}\overline{A})_x = \int_0^\infty {}_{s|}\overline{A}_x\,\mathrm{d}s$$

### 4.8.5 年递增 $m$ 次终身寿险

若在投保的第一年的第一个 $1/m$ 区间内死亡则给付 $1/m$ 元，第二个 $1/m$ 区间内死亡给付 $2/m$ 元，依次递推。死亡保险金在死亡后立即给付时：

$$Z = \frac{K(x) + \Gamma(x) + 1}{m} \cdot v^{T(x)}$$

精算现值记为 $(I^{(m)}\overline{A})_x$。

### 4.8.6 相互关系

**结论 4.8.5：**

$$\begin{aligned}
(DA)_{x:\enclose{actuarial}{n}}^1 &= n \cdot v \cdot q_x + v \cdot p_x \cdot (DA)_{x+1:\enclose{actuarial}{n-1}}^1 \\
(DA)_{x:\enclose{actuarial}{n}}^1 &= \sum_{j=0}^{n-1} A_{x:\enclose{actuarial}{n-j}}^1 \\
(DA)_{x:\enclose{actuarial}{n}}^1 &= \sum_{j=0}^{n-1} (n-j) \cdot {}_{j|1}A_x \\
(IA)_x &= v \cdot q_x + v \cdot p_x \cdot (A_{x+1} + (IA)_{x+1})
\end{aligned}$$

#### 例 4.8.1

已知 $A_{35:1|} = 0.9434$，$A_{35} = 0.13$，$p_{35} = 0.9964$，$(IA)_{35} = 3.7100$。计算 $(IA)_{36}$。

**解：** $v = A_{35:1|} = 0.9434$。

由 $(IA)_{35} = A_{35} + v \cdot p_{35} \cdot (IA)_{36}$：
$$3.71 = 0.13 + 0.9434 \times 0.9964 \times (IA)_{36}$$

解得 $(IA)_{36} = 3.593$。

#### 例 4.8.2

在每一年龄年 UDD 假设下：
$$\frac{(IA)_x - (\overline{IA})_x}{\overline{A}_x} = \frac{1}{d} - \frac{1}{\delta}$$

**证明：** 利用 $K(x)$ 与 $S(x)$ 独立，且 $S(x) \sim U[0,1]$：

$$\begin{aligned}
(IA)_x - (\overline{IA})_x &= E[(K+1)v^T] - E[Tv^T] = E[(K+1-T)v^T] \\
&= E[(1-S)v^{K+S}] = \overline{A}_x\left(\frac{1}{d} - \frac{1}{\delta}\right)
\end{aligned}$$

---

## 4.9 一个重要的定理

讨论对一般的死亡险，在死亡时刻给付保险金与在死亡保单年度末给付保险金两种情况下，保险人给付额的精算现值之间的关系。

#### 定理 4.9.1

已知在每一年龄年 UDD 假设成立。对个体 $(x)$，已知 $b_T = b_{K+1}^*$，则有：

$$E(b_T \cdot v^{T(x)}) = \frac{i}{\delta} \cdot E(b_{K+1}^* \cdot v^{K(x)+1})$$

#### 结论 4.9.2

在每一年龄年 UDD 假设下：

$$\begin{aligned}
\overline{A}_{x:\enclose{actuarial}{n}}^1 &= \frac{i}{\delta} \cdot A_{x:\enclose{actuarial}{n}}^1 \\
\overline{A}_x &= \frac{i}{\delta} \cdot A_x \\
{}_{m|n}\overline{A}_x &= \frac{i}{\delta} \cdot {}_{m|n}A_x \\
(\overline{IA})_{x:\enclose{actuarial}{n}}^1 &= \frac{i}{\delta} \cdot (IA)_{x:\enclose{actuarial}{n}}^1 \\
(\overline{DA})_{x:\enclose{actuarial}{n}}^1 &= \frac{i}{\delta} \cdot (DA)_{x:\enclose{actuarial}{n}}^1
\end{aligned}$$

> 注：$(\overline{IA})_x$ 和 $(IA)_x$ 不满足定理 4.9.1 的条件，不能直接应用定理结果。

#### 例 4.9.1

在每一年龄年 UDD 假设下，证明：
$$(\overline{IA})_x = \frac{i}{\delta}\left\{(IA)_x - \left(\frac{1}{d} - \frac{1}{\delta}\right)A_x\right\}$$

---

## 4.10 在实务中的应用

本节介绍精算现值的计算方法，取利率 $i = 0.04$。

### 4.10.1 利用 CL93M 计算 $A_x$

可通过以下步骤计算精算现值 $A_x,\; x = 0, 1, 2, \ldots$：

1. 根据生命表中的死亡概率 $q_x$ 计算生存人数 $l_x$ 和死亡人数 $d_x$：
   $$d_x = l_x \cdot q_x,\quad l_{x+1} = (1 - q_x) \cdot l_x,\quad l_0 = 1000$$
2. 计算生存人数和死亡人数的贴现值 $d_x \cdot v^{x+1}$、$l_x \cdot v^x$
3. 利用公式：
   $$A_x = \frac{\sum_{n=x}^\infty d_n \cdot v^{n+1}}{l_x \cdot v^x}$$

### 不同生命表下计算结果的比较

表 4.2 列出根据 CL93M、CL93F 及 CL93 计算的结果及比较。

### 死亡后立即给付与死亡的区间末给付的关系

在 UDD 假设下，可通过 $A_x^{(m)} = \frac{i}{i^{(m)}} \cdot A_x$ 来计算 $A_x^{(m)}$。注意 $\frac{i}{i^{(\infty)}} = \frac{i}{\delta}$。
