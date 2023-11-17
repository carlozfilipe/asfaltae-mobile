import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.18.47.33:3333',
  //baseURL: 'http://192.168.100.2:3333',
});

export default api;