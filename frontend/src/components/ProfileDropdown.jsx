import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Premium user ProfileDropdown menu with theme support.
 */
const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (username) => {
    if (!username) return 'U';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 focus:outline-none select-none active:scale-98 cursor-pointer"
        style={{ border: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 60%, transparent)', color: 'var(--text-secondary)' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))' }}>
          {getInitials(user?.username)}
        </div>
        <span className="hidden sm:inline text-sm font-semibold max-w-[100px] truncate" style={{ color: 'var(--text-primary)' }}>
          {user?.username || 'User'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2.5 w-56 rounded-xl backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 95%, transparent)', border: '1px solid var(--border-primary)' }}
        >
          {/* User Details Info */}
          <div className="px-3 py-2.5 mb-1.5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Signed in as</p>
            <p className="text-sm font-bold truncate mt-0.5" style={{ color: 'var(--text-primary)' }}>{user?.username || 'User'}</p>
          </div>

          {/* Action Links */}
          <button
            onClick={() => {
              setIsOpen(false);
              toast('Profile feature coming soon!', { icon: '👤' });
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 text-left cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              toast('Settings feature coming soon!', { icon: '⚙️' });
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 text-left cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </button>

          <hr className="my-1.5" style={{ borderColor: 'var(--border-primary)' }} />

          {/* Logout Action */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
              toast.success('Successfully logged out.');
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors duration-200 text-left font-medium cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
