import { useState } from 'react';
import { MessageSquare, Copy, Check, LogOut, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

/**
 * Premium RoomCard component to display in the Dashboard with theme support.
 */
const RoomCard = ({ room, onEnter, onLeave, onDestroy }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const isOwner = !!(
    (room.ownerEmail && user && (room.ownerEmail === user.email || room.ownerEmail === user.username)) ||
    (room.owner && user && room.owner === user.username)
  );

  const handleCopyCode = async (e) => {
    e.stopPropagation(); // Avoid triggering Card's click redirect
    try {
      await navigator.clipboard.writeText(room.roomCode);
      setCopied(true);
      toast.success('Room code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code.');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `Join my chat room on ChitChat!\nRoom Name: ${room.roomName}\nRoom Code: ${room.roomCode}`;
    if (navigator.share) {
      navigator.share({
        title: `Join ${room.roomName}`,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(room.roomCode);
      toast.success('Room code copied! Share it with your friends.');
    }
  };

  const handleLeave = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to leave the room "${room.roomName}"?`)) {
      setIsLeaving(true);
      try {
        await onLeave(room.roomCode);
      } finally {
        setIsLeaving(false);
      }
    }
  };

  const handleDestroy = async (e) => {
    e.stopPropagation();
    if (onDestroy) {
      await onDestroy(room.roomCode);
    }
  };

  return (
    <div 
      onClick={() => onEnter(room.roomCode)}
      className="glass-card hover:border-[var(--card-hover-border)] rounded-2xl p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden select-none hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Decorative backdrop light */}
      <div className="absolute top-[-10px] right-[-10px] w-20 h-20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--accent-glow)' }} />

      {/* Room Details */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid color-mix(in srgb, var(--accent-primary) 10%, transparent)' }}
            >
              <MessageSquare className="h-4 w-4" />
            </div>
            <h3 className="font-bold truncate text-base transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
              {room.roomName}
            </h3>
          </div>
          
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Room Code</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <code 
                className="text-xs font-mono px-2 py-1 rounded font-semibold"
                style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-secondary)', border: '1px solid var(--border-secondary)' }}
              >
                {room.roomCode}
              </code>
              <button
                onClick={handleCopyCode}
                title="Copy room code"
                className="p-1 rounded transition-all cursor-pointer"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 flex items-center justify-between gap-2" style={{ borderTop: '1px solid var(--border-secondary)' }}>
        <div className="flex gap-2">
          {isOwner && (
            <button
              onClick={handleDestroy}
              title="Destroy Room"
              className="p-2 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}

          <button
            onClick={handleLeave}
            disabled={isLeaving}
            title="Leave Room"
            className="p-2 rounded-xl hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            title="Share Room Details"
            className="p-2 rounded-xl border border-transparent hover:border-[var(--border-primary)] transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEnter(room.roomCode);
            }} 
            variant="primary" 
            size="sm"
          >
            Enter Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
