'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ShoppingBag,
  Calendar,
  Clock,
  User,
  MapPin,
  CreditCard,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';
import { OrderService } from './services/order-service';
import OrderForm from '../../components/orders/order-form';
import ConfirmDialog from '../../components/orders/confirm-dialog';

const OrderManagement = ({ theme }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [paymentMethodFilters, setPaymentMethodFilters] = useState({
    card: false,
    mpesa: false,
    cash: false,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getOrders();
      if (data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');

      // Fallback to mock data for demo purposes
      setTimeout(() => {
        setOrders([
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
            specialInstructions:
              'Please write "Happy Birthday Sarah!" on the cake',
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
              {
                id: 5,
                name: 'Birthday Cake (Custom)',
                quantity: 1,
                price: 65.0,
              },
            ],
            total: 65.0,
            status: 'processing',
            paymentMethod: 'mpesa',
            deliveryAddress: '456 Park Avenue, Nairobi',
            deliveryDate: '2024-03-25T12:00:00',
            specialInstructions:
              'Dairy-free cake with blue and white decorations',
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
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters to orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day

      if (orderDate < fromDate || orderDate > toDate) {
        return false;
      }
    }

    // Payment method filter
    const activePaymentFilters = Object.entries(paymentMethodFilters)
      .filter(([_, isActive]) => isActive)
      .map(([method]) => method);

    if (
      activePaymentFilters.length > 0 &&
      !activePaymentFilters.includes(order.paymentMethod)
    ) {
      return false;
    }

    // Search query
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query) ||
      order.customer.phone.toLowerCase().includes(query)
    );
  });

  // Create a new order
  const handleCreateOrder = async (orderData) => {
    setActionLoading(true);
    try {
      const newOrder = await OrderService.createOrder(orderData);
      setOrders([newOrder, ...orders]);
      setIsCreating(false);
      showNotification('Order created successfully!', 'success');
    } catch (err) {
      console.error('Failed to create order:', err);
      showNotification('Failed to create order. Please try again.', 'error');

      // For demo purposes, create a mock order with a generated ID
      const newOrder = {
        ...orderData,
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setOrders([newOrder, ...orders]);
      setIsCreating(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing order
  const handleUpdateOrder = async (orderData) => {
    setActionLoading(true);
    try {
      const updatedOrder = await OrderService.updateOrder(
        orderData.id,
        orderData
      );
      setOrders(
        orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      setIsEditing(false);
      setSelectedOrder(updatedOrder);
      showNotification('Order updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update order:', err);
      showNotification('Failed to update order. Please try again.', 'error');

      // For demo purposes, update the order locally
      const updatedOrder = { ...orderData };
      setOrders(
        orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      setIsEditing(false);
      setSelectedOrder(updatedOrder);
    } finally {
      setActionLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      showNotification(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update order status:', err);
      showNotification(
        'Failed to update order status. Please try again.',
        'error'
      );

      // For demo purposes, update the status locally
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  // Delete an order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    setActionLoading(true);
    try {
      await OrderService.deleteOrder(orderToDelete.id);
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));

      if (selectedOrder && selectedOrder.id === orderToDelete.id) {
        setSelectedOrder(null);
      }

      showNotification('Order deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete order:', err);
      showNotification('Failed to delete order. Please try again.', 'error');

      // For demo purposes, delete the order locally
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));

      if (selectedOrder && selectedOrder.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
    } finally {
      setActionLoading(false);
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  // Handle filter changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handlePaymentMethodFilterChange = (method) => {
    setPaymentMethodFilters({
      ...paymentMethodFilters,
      [method]: !paymentMethodFilters[method],
    });
  };

  const applyFilters = () => {
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setDateRange({ from: '', to: '' });
    setPaymentMethodFilters({
      card: false,
      mpesa: false,
      cash: false,
    });
    setSearchQuery('');
    setFilterOpen(false);
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Export order to CSV
  const exportOrdersToCSV = () => {
    // Create CSV header
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Order Date',
      'Total',
      'Status',
      'Payment Method',
      'Delivery Address',
      'Delivery Date',
      'Special Instructions',
    ].join(',');

    // Create CSV rows
    const rows = filteredOrders.map((order) => {
      return [
        order.id,
        `"${order.customer.name}"`,
        `"${order.customer.email}"`,
        `"${order.customer.phone}"`,
        new Date(order.date).toLocaleString(),
        order.total.toFixed(2),
        order.status,
        order.paymentMethod,
        `"${order.deliveryAddress}"`,
        new Date(order.deliveryDate).toLocaleString(),
        `"${order.specialInstructions}"`,
      ].join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\n');

    // Create a blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `orders_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    if (theme === 'dark') {
      switch (status) {
        case 'pending':
          return 'bg-yellow-900/30 text-yellow-400';
        case 'processing':
          return 'bg-blue-900/30 text-blue-400';
        case 'completed':
          return 'bg-green-900/30 text-green-400';
        case 'cancelled':
          return 'bg-red-900/30 text-red-400';
        default:
          return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'processing':
          return 'bg-blue-100 text-blue-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <AlertCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  // Render notification
  const renderNotification = () => {
    if (!notification) return null;

    const bgColor =
      notification.type === 'success'
        ? theme === 'dark'
          ? 'bg-green-900/80'
          : 'bg-green-100'
        : theme === 'dark'
        ? 'bg-red-900/80'
        : 'bg-red-100';

    const textColor =
      notification.type === 'success'
        ? theme === 'dark'
          ? 'text-green-300'
          : 'text-green-800'
        : theme === 'dark'
        ? 'text-red-300'
        : 'text-red-800';

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md ${bgColor} ${textColor} flex items-center`}
      >
        {notification.type === 'success' ? (
          <CheckCircle size={20} className="mr-2" />
        ) : (
          <AlertCircle size={20} className="mr-2" />
        )}
        <span>{notification.message}</span>
        <button
          onClick={() => setNotification(null)}
          className="ml-4 text-current hover:text-opacity-80"
        >
          <X size={16} />
        </button>
      </motion.div>
    );
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {renderNotification()}

      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          Order Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportOrdersToCSV()}
            className={`px-3 py-2 rounded-md flex items-center ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className={`px-3 py-2 rounded-md flex items-center ${
              theme === 'dark'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-amber-600 hover:bg-amber-700'
            } text-white`}
          >
            <Plus size={16} className="mr-2" />
            New Order
          </button>
        </div>
      </div>

      <div
        className={`rounded-lg shadow-md overflow-hidden ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Search and filter bar */}
        <div
          className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } flex flex-col sm:flex-row gap-4`}
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
              />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } rounded-md focus:outline-none focus:ring-2`}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              } rounded-md focus:outline-none focus:ring-2`}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`px-4 py-2 border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                    : 'border-gray-300 hover:bg-gray-50'
                } rounded-md flex items-center gap-2`}
              >
                <Filter
                  size={18}
                  className={
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }
                />
                More Filters
              </button>

              {filterOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  } rounded-md shadow-lg z-10 p-4 border`}
                >
                  <h3
                    className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Date Range
                  </h3>
                  <div className="space-y-2 mb-4">
                    <input
                      type="date"
                      name="from"
                      value={dateRange.from}
                      onChange={handleDateRangeChange}
                      className={`w-full px-3 py-2 border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      } rounded-md`}
                      placeholder="From"
                    />
                    <input
                      type="date"
                      name="to"
                      value={dateRange.to}
                      onChange={handleDateRangeChange}
                      className={`w-full px-3 py-2 border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'border-gray-300'
                      } rounded-md`}
                      placeholder="To"
                    />
                  </div>

                  <h3
                    className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Payment Method
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={paymentMethodFilters.card}
                        onChange={() => handlePaymentMethodFilterChange('card')}
                        className={`rounded ${
                          theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
                        } mr-2`}
                      />
                      <span
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Card
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={paymentMethodFilters.mpesa}
                        onChange={() =>
                          handlePaymentMethodFilterChange('mpesa')
                        }
                        className={`rounded ${
                          theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
                        } mr-2`}
                      />
                      <span
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        M-Pesa
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={paymentMethodFilters.cash}
                        onChange={() => handlePaymentMethodFilterChange('cash')}
                        className={`rounded ${
                          theme === 'dark' ? 'text-amber-500' : 'text-amber-600'
                        } mr-2`}
                      />
                      <span
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Cash
                      </span>
                    </label>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={resetFilters}
                      className={`px-3 py-1.5 text-sm ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyFilters}
                      className={`px-4 py-2 ${
                        theme === 'dark'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      } text-white rounded-md text-sm`}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="p-8 text-center">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                theme === 'dark' ? 'border-amber-500' : 'border-amber-500'
              } mx-auto`}
            ></div>
            <p
              className={`mt-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Loading orders...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle
              size={48}
              className={`${
                theme === 'dark' ? 'text-red-400' : 'text-red-500'
              } mx-auto mb-4`}
            />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {error}
            </p>
            <button
              onClick={fetchOrders}
              className={`mt-4 px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              } text-white rounded-md`}
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag
              size={48}
              className={`${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              } mx-auto mb-4`}
            />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              No orders found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead
                className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
              >
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    } uppercase tracking-wider`}
                  >
                    Delivery
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  theme === 'dark'
                    ? 'divide-gray-700 bg-gray-800'
                    : 'divide-gray-200 bg-white'
                }`}
              >
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                        } cursor-pointer`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } cursor-pointer`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        {order.customer.name}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {order.customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {new Date(order.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        ${order.total.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {order.items.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {order.deliveryAddress === 'Pickup in store'
                          ? 'Pickup'
                          : 'Delivery'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className={`${
                            theme === 'dark'
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-800'
                          }`}
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className={`${
                            theme === 'dark'
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditing(true);
                          }}
                          title="Edit Order"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={`${
                            theme === 'dark'
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                          onClick={() => {
                            setOrderToDelete(order);
                            setDeleteConfirmOpen(true);
                          }}
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order details modal */}
      {selectedOrder && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`p-6 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } flex justify-between items-center`}
            >
              <div>
                <h2
                  className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Order {selectedOrder.id}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1 capitalize">
                    {selectedOrder.status}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className={`p-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Edit Order"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <User
                    className={`${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                    } mt-1`}
                    size={20}
                  />
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Customer
                    </h4>
                    <p
                      className={
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }
                    >
                      {selectedOrder.customer.name}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {selectedOrder.customer.email}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {selectedOrder.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar
                    className={`${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                    } mt-1`}
                    size={20}
                  />
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Order Date
                    </h4>
                    <p
                      className={
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }
                    >
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {new Date(selectedOrder.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className={`${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                    } mt-1`}
                    size={20}
                  />
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Delivery Information
                    </h4>
                    <p
                      className={
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }
                    >
                      {selectedOrder.deliveryAddress}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {new Date(
                        selectedOrder.deliveryDate
                      ).toLocaleDateString()}{' '}
                      at{' '}
                      {new Date(selectedOrder.deliveryDate).toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard
                    className={`${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
                    } mt-1`}
                    size={20}
                  />
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Payment Method
                    </h4>
                    <p
                      className={
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }
                    >
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div
                  className={`mb-6 p-4 rounded-md ${
                    theme === 'dark'
                      ? 'bg-amber-900/20 border-amber-800'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <h4
                    className={`font-medium ${
                      theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
                    } mb-2`}
                  >
                    Special Instructions
                  </h4>
                  <p
                    className={
                      theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
                    }
                  >
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h4
                  className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } mb-4`}
                >
                  Order Items
                </h4>
                <div
                  className={`rounded-md overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead
                      className={
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }
                    >
                      <tr>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          } uppercase tracking-wider`}
                        >
                          Item
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          } uppercase tracking-wider`}
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          } uppercase tracking-wider`}
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                          } uppercase tracking-wider`}
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        theme === 'dark'
                          ? 'divide-gray-700 bg-gray-800'
                          : 'divide-gray-200 bg-white'
                      }`}
                    >
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-500'
                            }`}
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-500'
                            }`}
                          >
                            ${item.price.toFixed(2)}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot
                      className={
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }
                    >
                      <tr>
                        <td
                          colSpan="3"
                          className={`px-6 py-4 text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } text-right`}
                        >
                          Total
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          ${selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div
                className={`border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } pt-6`}
              >
                <h4
                  className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  } mb-4`}
                >
                  Update Order Status
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, 'pending')
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedOrder.status === 'pending'
                        ? theme === 'dark'
                          ? 'bg-yellow-900/30 text-yellow-400 border-2 border-yellow-700'
                          : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-yellow-900/20 hover:text-yellow-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-yellow-50 hover:text-yellow-800'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, 'processing')
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedOrder.status === 'processing'
                        ? theme === 'dark'
                          ? 'bg-blue-900/30 text-blue-400 border-2 border-blue-700'
                          : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-blue-900/20 hover:text-blue-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, 'completed')
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedOrder.status === 'completed'
                        ? theme === 'dark'
                          ? 'bg-green-900/30 text-green-400 border-2 border-green-700'
                          : 'bg-green-100 text-green-800 border-2 border-green-300'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-green-900/20 hover:text-green-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-green-50 hover:text-green-800'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, 'cancelled')
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedOrder.status === 'cancelled'
                        ? theme === 'dark'
                          ? 'bg-red-900/30 text-red-400 border-2 border-red-700'
                          : 'bg-red-100 text-red-800 border-2 border-red-300'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-red-900/20 hover:text-red-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-800'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={`px-4 py-2 border ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } rounded-md`}
                >
                  Close
                </button>
                <button
                  className={`px-4 py-2 ${
                    theme === 'dark'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white rounded-md`}
                >
                  Print Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create/Edit Order Form Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`p-6 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } flex justify-between items-center`}
            >
              <h2
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {isEditing ? 'Edit Order' : 'Create New Order'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className={
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <OrderForm
                order={isEditing ? selectedOrder : null}
                onSubmit={isEditing ? handleUpdateOrder : handleCreateOrder}
                onCancel={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                theme={theme}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order ${
          orderToDelete ? orderToDelete.id : ''
        }? This action cannot be undone.`}
        theme={theme}
      />
    </div>
  );
};

export default OrderManagement;
