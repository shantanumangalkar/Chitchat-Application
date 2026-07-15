import { forwardRef } from 'react';

/**
 * Reusable, premium atomic Input component with theme support.
 */
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold uppercase tracking-wider pl-1"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200" style={{ color: 'var(--text-tertiary)' }}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          ref={ref}
          className={`
            w-full backdrop-blur-md placeholder-slate-400 dark:placeholder-slate-500
            rounded-xl px-4 py-3 text-sm transition-all duration-300
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
          `}
          style={{
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'rgba(239, 68, 68, 0.6)' : 'var(--input-border)'}`,
            '--tw-ring-color': error ? 'rgba(239, 68, 68, 0.1)' : 'var(--accent-glow)',
          }}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 pl-1 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
