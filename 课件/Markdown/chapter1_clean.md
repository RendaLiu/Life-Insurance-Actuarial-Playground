# 第一章：单生命生存模型

> 提取自 chapter1(2026).pptx 课件，公式经手修及数值验证。

---

## 1.1 介绍

本章建立刻画单个个体寿命分布的基本模型，给出生存分布和死亡力等定义，讨论 $x$ 岁个体的生存分布，介绍精算表示法，分别用随机的观点和确定的观点讨论生存群的死亡人数，最后介绍生命表及分数年龄上的生存分布假设。

---

## 1.2 生存分布

记新生个体的寿命为 $X$，$X$ 为非负连续随机变量。

### 生存函数与死亡力

**生存函数（生存分布）：** $s(t) = P(X > t)$，$t \in [0, \infty)$

分布函数 $F_X(t)$ 和生存函数 $s(t)$ 的关系：
$$s(t) = P(X > t) = 1 - P(X \le t) = 1 - F_X(t)$$

**死亡力** $\mu(t)$ 定义为：
$$\mu(t) = \frac{f_X(t)}{1 - F_X(t)} = \frac{f_X(t)}{s(t)},\quad t \in (0, \infty)$$

当 $f_X$ 为连续函数时：
$$\mu(t) = \lim_{\Delta t \to 0^+} \frac{P(t < X \le t + \Delta t \mid X > t)}{\Delta t} = \frac{f_X(t)}{s(t)}$$

且有 $f_X(t) = \mu(t) \cdot s(t)$。

### 结论 1.2.1

生存函数 $s(t)$ 和密度函数 $f_X(t)$ 可由死亡力 $\mu(t)$ 表示：
$$s(t) = \exp\left(-\int_0^t \mu(s)\,\mathrm{d}s\right),\quad f_X(t) = \mu(t) \cdot \exp\left(-\int_0^t \mu(s)\,\mathrm{d}s\right)$$

