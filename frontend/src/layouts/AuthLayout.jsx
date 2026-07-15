import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Shield, Zap } from 'lucide-react';
import Loading from '../components/Loading';

/**
 * Shared layout for Auth pages (Login, Register).
 * Includes an animated hero sidebar on desktop and a glassmorphic form card container.
 */
const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // If already authenticated, redirect to Dashboard directly
  if (loading) {
    return <Loading fullScreen={true} text="Restoring secure workspace..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-screen flex overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--bg-glow-1)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--bg-glow-2)' }} />

      {/* Left Column: Hero Section (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative backdrop-blur-3xl z-10 select-none" style={{ borderRight: '1px solid var(--border-secondary)', backgroundColor: 'color-mix(in srgb, var(--bg-primary) 40%, transparent)' }}>
        {/* Logo/Brand */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" className="w-10 h-10 object-contain" alt="ChitChat Logo" />
          <span className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            ChitChat
          </span>
        </div>

        {/* Hero Central Pitch */}
        <div className="my-auto max-w-md flex flex-col gap-8">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            Your Conversations, <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              Your Space
            </span>
          </h1>
          
          <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>
            Manage rooms, connect with friends, and enjoy secure real-time messaging with ChiChat.
          </p>

          {/* Bullet points */}
          <div className="flex flex-col gap-5 mt-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)' }}>
                <Zap className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Lightning Fast Messaging</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Send and receive messages instantly with zero delays.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-secondary) 10%, transparent)', color: 'var(--accent-secondary)', border: '1px solid color-mix(in srgb, var(--accent-secondary) 20%, transparent)' }}>
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Secure & Private Rooms</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Your chat spaces are fully protected, keeping your conversations safe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
          &copy; {new Date().getFullYear()} ChitChat. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Container (Mobile/Tablet and Desktop form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 z-10 relative">
        {/* Floating animated background sphere behind form */}
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ backgroundColor: 'var(--bg-glow-2)' }} />
        
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Logo showing on mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-2">
            <img src="/logo.svg" className="w-10 h-10 object-contain" alt="ChitChat Logo" />
            <span className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
              ChitChat
            </span>
          </div>

          {/* Form wrapper */}
          <div className="glass-panel p-8 md:p-10 rounded-2xl relative overflow-hidden" style={{ border: '1px solid var(--border-secondary)' }}>
            {/* Glossy lighting overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
