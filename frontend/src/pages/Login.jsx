import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/validators';

/**
 * Login Page component.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Read remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remember_email');
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    const newErrors = {
      email: emailErr,
      password: passwordErr,
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Please enter valid credentials.');
      return;
    }

    setIsLoading(true);
    try {
      const responseData = await authService.login(
        formData.email.trim(),
        formData.password
      );

      // Defensively parse token from different Spring Boot backend structures
      const jwtToken = 
        responseData?.token || 
        responseData?.accessToken || 
        responseData?.jwt || 
        (typeof responseData === 'string' ? responseData : null);

      if (!jwtToken) {
        throw new Error('Authentication succeeded, but no token was returned by the server.');
      }

      // Remember me handling
      if (formData.rememberMe) {
        localStorage.setItem('remember_email', formData.email.trim());
      } else {
        localStorage.removeItem('remember_email');
      }

      // Set auth context state
      const userData = responseData && typeof responseData === 'object' ? {
        id: responseData.id,
        username: responseData.username,
        email: responseData.email,
      } : null;

      login(jwtToken, userData);
      toast.success('Welcome back to ChitChat!');
      
      const redirectCode = sessionStorage.getItem('redirectRoomCode');
      if (redirectCode) {
        sessionStorage.removeItem('redirectRoomCode');
        navigate(`/join/${redirectCode}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8 select-none">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Welcome back
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Sign in to access your secure rooms, connect with your teammates, and start chatting in real-time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email address"
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          required
        />

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between items-center pl-1">
            <label 
              htmlFor="password" 
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Password
            </label>
            <a 
              href="#forgot" 
              onClick={(e) => {
                e.preventDefault();
                toast('Forgot Password placeholder. Contact administrator to reset credentials.', {
                  icon: 'ℹ️',
                });
              }}
              className="text-xs font-semibold hover:underline"
              style={{ color: 'var(--accent-primary)' }}
            >
              Forgot Password?
            </a>
          </div>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            required
          />
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between px-1 select-none">
          <label className="flex items-center gap-2 cursor-pointer group" style={{ color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 rounded border-slate-350 focus:ring-violet-500 focus:ring-offset-white transition-colors"
            />
            <span className="text-sm font-medium">Remember me</span>
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading} 
          className="w-full mt-2 py-3"
        >
          Sign in
        </Button>
      </form>

      <div className="text-center mt-6 select-none">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-semibold transition-colors hover:underline"
            style={{ color: 'var(--accent-primary)' }}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
