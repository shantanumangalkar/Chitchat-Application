import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  MessageSquare, 
  ChevronLeft,
  LogOut,
  QrCode,
  Copy,
  Check,
  CornerDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { roomService } from '../services/roomService';

/**
 * Premium ChatRoom component supporting responsive sidebars and live message feeds.
 */
const ChatRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Component states
  const [roomDetails, setRoomDetails] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar drawer state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Connect WebSockets
  const { messages, isConnected, sendMessage } = useWebSocket(roomCode, token, user);
  const messagesEndRef = useRef(null);

  const handleCopyInviteLink = async () => {
    const link = `${window.location.origin}/join/${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      toast.success('Invite link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast.error('Failed to copy invite link.');
    }
  };

  const handleSendMessage = (text) => {
    sendMessage(text, replyingTo?.id);
    setReplyingTo(null);
  };

  // Load room details and channel list
  useEffect(() => {
    const loadRoomData = async () => {
      setIsLoading(true);
      try {
        // Fetch current room information
        const details = await roomService.getRoomDetails(roomCode);
        setRoomDetails(details);

        // Fetch user's channels list for the sidebar
        const channels = await roomService.getMyRooms();
        setMyRooms(channels);
      } catch (err) {
        toast.error(err.message || 'Failed to enter chat space.');
        navigate('/dashboard'); // Kick back to safety
      } finally {
        setIsLoading(false);
      }
    };

    if (roomCode) {
      loadRoomData();
    }
  }, [roomCode, navigate]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLeaveChannel = async () => {
    if (window.confirm(`Leave room "${roomDetails?.roomName}"?`)) {
      try {
        await roomService.leaveRoom(roomCode);
        toast.success('Successfully left room.');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.message || 'Failed to leave room.');
      }
    }
  };

  const handleDestroyChannel = async () => {
    if (window.confirm(`Permanently destroy room "${roomDetails?.roomName}"? This will delete all messages and members forever!`)) {
      try {
        await roomService.destroyRoom(roomCode);
        toast.success('Room destroyed successfully.');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.message || 'Failed to destroy room.');
      }
    }
  };

  if (isLoading) {
    return <Loading fullScreen={true} text="Connecting to room channels..." />;
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-[calc(100vh-8.5rem)] rounded-2xl border overflow-hidden relative shadow-2xl" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}>
      
      {/* 1. ROOMS LIST SIDEBAR (Desktop: Fixed, Mobile: Drawer) */}
      <aside 
        className={`
          w-64 shrink-0 flex flex-col justify-between 
          transition-transform duration-300 z-30 absolute md:static inset-y-0 left-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ borderRight: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)' }}
      >
        <div className="flex flex-col flex-1 min-h-0 select-none">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider pl-1" style={{ color: 'var(--text-tertiary)' }}>
              My Workspaces
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 transition-colors cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
              title="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Rooms scroll list */}
          <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
            {myRooms.map((ch) => {
              const isActive = ch.roomCode === roomCode;
              return (
                <Link
                  key={ch.roomCode}
                  to={`/room/${ch.roomCode}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'text-indigo-450' 
                      : 'text-slate-500 hover:text-slate-200'}
                  `}
                  style={{
                    backgroundColor: isActive ? 'var(--accent-glow)' : 'transparent',
                    border: isActive ? '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)' : '1px solid transparent',
                  }}
                >
                  <MessageSquare className={`h-4 w-4`} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)' }} />
                  <span className="truncate flex-1">{ch.roomName}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Back to Dashboard Footer */}
        <div className="p-3 select-none" style={{ borderTop: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 95%, transparent)' }}>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <ChevronLeft className="h-4.5 w-4.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* 2. CHAT WINDOW PANEL */}
      <section className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Core Chat Header */}
        <div className="w-full">
          <ChatHeader
            roomName={roomDetails?.roomName}
            memberCount={roomDetails?.memberCount}
            isConnected={isConnected}
            onLeave={handleLeaveChannel}
            onInvite={() => setIsInviteOpen(true)}
            isOwner={!!(
              (roomDetails?.ownerEmail && user && (roomDetails.ownerEmail === user.email || roomDetails.ownerEmail === user.username)) ||
              (roomDetails?.owner && user && roomDetails.owner === user.username)
            )}
            onDestroy={handleDestroyChannel}
            onMenuToggle={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* Dynamic Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 flex flex-col gap-2" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-inset) 20%, transparent)' }}>
          
          {/* Welcome Intro Message */}
          <div 
            className="flex flex-col items-center text-center p-4 md:p-6 border rounded-2xl max-w-lg mx-auto my-3 md:my-6 select-none border-dashed"
            style={{ borderColor: 'var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}
          >
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 shadow-inner"
              style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)', color: 'var(--accent-primary)' }}
            >
              <MessageSquare className="h-5 w-5 md:h-5.5 md:w-5.5" />
            </div>
            <h4 className="font-bold text-xs md:text-sm" style={{ color: 'var(--text-primary)' }}>
              Welcome to the {roomDetails?.roomName} room!
            </h4>
            <p className="text-[10px] md:text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This is the beginning of the {roomDetails?.roomName} workspace conversation. Share the code <span className="font-mono px-1 py-0.5 rounded font-semibold" style={{ backgroundColor: 'var(--bg-inset)', border: '1px solid var(--border-primary)', color: 'var(--accent-primary)' }}>{roomCode}</span> to bring teammates in!
            </p>
          </div>

          {/* Messages list */}
          {messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id || idx}
              message={msg}
              isCurrentUser={msg.sender === user?.username || msg.sender === user?.email}
              onReply={setReplyingTo}
            />
          ))}
          
          {/* Scroll bottom target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Real-time connection feedback */}
        {!isConnected && (
          <div className="absolute top-16 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-semibold text-amber-400 select-none animate-fadeIn">
            Real-time feed sync issue. Re-connecting to chat socket...
          </div>
        )}

        {/* Reply Preview Header */}
        {replyingTo && (
          <div 
            className="px-4 py-2.5 flex items-center justify-between text-xs animate-fade-in"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg-surface) 80%, transparent)', borderTop: '1px solid var(--border-primary)' }}
          >
            <div className="flex items-center gap-2 truncate" style={{ color: 'var(--text-secondary)' }}>
              <CornerDownRight className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-bold shrink-0" style={{ color: 'var(--accent-primary)' }}>Replying to @{replyingTo.sender}:</span>
              <span className="truncate italic text-slate-500 dark:text-slate-400">"{replyingTo.encryptedMessage}"</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded transition-colors cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-inset)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              title="Cancel reply"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Core Chat Input form */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={!isConnected} 
        />
      </section>

      {/* 3. MOBILE SIDEBAR BACKDROP DRAWER OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Invite Modal for QR Code and Invite Link */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Teammates"
      >
        <div className="flex flex-col items-center gap-6 text-center select-none animate-fade-in">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-glow)', border: '1px solid color-mix(in srgb, var(--accent-primary) 20%, transparent)', color: 'var(--accent-primary)' }}
          >
            <QrCode className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Share Connection Access</h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Send the invite link to others, or let them scan this QR code to join instantly.
            </p>
          </div>

          {/* Link Input & Copy */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full justify-between border" style={{ backgroundColor: 'var(--bg-inset)', borderColor: 'var(--border-primary)' }}>
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/join/${roomCode}`}
              className="text-xs font-semibold bg-transparent outline-none flex-1 truncate select-all pr-2"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              onClick={handleCopyInviteLink}
              className="p-2 rounded-xl transition-colors shrink-0 cursor-pointer"
              style={{ color: 'var(--accent-primary)', border: '1px solid var(--border-primary)' }}
              title="Copy Invite Link"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* QR Code Container */}
          <div className="p-3 rounded-2xl w-48 h-48 flex items-center justify-center shadow-lg border" style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-primary)' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                `${window.location.origin}/join/${roomCode}`
              )}`}
              alt="Room Invite QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            Room Code: <span className="font-mono px-1.5 py-0.5 border rounded font-semibold" style={{ backgroundColor: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--accent-primary)' }}>{roomCode}</span>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ChatRoom;
