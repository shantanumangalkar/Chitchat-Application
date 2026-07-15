import API from '../api/axios';

/**
 * Service to handle authentication REST API requests to the Spring Boot backend.
 */
export const authService = {
  /**
   * Registers a new user.
   * Endpoint: POST /api/users/register
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   */
  register: async (username, email, password) => {
    try {
      const response = await API.post('/api/users/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Extract backend validation messages if present
      const message = error.response?.data?.message || error.response?.data || 'Registration failed';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Logins an existing user.
   * Endpoint: POST /api/users/login
   * @param {string} email or username
   * @param {string} password 
   */
  login: async (email, password) => {
    try {
      const response = await API.post('/api/users/login', {
        email,
        password,
      });
      // Response is expected to contain the JWT token e.g. { token: '...' } or response.data is the token string.
      // We will return the data and handle token extraction in the calling hook.
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Login failed';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },
};
