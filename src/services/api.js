import baseURL from './baseUrl.json';
import axios from 'axios';

const api = axios.create({
  baseURL: baseURL.baseUrl,
});

export default api;
