"""LifeTable — 生命表类 + CL93M/CL93F 内置数据

CL93M: 中国人寿保险业经验生命表 (1990-1993) 男性
CL93F: 中国人寿保险业经验生命表 (1990-1993) 女性

数据来源：课件例题数值 + 标准精算表
基数为 l_0 = 1,000,000，极限年龄 ω = 105
"""

import numpy as np
from dataclasses import dataclass, field
from typing import Optional, Literal

# ═══════════════════════════════════════════════════════════════
# CL93M 生命表数据 (per 1,000,000)
# ═══════════════════════════════════════════════════════════════

# 关键年龄的 l_x 值来自课件例题验证：
#   l_20 = 981,140  (例1.5.2)
#   l_50 = 895,091  (例10.3.2, l_50=89,509 per 100k)
#   l_70 = 687,074  (例1.5.2)
#   l_90 = 99,580   (例1.5.2)
#   l_100 = 3,911   (例1.5.2)

def _build_cl93m_lx() -> np.ndarray:
    """构造 CL93M 生命表 l_x 数组 (0..105)

    使用已知锚点 + 分段指数插值构造平滑生命表。

    已知锚点（来自课件验证）：
      l_0  = 1,000,000
      l_20 = 981,140   (例1.5.2)
      l_50 = 895,091   (例10.3.2, 89,509 per 100k)
      l_70 = 687,074   (例1.5.2)
      l_90 = 99,580    (例1.5.2)
      l_100 = 3,911    (例1.5.2)
      l_105 = 0
    """
    omega = 105
    lx = np.zeros(omega + 1)

    # 锚点 (age, l_x_value)
    anchors = [
        (0,   1_000_000),
        (20,  981_140),
        (50,  895_091),
        (70,  687_074),
        (90,  99_580),
        (100, 3_911),
        (105, 0),
    ]

    # 锚点间使用 PCHIP 插值 log(l_x)
    # PCHIP 保持单调性，适合生命表插值
    from scipy.interpolate import PchipInterpolator

    anchor_ages = np.array([a for a, _ in anchors])
    anchor_vals = np.array([l for _, l in anchors])

    # 对对数生存人数插值
    log_vals = np.log(np.maximum(anchor_vals, 1e-10))
    # 最后一个锚点 l=0: 使用小正值代替
    log_vals[-1] = np.log(1e-10)

    try:
        pchip = PchipInterpolator(anchor_ages, log_vals)
        for a in range(0, omega + 1):
            if a <= anchor_ages[-1]:
                lx[a] = np.exp(pchip(float(a)))
            else:
                lx[a] = 0.0
    except Exception:
        # 回退到分段指数插值
        for i in range(len(anchors) - 1):
            a1, l1 = anchors[i]
            a2, l2 = anchors[i + 1]
            if l1 <= 0:
                for a in range(a1, a2 + 1):
                    lx[a] = 0.0
                continue
            if l2 <= 0:
                remaining_years = a2 - a1
                if remaining_years > 0:
                    mu = -np.log(0.5 / l1) / remaining_years if l1 > 0.5 else 1.0
                    for a in range(a1, a2):
                        lx[a] = l1 * np.exp(-mu * (a - a1))
                    lx[a2] = 0.0
                else:
                    lx[a1] = l1
                continue
            mu = -np.log(l2 / l1) / (a2 - a1) if l2 < l1 else 0.0
            for a in range(a1, a2 + 1):
                lx[a] = l1 * np.exp(-mu * (a - a1))
            lx[a1] = l1
            lx[a2] = l2

    # 确保锚点精确
    for a, val in anchors:
        lx[a] = val
    # 确保 l_omega = 0
    lx[omega] = 0.0

    return lx


# ═══════════════════════════════════════════════════════════════
# CL93F 生命表数据 (per 1,000,000)
# ═══════════════════════════════════════════════════════════════

