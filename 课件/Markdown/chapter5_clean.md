# 第五章：生存年金的精算现值

> 提取自 chapter5(2026).pptx 课件，公式经手修及数值验证。

---

## 5.1 介绍

年金是指在一定期限内等间隔的一系列给付（或领取），多以一年为给付时间间隔。按给付条件划分：
- **确定年金**：不论年金领取人是否生存，在合同期内都给付
- **生存年金**：以年金领取人的生存为给付条件

本章针对四种生存年金建立随机给付模型，讨论精算现值以及各种生存年金之间的关系：定期生存年金、终身生存年金、延期生存年金、$n$ 年确定期生存年金。还简单介绍比例期初生存年金和完全期末生存年金，并初步介绍年金模型在金融中的应用。

---

## 5.2 生存保险与精算终值

### 精算终值

对应 ${}_n E_x$ 的精算终值定义为 ${}_n E_x$ 的倒数。令 $S = \frac{1}{{}_n E_x}$，则 $S \cdot {}_n E_x = 1$，即 $n$ 年末的 $S$ 个单位的精算现值为 1。

$$S = \frac{1}{{}_n E_x} = \frac{1}{v^n \cdot {}_n p_x} = \frac{(1+i)^n \cdot l_x}{l_{x+n}}$$

上式说明：在确定生存模型中，$x$ 岁的 $l_x$ 个人每人缴纳一元，这笔资金及利息累积到 $n$ 年末，资金的总额恰好使得每个生存的个体可得到 $S$ 元——这说明了精算终值的实际含义。

### 例 5.2.1

对 $0 < t < n$，证明 ${}_n E_x = {}_t E_x \cdot {}_{n-t}E_{x+t}$。

**证明：**

$${}_n E_x = v^n \cdot {}_n p_x = v^t \cdot {}_t p_x \cdot v^{n-t} \cdot {}_{n-t}p_{x+t} = {}_t E_x \cdot {}_{n-t}E_{x+t}$$

### 例 5.2.2

令 $K = \frac{\mathrm{d}}{\mathrm{d}x}({}_{10}E_x)$，$L = \frac{\mathrm{d}}{\mathrm{d}y}({}_y E_x)|_{y=5}$。计算 $(\mu_x(5)+\delta)K/L$。

**证明：** 可计算得 $K = {}_{10}E_x \cdot (\mu(x) - \mu(x+10))$，$L = -{}_5 E_x(\mu_x(5) + \delta)$。

代入得 $(\mu_x(5)+\delta)K/L = {}_5 E_{x+5}(\mu_x(10) - \mu(x))$。

---

## 5.3 连续生存年金

连续生存年金的给付率：设到 $t$ 时刻年金给付的总额为 $a(t)$（不考虑利息的影响），则在 $t$ 时刻的年金给付率定义为 $\frac{\mathrm{d}a(t)}{\mathrm{d}t}$。如果每一时刻的年金给付率为 1，则到一年末年金给付总额为 $\int_0^1 1\,\mathrm{d}t = 1$。

假设每一时刻的年金给付率为 1，年金从 $x$ 岁开始给付。

### 5.3.1 $n$ 年期生存年金

从 $x$ 岁开始给付的 $n$ 年期生存年金，年金给付的时间长度为 $T(x) \land n = \min\{T(x), n\}$。年金给付额的现值可表示为 $a_{\overline{T(x) \land n|}}$，精算现值记为 $\overline{a}_{x:\enclose{actuarial}{n}}$。

#### 结论 5.3.1

$$\overline{a}_{x:\enclose{actuarial}{n}} = \int_0^n v^t \cdot {}_t p_x \,\mathrm{d}t$$

#### 例 5.3.1

证明对 $m < n$：$\overline{a}_{x:\enclose{actuarial}{n}} = \overline{a}_{x:\enclose{actuarial}{m}} + {}_m E_x \cdot \overline{a}_{x+m:\enclose{actuarial}{n-m}}$

