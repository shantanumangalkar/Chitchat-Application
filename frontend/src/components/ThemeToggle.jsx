import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * Premium pill-shaped ThemeToggle with sliding thumb animation.
 */
const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`theme-toggle-track ${className}`}
      aria-label="Toggle visual theme"
    >
      <div className={`theme-toggle-thumb ${theme}`}>
        {theme === 'dark' ? (
          <Moon className="h-3 w-3 text-white" />
        ) : (
          <Sun className="h-3 w-3 text-white" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
