import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
