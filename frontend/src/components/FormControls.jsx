export function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export function TextInput({ className = '', ...props }) {
  return <input className={`input ${className}`} {...props} />;
}

export function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`input ${className}`} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ className = '', rows = 4, ...props }) {
  return <textarea className={`input ${className}`} rows={rows} {...props} />;
}
