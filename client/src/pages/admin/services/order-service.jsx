import API_CONFIG from '../../../config/api-config';
import {
  addAuthToRequest,
  logApiRequest,
  logApiResponse,
  logApiError,
} from '../../../utils/api-utils';
import MockOrderService from './mock-data-service';

// Base URL for orders API
const ORDERS_API_URL = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.orders}`;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || `Error: ${response.status} ${response.statusText}`;
    } catch (e) {
      errorMessage = `Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const OrderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString
        ? `${ORDERS_API_URL}?${queryString}`
        : ORDERS_API_URL;

      logApiRequest('GET', url);

      const response = await fetch(
        url,
        addAuthToRequest({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const data = await handleResponse(response);
      logApiResponse('GET', url, data);
      return data;
    } catch (error) {
      logApiError('GET', ORDERS_API_URL, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.getOrders(params);
      }

      throw error;
    }
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    try {
      const url = `${ORDERS_API_URL}/${id}`;
      logApiRequest('GET', url);

      const response = await fetch(
        url,
        addAuthToRequest({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const data = await handleResponse(response);
      logApiResponse('GET', url, data);
      return data;
    } catch (error) {
      logApiError('GET', `${ORDERS_API_URL}/${id}`, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.getOrderById(id);
      }

      throw error;
    }
  },

  // Create a new order
  createOrder: async (orderData) => {
    try {
      logApiRequest('POST', ORDERS_API_URL, orderData);

      const response = await fetch(
        ORDERS_API_URL,
        addAuthToRequest({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })
      );

      const data = await handleResponse(response);
      logApiResponse('POST', ORDERS_API_URL, data);
      return data;
    } catch (error) {
      logApiError('POST', ORDERS_API_URL, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.createOrder(orderData);
      }

      throw error;
    }
  },

  // Update an existing order
  updateOrder: async (id, orderData) => {
    try {
      const url = `${ORDERS_API_URL}/${id}`;
      logApiRequest('PUT', url, orderData);

      const response = await fetch(
        url,
        addAuthToRequest({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })
      );

      const data = await handleResponse(response);
      logApiResponse('PUT', url, data);
      return data;
    } catch (error) {
      logApiError('PUT', `${ORDERS_API_URL}/${id}`, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.updateOrder(id, orderData);
      }

      throw error;
    }
  },

  // Update just the status of an order
  updateOrderStatus: async (id, status) => {
    try {
      const url = `${ORDERS_API_URL}/${id}/status`;
      logApiRequest('PATCH', url, { status });

      const response = await fetch(
        url,
        addAuthToRequest({
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        })
      );

      const data = await handleResponse(response);
      logApiResponse('PATCH', url, data);
      return data;
    } catch (error) {
      logApiError('PATCH', `${ORDERS_API_URL}/${id}/status`, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.updateOrderStatus(id, status);
      }

      throw error;
    }
  },

  // Delete an order
  deleteOrder: async (id) => {
    try {
      const url = `${ORDERS_API_URL}/${id}`;
      logApiRequest('DELETE', url);

      const response = await fetch(
        url,
        addAuthToRequest({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      if (!response.ok) {
        throw new Error(`Failed to delete order ${id}`);
      }

      logApiResponse('DELETE', url, { success: true });
      return true;
    } catch (error) {
      logApiError('DELETE', `${ORDERS_API_URL}/${id}`, error);

      if (API_CONFIG.useMockFallback) {
        console.log('API request failed, using mock data as fallback');
        return MockOrderService.deleteOrder(id);
      }

      throw error;
    }
  },
};

export default OrderService;
