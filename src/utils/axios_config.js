import axios from 'axios';

// Create a new Axios instance
const http = axios.create({
  baseURL: 'http://api.weatherapi.com/v1/',
});

export default http;