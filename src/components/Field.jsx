export default function Field({ label, value, status, onChange, placeholder }) {
  return (
    <div className="field">
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ''}
        placeholder={placeholder ?? label}
        onChange={onChange}
      />
      <div className={`status ${status}`} />
    </div>
  );
}