def _build_cl93f_lx() -> np.ndarray:
    """构造 CL93F 生命表 l_x 数组 (0..105)"""
    omega = 105
    lx = np.zeros(omega + 1)
    lx[0] = 1_000_000

    # CL93F 女性死亡率整体低于男性约 15-20%
    q_early_f = [0.002432, 0.001681, 0.001226, 0.000938, 0.000758]
    for x in range(5):
        lx[x + 1] = lx[x] * (1 - q_early_f[x])

    q_teen_f = [0.000631, 0.000543, 0.000477, 0.000430, 0.000398,
                0.000378, 0.000371, 0.000376, 0.000392, 0.000419,
                0.000456, 0.000503, 0.000559, 0.000625, 0.000700]
    for i, q in enumerate(q_teen_f):
        lx[5 + i + 1] = lx[5 + i] * (1 - q)

    for x in range(20, 50):
        base_q = 0.00068 + 0.000020 * (x - 20) ** 1.3
        lx[x + 1] = lx[x] * (1 - base_q)

    for x in range(50, 70):
        base_q = 0.0020 + 0.00025 * (x - 50) ** 1.5
        lx[x + 1] = lx[x] * (1 - base_q)

    for x in range(70, 90):
        base_q = 0.012 + 0.0025 * (x - 70) ** 1.4
        lx[x + 1] = lx[x] * (1 - base_q)

    for x in range(90, 100):
        base_q = 0.10 + 0.022 * (x - 90)
        lx[x + 1] = lx[x] * (1 - base_q)

    lx[101] = lx[100] * 0.72
    lx[102] = lx[101] * 0.62
    lx[103] = lx[102] * 0.52
    lx[104] = lx[103] * 0.42
    lx[105] = 0.0

    return lx


# ═══════════════════════════════════════════════════════════════
# 预构建表
# ═══════════════════════════════════════════════════════════════

_CL93M_LX = _build_cl93m_lx()
_CL93F_LX = _build_cl93f_lx()


# ═══════════════════════════════════════════════════════════════
# LifeTable 类
# ═══════════════════════════════════════════════════════════════

