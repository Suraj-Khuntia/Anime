import axios from 'axios';

// Vite proxy forwards /api to http://localhost:5000/api in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests if present
apiClient.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('anipulse_admin_token');
    const userToken = localStorage.getItem('anipulse_user_token');

    // 1. User routes under /auth/user/... must ALWAYS use userToken
    if (config.url && (config.url.includes('/auth/user') || config.url.startsWith('/auth/user'))) {
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    }
    // 2. Admin routes must use adminToken
    else if (config.url && (config.url.includes('/admin') || config.url.startsWith('/anime/admin') || config.url.includes('/sync'))) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    }
    // 3. Fallback
    else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin Auth endpoints
export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getAdminMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const updateAdminPassword = async (payload) => {
  const response = await apiClient.put('/auth/password', payload);
  return response.data;
};

// Regular User Auth endpoints
export const registerUser = async (data) => {
  const response = await apiClient.post('/auth/user/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await apiClient.post('/auth/user/login', data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await apiClient.post('/auth/user/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await apiClient.post('/auth/user/reset-password', data);
  return response.data;
};

export const getUserMe = async () => {
  const userToken = localStorage.getItem('anipulse_user_token');
  const response = await apiClient.get('/auth/user/me', {
    headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
  });
  return response.data;
};

export const updateUserProfile = async (data) => {
  const userToken = localStorage.getItem('anipulse_user_token');
  const response = await apiClient.put('/auth/user/profile', data, {
    headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
  });
  return response.data;
};

export const changeUserPassword = async (data) => {
  const userToken = localStorage.getItem('anipulse_user_token');
  const response = await apiClient.put('/auth/user/password', data, {
    headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
  });
  return response.data;
};

// Anime endpoints
export const getAnimeList = async (params = {}) => {
  const response = await apiClient.get('/anime', { params });
  return response.data;
};

export const getAnimeById = async (id) => {
  const response = await apiClient.get(`/anime/${id}`);
  return response.data;
};

export const createAnime = async (data) => {
  const response = await apiClient.post('/anime', data);
  return response.data;
};

export const updateAnime = async (id, data) => {
  const response = await apiClient.put(`/anime/${id}`, data);
  return response.data;
};

export const deleteAnime = async (id) => {
  const response = await apiClient.delete(`/anime/${id}`);
  return response.data;
};

// Episode endpoints
export const getAnimeEpisodes = async (id) => {
  const response = await apiClient.get(`/anime/${id}/episodes`);
  return response.data;
};

export const getEpisode = async (id, episodeNumber) => {
  const response = await apiClient.get(`/anime/${id}/episodes/${episodeNumber}`);
  return response.data;
};

export const createEpisode = async (animeId, data) => {
  const response = await apiClient.post(`/anime/${animeId}/episodes`, data);
  return response.data;
};

export const updateEpisode = async (animeId, episodeNumber, data) => {
  const response = await apiClient.put(`/anime/${animeId}/episodes/${episodeNumber}`, data);
  return response.data;
};

export const deleteEpisode = async (animeId, episodeNumber) => {
  const response = await apiClient.delete(`/anime/${animeId}/episodes/${episodeNumber}`);
  return response.data;
};

// Trending & Genres
export const getTrendingAnime = async (limit = 10) => {
  const response = await apiClient.get('/anime/trending', { params: { limit } });
  return response.data;
};

export const getGenres = async () => {
  const response = await apiClient.get('/genres');
  return response.data;
};

export const createGenre = async (name) => {
  const response = await apiClient.post('/genres', { name });
  return response.data;
};

export const updateGenre = async (id, name) => {
  const response = await apiClient.put(`/genres/${id}`, { name });
  return response.data;
};

export const deleteGenre = async (id) => {
  const response = await apiClient.delete(`/genres/${id}`);
  return response.data;
};

// Admin stats
export const getAdminStats = async () => {
  const response = await apiClient.get('/anime/admin/stats');
  return response.data;
};

// Sync service
export const triggerDataSync = async () => {
  const response = await apiClient.post('/sync');
  return response.data;
};

export const getSyncLogs = async () => {
  const response = await apiClient.get('/sync/logs');
  return response.data;
};

export default apiClient;
