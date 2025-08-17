import api from './api';

export interface Travelmate {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const travelmateService = {
  // Get all travelmates
  getAll: async () => {
    const response = await api.get('/travelmates');
    return response.data;
  },

  // Get a single travelmate by ID
  getById: async (id: string) => {
    const response = await api.get(`/travelmates/${id}`);
    return response.data;
  },

  // Create a new travelmate
  create: async (data: Omit<Travelmate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/travelmates', data);
    return response.data;
  },

  // Update a travelmate
  update: async (id: string, data: Partial<Travelmate>) => {
    const response = await api.put(`/travelmates/${id}`, data);
    return response.data;
  },

  // Delete a travelmate
  delete: async (id: string) => {
    const response = await api.delete(`/travelmates/${id}`);
    return response.data;
  },

  // Get travelmates by user ID
  getByUserId: async (userId: string) => {
    const response = await api.get(`/travelmates/user/${userId}`);
    return response.data;
  },

  // Check if user has a profile
  checkProfileStatus: async () => {
    const response = await api.get('/travelmates/profile/status');
    return response.data;
  },

  // Get user's profile
  getMyProfile: async () => {
    const response = await api.get('/travelmates/profile');
    return response.data;
  },

  // Get potential matches
  getMatches: async () => {
    const response = await api.get('/travelmates/matches');
    return response.data;
  },

  // Create or update profile
  createOrUpdateProfile: async (profileData: any) => {
    const response = await api.post('/travelmates/profile', profileData);
    return response.data;
  },

  // Send connection request
  sendConnectionRequest: async (userId: string) => {
    const response = await api.post(`/travelmates/connect/${userId}`);
    return response.data;
  }
};

export default travelmateService; 