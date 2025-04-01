import API_CONFIG from '../config/api-config';

// Generate a random delay for mock responses
export const getRandomDelay = () => {
  return API_CONFIG.getRandomDelay();
};

// Format error messages from API responses
export const formatErrorMessage = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const data = error.response.data;
    if (data && data.message) {
      return data.message;
    }
    return `Error ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
  }
};

// Check if we should use mock data
export const shouldUseMockData = (error) => {
  if (!API_CONFIG.useMockFallback) {
    return false;
  }

  // Network errors or server errors should use mock data
  if (!error.response || error.response.status >= 500) {
    return true;
  }

  // For 4xx errors, we might want to show the actual error
  // But for demo purposes, we'll use mock data for all errors
  return true;
};

// Helper to add authentication to requests
export const addAuthToRequest = (options = {}) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return options;
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

// Log API requests in development
export const logApiRequest = (method, url, data) => {
  console.log(`API ${method}: ${url}`, data || '');
};

// Log API responses in development
export const logApiResponse = (method, url, response) => {
  console.log(`API ${method} Response: ${url}`, response);
};

// Log API errors in development
export const logApiError = (method, url, error) => {
  console.error(`API ${method} Error: ${url}`, error);
};
