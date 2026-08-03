// 校验输入是否为合法的数字字符串。
// 允许未输入完整的中间状态（如 ".", "-", "1.", "1e"），
// 但拒绝结构非法的输入（如 "1.2.3", "abc"）。
export function checkNum(str) {
  if (str === '' || str == null) return true;
  return /^[+-]?(\d+(\.\d*)?|\.\d*)([eE][+-]?\d*)?$/.test(String(str));
}
