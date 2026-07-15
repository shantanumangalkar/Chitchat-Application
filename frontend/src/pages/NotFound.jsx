import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 text-center select-none relative bg-slate-950">
      {/* Glow backgrounds */}
      <div className="absolute w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-panel p-10 md:p-12 rounded-3xl max-w-md border border-white/5 relative z-10">
        <h1 className="text-8xl font-black bg-gradient-to-tr from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-200 mt-4">
          Lost in Space
        </h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          variant="primary"
          icon={Home}
          className="mt-8 w-full py-3"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
