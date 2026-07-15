/**
 * Form validator utilities.
 */

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters long';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

export const validateRoomName = (name) => {
  if (!name || !name.trim()) return 'Room name is required';
  if (name.trim().length < 3) {
    return 'Room name must be at least 3 characters long';
  }
  return '';
};

export const validateRoomCode = (code) => {
  if (!code || !code.trim()) return 'Room code is required';
  return '';
};
