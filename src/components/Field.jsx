export default function Field({ label, value, status, onChange, placeholder, invalid = false }) {
  const computed = status === 'display' && value !== '' && value != null;

  return (
    <div
      className={`field${status === 'entered' ? ' entered' : ''}${computed ? ' computed' : ''}${
        invalid ? ' invalid' : ''
      }`}
    >
      <span className="field-label">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value ?? ''}
        placeholder={placeholder ?? label}
        onChange={onChange}
        aria-label={label}
        aria-invalid={invalid || undefined}
      />
      {computed && (
        <span className="auto-badge" aria-hidden="true">
          自动计算
        </span>
      )}
    </div>
  );
}