**证明：**
$$\begin{aligned}
\overline{a}_{x:\enclose{actuarial}{n}} &= \int_0^n v^t \cdot {}_t p_x\,\mathrm{d}t \\
&= \int_0^m v^t \cdot {}_t p_x\,\mathrm{d}t + \int_m^n v^t \cdot {}_t p_x\,\mathrm{d}t \\
&= \overline{a}_{x:\enclose{actuarial}{m}} + \int_0^{n-m} v^{t+m} \cdot {}_{t+m}p_x\,\mathrm{d}t \\
&= \overline{a}_{x:\enclose{actuarial}{m}} + {}_m E_x \cdot \int_0^{n-m} v^t \cdot {}_t p_{x+m}\,\mathrm{d}t \\
&= \overline{a}_{x:\enclose{actuarial}{m}} + {}_m E_x \cdot \overline{a}_{x+m:\enclose{actuarial}{n-m}}
\end{aligned}$$

精算终值 $\overline{s}_{x:\enclose{actuarial}{n}}$ 定义为：
$$\overline{s}_{x:\enclose{actuarial}{n}} = \frac{\overline{a}_{x:\enclose{actuarial}{n}}}{{}_n E_x} = \frac{\int_0^n (1+i)^{n-t} \cdot l_{x+t}\,\mathrm{d}t}{l_{x+n}}$$

### 5.3.2 终身生存年金

在 $x$ 岁开始给付的终身生存年金，年金给付终止时刻为 $T(x)$。给付额的现值可表示为 $\overline{a}_{\overline{T(x)|}}$。精算现值记为 $\overline{a}_x$。

#### 结论 5.3.2

$$\overline{a}_x = \int_0^\infty v^t \cdot {}_t p_x \,\mathrm{d}t$$

#### 例 5.3.2

证明：$\frac{\mathrm{d}}{\mathrm{d}x}\overline{a}_x = (\mu(x) + \delta)\overline{a}_x - 1$

**证明：** 利用 $\overline{a}_x = \int_0^\infty v^t \cdot \exp\left(-\int_x^{x+t} \mu(s)\,\mathrm{d}s\right)\mathrm{d}t$，求导后分部积分即得。

#### 例 5.3.3

设死亡力 $\mu = 0.04$，利息力 $\delta = 0.06$。求精算现值 $\overline{a}_x$，并计算现值 $\overline{a}_{\overline{T(x)|}}$ 超过精算现值 $\overline{a}_x$ 的概率。

**解：**
$$\overline{a}_x = \int_0^\infty e^{-\delta t} \cdot e^{-\mu t}\,\mathrm{d}t = \frac{1}{\mu + \delta} = \frac{1}{0.10} = 10$$

$$\begin{aligned}
P(\overline{a}_{\overline{T(x)|}} > 10) &= P\left(\frac{1 - e^{-0.06T(x)}}{0.06} > 10\right) \\
&= P\left(T(x) > -\frac{\ln(0.4)}{0.06}\right) = e^{-0.04 \times 15.27} = 0.543
\end{aligned}$$

### 5.3.3 延期 $n$ 年的终身生存年金

延期 $n$ 年的终身生存年金，可理解为从对个体 $(x)$ 的终身生存年金的给付中扣除对个体的 $n$ 年期生存年金的给付。精算现值记为 ${}_{n|}\overline{a}_x$。

#### 结论 5.3.3

$${}_{n|}\overline{a}_x = \overline{a}_x - \overline{a}_{x:\enclose{actuarial}{n}} = \int_n^\infty v^t \cdot {}_t p_x\,\mathrm{d}t$$

#### 例 5.3.4

证明：${}_{n|}\overline{a}_x = {}_n E_x \cdot \overline{a}_{x+n}$

**证明：**
$${}_{n|}\overline{a}_x = \int_n^\infty v^t \cdot {}_t p_x\,\mathrm{d}t = v^n \cdot {}_n p_x \int_0^\infty v^t \cdot {}_t p_{x+n}\,\mathrm{d}t = {}_n E_x \cdot \overline{a}_{x+n}$$

