import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare } from 'lucide-react';
import Loading from '../components/Loading';
import ThemeToggle from '../components/ThemeToggle';
import ProfileDropdown from '../components/ProfileDropdown';

/**
 * Main Layout wrapper for authenticated pages.
 * Handles top navigation bar and responsive canvas.
 */
const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If loading or unauthenticated, handle route guards
  if (loading) {
    return <Loading fullScreen={true} text="Initializing secure workspace..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isInRoom = location.pathname.startsWith('/room/');

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sticky top Navigation Header */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl select-none ${isInRoom ? 'hidden md:block' : 'block'}`} style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo (Left) */}
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" className="w-9 h-9 object-contain" alt="ChitChat Logo" />
            <span className="text-lg font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              ChitChat
            </span>
          </div>

          {/* User & Theme Actions (Right) */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-6 w-px" style={{ backgroundColor: 'var(--border-primary)' }} />
            <ProfileDropdown />
          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto px-2 sm:px-6 py-2 md:py-8 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
