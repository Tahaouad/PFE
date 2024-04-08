import axios from 'axios';

const API_URL = 'http://localhost:3000'; 


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const createUser = async (userData) => {
  try {
    const response = await api.post('/user', userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Error creating user';
  }
};

const getUserInfo = async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error.response.data.message || 'Error getting user information';
    }
  };

const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;   
  } catch (error) {
    throw error.response.data.message || 'Error logging in';
  }
};

const logoutUser = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        throw error.response.data.message || 'Error logging out';
    }
};

export { createUser, loginUser ,getUserInfo,logoutUser};
