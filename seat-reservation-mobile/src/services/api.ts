import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Base URL for the API
const API_URL = 'https://api.reservation-system.company.com/v1';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    // Add auth token to headers if available
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // In a real app, this would refresh the token
        // For now, we'll just log the user out
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        
        // Redirect to login screen would happen via Redux
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  logout: () => {
    return api.post('/auth/logout');
  },
  refreshToken: (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  // Reservations
  getReservations: (params?: any) => {
    return api.get('/reservations', { params });
  },
  createReservation: (data: any) => {
    return api.post('/reservations', data);
  },
  getReservationDetails: (id: string) => {
    return api.get(`/reservations/${id}`);
  },
  updateReservation: (id: string, data: any) => {
    return api.put(`/reservations/${id}`, data);
  },
  cancelReservation: (id: string) => {
    return api.delete(`/reservations/${id}`);
  },
  checkIn: (id: string, data?: any) => {
    return api.post(`/reservations/${id}/checkin`, data);
  },
  checkOut: (id: string) => {
    return api.post(`/reservations/${id}/checkout`);
  },
  findAvailableSpaces: (params: any) => {
    return api.get('/reservations/available', { params });
  },

  // Spaces
  getBuildings: (params?: any) => {
    return api.get('/buildings', { params });
  },
  getBuildingDetails: (id: string) => {
    return api.get(`/buildings/${id}`);
  },
  getFloors: (buildingId: string) => {
    return api.get(`/buildings/${buildingId}/floors`);
  },
  getFloorDetails: (id: string) => {
    return api.get(`/floors/${id}`);
  },
  getSpaces: (floorId: string, params?: any) => {
    return api.get(`/floors/${floorId}/spaces`, { params });
  },
  getSpaceDetails: (id: string) => {
    return api.get(`/spaces/${id}`);
  },
  getSpaceTypes: () => {
    return api.get('/spaces/types');
  },
  getAmenities: () => {
    return api.get('/amenities');
  },

  // User
  getUserProfile: () => {
    return api.get('/users/me');
  },
  updateUserProfile: (data: any) => {
    return api.put('/users/me', data);
  },
  getUserReservations: (params?: any) => {
    return api.get('/users/me/reservations', { params });
  },
  getTeams: () => {
    return api.get('/teams');
  },
  getTeamDetails: (id: string) => {
    return api.get(`/teams/${id}`);
  },
  getTeamMembers: (id: string) => {
    return api.get(`/teams/${id}/members`);
  },
  getTeamReservations: (id: string, params?: any) => {
    return api.get(`/teams/${id}/reservations`, { params });
  },
};
