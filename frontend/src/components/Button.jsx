import { Loader2 } from 'lucide-react';

/**
 * Reusable, premium atomic Button component with theme support.
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, outline, accent
  size = 'md', // sm, md, lg
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer';
  
  const variants = {
    primary: 'text-white shadow-lg focus:ring-violet-500',
    secondary: 'focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/20 focus:ring-red-500',
    outline: 'focus:ring-violet-500',
    accent: 'text-white shadow-lg focus:ring-cyan-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))',
          boxShadow: `0 4px 15px var(--accent-glow)`,
          '--tw-ring-offset-color': 'var(--bg-primary)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          '--tw-ring-offset-color': 'var(--bg-primary)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-primary)',
          '--tw-ring-offset-color': 'var(--bg-primary)',
        };
      case 'accent':
        return {
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)',
          '--tw-ring-offset-color': 'var(--bg-primary)',
        };
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={getVariantStyle()}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="h-4 w-4 text-current" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