### 5.3.4 $n$ 年确定期终身生存年金

在 $x$ 岁开始给付的 $n$ 年确定期终身生存年金：前 $n$ 年不论 $(x)$ 是否生存都给付年金（确定年金），过了 $n$ 年只有 $(x)$ 生存才给付（延期终身生存年金）。

给付时间长度为 $T(x) \lor n = \max\{T(x), n\}$，现值可表示为 $\overline{a}_{\overline{T(x) \lor n|}}$。精算现值记为 $\overline{a}_{\overline{x:\enclose{actuarial}{n}}}$。

#### 结论 5.3.4

$$\overline{a}_{\overline{x:\enclose{actuarial}{n}}} = \overline{a}_{\overline{n|}} + {}_{n|}\overline{a}_x$$

其中 $\overline{a}_{\overline{n|}}$ 为 $n$ 年期确定年金的连续年金现值。

### 5.3.5 生死合险与生存年金的关系

#### 结论 5.3.5

$$\delta \cdot \overline{a}_{x:\enclose{actuarial}{n}} + \overline{A}_{x:\enclose{actuarial}{n}} = 1$$

$$\text{Var}(\overline{a}_{\overline{T(x) \land n|}}) = \frac{{}^2\overline{A}_{x:\enclose{actuarial}{n}} - (\overline{A}_{x:\enclose{actuarial}{n}})^2}{\delta^2}$$

### 5.3.6 终身寿险与终身生存年金

令 $n \to \infty$：

#### 结论 5.3.6

$$\delta \cdot \overline{a}_x + \overline{A}_x = 1,\qquad \text{Var}(\overline{a}_{\overline{T(x)|}}) = \frac{{}^2\overline{A}_x - (\overline{A}_x)^2}{\delta^2}$$

**等式 $\delta\overline{a}_x + \overline{A}_x = 1$ 的含义：** 个体 $(x)$ 投资一元，利息力为 $\delta$。个体选择在生存期间连续获得利息（精算现值 $\delta \overline{a}_x$），在死亡后立即收回一元本金（精算现值 $\overline{A}_x$）。利息和本金的精算现值之和等于投资的本金。

> **寿险和年金的风险比较：** $\delta^2 \cdot \text{Var}(\overline{a}_{\overline{T(x)|}}) = \text{Var}(v^{T(x)})$。由于 $\delta$ 很小，年金的风险远大于寿险的风险。

#### 例 5.3.5

已知 $\overline{a}_x = 10$，${}^2\overline{a}_x = 7.735$，$\text{Var}(\overline{a}_{\overline{T|}}) = 50$。求精算现值 $\overline{A}_x$。

**解：** 由 ${}^2\overline{A}_x = 1 - 2\delta \cdot {}^2\overline{a}_x$ 及 $\overline{A}_x = 1 - \delta \cdot \overline{a}_x$：
$$\frac{1 - 2\delta \times 7.735 - (1 - \delta \times 10)^2}{\delta^2} = 50$$

解得 $\delta = 0.0302$，$\overline{A}_x = 1 - 0.0302 \times 10 = 0.698$。

#### 例 5.3.6

在 30 岁签单的保单提供：(1) 给付率为 1000 的连续生存年金；(2) 死亡后立即给付 5000 元死亡保险金。已知在每一年龄年 UDD 成立，$A_{30} = 0.14011$，${}^2 A_{30} = 0.03641$，$i = 0.05$。计算 $E(Z)$ 和 $\text{Var}(Z)$。

**解：** $Z = 1000\overline{a}_{\overline{T|}} + 5000v^T = 20{,}496 - 15{,}496v^T$。

利用 UDD 假设：
$$\overline{A}_{30} = \frac{i}{\delta}A_{30} = 0.143584,\quad {}^2\overline{A}_{30} = \frac{2i + i^2}{2\delta}A_{30} = 0.038246$$

$$E(Z) = 20{,}496 - 15{,}496 \cdot \overline{A}_{30} = 18{,}271$$
$$\text{Var}(Z) = 15{,}496^2 \cdot ({}^2\overline{A}_{30} - (\overline{A}_{30})^2) = 4.233 \times 10^6$$

