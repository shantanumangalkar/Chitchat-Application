import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Users, LogOut, Radio, QrCode, Trash2, Menu, MoreVertical } from 'lucide-react';

/**
 * Premium ChatHeader component with theme support.
 */
const ChatHeader = ({ 
  roomName = 'Channel', 
  memberCount = 0, 
  isConnected = false, 
  onLeave,
  onInvite,
  isOwner = false,
  onDestroy,
  onMenuToggle
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="h-16 flex items-center justify-between px-4 md:px-6 select-none relative"
      style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 60%, transparent)' }}
    >
      
      {/* Left: Room Info */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg shrink-0 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-inset)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
            title="Open menu"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid color-mix(in srgb, var(--accent-primary) 15%, transparent)' }}
        >
          <MessageSquare className="h-4.5 w-4.5" />
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {roomName}
            </h2>
            
            {/* Connection Status dot */}
            <div className="flex items-center gap-1 shrink-0">
              <span className={`relative flex h-2 w-2`}>
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>
                {isConnected ? 'Live' : 'Syncing'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            <Users className="h-3.5 w-3.5" style={{ color: 'var(--text-tertiary)' }} />
            <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          </div>
        </div>
      </div>

      {/* Right Actions Block */}
      <div className="flex items-center gap-2">
        {/* Desktop actions (shown on md+ screens) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onInvite}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            title="Get room invite code, link, and QR code"
            style={{ color: 'var(--accent-primary)', border: '1px solid var(--border-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-glow)'; e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-primary) 30%, transparent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}
          >
            <QrCode className="h-4 w-4" />
            <span>Invite Space</span>
          </button>

          {isOwner && (
            <button
              onClick={onDestroy}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer animate-fade-in"
              title="Permanently destroy this room and delete all messages"
              style={{ border: '1px solid var(--border-primary)' }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Destroy Room</span>
            </button>
          )}

          <button
            onClick={onLeave}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut className="h-4 w-4" />
            <span>Leave Room</span>
          </button>
        </div>

        {/* Mobile three-dot actions (shown on screens < md) */}
        <div className="md:hidden relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl transition-all hover:bg-[var(--bg-inset)] cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
            title="Actions Menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 rounded-xl backdrop-blur-xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 95%, transparent)', border: '1px solid var(--border-primary)' }}
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onInvite();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer"
                style={{ color: 'var(--accent-primary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-glow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <QrCode className="h-4 w-4" />
                <span>Invite Space</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLeave();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-lg transition-colors text-left cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <LogOut className="h-4 w-4" />
                <span>Leave Room</span>
              </button>

              {isOwner && (
                <>
                  <hr className="my-1.5" style={{ borderColor: 'var(--border-primary)' }} />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDestroy();
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-left font-medium cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Destroy Room</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ChatHeader;
