import { getRandomDelay } from '../../../utils/api-utils';

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD-1001',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+254 712 345 678',
    },
    date: '2024-03-20T10:30:00',
    items: [
      { id: 1, name: 'Red Velvet Cake', quantity: 1, price: 35.99 },
      { id: 2, name: 'Chocolate Cupcakes', quantity: 6, price: 18.0 },
    ],
    total: 53.99,
    status: 'pending',
    paymentMethod: 'card',
    deliveryAddress: '123 Main St, Nairobi',
    deliveryDate: '2024-03-22T14:00:00',
    specialInstructions: 'Please write "Happy Birthday Sarah!" on the cake',
  },
  {
    id: 'ORD-1002',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+254 723 456 789',
    },
    date: '2024-03-19T15:45:00',
    items: [
      { id: 3, name: 'Sourdough Bread', quantity: 2, price: 12.98 },
      { id: 4, name: 'Croissants', quantity: 4, price: 10.0 },
    ],
    total: 22.98,
    status: 'completed',
    paymentMethod: 'cash',
    deliveryAddress: 'Pickup in store',
    deliveryDate: '2024-03-19T17:30:00',
    specialInstructions: '',
  },
  {
    id: 'ORD-1003',
    customer: {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+254 734 567 890',
    },
    date: '2024-03-18T09:15:00',
    items: [
      { id: 5, name: 'Birthday Cake (Custom)', quantity: 1, price: 65.0 },
    ],
    total: 65.0,
    status: 'processing',
    paymentMethod: 'mpesa',
    deliveryAddress: '456 Park Avenue, Nairobi',
    deliveryDate: '2024-03-25T12:00:00',
    specialInstructions: 'Dairy-free cake with blue and white decorations',
  },
  {
    id: 'ORD-1004',
    customer: {
      name: 'Robert Williams',
      email: 'robert.w@example.com',
      phone: '+254 745 678 901',
    },
    date: '2024-03-17T14:20:00',
    items: [
      { id: 6, name: 'Assorted Pastries', quantity: 12, price: 36.0 },
      { id: 7, name: 'Coffee Cake', quantity: 1, price: 28.5 },
    ],
    total: 64.5,
    status: 'cancelled',
    paymentMethod: 'card',
    deliveryAddress: '789 Business Park, Nairobi',
    deliveryDate: '2024-03-18T10:00:00',
    specialInstructions: 'Office delivery - please call when arriving',
  },
  {
    id: 'ORD-1005',
    customer: {
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '+254 756 789 012',
    },
    date: '2024-03-21T11:00:00',
    items: [
      {
        id: 8,
        name: 'Chocolate Chip Cookies',
        quantity: 24,
        price: 18.0,
      },
      { id: 9, name: 'Blueberry Muffins', quantity: 6, price: 15.0 },
    ],
    total: 33.0,
    status: 'pending',
    paymentMethod: 'mpesa',
    deliveryAddress: 'Pickup in store',
    deliveryDate: '2024-03-21T16:00:00',
    specialInstructions: '',
  },
];

// In-memory store for mock data
let mockOrdersData = [...MOCK_ORDERS];

// Helper to simulate async API calls with random delay
const mockAsync = async (data) => {
  const delay = getRandomDelay();
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
};

// Filter orders based on query parameters
const filterOrders = (orders, params = {}) => {
  let filtered = [...orders];

  // Filter by status
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter((order) => order.status === params.status);
  }

  // Filter by search query
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower) ||
        order.customer.phone.toLowerCase().includes(searchLower)
    );
  }

  // Filter by date range
  if (params.dateFrom && params.dateTo) {
    const fromDate = new Date(params.dateFrom);
    const toDate = new Date(params.dateTo);
    toDate.setHours(23, 59, 59, 999); // Include the entire "to" day

    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= fromDate && orderDate <= toDate;
    });
  }

  // Filter by payment method
  if (params.paymentMethod) {
    const methods = Array.isArray(params.paymentMethod)
      ? params.paymentMethod
      : [params.paymentMethod];

    if (methods.length > 0) {
      filtered = filtered.filter((order) =>
        methods.includes(order.paymentMethod)
      );
    }
  }

  return filtered;
};

export const MockOrderService = {
  // Get all orders
  getOrders: async (params = {}) => {
    console.log('MOCK: Fetching orders with params:', params);
    const filtered = filterOrders(mockOrdersData, params);
    return mockAsync(filtered);
  },

  // Get a single order by ID
  getOrderById: async (id) => {
    console.log(`MOCK: Fetching order with ID: ${id}`);
    const order = mockOrdersData.find((order) => order.id === id);

    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return mockAsync(order);
  },

  // Create a new order
  createOrder: async (orderData) => {
    console.log('MOCK: Creating new order with data:', orderData);

    // Generate a new ID
    const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create the new order
    const newOrder = {
      ...orderData,
      id: newId,
      date: orderData.date || new Date().toISOString(),
      status: orderData.status || 'pending',
    };

    // Add to mock data
    mockOrdersData = [newOrder, ...mockOrdersData];

    return mockAsync(newOrder);
  },

  // Update an existing order
  updateOrder: async (id, orderData) => {
    console.log(`MOCK: Updating order ${id} with data:`, orderData);

    const index = mockOrdersData.findIndex((order) => order.id === id);

    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // Update the order
    const updatedOrder = {
      ...orderData,
      id: id, // Ensure ID doesn't change
    };

    mockOrdersData[index] = updatedOrder;

    return mockAsync(updatedOrder);
  },

  // Update just the status of an order
  updateOrderStatus: async (id, status) => {
    console.log(`MOCK: Updating status for order ${id} to ${status}`);

    const index = mockOrdersData.findIndex((order) => order.id === id);

    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // Update the status
    mockOrdersData[index] = {
      ...mockOrdersData[index],
      status: status,
    };

    return mockAsync(mockOrdersData[index]);
  },

  // Delete an order
  deleteOrder: async (id) => {
    console.log(`MOCK: Deleting order ${id}`);

    const index = mockOrdersData.findIndex((order) => order.id === id);

    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // Remove the order
    mockOrdersData = mockOrdersData.filter((order) => order.id !== id);

    return mockAsync(true);
  },

  // Reset mock data to initial state (useful for testing)
  resetMockData: () => {
    mockOrdersData = [...MOCK_ORDERS];
  },
};

export default MockOrderService;
