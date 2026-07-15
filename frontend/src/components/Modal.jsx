import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable premium Modal component with backdrop blur and escape key listener.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 backdrop-blur-sm transition-opacity duration-300"
        style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)' }}
      />

      {/* Modal card content */}
      <div 
        className={`
          glass-panel relative w-full max-w-md rounded-2xl 
          p-6 md:p-8 z-10 transform scale-100 transition-all duration-300 
          animate-in fade-in zoom-in-95 duration-200
          ${className}
        `}
        style={{ border: '1px solid var(--border-secondary)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {title && (
            <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--text-primary))' }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg transition-all duration-200 focus:outline-none cursor-pointer"
            style={{ color: 'var(--text-tertiary)', border: '1px solid transparent' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.backgroundColor = 'var(--bg-inset)'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--text-tertiary)'; e.target.style.backgroundColor = 'transparent'; }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
