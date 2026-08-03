// 校验输入是否为合法的数字字符串（与旧版逻辑一致）
export function checkNum(str) {
  if (str === '' || str == null) return true;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i);
    if (
      ch !== '.' &&
      ch !== '+' &&
      ch !== '-' &&
      ch !== 'e' &&
      ch !== 'E' &&
      (ch < '0' || ch > '9')
    ) {
      return false;
    }
  }
  return true;
}