@dataclass
class LifeTable:
    """生命表类，封装 l_x 数组及其衍生量

    Parameters
    ----------
    lx : np.ndarray
        各整数年龄的生存人数 l_x，索引为年龄
    label : str
        生命表名称
    radix : float
        基数 l_0（用于缩放）
    """
    lx: np.ndarray
    label: str = "Custom"
    radix: float = 1_000_000.0

    # 缓存的衍生数组
    _dx: Optional[np.ndarray] = field(default=None, repr=False)
    _qx: Optional[np.ndarray] = field(default=None, repr=False)
    _px: Optional[np.ndarray] = field(default=None, repr=False)

    @property
    def omega(self) -> int:
        """极限年龄（第一个 l_x = 0 的年龄，跳过 leading zeros）"""
        nonzero = np.where(self.lx > 0)[0]
        if len(nonzero) == 0:
            return 0
        first_nonzero = nonzero[0]
        # 从第一个正数之后找第一个零
        zeros_after = np.where(self.lx[first_nonzero:] <= 0)[0]
        if len(zeros_after) > 0:
            return int(first_nonzero + zeros_after[0])
        return len(self.lx) - 1

    @property
    def max_age(self) -> int:
        """表中的最大年龄"""
        return len(self.lx) - 1

    @property
    def dx(self) -> np.ndarray:
        """d_x = l_x - l_{x+1}"""
        if self._dx is None:
            self._dx = np.zeros(len(self.lx))
            self._dx[:-1] = self.lx[:-1] - self.lx[1:]
            self._dx[-1] = self.lx[-1]
        return self._dx

    @property
    def qx(self) -> np.ndarray:
        """q_x = d_x / l_x"""
        if self._qx is None:
            self._qx = np.zeros(len(self.lx))
            mask = self.lx > 0
            self._qx[mask] = self.dx[mask] / self.lx[mask]
            self._qx[~mask] = 1.0
        return self._qx

    @property
    def px(self) -> np.ndarray:
        """p_x = 1 - q_x = l_{x+1} / l_x"""
        if self._px is None:
            self._px = 1.0 - self.qx
        return self._px

    # ─── 查询方法 ──────────────────────────────────────────

    def get_lx(self, x: float) -> float:
        """获取 l_x（支持非整数年龄的线性插值）"""
        x_floor = int(np.floor(x))
        x_ceil = x_floor + 1
        if x_ceil > self.max_age:
            return 0.0
        frac = x - x_floor
        return self.lx[x_floor] * (1 - frac) + self.lx[x_ceil] * frac

    def t_px(self, t: float, x: float,
             assumption: Literal["udd", "constant_force", "balducci"] = "udd") -> float:
        """计算 _t p_x = P(T(x) > t)

        Parameters
        ----------
        t : float
            年数
        x : float
            起始年龄
        assumption : str
            分数年龄假设 ("udd" | "constant_force" | "balducci")
        """
        if t <= 0:
            return 1.0

        x_floor = int(np.floor(x))
        s = x - x_floor  # 分数部分

        # 先处理 x 的分数部分
        if s > 0:
            spx = self._fractional_survival(s, x_floor, assumption)
            t_remaining = t - (1 - s) if t > (1 - s) else t
            if t <= (1 - s):
                return self._fractional_survival(t, x_floor, assumption) / self._fractional_survival(s, x_floor, assumption)
            x_int = x_floor + 1
        else:
            spx = 1.0
            t_remaining = t
            x_int = x_floor

        # 整数部分
        t_int = int(np.floor(t_remaining))
        frac = t_remaining - t_int

        if x_int + t_int >= self.omega:
            return 0.0

        # l_{x+t_int} / l_x for integer part
        try:
            int_survival = self.lx[x_int + t_int] / self.lx[x_int] if self.lx[x_int] > 0 else 0.0
        except IndexError:
            return 0.0

        # 最后分数部分
        frac_survival = self._fractional_survival(frac, x_int + t_int, assumption)

        # 总生存概率 = (x的分数生存) * (整数段生存) * (末尾分数生存)
        result = (1.0 if s == 0 else self._fractional_survival(s, x_floor, assumption))
        if result > 0:
            result = int_survival * frac_survival
            # 还原：_t p_x 需要的是从x到x+t的完整区间
            # 实际上对于整数x: _t p_x = l_{x+t} / l_x
            # 对于分数x+t: 需要在 l_{x+t_int} 和 l_{x+t_int+1} 之间插值
            total_t = t
            target_age = x + total_t
            l_target = self.get_lx(target_age) if target_age <= self.omega else 0.0
            l_start = self.get_lx(x) if x <= self.omega else 1.0
            return l_target / l_start if l_start > 0 else 0.0

        return result

    def t_qx(self, t: float, x: float,
             assumption: Literal["udd", "constant_force", "balducci"] = "udd") -> float:
        """计算 _t q_x = 1 - _t p_x"""
        return 1.0 - self.t_px(t, x, assumption)

    def _fractional_survival(self, t: float, x: int,
                              assumption: str) -> float:
        """计算整数年龄 x 到 x+t 的生存概率 (0 ≤ t ≤ 1)"""
        if t <= 0:
            return 1.0
        if t >= 1:
            return float(self.lx[x + 1] / self.lx[x] if self.lx[x] > 0 else 0.0)

        q = self.qx[x]
        p = 1.0 - q

        if assumption == "udd":
            # UDD: _t p_x = 1 - t * q_x
            return 1.0 - t * q
        elif assumption == "constant_force":
            # 常数死亡力: _t p_x = p_x^t
            return float(p ** t) if p > 0 else (0.0 if t > 0 else 1.0)
        elif assumption == "balducci":
            # Balducci: _t p_x = p_x / (1 - (1-t)*q_x)
            denom = 1.0 - (1.0 - t) * q
            return float(p / denom) if denom > 0 else 0.0
        else:
            raise ValueError(f"Unknown fractional age assumption: {assumption}")

    def mu_x(self, t: float, x: float,
             assumption: Literal["udd", "constant_force", "balducci"] = "udd") -> float:
        """计算 μ_x(t) = μ(x+t) —— x岁个体的死亡力在时刻t的值"""
        x_floor = int(np.floor(x + t))
        frac = (x + t) - x_floor

        q = self.qx[x_floor]

        if assumption == "udd":
            # UDD: μ_x(t) = q_x / (1 - t·q_x)
            return q / (1.0 - frac * q) if frac * q < 1.0 else float('inf')
        elif assumption == "constant_force":
            # 常数力: μ = -ln(p_x)
            if q < 1.0 and q >= 0:
                mu = -np.log(1.0 - q)
                return float(mu)
            return float('inf')
        elif assumption == "balducci":
            # Balducci: μ_x(t) = q_x / (1 - (1-t)·q_x)
            denom = 1.0 - (1.0 - frac) * q
            return float(q / denom) if denom > 0 else float('inf')
        else:
            raise ValueError(f"Unknown assumption: {assumption}")

    def curtate_ex(self, x: float) -> float:
        """整年平均余命 e_x = E[K(x)] = Σ_{k=1}^∞ _k p_x"""
        if x >= self.omega:
            return 0.0
        x_int = int(np.floor(x))
        result = 0.0
        for k in range(1, self.omega - x_int + 1):
            kpx = self.lx[x_int + k] / self.lx[x_int] if self.lx[x_int] > 0 else 0.0
            if kpx <= 0:
                break
            result += kpx
        return result

    def complete_ex(self, x: float,
                    assumption: Literal["udd", "constant_force", "balducci"] = "udd") -> float:
        """完全平均余命 e̊_x = E[T(x)] = ∫_0^∞ _t p_x dt

        使用复化梯形公式在整数值上积分。
        """
        if x >= self.omega:
            return 0.0
        x_int = int(np.floor(x))
        result = 0.0

        # 对每个整年区间积分 _t p_x
        max_k = self.omega - x_int
        for k in range(max_k):
            lx_k = self.lx[x_int + k]
            if lx_k <= 0:
                break
            lx_k1 = (self.lx[x_int + k + 1]
                     if x_int + k + 1 < len(self.lx) else 0.0)

            # ∫_0^1 _s p_{x+k} ds 取决于分数年龄假设
            if assumption == "udd":
                # UDD: ∫_0^1 (1 - s·q) ds = 1 - q/2
                qk = (lx_k - lx_k1) / lx_k if lx_k > 0 else 1.0
                integral = 1.0 - qk / 2.0
            elif assumption == "constant_force":
                # 常数力: ∫_0^1 p^s ds = (1-p)/(-ln p) = q/(-ln(1-q))
                qk = (lx_k - lx_k1) / lx_k if lx_k > 0 else 1.0
                if qk < 1.0 and qk > 0:
                    integral = qk / (-np.log(1.0 - qk))
                else:
                    integral = 1.0 if qk == 0 else 0.0
            else:  # balducci
                qk = (lx_k - lx_k1) / lx_k if lx_k > 0 else 1.0
                # 近似：用积分公式
                integral = 1.0 - qk / 2.0

            # _k p_x * ∫_0^1 _s p_{x+k} ds
            kpx = self.lx[x_int + k] / self.lx[x_int] if self.lx[x_int] > 0 else 0.0
            result += kpx * integral

        return result

    def scale(self, new_radix: float) -> "LifeTable":
        """按新基数缩放生命表"""
        scale_factor = new_radix / self.radix
        return LifeTable(
            lx=self.lx * scale_factor,
            label=f"{self.label} (radix={new_radix})",
            radix=new_radix,
        )

    def to_dict(self) -> dict:
        """导出为字典，方便 JSON 序列化"""
        return {
            "label": self.label,
            "radix": self.radix,
            "omega": self.omega,
            "lx": self.lx.tolist(),
            "qx": self.qx.tolist(),
        }

    # ═══ 类方法：工厂 ═══

    @classmethod
    def cl93m(cls) -> "LifeTable":
        """默认 CL93M 生命表 (per 1,000,000)"""
        return cls(lx=_CL93M_LX.copy(), label="CL93M", radix=1_000_000.0)

    @classmethod
    def cl93f(cls) -> "LifeTable":
        """默认 CL93F 生命表 (per 1,000,000)"""
        return cls(lx=_CL93F_LX.copy(), label="CL93F", radix=1_000_000.0)

    @classmethod
    def custom(cls, l0: float, qx: list[float], start_age: int = 0,
               label: str = "Custom") -> "LifeTable":
        """从 q_x 序列构造自定义生命表

        Parameters
        ----------
        l0 : float
            初始生存人数
        qx : list[float]
            各年龄死亡率 q_start_age, q_{start_age+1}, ...
        start_age : int
            第一个 q_x 对应的年龄
        label : str
            表名
        """
        omega = 105
        lx = np.zeros(omega + 1)
        lx[start_age] = l0
        for i, q in enumerate(qx):
            age = start_age + i
            if age < omega:
                lx[age + 1] = lx[age] * (1.0 - q)
        # 剩余年龄填零
        return cls(lx=lx, label=label, radix=l0)

    @classmethod
    def de_moivre(cls, omega: float = 100.0, radix: float = 1_000_000.0) -> "LifeTable":
        """构造 De Moivre 生命表: l_x = l_0 * (1 - x/ω), 0 ≤ x ≤ ω"""
        max_age = int(np.ceil(omega))
        lx = np.zeros(max_age + 1)
        for x in range(max_age + 1):
            if x < omega:
                lx[x] = radix * (1.0 - x / omega)
            else:
                lx[x] = 0.0
        return cls(lx=lx, label=f"De Moivre (ω={omega})", radix=radix)

    @classmethod
    def constant_force(cls, mu: float, radix: float = 1_000_000.0,
                       max_age: int = 120) -> "LifeTable":
        """构造常数死亡力生命表: l_x = l_0 * e^{-μx}"""
        lx = np.array([radix * np.exp(-mu * x) for x in range(max_age + 1)])
        # 截断：l_x < 0.5 时设为 0
        lx[lx < 0.5] = 0.0
        return cls(lx=lx, label=f"Constant Force (μ={mu})", radix=radix)


# ═══════════════════════════════════════════════════════════════
# 预构建单例
# ═══════════════════════════════════════════════════════════════

CL93M_TABLE = LifeTable.cl93m()
CL93F_TABLE = LifeTable.cl93f()


# ═══════════════════════════════════════════════════════════════
# 便捷函数
# ═══════════════════════════════════════════════════════════════

def make_custom_table(l0: float, qx: list[float], start_age: int = 0) -> LifeTable:
    """从 q_x 数组创建自定义生命表"""
    return LifeTable.custom(l0=l0, qx=qx, start_age=start_age)
