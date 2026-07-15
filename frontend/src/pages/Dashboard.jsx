import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  LogIn, 
  Search, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import RoomCard from '../components/RoomCard';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import { roomService } from '../services/roomService';
import { validateRoomName, validateRoomCode } from '../utils/validators';

/**
 * Premium Dashboard page component with theme support.
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Rooms and loading states
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal open states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [successRoom, setSuccessRoom] = useState(null); // Holds details of newly created room

  // Form states
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load user's rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await roomService.getMyRooms();
      // Ensure data is array
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || 'Could not fetch your rooms.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter rooms by search query
  const filteredRooms = rooms.filter((room) =>
    room.roomName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Room Creation
  const handleCreateRoomSubmit = async (e) => {
    e.preventDefault();
    const err = validateRoomName(roomName);
    if (err) {
      setFormErrors({ roomName: err });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const newRoom = await roomService.createRoom(roomName.trim());
      setSuccessRoom(newRoom); // Save created room to show code screen
      setRoomName('');
      setIsCreateOpen(false); // Close create form modal
      fetchRooms(); // Refresh rooms list
      toast.success('Room created successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to create room.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Joining Room
  const handleJoinRoomSubmit = async (e) => {
    e.preventDefault();
    const err = validateRoomCode(roomCode);
    if (err) {
      setFormErrors({ roomCode: err });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const joinedRoom = await roomService.joinRoom(roomCode.trim().toUpperCase());
      setRoomCode('');
      setIsJoinOpen(false);
      toast.success(`Joined room "${joinedRoom.roomName}"!`);
      navigate(`/room/${joinedRoom.roomCode}`);
    } catch (err) {
      toast.error(err.message || 'Failed to join room. Verify room code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Leaving Room
  const handleLeaveRoom = async (code) => {
    try {
      await roomService.leaveRoom(code);
      toast.success('Successfully left the room.');
      fetchRooms(); // Refresh lists
    } catch (err) {
      toast.error(err.message || 'Failed to leave room.');
    }
  };

  // Handle Destroying Room
  const handleDestroyRoom = async (code) => {
    if (window.confirm(`Permanently destroy this room? This will delete all messages and members forever!`)) {
      try {
        await roomService.destroyRoom(code);
        toast.success('Room destroyed successfully.');
        fetchRooms(); // Refresh lists
      } catch (err) {
        toast.error(err.message || 'Failed to destroy room.');
      }
    }
  };

  const handleCopyCreatedCode = async () => {
    if (!successRoom) return;
    try {
      await navigator.clipboard.writeText(successRoom.roomCode);
      setCopied(true);
      toast.success('Room code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code.');
    }
  };

  const handleEnterRoom = (code) => {
    navigate(`/room/${code}`);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Banner section */}
      <section 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl glass-panel relative overflow-hidden select-none shadow-xl"
        style={{ border: '1px solid var(--border-secondary)' }}
      >
        <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[150%] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: 'var(--accent-glow)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-xl md:text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Choose How You Want to Connect
            </h2>
          </div>
          <p className="text-sm mt-1 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Create a new chat room or join an existing one using a room code. Fast, secure, and effortless.
          </p>
        </div>
        
        {/* Quick action buttons */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Button 
            onClick={() => setIsJoinOpen(true)} 
            variant="secondary" 
            icon={LogIn}
          >
            Join Room
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)} 
            variant="primary" 
            icon={Plus}
          >
            Create Room
          </Button>
        </div>
      </section>

      {/* Main content grid: search bar + lists */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            My Rooms ({rooms.length})
          </h3>
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs group">
            <Search className="absolute left-3.5 inset-y-0 my-auto h-4 w-4 transition-colors" style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 transition-all"
              style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-glow)' }}
            />
          </div>
        </div>

        {/* Rooms Grid / Loaders / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton variant="rect" height="180px" />
            <Skeleton variant="rect" height="180px" />
            <Skeleton variant="rect" height="180px" />
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.roomCode}
                room={room}
                onEnter={handleEnterRoom}
                onLeave={handleLeaveRoom}
                onDestroy={handleDestroyRoom}
              />
            ))}
          </div>
        ) : searchQuery ? (
          <EmptyState
            icon={Search}
            title="No search matches"
            description={`We couldn't find any rooms matching "${searchQuery}". Check the spelling or search for another name.`}
          />
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="Welcome to your workspace"
            description="You aren't active in any rooms yet. Kick off your first workspace chat room or type an invitation code to join others."
            actionLabel="Create a Room"
            onAction={() => setIsCreateOpen(true)}
          />
        )}
      </section>

      {/* CREATE ROOM MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setFormErrors({});
          setRoomName('');
        }}
        title="Create a chat room"
      >
        <form onSubmit={handleCreateRoomSubmit} className="flex flex-col gap-5">
          <Input
            label="Room Name"
            id="roomName"
            type="text"
            placeholder="e.g. Frontend Development, Coffee Lounge"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              if (formErrors.roomName) setFormErrors({});
            }}
            error={formErrors.roomName}
            disabled={isSubmitting}
            required
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full py-3"
          >
            Establish Room
          </Button>
        </form>
      </Modal>

      {/* JOIN ROOM MODAL */}
      <Modal
        isOpen={isJoinOpen}
        onClose={() => {
          setIsJoinOpen(false);
          setFormErrors({});
          setRoomCode('');
        }}
        title="Join chat room"
      >
        <form onSubmit={handleJoinRoomSubmit} className="flex flex-col gap-5">
          <Input
            label="Room Code"
            id="roomCode"
            type="text"
            placeholder="e.g. ABCDEF (6-character code)"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              if (formErrors.roomCode) setFormErrors({});
            }}
            error={formErrors.roomCode}
            disabled={isSubmitting}
            required
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full py-3"
            icon={ArrowRight}
          >
            Connect to Room
          </Button>
        </form>
      </Modal>

      {/* ROOM CREATION SUCCESS MODAL */}
      <Modal
        isOpen={!!successRoom}
        onClose={() => setSuccessRoom(null)}
        title="Workspace room active!"
      >
        {successRoom && (
          <div className="flex flex-col items-center gap-6 text-center select-none">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>

            <div>
              <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {successRoom.roomName}
              </h4>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Share this room code with others to invite them to this space.
              </p>
            </div>

            <div 
              className="flex items-center gap-2 px-5 py-3 rounded-2xl w-full justify-between"
              style={{ backgroundColor: 'var(--bg-inset)', border: '1px solid var(--border-primary)' }}
            >
              <code className="text-lg font-mono font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
                {successRoom.roomCode}
              </code>
              <button
                onClick={handleCopyCreatedCode}
                className="p-2 rounded-xl transition-colors cursor-pointer"
                style={{ color: 'var(--accent-primary)', border: '1px solid var(--border-primary)' }}
                title="Copy Code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-3 w-full mt-2">
              <Button
                onClick={() => setSuccessRoom(null)}
                variant="secondary"
                className="flex-1 py-3"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const code = successRoom.roomCode;
                  setSuccessRoom(null);
                  handleEnterRoom(code);
                }}
                variant="primary"
                className="flex-1 py-3"
                icon={ExternalLink}
              >
                Enter Chat
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