---

## 5.4 期初生存年金

假设从个体 $x$ 岁时开始给付，年金在每年年初给付，每次给付额为一元。

### 5.4.1 定义及计算公式

各种年金的给付次数及精算现值：

| 年金类型 | 给付次数 | 精算现值记号 |
|---------|---------|------------|
| 终身生存年金 | $K(x) + 1$ | $\ddot{a}_x$ |
| $n$ 年期 | $(K(x)+1) \land n$ | $\ddot{a}_{x:\enclose{actuarial}{n}}$ |
| $n$ 年确定期 | $(K(x)+1) \lor n$ | $\ddot{a}_{\overline{x:\enclose{actuarial}{n}}}$ |
| 延期 $n$ 年 | $K(x)+1 - (K(x)+1)\land n$ | ${}_{n|}\ddot{a}_x$ |

#### 结论 5.4.1

$$\begin{aligned}
\ddot{a}_{x:\enclose{actuarial}{n}} &= \sum_{j=0}^{n-1} v^j \cdot {}_j p_x \\
\ddot{a}_x &= \sum_{j=0}^\infty v^j \cdot {}_j p_x \\
{}_{n|}\ddot{a}_x &= \sum_{j=n}^\infty v^j \cdot {}_j p_x = \ddot{a}_x - \ddot{a}_{x:\enclose{actuarial}{n}}
\end{aligned}$$

精算终值 $\ddot{s}_{x:\enclose{actuarial}{n}}$ 定义为：
$$\ddot{s}_{x:\enclose{actuarial}{n}} = \frac{\ddot{a}_{x:\enclose{actuarial}{n}}}{{}_n E_x}$$

#### 例 5.4.1

在个体 90 岁开始给付的期初年金，每年给付一次，每次给付一元。已知 $l_{90} = 100$，$l_{91} = 72$，$l_{92} = 39$，$l_{93} = 0$，利率 $i = 0.06$。$Z$ 表示年金的现值。计算 $Z$ 的分布和期望。

**解：** $Z = \ddot{a}_{\overline{K+1|}}$。

$$\begin{aligned}
K = 0: \ddot{a}_{\overline{1|}} = 1,\quad &P = d_{90}/l_{90} = 28/100 = 0.28 \\
K = 1: \ddot{a}_{\overline{2|}} = 1 + v = 1.943396,\quad &P = d_{91}/l_{90} = 33/100 = 0.33 \\
K = 2: \ddot{a}_{\overline{3|}} = 1 + v + v^2 = 2.833393,\quad &P = d_{92}/l_{90} = 0.39
\end{aligned}$$

利用期望定义：
$$E(Z) = 1 \times 0.28 + 1.943396 \times 0.33 + 2.833393 \times 0.39 = 2.026344$$

或利用结论 5.4.1：
$$E(Z) = \ddot{a}_{90} = \sum v^k \cdot {}_k p_{90} = 1 + v\frac{72}{100} + v^2\frac{39}{100} = 2.026344$$

### 5.4.2 终身寿险和期初生存年金的关系

#### 结论 5.4.2

$$d \cdot \ddot{a}_x + A_x = 1,\qquad d \cdot \ddot{a}_{x:\enclose{actuarial}{n}} + A_{x:\enclose{actuarial}{n}} = 1$$

$$\text{Var}(\ddot{a}_{\overline{K(x)+1|}}) = \frac{{}^2 A_x - (A_x)^2}{d^2}$$

$$\text{Var}(\ddot{a}_{\overline{(K(x)+1)\land n|}}) = \frac{{}^2 A_{x:\enclose{actuarial}{n}} - (A_{x:\enclose{actuarial}{n}})^2}{d^2}$$

