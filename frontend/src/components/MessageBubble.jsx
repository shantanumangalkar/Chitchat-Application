import { CornerUpLeft } from 'lucide-react';

/**
 * Premium MessageBubble component supporting TEXT, SYSTEM, replies, and seen states.
 */
const MessageBubble = ({ message, isCurrentUser, onReply }) => {
  const isSystem = message.messageType === 'SYSTEM';

  // Format local current timestamp as HH:MM
  const formatTime = () => {
    const date = message.timestamp ? new Date(message.timestamp) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 select-none animate-fade-in">
        <span 
          className="text-xs px-3.5 py-1.5 rounded-full font-medium tracking-wide"
          style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-tertiary)', border: '1px solid var(--border-secondary)' }}
        >
          {message.encryptedMessage}
        </span>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  const otherReaders = message.seenBy ? message.seenBy.filter(u => u !== message.sender) : [];
  const isSeen = otherReaders.length > 0;
  const seenTooltip = isSeen ? `Seen by: ${otherReaders.join(', ')}` : 'Sent';

  return (
    <div 
      id={`msg-${message.id}`}
      className={`
        flex gap-3 max-w-[85%] sm:max-w-[70%] my-2 group relative items-center
        ${isCurrentUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}
      `}
    >
      {/* Sender Avatar Initials (Only for other users) */}
      {!isCurrentUser && (
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs select-none shrink-0 mt-0.5 shadow"
          style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid color-mix(in srgb, var(--accent-primary) 10%, transparent)' }}
        >
          {getInitials(message.sender)}
        </div>
      )}

      {/* Bubble card */}
      <div className="flex flex-col gap-1 min-w-0">
        {/* Sender Username */}
        {!isCurrentUser && (
          <span className="text-xs font-bold pl-1 select-none" style={{ color: 'var(--text-secondary)' }}>
            {message.sender}
          </span>
        )}
        
        <div 
          className={`px-4 py-3 rounded-2xl text-sm relative shadow-md break-all ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
          style={isCurrentUser 
            ? { background: 'var(--bubble-own-bg)', color: 'var(--bubble-own-text)' }
            : { backgroundColor: 'var(--bubble-other-bg)', color: 'var(--bubble-other-text)', border: `1px solid var(--bubble-other-border)` }
          }
        >
          {/* Reply parent message preview */}
          {message.replyToId && (
            <div 
              onClick={() => {
                const el = document.getElementById(`msg-${message.replyToId}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('highlight-message');
                  setTimeout(() => el.classList.remove('highlight-message'), 2000);
                }
              }}
              className={`mb-2 border-l-2 pl-2 py-1 rounded-r text-[10px] cursor-pointer max-w-full truncate transition-all`}
              style={{
                borderColor: 'var(--accent-primary)',
                backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.1)' : 'var(--bg-inset)',
                color: isCurrentUser ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
              }}
              title="Click to jump to message"
            >
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>@{message.replyToSender}</div>
              <div className="italic truncate">{message.replyToText || 'Original message'}</div>
            </div>
          )}

          <p className="leading-relaxed whitespace-pre-wrap">{message.encryptedMessage}</p>
          
          {/* Message timestamp & Seen Indicators */}
          <div 
            className="text-[9px] font-medium mt-1.5 text-right select-none flex items-center justify-end gap-1"
            style={{ color: isCurrentUser ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)' }}
          >
            <span>{formatTime()}</span>
            {isCurrentUser && (
              <span className="flex items-center">
                {isSeen ? (
                  <span className="text-emerald-400 font-bold tracking-tighter" title={seenTooltip}>✓✓</span>
                ) : (
                  <span title="Sent" style={{ color: 'var(--text-tertiary)' }}>✓</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reply Action Trigger (Shown on hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        <button
          onClick={() => onReply({ id: message.id, sender: message.sender, encryptedMessage: message.encryptedMessage })}
          className="p-1.5 rounded-lg transition-all active:scale-90 cursor-pointer"
          style={{ border: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 30%, transparent)', color: 'var(--text-tertiary)' }}
          title="Reply to message"
        >
          <CornerUpLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;
