import { useState } from 'react';
import Field from '../components/Field';
import { calcArea, calcCurrent } from '../calc/currentCalc';
import { checkNum } from '../calc/checkNum';

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

  const handleChange = (field) => (e) => {
    const raw = e.target.value;
    if (!checkNum(raw)) {
      alert('请输入有效的数字');
      return;
    }
    // 输入框清空后，清空所有输出
    if (raw === '') {
      setValues(EMPTY_VALUES);
      setStatus(EMPTY_STATUS);
      return;
    }

    const num = parseFloat(raw);
    const next = { ...EMPTY_VALUES, [field]: raw };
    const nextStatus = { ...DISPLAY_STATUS, [field]: 'entered' };

    switch (field) {
      case 'area': {
        // 线径 → 电流、单相功率、三相功率
        const i = calcCurrent(num);
        next.current = String(i);
        next.singlePhase = String((220 * i) / 1000);
        next.threePhase = String((1.732 * 380 * i) / 1000);
        break;
      }
      case 'current': {
        // 电流 → 线径、单相功率、三相功率
        const s = calcArea(num);
        next.area = String(s);
        next.singlePhase = String((220 * num) / 1000);
        next.threePhase = String((1.732 * 380 * num) / 1000);
        break;
      }
      case 'singlePhase': {
        // 单相功率 → 电流、线径、三相功率
        const i = (num * 1000) / 220;
        const s = calcArea(i);
        next.current = String(i);
        next.area = String(s);
        next.threePhase = String((1.732 * 380 * i) / 1000);
        break;
      }
      case 'threePhase': {
        // 三相功率 → 电流、线径、单相功率
        const i = (num * 1000) / 1.732 / 380;
        const s = calcArea(i);
        next.current = String(i);
        next.area = String(s);
        next.singlePhase = String((220 * i) / 1000);
        break;
      }
      default:
        break;
    }

    setValues(next);
    setStatus(nextStatus);
  };

  return (
    <div className="page">
      <Field
        label="电流(A)"
        value={values.current}
        status={status.current}
        onChange={handleChange('current')}
        placeholder="电流"
      />
      <Field
        label="线径(mm²)"
        value={values.area}
        status={status.area}
        onChange={handleChange('area')}
        placeholder="线径"
      />
      <Field
        label="单相功率(kW)"
        value={values.singlePhase}
        status={status.singlePhase}
        onChange={handleChange('singlePhase')}
        placeholder="单相功率"
      />
      <Field
        label="三相功率(kW)"
        value={values.threePhase}
        status={status.threePhase}
        onChange={handleChange('threePhase')}
        placeholder="三相功率"
      />
    </div>
  );
}
