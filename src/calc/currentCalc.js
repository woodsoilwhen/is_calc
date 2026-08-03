// 电流线径计算：载流量公式 I = a * s^m - b * s^n（参数与旧版一致）
export const DEFAULT_PARAMS = { a: 11.84, m: 0.628, b: 0, n: 0 };

// 可选线径规格
const CABLE_SIZES = [0.5, 1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];

// 载流量计算公式：给定截面积计算载流量
export function currentFromArea(area, params = DEFAULT_PARAMS) {
  const first = params.a * Math.pow(area, params.m);
  if (params.b === 0) return first;
  const second = params.b * Math.pow(area, params.n);
  return first - second;
}

// 载流量计算公式一阶导数
export function currentDerivative(area, params = DEFAULT_PARAMS) {
  const first = params.a * params.m * Math.pow(area, params.m - 1);
  if (params.b === 0) return first;
  const second = params.b * params.n * Math.pow(area, params.n - 1);
  return first - second;
}

// 最小截面积计算
export function minAreaForCurrent(current, params = DEFAULT_PARAMS) {
  if (params.b === 0) {
    // s = (I / a) ^ (1 / m)
    return Math.pow(current / params.a, 1 / params.m);
  }
  // 使用牛顿法计算
  let area = 1;
  let prev = 0;
  do {
    prev = area;
    area = prev - (currentFromArea(prev, params) - current) / currentDerivative(prev, params);
  } while (Math.abs(area - prev) > 0.1);
  return area;
}

// 给定截面积计算载流量
export function calcCurrent(area, params = DEFAULT_PARAMS) {
  const i = currentFromArea(area, params);
  if (i < 20) {
    // 载流量不超过 20A 时按 0.5A 取整
    return (2 * i).toFixed() / 2;
  }
  // 大于 20A 时按 1A 取整
  return Number(i.toFixed());
}

// 给定电流计算最小对应线截面积
export function calcArea(current, params = DEFAULT_PARAMS) {
  const minArea = minAreaForCurrent(current, params);
  const prev = CABLE_SIZES[0];
  for (const size of CABLE_SIZES) {
    if (size >= minArea) {
      if (calcCurrent(prev, params) >= current) return prev;
      if (calcCurrent(size, params) >= current) return size;
    }
  }
  return Math.ceil(minArea);
}
