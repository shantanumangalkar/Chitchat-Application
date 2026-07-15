import API from '../api/axios';

/**
 * Service to handle room REST API requests to the Spring Boot backend.
 */
export const roomService = {
  /**
   * Creates a new chat room.
   * Endpoint: POST /api/rooms
   * @param {string} name - Name of the room
   */
  createRoom: async (name) => {
    try {
      const response = await API.post('/api/rooms', { roomName: name });
      return response.data; // Expected: Room object with name and generated roomCode
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to create room';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Joins an existing chat room using a room code.
   * Endpoint: POST /api/rooms/join
   * @param {string} roomCode - Code of the room to join
   */
  joinRoom: async (roomCode) => {
    try {
      const response = await API.post('/api/rooms/join', { roomCode });
      return response.data; // Expected: Room object
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to join room';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Retrieves all rooms the current user has joined.
   * Endpoint: GET /api/rooms/my
   */
  getMyRooms: async () => {
    try {
      const response = await API.get('/api/rooms/my');
      return response.data; // Expected: Array of Room objects
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch your rooms';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Gets details for a specific room.
   * Endpoint: GET /api/rooms/{roomCode}
   * @param {string} roomCode 
   */
  getRoomDetails: async (roomCode) => {
    try {
      const response = await API.get(`/api/rooms/${roomCode}`);
      return response.data; // Expected: Room details (name, code, members list, etc.)
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch room details';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Leaves a room.
   * Endpoint: DELETE /api/rooms/{roomCode}/leave
   * @param {string} roomCode 
   */
  leaveRoom: async (roomCode) => {
    try {
      const response = await API.delete(`/api/rooms/${roomCode}/leave`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to leave room';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Retrieves messages for a specific room.
   * Endpoint: GET /api/rooms/{roomCode}/messages
   * @param {string} roomCode 
   */
  getRoomMessages: async (roomCode) => {
    try {
      const response = await API.get(`/api/rooms/${roomCode}/messages`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to fetch messages';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  /**
   * Marks messages in a specific room as seen by the current user.
   * Endpoint: POST /api/rooms/{roomCode}/seen
   * @param {string} roomCode 
   */
  markMessagesAsSeen: async (roomCode) => {
    try {
      await API.post(`/api/rooms/${roomCode}/seen`);
    } catch (error) {
      console.error('Failed to mark messages as seen:', error);
    }
  },

  /**
   * Permanently destroys a room (owner only).
   * Endpoint: DELETE /api/rooms/{roomCode}
   * @param {string} roomCode 
   */
  destroyRoom: async (roomCode) => {
    try {
      const response = await API.delete(`/api/rooms/${roomCode}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data || 'Failed to destroy room';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },
};
