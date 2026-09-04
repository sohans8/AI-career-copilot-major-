import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://career-copilot-api-9591.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/api/v1/health');
    return response.data;
  } catch (error) {
    console.error('API Health Check Error:', error);
    throw error;
  }
};

export const getRecommendations = async (profileData) => {
  try {
    const payload = {
      name: profileData.name || 'Student',
      subjects: profileData.subjects || [],
      skills: profileData.skills || [],
      interests: profileData.interests || [],
    };
    const response = await api.post('/api/v1/recommend', payload);
    return response.data;
  } catch (error) {
    console.error('API Recommendation Error:', error);
    throw error;
  }
};

export default api;
