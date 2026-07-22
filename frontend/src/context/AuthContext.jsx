import { createContext, useState, useEffect } from 'react';
import { 
  getToken, 
  setToken, 
  removeToken, 
  isTokenExpired, 
  getUserFromToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser
} from '../utils/token';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check token validation on startup
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getToken();
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          // Token expired, clear it
          removeToken();
          removeStoredUser();
          setUser(null);
          setTokenState(null);
        } else {
          // Token is valid, decode and load user details
          const storedUser = getStoredUser();
          setUser(storedUser || getUserFromToken(storedToken));
          setTokenState(storedToken);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for global unauthorized events from Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Set up periodic check to trigger automatic logout on token expiration
  useEffect(() => {
    if (!token) return;

    const checkInterval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout();
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(checkInterval);
  }, [token]);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setTokenState(jwtToken);
    if (userData) {
      setStoredUser(userData);
      setUser(userData);
    } else {
      const decodedUser = getUserFromToken(jwtToken);
      setUser(decodedUser);
    }
  };

  const logout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