**等式 $d \ddot{a}_x + A_x = 1$ 的含义：** $x$ 岁的个体投资一元。从投资之日始，个体在生存期间内在每年年初得到利息 $d$ 元，利息给付额的精算现值为 $\ddot{a}_x \cdot d = d \cdot \ddot{a}_x$。当个体死亡后，在死亡的年未得到返还的一元本金，精算现值为 $A_x$。两者之和 $d \ddot{a}_x + A_x = 1$ 等于投资者的本金。

#### 例 5.4.2

同例 5.4.1，计算 $\text{Var}(Z)$。

**解：**

$$A_{90} = \sum_{k=0}^\infty v^{k+1} \cdot {}_{k|}q_{90} = \frac{0.28}{1.06} + \frac{0.33}{1.06^2} + \frac{0.39}{1.06^3} = 0.885301$$

$${}^2 A_{90} = \sum_{k=0}^\infty v^{2(k+1)} \cdot {}_{k|}q_{90} = \frac{0.28}{1.06^2} + \frac{0.33}{1.06^4} + \frac{0.39}{1.06^6} = 0.785525$$

$$\text{Var}(Z) = \frac{{}^2 A_{90} - (A_{90})^2}{d^2} = 0.55154$$

#### 例 5.4.3

在例 5.4.1 中，确定 $t = 0$ 时需要存入的最少资金，使得 100 个个体在未来得到给付的概率为 95%。

**解：** $E(X) = 100 \times 2.026344 = 202.6344$，$\text{Var}(X) = 100 \times 0.55154 = 55.154$。

利用正态近似：$B \approx E(X) + 1.645 \sqrt{\text{Var}(X)} = 214.85$ 元。

#### 例 5.4.4

给付个体 $(x)$ 期初终身生存年金，每次给付一元。已知 $\ddot{a}_x = 10$，${}^2\ddot{a}_x = 6$，$i = \frac{1}{24}$。计算 $\text{Var}(Y)$。

**解：** $d = \frac{1/24}{1+1/24} = \frac{1}{25}$。

$$A_x = 1 - d \cdot \ddot{a}_x = 1 - 10/25 = 0.6$$
$${}^2 A_x = 1 - (2d - d^2) \cdot {}^2\ddot{a}_x = 1 - (\frac{2}{25} - \frac{1}{625}) \times 6 = 0.5296$$

$$\text{Var}(Y) = \frac{0.5296 - 0.6^2}{(1/25)^2} = 106$$

---

## 5.5 期末生存年金

年金在每年年末给付，每次给付额为一元。年金从 $x$ 岁开始给付。

### 5.5.1 基本的定义

| 年金类型 | 给付次数 | 精算现值记号 |
|---------|---------|------------|
| 终身 | $K(x)$ | $a_x$ |
| $n$ 年期 | $K(x) \land n$ | $a_{x:\enclose{actuarial}{n}}$ |
| $n$ 年确定期 | $K(x) \lor n$ | $a_{\overline{x:\enclose{actuarial}{n}}}$ |
| 延期 $n$ 年 | $K(x) - K(x)\land n$ | ${}_{n|}a_x$ |

#### 结论 5.5.1

$$a_{x:\enclose{actuarial}{n}} = \sum_{j=1}^n v^j \cdot {}_j p_x,\qquad a_x = \sum_{j=1}^\infty v^j \cdot {}_j p_x$$

$${}_{n|}a_x = \sum_{j=n+1}^\infty v^j \cdot {}_j p_x$$

### 5.5.2 期初与期末生存年金的关系

#### 结论 5.5.2

$$a_x = \ddot{a}_x - 1$$
$$a_{x:\enclose{actuarial}{n}} = \ddot{a}_{x:\enclose{actuarial}{n}} - 1 + v^n \cdot {}_n p_x$$

#### 结论 5.5.3

$$\text{Var}(a_{\overline{K(x)|}}) = \text{Var}(\ddot{a}_{\overline{K(x)+1|}})$$

#### 例 5.5.1

记 $Y = \ddot{a}_{\overline{K+1|}}$，$Z = \ddot{a}_{\overline{(K+1)\land n|}}$。已知 $i = 0.06$，$A_x = 0.20755$，$a_{x:\enclose{actuarial}{n-1}} = 6$。计算 $E(Y) - E(Z)$。

