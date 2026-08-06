import { useEffect, useRef, useState } from 'react';
import Field from '../components/Field';
import { calcArea, calcCurrent, isStandardSize } from '../calc/currentCalc';
import { checkNum, isCompleteNumber } from '../calc/checkNum';
import { formatNumber } from '../calc/format';

const EMPTY_VALUES = { current: '', area: '', singlePhase: '', threePhase: '' };
const EMPTY_STATUS = {
  current: 'not-entered',
  area: 'not-entered',
  singlePhase: 'not-entered',
  threePhase: 'not-entered',
};
const DISPLAY_STATUS = {
  current: 'display',
  area: 'display',
  singlePhase: 'display',
  threePhase: 'display',
};

export default function CurrentCalc() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [status, setStatus] = useState(EMPTY_STATUS);
  const [error, setError] = useState(null);
  const errorTimer = useRef(null);
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(errorTimer.current);
    clearTimeout(noticeTimer.current);
  }, []);

  const showError = (field, message) => {
    setError({ field, message });
    clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 2600);
  };

  const clearAll = () => {
    setValues(EMPTY_VALUES);
    setStatus(EMPTY_STATUS);
    setError(null);
    setNotice(null);
  };

  const showNotice = (message) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
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
    // 输入尚未完整（如 ".", "-", "0.", "1e", "1e+" 等），等待继续输入，避免提前计算
    if (!isCompleteNumber(raw)) return;
    // 超出可表示范围（如 "1e999"）时直接提示，避免静默等待
    if (!Number.isFinite(num)) {
      showError(field, '数字超出可计算范围');
      return;
    }
    // 0 或负数无物理意义，直接提示
    if (num <= 0) {
      showError(field, '请输入大于 0 的数字');
      return;
    }

    const next = { ...EMPTY_VALUES, [field]: raw };
    const nextStatus = { ...DISPLAY_STATUS, [field]: 'entered' };

    switch (field) {
      case 'area': {
        // 线径 → 电流、单相功率、三相功率
        const i = calcCurrent(num);
        next.current = formatNumber(i);
        next.singlePhase = formatNumber((220 * i) / 1000);
        next.threePhase = formatNumber((1.732 * 380 * i) / 1000);
        break;
      }
      case 'current': {
        // 电流 → 线径、单相功率、三相功率
        const s = calcArea(num);
        next.area = formatNumber(s);
        next.singlePhase = formatNumber((220 * num) / 1000);
        next.threePhase = formatNumber((1.732 * 380 * num) / 1000);
        if (!isStandardSize(s)) showNotice('电流过大，超出常用线径规格，已按计算值取整');
        break;
      }
      case 'singlePhase': {
        // 单相功率 → 电流、线径、三相功率
        const i = (num * 1000) / 220;
        const s = calcArea(i);
        next.current = formatNumber(i);
        next.area = formatNumber(s);
        next.threePhase = formatNumber((1.732 * 380 * i) / 1000);
        if (!isStandardSize(s)) showNotice('功率过大，电流超出常用线径规格，已按计算值取整');
        break;
      }
      case 'threePhase': {
        // 三相功率 → 电流、线径、单相功率
        const i = (num * 1000) / 1.732 / 380;
        const s = calcArea(i);
        next.current = formatNumber(i);
        next.area = formatNumber(s);
        next.singlePhase = formatNumber((220 * i) / 1000);
        if (!isStandardSize(s)) showNotice('功率过大，电流超出常用线径规格，已按计算值取整');
        break;
      }
      default:
        break;
    }

    setValues(next);
    setStatus(nextStatus);
  };

  const fields = [
    ['current', '电流(A)'],
    ['area', '线径(mm²)'],
    ['singlePhase', '单相功率(kW)'],
    ['threePhase', '三相功率(kW)'],
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>电流线径计算</h1>
          <p className="page-desc">输入任意一项，自动换算电流、线径、单相和三相功率。</p>
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

      {notice && (
        <div className="notice-bar" role="status">
          <i className="fa fa-info-circle" aria-hidden="true" />
          {notice}
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
        载流量：<code>I = 11.84 × S^0.628</code>；单相功率：<code>P = 220 × I</code>；三相功率：
        <code>P = √3 × 380 × I</code>
      </p>
    </div>
  );
}
