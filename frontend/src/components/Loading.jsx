import { Loader2 } from 'lucide-react';

/**
 * Reusable full-screen and element loading spinner with theme support.
 */
const Loading = ({ fullScreen = true, text = 'Loading your chat universe...' }) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center' 
    : 'w-full h-full flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClass} style={fullScreen ? { backgroundColor: 'var(--bg-primary)' } : {}}>
      <div className="relative flex flex-col items-center gap-4">
        {/* Glow effect back drop */}
        <div className="absolute w-24 h-24 rounded-full blur-xl animate-pulse" style={{ backgroundColor: 'var(--accent-glow)' }} />
        
        <Loader2 className="h-10 w-10 animate-spin z-10" style={{ color: 'var(--accent-primary)' }} />
        
        {text && (
          <p className="text-sm font-semibold tracking-wider uppercase animate-pulse" style={{ color: 'var(--text-tertiary)' }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