**解：** $d = 0.06/1.06$。
$$\ddot{a}_x = \frac{1 - A_x}{d} = \frac{1 - 0.20755}{0.06/1.06} = 14$$
$$\ddot{a}_{x:\enclose{actuarial}{n}} = 1 + a_{x:\enclose{actuarial}{n-1}} = 7$$
$$E(Y) - E(Z) = \ddot{a}_x - \ddot{a}_{x:\enclose{actuarial}{n}} = 14 - 7 = 7$$

#### 例 5.5.2

证明：$A_x + d \cdot a_x = v$

**证明：** 由 $\ddot{a}_x = a_x + 1$，得 $A_x + d \cdot (a_x + 1) = 1$，整理得 $A_x + d \cdot a_x = 1 - d = v$。

> 小结恒等式：$A_x + d \cdot \ddot{a}_x = 1$，$A_x + \delta \cdot \overline{a}_x = 1$，$A_x + d \cdot a_x = v$。

---

## 5.6 每年分 $m$ 次给付的年金

每年给付年金总额为一元，每次给付 $\frac{1}{m}$ 元，年金从个体 $x$ 岁时开始给付。

在区间初给付的称为**期初年金**，精算现值记为 $\ddot{a}_x^{(m)}$；在区间末给付的称为**期末年金**，精算现值记为 $a_x^{(m)}$。

#### 结论 5.6.1

$$d^{(m)} \cdot \ddot{a}_x^{(m)} + A_x^{(m)} = 1$$

#### 例 5.6.1

证明：

(1) $\ddot{a}_x^{(m)} = a_x^{(m)} + \frac{1}{m}$

(2) $i^{(m)} \cdot a_x^{(m)} + \left(1 + \frac{i^{(m)}}{m}\right) \cdot A_x^{(m)} = 1$

### UDD 假设下的计算公式

在每一年龄年 UDD 假设下，定义：
$$\alpha(m) = \frac{i \cdot d}{i^{(m)} \cdot d^{(m)}},\qquad \beta(m) = \frac{i - i^{(m)}}{i^{(m)} \cdot d^{(m)}}$$

#### 结论 5.6.2

在每一年龄年 UDD 假设下：
$$\ddot{a}_x^{(m)} = \alpha(m) \cdot \ddot{a}_x - \beta(m)$$
$$\ddot{a}_{x:\enclose{actuarial}{n}}^{(m)} = \alpha(m) \cdot \ddot{a}_{x:\enclose{actuarial}{n}} - \beta(m) \cdot (1 - {}_n E_x)$$

常用的近似公式（等号成立条件见习题）：
$$\ddot{a}_x^{(m)} \approx \ddot{a}_x - \frac{m-1}{2m}$$

#### 例 5.6.2

在例 5.4.1 中，在每一年龄年 UDD 假设下，计算 $\ddot{a}_{90}^{(2)}$。

**解：** $i^{(2)} = 0.059126$，$d^{(2)} = 0.057428$。
$$\alpha(2) = \frac{0.06 \times 0.056604}{0.059126 \times 0.057428} = 1.000212$$
$$\beta(2) = \frac{0.06 - 0.059126}{0.059126 \times 0.057428} = 0.257400$$
$$\ddot{a}_{90}^{(2)} = 1.000212 \times 2.026344 - 0.257400 = 1.7694$$

---

## 5.7 年金模型在金融中的应用

### 5.7.1 包含违约风险的债券模型

考虑一种包含违约风险的债券模型：债券发行人违约后不再支付后面的利息及本金。以 10 年期债券为例，每年年底付息 $C$ 元，第 10 年底额外给付面值 $M$ 元。记违约时刻为 $T$，$K$ 为 $T$ 的整数部分。

债券价格为 $Y$ 的精算现值：
$$P = E(Y) = C \sum_{n=1}^{10} (1+i)^{-n} \cdot {}_n p_0 + M \cdot (1+i)^{-10} \cdot {}_{10}p_0$$

