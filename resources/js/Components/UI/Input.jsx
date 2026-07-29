export default function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
}) {
    return (
        <div>
            {label && (
                <label className="label">
                    {label} {required && <span className="text-sirius-danger">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`input ${error ? 'input-error' : ''}`}
            />
            {error && (
                <p className="text-xs text-sirius-danger mt-1 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </p>
            )}
        </div>
    )
}