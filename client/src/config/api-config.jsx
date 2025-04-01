// API configuration
const API_CONFIG = {
  // Base API URL - can be overridden by environment variables
  baseUrl: 'http://localhost:5000/api',

  // API endpoints
  endpoints: {
    orders: '/orders',
    customers: '/customers',
    products: '/products',
  },

  // Request timeout in milliseconds
  timeout: 15000,

  // Whether to use mock data as fallback
  useMockFallback: true,

  // Delay for mock responses (in milliseconds)
  mockDelay: {
    min: 300, // Minimum delay
    max: 1200, // Maximum delay
  },

  // Get a random delay within the configured range
  getRandomDelay: function () {
    const { min, max } = this.mockDelay;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

export default API_CONFIG;