#### 例 5.7.1

给定 $P(T > t) = e^{-\lambda t}$，$M = 1000$，$C = 70$，$e^{-10\lambda} = 0.98$，债券收益率 $i = 0.06$。计算债券价格。

**解：** 定义 $j$ 满足 $1+j = (1+i) \cdot e^{\lambda} = 1.06 \cdot (0.98)^{-1/10} = 1.06214$。

$$P = 70 \cdot a_{\overline{10|}j} + 1000 \cdot (1+j)^{-10} = 1057.24 \text{ 元}$$

### 5.7.2 包含早赎风险的债券模型

假设债券发行人可以提前按约定价格收回债券。$M = 1000$ 元，$C = 70$ 元。早赎可发生在第 6 年和第 8 年：第 6 年早赎一次性支付 1020 元，第 8 年早赎一次性支付 1010 元。

当 $P(K=6) = 0.15$，$P(K=8) = 0.25$，$i = 6\%$ 时：
$$P = E(Y) = 1063.27 \times 0.15 + 1068.37 \times 0.25 + 1073.60 \times 0.60 = 1070.74 \text{ 元}$$

### 5.7.3 考虑提前还贷风险的贷款模型

考虑一笔分 $n$ 期返还的贷款，借款人在每期期末偿还相同的额度 $P$，$n$ 期后还清。每期利率为 $i$，则贷款总额 $L = P \cdot a_{\overline{n|}i}$。

用 $K$ 表示借款人提前还贷的时间，$q_{m-1}$ 表示在 $m$ 时刻前正常还贷但在第 $m$ 个区间提前还贷的概率，$p_{m-1} = 1 - q_{m-1}$。

**CPR 模型：** 假设每月提前还贷的概率相同 $q$。记 $1 - \text{CPR} = (1-q)^{12}$，则 CPR 代表每年发生提前还贷的概率：
$$P(K = k) = (1-q)^{k-1} \cdot q$$

**PSA 模型：** 概率满足 $(1-q_k)^{12} = 1 - 0.002(k+1)$，$k = 0, 1, \ldots, 29$ 及 $q_{29} = q_{30} = \cdots$。

#### 例 5.7.2

一笔三个月期的贷款，每月月底还贷一元。贷款利率 $i = 0.01$。利用 CPR 模型，$q = 0.2$，$j = 0.015$。

(1) 贷款总额：$L = a_{\overline{3|}0.01} = 2.940985$

(2) $Y$ 的分布：
$$\begin{aligned}
K = 1 &: Y = a_{\overline{1|}0.015} + a_{\overline{2|}0.01}/1.015 = 2.926498, & P = 0.2 \\
K = 2 &: Y = a_{\overline{2|}0.015} + a_{\overline{1|}0.01}/1.015^2 = 2.916347, & P = 0.16 \\
K \ge 3 &: Y = a_{\overline{3|}0.015} = 2.912200, & P = 0.64
\end{aligned}$$

(3) $E(Y) = 2.915817$，$\text{Var}(Y) = 0.000031$

---

## 5.8 精算实务中精算现值的计算方法

### 5.8.1 期初生存年金

期初生存年金的精算现值计算公式：
$$\ddot{a}_{x:\enclose{actuarial}{n}} = \frac{\sum_{k=x}^{x+n-1} l_k \cdot v^k}{l_x \cdot v^x}$$

生存保险的精算现值：
$${}_n E_x = \frac{l_{x+n} \cdot v^{x+n}}{l_x \cdot v^x}$$

### 5.8.2 每年给付 $m$ 次的期初生存年金

在每一年龄年 UDD 假设下：
$$\ddot{a}_{x:\enclose{actuarial}{n}}^{(m)} = \alpha(m) \cdot \ddot{a}_{x:\enclose{actuarial}{n}} - \beta(m) \cdot (1 - {}_n E_x)$$

其中 $\alpha(m)$ 和 $\beta(m)$ 为仅依赖于利率 $i$ 和区间数 $m$ 的常数。
