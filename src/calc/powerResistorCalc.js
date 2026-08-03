// 功率电阻计算：公式与旧版一致 R = 290.4 / P，P = 290.4 / R

// 给定功率(kW)计算电阻(Ω)
export function calcResistance(powerKw) {
  return 290.4 / powerKw;
}

// 给定电阻(Ω)计算功率(kW)
export function calcPower(resistance) {
  return 290.4 / resistance;
}
