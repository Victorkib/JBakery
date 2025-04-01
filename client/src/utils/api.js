import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance with default config
const apiRequest = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add a request interceptor to include auth token
apiRequest.interceptors.request.use(
  (config) => {
    // Get token from cookies or localStorage
    const token = Cookies.get('authToken') || localStorage.getItem('authToken');

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Check if it's not a login or register request
      const isAuthRequest =
        error.config.url.includes('/login') ||
        error.config.url.includes('/register');

      if (!isAuthRequest) {
        // Clear tokens
        Cookies.remove('authToken');
        localStorage.removeItem('authToken');

        // Redirect to login page if not already there
        if (!window.location.pathname.includes('/auth')) {
          window.location.href =
            '/auth/login?message=' +
            encodeURIComponent(
              'Your session has expired. Please log in again.'
            );
        }
      }
    }

    // Handle server errors
    if (error.response && error.response.status === 500) {
      console.error('Server error:', error);
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

export default apiRequest;