**证明思路：** 由 $\mu(t) = -\frac{s'(t)}{s(t)} = -(\ln s(t))'$，积分得 $\ln s(t) = -\int_0^t \mu(s)\,\mathrm{d}s + C$，由 $s(0) = 1$ 得 $C = 0$。

### 例 1.2.1（De Moivre 分布）

设密度函数 $f_X(t) = \frac{1}{w}$，$0 \le t < w$。计算生存分布 $s(t)$ 和死亡力 $\mu(t)$。

**解：** 对 $0 < t < w$：
$$F_X(t) = \int_0^t \frac{1}{w}\,\mathrm{d}s = \frac{t}{w}$$
$$s(t) = 1 - F_X(t) = \frac{w - t}{w}$$
$$\mu(t) = \frac{f_X(t)}{1 - F_X(t)} = \frac{1/w}{(w-t)/w} = \frac{1}{w - t}$$

### 例 1.2.2（指数分布）

设生存分布 $s(t) = e^{-\lambda t}$，$t \ge 0$，其中 $\lambda > 0$。求死亡力 $\mu(t)$。

**解：** $\mu(t) = -\frac{s'(t)}{s(t)} = \frac{\lambda e^{-\lambda t}}{e^{-\lambda t}} = \lambda$

### 寿命的期望

$\mathring{e}_0 = E(X)$：新生儿的完全平均余命
$e_0 = E(K(0))$：新生儿的整年平均余命，其中 $K(0) = \lfloor X \rfloor$ 为 $X$ 的整数部分

有 $e_0 < \mathring{e}_0 < e_0 + 1$。

### 结论 1.2.2

(1) $\mathring{e}_0$ 和 $e_0$ 与生存函数 $s(t)$ 的关系：
$$\mathring{e}_0 = \int_0^\infty s(t)\,\mathrm{d}t,\qquad e_0 = \sum_{n \ge 1} s(n)$$

(2) $X$ 和 $K(0)$ 的二阶矩：
$$E(X^2) = \int_0^\infty 2t \cdot s(t)\,\mathrm{d}t,\qquad E(K(0)^2) = \sum_{n \ge 1} (2n-1) \cdot s(n)$$

**证明思路：** 对非负随机变量 $Y$，有 $E(Y) = \int_0^\infty P(Y > y)\,\mathrm{d}y$。分别应用于 $X$ 和 $K(0)$ 即得。

### 例 1.2.3

设密度函数 $f_X(t) = \frac{1}{w}$，$0 \le t < w$。计算 $\mathring{e}_0$ 和 $E(X^2)$。

**解：**
$$\mathring{e}_0 = \int_0^\infty s(t)\,\mathrm{d}t = \int_0^w \frac{w-t}{w}\,\mathrm{d}t = \frac{w}{2}$$
$$E(X^2) = \int_0^\infty 2t \cdot s(t)\,\mathrm{d}t = \int_0^w 2t \cdot \frac{w-t}{w}\,\mathrm{d}t = \frac{w^2}{3}$$

### 常见的死亡力函数

| 名称 | 参数 | $\mu(t)$ | 适用范围 |
|------|------|----------|---------|
| De Moivre (1729) | $\omega > 0$ | $\frac{1}{\omega - t}$ | $0 \le t < \omega$ |
| Gompertz (1825) | $B > 0, C \ge 1$ | $B \cdot C^t$ | $t \ge 0$ |
| Makeham (1860) | $B > 0, A \ge -B, C > 1$ | $A + B \cdot C^t$ | $t \ge 0$ |
| Weibull (1939) | $k > 0, n > 0$ | $k \cdot t^n$ | $t \ge 0$ |

> 当 $A = 0$ 时，Makeham 死亡力即为 Gompertz 死亡力。

---

## 1.3 $x$ 岁个体的生存分布

一新生儿生存至 $x$ 岁，记此时的个体为 $(x)$。$(x)$ 的未来生存时间为一随机变量，记为 $T(x)$：
$$T(x) = X - x$$

又记 $T(x)$ 的整数部分为 $K(x)$，小数部分为 $S(x)$，则 $T(x) = K(x) + S(x)$。

### 1.3.1 基本的计算公式

假设个体的年龄为 $x$ 岁，且该个体的其它信息均未告知。

$$F_{T(x)}(t) = 1 - \frac{s(x+t)}{s(x)}$$

$T(x)$ 的死亡力 $\mu_x(t)$ 定义为：
$$\mu_x(t) = \frac{f_{T(x)}(t)}{1 - F_{T(x)}(t)}$$

### 结论 1.3.1

(1) 随机变量 $T(x)$ 的密度函数：
$$f_{T(x)}(t) = \frac{f_X(x+t)}{s(x)},\quad t \ge 0$$

(2) 生存分布：
$$s_{T(x)}(t) = \exp\left(-\int_0^t \mu(x+s)\,\mathrm{d}s\right)$$

(3) 新生个体与 $x$ 岁个体的死亡力之间的关系：
$$\mu_x(t) = \mu(x + t)$$

### 例 1.3.1（De Moivre 分布）

设密度函数 $f_X(t) = \frac{1}{w}$，$0 \le t < w$。求 $F_{T(x)}(t)$ 和 $f_{T(x)}(t)$，$t \ge 0$。

**解：** 对 $0 < t < w - x$：
$$F_{T(x)}(t) = 1 - \frac{s(x+t)}{s(x)} = \frac{t}{w - x}$$
$$f_{T(x)}(t) = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{t}{w-x}\right) = \frac{1}{w - x}$$

### 例 1.3.2（指数分布）

设生存分布 $s(t) = e^{-\lambda t}$，$t \ge 0$，$\lambda > 0$。求 $F_{T(x)}(t)$ 和 $f_{T(x)}(t)$。

**解：**
$$F_{T(x)}(t) = 1 - \frac{s(x+t)}{s(x)} = 1 - e^{-\lambda t}$$
$$f_{T(x)}(t) = \frac{\mathrm{d}}{\mathrm{d}t}(1 - e^{-\lambda t}) = \lambda e^{-\lambda t}$$

### 定理 1.3.2（无记忆性的推广）

假设除了个体的年龄及个体是否死亡为已知，个体的其他信息均未告知。$x$ 岁的个体生存了 $t$ 年后，其再继续生存时间的分布和 $x+t$ 岁个体的未来生存时间的分布相同：
$$P(T(x) > s + t \mid T(x) > t) = P(T(x+t) > s),\quad s \in [0, \infty)$$

### 1.3.2 精算表示法

国际精算协会采用的符号：

| 符号 | 含义 |
|------|------|
| ${}_t p_x$ | $(x)$ 活过年龄 $x+t$ 岁的概率 |
| ${}_t q_x$ | $(x)$ 在未来 $t$ 年内死亡的概率 |
| ${}_{u|} {}_t q_x$ | $(x)$ 在年龄段 $[x+u, x+u+t)$ 死亡的概率 |

$t = 1$ 时的简化：${}_1 p_x = p_x$，${}_1 q_x = q_x$，${}_{t|1} q_x = {}_{t|} q_x$

### 结论 1.3.3

(1) 生存概率：${}_t p_x = \frac{s(x+t)}{s(x)}$

(2) 对 $t > 0$，$u > 0$：
$$\begin{aligned}
{}_t q_x &= 1 - {}_t p_x \\
{}_{u|} {}_t q_x &= {}_u p_x \cdot {}_t q_{x+u} \\
{}_{u|} {}_t q_x &= {}_u p_x - {}_{u+t} p_x
\end{aligned}$$

对 $0 < h < t$：${}_t p_x = {}_h p_x \cdot {}_{t-h} p_{x+h}$

(3) 密度函数：$f_{T(x)}(t) = {}_t p_x \cdot \mu(x+t)$

(4) 导数关系：$\frac{\mathrm{d}}{\mathrm{d}t}({}_t p_x) = -{}_t p_x \cdot \mu(x+t)$

**证明要点：** ${}_t p_x = \exp\left(-\int_0^t \mu(x+s)\,\mathrm{d}s\right) = \exp\left(-\int_x^{x+t} \mu(s)\,\mathrm{d}s\right)$

### 例 1.3.3

已知生存函数 $s(x) = (1 - \frac{x}{100})^{1/2}$，$0 \le x \le 100$。计算 ${}_{17}p_{19}$，${}_{15}q_{36}$ 和 ${}_{15|13}q_{36}$。

**解：**
$${}_{17}p_{19} = \frac{s(36)}{s(19)} = \frac{(1 - 36/100)^{1/2}}{(1 - 19/100)^{1/2}} = \sqrt{\frac{64}{81}} = \frac{8}{9}$$

$${}_{15}q_{36} = 1 - {}_{15}p_{36} = 1 - \frac{s(51)}{s(36)} = 1 - \sqrt{\frac{49}{64}} = 1 - \frac{7}{8} = \frac{1}{8}$$

$${}_{15|13}q_{36} = {}_{15}p_{36} \cdot {}_{13}q_{51} = \frac{7}{8} \cdot \left(1 - \frac{s(64)}{s(51)}\right) = \frac{7}{8} \cdot \left(1 - \sqrt{\frac{36}{49}}\right) = \frac{1}{8}$$

### 未来生存时间的期望

记 $\mathring{e}_x = E(T(x))$ 及 $e_x = E(K(x))$。

(1) 期望：
$$\mathring{e}_x = \int_0^\infty {}_t p_x\,\mathrm{d}t,\qquad e_x = \sum_{n \ge 1} {}_n p_x$$

(2) 二阶矩：
$$E(T(x)^2) = \int_0^\infty 2t \cdot {}_t p_x\,\mathrm{d}t,\qquad E(K(x)^2) = \sum_{n \ge 1} (2n-1) \cdot {}_n p_x$$

### 例 1.3.4

证明并解释：
$$\frac{\mathrm{d}}{\mathrm{d}x}({}_t p_x) = {}_t p_x \cdot (\mu(x) - \mu(x+t))$$
$$e_x = p_x \cdot e_{x+1} + p_x$$

**证明思路：** 利用 ${}_t p_x = \exp\left(-\int_x^{x+t} \mu(s)\,\mathrm{d}s\right)$，对 $x$ 求偏导即得第一式。对第二式：
$$e_x = \sum_{n=1}^\infty {}_n p_x = p_x + \sum_{n=2}^\infty {}_n p_x = p_x + p_x \cdot \sum_{n=2}^\infty {}_{n-1}p_{x+1} = p_x + p_x \cdot e_{x+1}$$

---

## 1.4 随机生存群和确定生存群

假设一封闭的生存群体由 $l_0$ 个新生儿组成，群体无迁出与迁入、无生育。影响群体数目变化的唯一因素是死亡，且个体间的死亡互不相关。

- **随机观点：** 每个个体的死亡依据一定的概率分布
- **确定观点：** 群体每年依一固定的比例死亡

### 1.4.1 随机生存群

设 $l_0$ 个个体的寿命分别为 $X_1, \ldots, X_{l_0}$，每个个体服从共同的生存分布 $s(t)$。

实际活过 $x$ 岁的人数记为 $\mathcal{L}(x)$：
$$\mathcal{L}(x) = \sum_{i=1}^{l_0} I_{\{X_i \ge x\}}$$

取期望得到 $l_x = l_0 \cdot s(x)$。

记 ${}_t d_x = l_x - l_{x+t}$，${}_t \mathcal{D}_x = \sum_{i=1}^{l_0} I_{\{x \le X_i < x+t\}}$，则 ${}_t d_x = E({}_t \mathcal{D}_x)$。

### 结论 1.4.1

**(a)** 生命表与概率的关系：
$${}_t p_x = \frac{l_{x+t}}{l_x},\qquad {}_t q_x = \frac{{}_t d_x}{l_x}$$

**证明：** ${}_t p_x = \frac{s(x+t)}{s(x)} = \frac{l_{x+t}/l_0}{l_x/l_0} = \frac{l_{x+t}}{l_x}$

**(b)** 微分关系：
$$\frac{\mathrm{d}l_x}{\mathrm{d}x} = -l_x \cdot \mu(x)$$
$$l_{x+t} = l_x \cdot \exp\left(-\int_x^{x+t} \mu(s)\,\mathrm{d}s\right)$$
$${}_n d_x = \int_x^{x+n} l_y \cdot \mu(y)\,\mathrm{d}y$$

### 例 1.4.1

已知 $l_x = 1000(\omega^2 - x^2)$，$0 \le x \le \omega$。计算 $\mathring{e}_0$。

**解：**
$$\mathring{e}_0 = \int_0^\infty {}_s p_0\,\mathrm{d}s = \int_0^\omega \frac{l_s}{l_0}\,\mathrm{d}s = \int_0^\omega \frac{\omega^2 - s^2}{\omega^2}\,\mathrm{d}s = \frac{2\omega}{3}$$

### 1.4.2 确定生存群

对 $l_0$ 个新生个体：
- 第一年死亡比例 $q_0$，死亡人数 $d_0 = l_0 \cdot q_0$，活过第一年 $l_1 = l_0(1 - q_0)$
- 第二年死亡比例 $q_1$，死亡人数 $d_1 = l_1 \cdot q_1$，活过第二年 $l_2 = l_1(1 - q_1)$

依此类推：
$$l_x = l_0 \cdot (1 - q_0)(1 - q_1) \cdots (1 - q_{x-1}) = l_0 \cdot (1 - {}_x q_0)$$

其中 ${}_x q_0 = 1 - \prod_{j=0}^{x-1} (1 - q_j)$。

在分数年龄上，给定死亡力函数 $\mu(t)$，在时刻 $t$ 的生存人数 $l_t$ 满足：
$$\frac{\mathrm{d}l_t}{\mathrm{d}t} = -l_t \cdot \mu(t)$$

### 例 1.4.4

一随机生存群由两个子群体组成：1600 个新生儿；10 岁的 540 个个体。个体服从下列生存分布：$l_0 = 40$，$l_{10} = 39$，$l_{70} = 26$。

令 $Y_1$、$Y_2$ 分别表示两个子群体活到 70 岁的个体总数。求 $c$ 使 $P(Y_1 + Y_2 > c) = 0.05$。

**解：**

$$\begin{aligned}
E(Y_1) &= 1600 \cdot {}_{70}p_0 = 1600 \times \frac{26}{40} = 1040 \\
E(Y_2) &= 540 \cdot {}_{60}p_{10} = 540 \times \frac{26}{39} = 360
\end{aligned}$$

$$\text{Var}(Y_1) = 1600 \cdot {}_{70}p_0 \cdot (1 - {}_{70}p_0) = 364,\quad \text{Var}(Y_2) = 120$$

利用正态分布近似：
$$\frac{c - 1400}{\sqrt{484}} \approx 1.645 \;\Longrightarrow\; c \approx 1436.2$$

---

## 1.5 生命表

### 1.5.1 中心死亡率与相关函数

**中心死亡率** ${}_n m_x$：
$${}_n m_x = \frac{{}_n q_x}{\int_0^n {}_t p_x\,\mathrm{d}t}$$

简记 ${}_1 m_x = m_x$。

定义 $a(x)$：
$$a(x) = \frac{\int_0^1 t \cdot {}_t p_x \cdot \mu_x(t)\,\mathrm{d}t}{q_x}$$

进一步定义：
$${}_t L_x = \int_0^t l_{x+s}\,\mathrm{d}s,\qquad T_x = \int_0^\infty l_{x+s}\,\mathrm{d}s,\qquad Y_x = \int_0^\infty T_{x+s}\,\mathrm{d}s$$

简记 ${}_1 L_x = L_x$。

### 结论 1.5.1

$$a(x) = E[T(x) \mid T(x) < 1],\qquad {}_n m_x = \frac{{}_n d_x}{{}_n L_x}$$

### 结论 1.5.2

$${}_n m_x \cdot {}_n L_x = l_x - l_{x+n}$$
$${}_t L_x = l_x \cdot E(T(x) \land t)$$
$$T_x = l_x \cdot \mathring{e}_x$$

其中 $T(x) \land t = \min\{T(x), t\}$。

### 例 1.5.1

证明 $L_x = a(x) \cdot l_x + (1 - a(x)) \cdot l_{x+1}$。特别地，若 $a(x) = \frac{1}{2}$，则 $L_x = \frac{l_x + l_{x+1}}{2}$。

### 1.5.2 生命表简介

生命表是根据观察到的死亡记录构造的在每一年龄的死亡和生存概率的列表。分类：
- 按性别：男性/女性/综合
- 按是否吸烟：吸烟/不吸烟
- 按对象：国民生命表/经验生命表

中国编制的 1990-1993 生命表（CL93）包括：
- **CL93M**：男性生命表（适用于寿险产品）
- **CL93F**：女性生命表
- **CL93**：混合表

### 例 1.5.2（利用 CL93M 计算）

根据 CL93M，求个体 (20)：
(a) 生存至 100 岁的概率
(b) 在 70 岁之前死亡的概率
(c) 在 90 岁至 100 岁之间死亡的概率

**解：** 利用生命表中的数据：
$$l_{20} = 981{,}140,\quad l_{70} = 687{,}074,\quad l_{90} = 99{,}580,\quad l_{100} = 3{,}911$$

$$\begin{aligned}
\text{(a)}\; {}_{80}p_{20} &= \frac{l_{100}}{l_{20}} = \frac{3{,}911}{981{,}140} = 0.003986 \\
\text{(b)}\; {}_{50}q_{20} &= 1 - {}_{50}p_{20} = 1 - \frac{687{,}074}{981{,}140} = 0.29972 \\
\text{(c)}\; {}_{70|10}q_{20} &= \frac{l_{90} - l_{100}}{l_{20}} = \frac{99{,}580 - 3{,}911}{981{,}140} = 0.097508
\end{aligned}$$

---

## 1.6 分数年龄上的分布假设

生命表只给出每个整数年龄段的死亡概率，分数年龄上的分布需要通过假设来确定。

### 1.6.1 UDD 假设（死亡均匀分布）

对整数年龄 $x$，$0 \le t < 1$，若生存函数满足：
$$s(x+t) = (1-t) \cdot s(x) + t \cdot s(x+1)$$

则称在年龄段 $[x, x+1)$ 满足**线性插值假设**（精算中常称为死亡均匀分布假设，UDD）。

### 结论 1.6.1

在年龄段 $[x, x+1)$ UDD 假设成立，则对 $t \in [0, 1)$：

(1) 期望生存人数和期望死亡人数：
$$l_{x+t} = (1-t) \cdot l_x + t \cdot l_{x+1},\qquad {}_t d_x = t \cdot d_x$$

(2) 概率关系：
$${}_t q_x = t \cdot q_x,\quad f_{T(x)}(t) = q_x,\quad \mu_x(t) = \frac{q_x}{1 - t \cdot q_x}$$

### 结论 1.6.2

已知在每一年龄年 UDD 假设成立，则 $K(x)$ 与 $S(x)$ 相互独立，且 $S(x) \sim U(0, 1)$。

**证明：**
$$P(K(x)=n, S(x) \le t) = {}_{n|}{}_t q_x = {}_n p_x \cdot t \cdot q_{x+n} = t \cdot P(K(x)=n) = P(S(x) \le t) \cdot P(K(x)=n)$$

### 例 1.6.1

证明：在每一年龄年 UDD 假设成立时：
$$\mathring{e}_x = e_x + \frac{1}{2},\qquad \text{Var}(T) = \text{Var}(K) + \frac{1}{12}$$

### 例 1.6.2

已知年龄段 $[x, x+1)$ UDD 假设成立，证明：
$$m_x = \frac{q_x}{1 - q_x}$$

### 例 1.6.3

已知 $m_x = 0.400$，又在年龄段 $[x, x+1)$ UDD 假设成立。计算 $q_x$。

**解：** 由 $m_x = \frac{q_x}{1 - q_x} = 0.400$，得 $q_x = \frac{0.400}{1.400} \approx 0.2857$

### 1.6.2 常数死亡力假设

若在年龄段 $[x, x+1)$ 满足：
$$\ln s(x+t) = (1-t) \cdot \ln s(x) + t \cdot \ln s(x+1),\quad t \in [0, 1)$$

则称满足**常数死亡力假设**。

### 结论 1.6.3

设对年龄段 $[x, x+1)$ 上常数死亡力假设成立。则对 $t \in [0, 1)$：

(1) 期望生存人数满足 $\ln l_{x+t} = (1-t) \cdot \ln l_x + t \cdot \ln l_{x+1}$

(2) 死亡力为常数 $\mu(x+t) = -\ln(1 - q_x) = \mu$

(3) $l_{x+t} = l_x \cdot e^{-\mu t}$，${}_t q_x = 1 - p_x^t$，$f_{T(x)}(t) = -p_x^t \cdot \ln p_x$

### 1.6.3 Balducci 假设

若在年龄段 $[x, x+1)$ 满足：
$$\frac{1}{s(x+t)} = \frac{1-t}{s(x)} + \frac{t}{s(x+1)},\quad t \in [0, 1)$$

### 结论 1.6.4

设对年龄段 $[x, x+1)$ Balducci 假设成立，则对 $t \in [0, 1)$：

(1) $\frac{1}{l_{x+t}} = \frac{1-t}{l_x} + \frac{t}{l_{x+1}}$

(2) ${}_t q_x = \frac{t \cdot q_x}{1 - (1-t)q_x}$，$\mu(x+t) = \frac{q_x}{1 - (1-t)q_x}$

(3) $f_{T(x)}(t) = \frac{q_x \cdot p_x}{(1 - (1-t)q_x)^2}$

### 三种假设的比较

| 假设 | 死亡力趋势 | 特点 |
|------|-----------|------|
| UDD | 上升 | $K(x)$ 与 $S(x)$ 独立，$S(x) \sim U(0,1)$ |
| 常数死亡力 | 不变 | $l_{x+t}$ 呈指数衰减 |
| Balducci | 下降 | 调和插值 |

在实务中常用 UDD 假设讨论分数年龄问题——因为 $K(x)$ 与 $S(x)$ 独立，且 $S(x) \sim U(0,1)$，使用最方便。

---

## 1.7 选择生命表与终极生命表

在保险中，已通过核保的被保险人群体比未经过核保的群体具有较低的死亡率。投保年龄和已投保期限都是计算死亡概率的重要指标。

- **选择生命表：** 死亡概率不仅与投保年龄有关，还与投保时间有关
- **终极生命表：** 超过选择期后，选择的影响消失

记 $q_{[x]+r}$ 为选择表中的死亡概率。随着选择年限 $r$ 增加，选择作用逐渐消失。当超过一定年限 $r_0$ 时（选择期），有：
$$q_{[x-j]+r_0+j} = q_{[x]+r_0},\quad j \ge 0$$

此时将 $q_{[x]+r_0}$ 简写为 $q_{x+r_0}$，称为**终极表**。

### 例 1.7.1

利用表 1.6 计算 ${}_2 p_{[30]}$ 和 ${}_2 p_{[30]+1}$。

**解：** 利用表中的数据：
$${}_2 p_{[30]} = \frac{l_{[30]+2}}{l_{[30]}} = \frac{l_{32}}{l_{[30]}} = \frac{9901.2702}{9906.7380} = 0.999448$$
$${}_2 p_{[30]+1} = \frac{l_{[30]+3}}{l_{[30]+1}} = \frac{l_{33}}{l_{[30]+1}} = \frac{9897.0919}{9904.5387} = 0.999248$$

注意到 ${}_2 p_{[30]} > {}_2 p_{[30]+1}$，这是因为 $[30]+1$ 的选择效应弱于 $[30]$。
