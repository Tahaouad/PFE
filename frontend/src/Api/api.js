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

const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;   
  } catch (error) {
    throw error.response.data.message || 'Error logging in';
  }
};

export { createUser, loginUser };
