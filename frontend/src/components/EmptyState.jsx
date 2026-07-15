import Button from './Button';

/**
 * Reusable empty state view with icon, title, description, and call-to-action.
 */
const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = 'Get started by creating or joining your first room.',
  actionLabel,
  onAction,
}) => {
  return (
    <div 
      className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border-dashed backdrop-blur-sm select-none"
      style={{ border: '1px dashed var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 30%, transparent)' }}
    >
      <div 
        className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 shadow-inner"
        style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-tertiary)', border: '1px solid var(--border-primary)' }}
      >
        {Icon && <Icon className="h-7 w-7" />}
      </div>
      
      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm max-w-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          variant="outline" 
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
