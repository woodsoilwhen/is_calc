import { useState } from 'react';
import Field from '../components/Field';
import { calcPower, calcResistance } from '../calc/powerResistorCalc';
import { checkNum } from '../calc/checkNum';

const EMPTY_VALUES = { power: '', resistance: '' };
const EMPTY_STATUS = { power: 'not-entered', resistance: 'not-entered' };
const DISPLAY_STATUS = { power: 'display', resistance: 'display' };

export default function PowerResistorCalc() {
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

    if (field === 'power') {
      // 给定功率(kW)计算电阻(Ω)
      next.resistance = String(calcResistance(num));
    } else {
      // 给定电阻(Ω)计算功率(kW)
      next.power = String(calcPower(num));
    }

    setValues(next);
    setStatus(nextStatus);
  };

  return (
    <div className="page">
      <Field
        label="功率(kW)"
        value={values.power}
        status={status.power}
        onChange={handleChange('power')}
        placeholder="功率"
      />
      <Field
        label="电阻(Ω)"
        value={values.resistance}
        status={status.resistance}
        onChange={handleChange('resistance')}
        placeholder="电阻"
      />
    </div>
  );
}
