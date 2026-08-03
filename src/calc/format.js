// 结果展示格式化：最多保留 3 位小数，去除多余的 0
export function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  if (Object.is(value, -0)) value = 0;
  if (Number.isInteger(value)) return String(value);
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}
