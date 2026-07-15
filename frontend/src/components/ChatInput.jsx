import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import toast from 'react-hot-toast';

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
  '😘', '😋', '😛', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔',
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', 
  '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '❤️', '💖', '🔥', '✨', '🌟', '⚡'
];

/**
 * Premium ChatInput message form bar with theme support.
 */
const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      onSendMessage(text.trim());
      setText(''); // Clear input
      setShowEmojiPicker(false);
    } catch (err) {
      toast.error('Failed to transmit message.');
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-3 md:p-4 flex items-center gap-2.5 relative select-none"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)', borderTop: '1px solid var(--border-primary)' }}
    >
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div 
          className="absolute bottom-20 left-4 z-40 w-72 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 animate-fade-in backdrop-blur-md"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 95%, transparent)', border: '1px solid var(--border-primary)' }}
        >
          <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Select Emoji</span>
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(false)}
              className="text-xs font-semibold cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Close
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto grid grid-cols-8 gap-2 pr-1">
            {EMOJIS.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl p-1 rounded transition-colors duration-100 cursor-pointer active:scale-90 flex items-center justify-center hover:bg-[var(--bg-inset)]"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unified Input Capsule */}
      <div 
        className="flex-1 flex items-center gap-2 px-3.5 py-1 rounded-2xl transition-all focus-within:ring-4"
        style={{
          backgroundColor: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          '--tw-ring-color': 'var(--accent-glow)',
        }}
      >
        {/* Emoji trigger button (inside capsule) */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1 rounded-lg transition-all active:scale-95 cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]"
          title="Choose emoji"
        >
          <Smile className="h-5.5 w-5.5" />
        </button>

        {/* Message input field (borderless) */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 py-2.5"
          style={{ color: 'var(--text-primary)' }}
          maxLength={2000}
        />
      </div>

      {/* Send button (outside capsule) */}
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-10 w-10 md:h-11 md:w-11 rounded-2xl text-white shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        style={{
          background: disabled || !text.trim() ? 'var(--bg-inset)' : 'linear-gradient(135deg, var(--accent-gradient-from), var(--accent-gradient-to))',
          boxShadow: disabled || !text.trim() ? 'none' : '0 4px 15px var(--accent-glow)',
          color: disabled || !text.trim() ? 'var(--text-tertiary)' : '#ffffff',
        }}
        title="Send Message"
      >
        <Send className="h-4.5 w-4.5" />
      </button>
    </form>
  );
};

export default ChatInput;
