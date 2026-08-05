import { useEffect, useRef, useState } from 'react';
import Field from '../components/Field';
import { calcPower, calcResistance } from '../calc/powerResistorCalc';
import { checkNum } from '../calc/checkNum';
import { formatNumber } from '../calc/format';

const EMPTY_VALUES = { power: '', resistance: '' };
const EMPTY_STATUS = { power: 'not-entered', resistance: 'not-entered' };
const DISPLAY_STATUS = { power: 'display', resistance: 'display' };

export default function PowerResistorCalc() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [error, setError] = useState(null);
  const errorTimer = useRef(null);

  useEffect(() => () => clearTimeout(errorTimer.current), []);

  const showError = (field, message) => {
    setError({ field, message });
    clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 2600);
  };

  const clearAll = () => {
    setValues(EMPTY_VALUES);
    setStatus(EMPTY_STATUS);
    setError(null);
  };

  const handleChange = (field) => (e) => {
    const raw = e.target.value;
    if (!checkNum(raw)) {
      showError(field, '请输入有效的数字');
      return;
    }
    // 输入框清空后，清空所有输出
    if (raw === '') {
      clearAll();
      return;
    }

    const num = parseFloat(raw);
    // 输入尚未完整（如单独的小数点或正负号），等待继续输入
    if (!Number.isFinite(num)) return;
    // 0 或负数无物理意义，直接提示（"0." 等中间态继续等待）
    if (num <= 0 && String(num) === raw) {
      showError(field, '请输入大于 0 的数字');
      return;
    }

    const next = { ...EMPTY_VALUES, [field]: raw };
    const nextStatus = { ...DISPLAY_STATUS, [field]: 'entered' };

    if (field === 'power') {
      // 给定功率(kW)计算电阻(Ω)
      next.resistance = formatNumber(calcResistance(num));
    } else {
      // 给定电阻(Ω)计算功率(kW)
      next.power = formatNumber(calcPower(num));
    }

    setValues(next);
    setStatus(nextStatus);
  };

  const fields = [
    ['power', '功率(kW)'],
    ['resistance', '电阻(Ω)'],
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>功率电阻计算</h1>
          <p className="page-desc">输入功率或电阻，自动换算另一项。</p>
        </div>
        <button type="button" className="btn clear-btn" onClick={clearAll}>
          <i className="fa fa-eraser" aria-hidden="true" />
          清空
        </button>
      </header>

      {error && (
        <div className="error-bar" role="alert">
          <i className="fa fa-exclamation-circle" aria-hidden="true" />
          {error.message}
        </div>
      )}

      <div className="calc-card">
        {fields.map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={values[key]}
            status={status[key]}
            invalid={error?.field === key}
            onChange={handleChange(key)}
            placeholder="点击输入"
          />
        ))}
      </div>

      <p className="formula-note">
        换算关系：<code>R = 290.4 / P</code>（功率 P 单位为 kW，电阻 R 单位为 Ω）
      </p>
    </div>
  );
}
