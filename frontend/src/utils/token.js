const TOKEN_KEY = 'chat_app_jwt_token';
const USER_KEY = 'chat_app_user_data';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  const data = localStorage.getItem(USER_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // A JWT has 3 dot-separated parts: Header, Payload, and Signature.
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode base64url-encoded payload.
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    
    // JWT exp is in seconds, Date.now() is in milliseconds.
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (e) {
    // If decoding fails, we assume it is invalid or expired
    return true;
  }
};

export const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    // Usually Spring Boot JWT contains username as sub
    return {
      username: payload.sub || payload.username || 'User',
      exp: payload.exp,
      // You can expand this if the backend JWT has other claims
    };
  } catch (e) {
    return null;
  }
};
