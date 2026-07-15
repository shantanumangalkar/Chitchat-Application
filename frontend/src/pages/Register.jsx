import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { 
  validateUsername, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from '../utils/validators';

/**
 * Register Page component.
 */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    const usernameErr = validateUsername(formData.username);
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);

    const newErrors = {
      username: usernameErr,
      email: emailErr,
      password: passwordErr,
      confirmPassword: confirmErr,
    };

    // Filter out empty errors
    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Please correct the errors in the form.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(
        formData.username.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8 select-none">
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Create an account
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Join ChitChat today to connect and collaborate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Username"
          id="username"
          name="username"
          type="text"
          placeholder="Enter a username"
          icon={User}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          disabled={isLoading}
          required
        />

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

        <Input
          label="Password"
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

        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isLoading}
          required
        />

        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isLoading} 
          className="w-full mt-2 py-3"
        >
          Create account
        </Button>
      </form>

      <div className="text-center mt-6 select-none">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-semibold transition-colors hover:underline"
            style={{ color: 'var(--accent-primary)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
