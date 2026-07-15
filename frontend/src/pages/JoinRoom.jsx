import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Users, ArrowRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../components/Button';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { roomService } from '../services/roomService';

/**
 * Premium JoinRoom page component for invite links and QR code redirects.
 */
const JoinRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // If auth state is still loading, wait
    if (authLoading) return;

    const autoJoin = async () => {
      setIsJoining(true);
      try {
        const response = await roomService.joinRoom(roomCode.trim().toUpperCase());
        toast.success(`Joined room "${response.roomName}"!`);
        navigate(`/room/${roomCode}`);
      } catch (err) {
        // If already a member, forward directly
        if (err.message?.toLowerCase().includes('already') || err.message?.toLowerCase().includes('member')) {
          navigate(`/room/${roomCode}`);
        } else {
          toast.error(err.message || 'Failed to join room. Verify invitation code.');
          navigate('/dashboard');
        }
      } finally {
        setIsJoining(false);
      }
    };

    if (isAuthenticated && roomCode) {
      autoJoin();
    }
  }, [isAuthenticated, authLoading, roomCode, navigate]);

  const handleGuestRedirect = (path) => {
    sessionStorage.setItem('redirectRoomCode', roomCode);
    navigate(path);
  };

  if (authLoading || isJoining) {
    return <Loading fullScreen={true} text="Accepting invitation..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative select-none overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 border border-white/5 shadow-2xl text-center flex flex-col gap-6 animate-fadeIn">
        
        {/* Invitation Icon */}
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <Users className="h-8 w-8 animate-pulse" />
        </div>

        {/* Title & Desc */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-200 to-slate-200 bg-clip-text text-transparent">
            Workspace Invitation
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            You've been invited to join a collaborative chat room. Secure and end-to-end encrypted workspace.
          </p>
        </div>

        {/* Invitation details */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 my-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
            Room Join Code
          </span>
          <code className="text-2xl font-mono font-black tracking-wider text-indigo-400">
            {roomCode?.toUpperCase()}
          </code>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5 mt-2">
          <Button
            onClick={() => handleGuestRedirect('/login')}
            variant="primary"
            className="py-3 flex justify-center items-center gap-2 text-sm font-semibold rounded-2xl"
            icon={LogIn}
          >
            Log in to Join Room
          </Button>

          <Button
            onClick={() => handleGuestRedirect('/register')}
            variant="secondary"
            className="py-3 flex justify-center items-center gap-2 text-sm font-semibold rounded-2xl"
            icon={UserPlus}
          >
            Create Account to Join
          </Button>
        </div>

        {/* Back to Home safety fallback */}
        <div className="border-t border-slate-900 pt-4 mt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Cancel and Go to Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default JoinRoom;
