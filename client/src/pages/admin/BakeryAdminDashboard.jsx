'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  AreaChart,
  Area,
  LineChart,
} from 'recharts';
import {
  ChefHat,
  DollarSign,
  Gift,
  LayoutDashboard,
  MessageSquare,
  Package,
  PieChartIcon,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import ProductsComponent from '../../components/ProductsComponent/ProductsComponent';
import Customers from '../../components/customers/Customers';
import OrderManagement from './OrderManagement';
import ReportsPage from './ReportsPage';
import { useTheme } from '../../context/ThemeContext';

const BakeryAdminDashboard = () => {
  // State for various dashboard controls
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('week');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewOrder, setQuickViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Use theme context instead of local state
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Mock data for the dashboard
  const salesData = [
    { name: 'Mon', revenue: 1500, orders: 25, target: 1800 },
    { name: 'Tue', revenue: 2200, orders: 32, target: 2000 },
    { name: 'Wed', revenue: 1800, orders: 28, target: 2000 },
    { name: 'Thu', revenue: 2400, orders: 40, target: 2000 },
    { name: 'Fri', revenue: 2800, orders: 45, target: 2200 },
    { name: 'Sat', revenue: 3500, orders: 52, target: 3000 },
    { name: 'Sun', revenue: 3000, orders: 48, target: 2800 },
  ];

  const orderStatusData = [
    { name: 'Pending', value: 15, color: '#3b82f6' },
    { name: 'In Progress', value: 25, color: '#eab308' },
    { name: 'Completed', value: 45, color: '#22c55e' },
    { name: 'Cancelled', value: 5, color: '#ef4444' },
  ];

  const popularProducts = [
    {
      id: 1,
      name: 'Sourdough Bread',
      sales: 152,
      stock: 48,
      category: 'Bread',
      price: 6.99,
      img: '/placeholder.svg?height=100&width=100',
    },
    {
      id: 2,
      name: 'Chocolate Croissant',
      sales: 138,
      stock: 62,
      category: 'Pastry',
      price: 3.99,
      img: '/placeholder.svg?height=100&width=100',
    },
    {
      id: 3,
      name: 'Red Velvet Cake',
      sales: 125,
      stock: 15,
      category: 'Cake',
      price: 32.99,
      img: '/placeholder.svg?height=100&width=100',
    },
    {
      id: 4,
      name: 'Blueberry Muffin',
      sales: 112,
      stock: 73,
      category: 'Pastry',
      price: 2.99,
      img: '/placeholder.svg?height=100&width=100',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-7243',
      customer: 'Maya Johnson',
      total: 87.5,
      status: 'Pending',
      time: '10 mins ago',
      items: 5,
    },
    {
      id: '#ORD-7242',
      customer: 'Ethan Williams',
      total: 124.99,
      status: 'Completed',
      time: '25 mins ago',
      items: 3,
    },
    {
      id: '#ORD-7241',
      customer: 'Sophie Brown',
      total: 42.75,
      status: 'In Progress',
      time: '45 mins ago',
      items: 2,
    },
    {
      id: '#ORD-7240',
      customer: 'Oliver Davis',
      total: 159.95,
      status: 'Completed',
      time: '1 hour ago',
      items: 7,
    },
  ];

  const lowStockIngredients = [
    {
      id: 1,
      name: 'Organic Flour',
      current: 12,
      min: 20,
      unit: 'kg',
      supplier: 'Harvest Mills',
    },
    {
      id: 2,
      name: 'Unsalted Butter',
      current: 8,
      min: 15,
      unit: 'kg',
      supplier: 'Dairy Delights',
    },
    {
      id: 3,
      name: 'Vanilla Extract',
      current: 3,
      min: 5,
      unit: 'bottles',
      supplier: 'Flavor Essentials',
    },
  ];

  const upcomingDeliveries = [
    {
      id: 1,
      supplier: 'Harvest Mills',
      items: 'Organic Flour, Whole Wheat',
      date: 'Tomorrow, 9:00 AM',
    },
    {
      id: 2,
      supplier: 'Farm Fresh Eggs',
      items: 'Eggs, Milk',
      date: 'Feb 26, 10:30 AM',
    },
    {
      id: 3,
      supplier: 'Berry Farms',
      items: 'Strawberries, Blueberries',
      date: 'Feb 27, 8:00 AM',
    },
  ];

  const staffSchedule = [
    {
      id: 1,
      name: 'Elena Rodriguez',
      role: 'Head Baker',
      shift: '4:00 AM - 12:00 PM',
      status: 'Checked In',
    },
    {
      id: 2,
      name: 'James Kim',
      role: 'Pastry Chef',
      shift: '6:00 AM - 2:00 PM',
      status: 'Checked In',
    },
    {
      id: 3,
      name: 'Aisha Patel',
      role: 'Sales Associate',
      shift: '8:00 AM - 4:00 PM',
      status: 'Not Started',
    },
    {
      id: 4,
      name: 'Michael Chen',
      role: 'Delivery Driver',
      shift: '10:00 AM - 6:00 PM',
      status: 'Not Started',
    },
  ];

  const customerSegmentation = [
    { name: 'New', value: 30, color: '#60a5fa' },
    { name: 'Returning', value: 45, color: '#34d399' },
    { name: 'Loyal', value: 25, color: '#a78bfa' },
  ];

  // Performance metrics for new dashboard section
  const performanceMetrics = [
    { name: 'Jan', sales: 4000, profit: 2400, expenses: 1600 },
    { name: 'Feb', sales: 5000, profit: 3000, expenses: 2000 },
    { name: 'Mar', sales: 6000, profit: 3600, expenses: 2400 },
    { name: 'Apr', sales: 7000, profit: 4200, expenses: 2800 },
    { name: 'May', sales: 8000, profit: 4800, expenses: 3200 },
    { name: 'Jun', sales: 9000, profit: 5400, expenses: 3600 },
  ];

  // Quick filters for dashboard
  const dashboardFilters = [
    { id: 'all', name: 'All Data' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
  ];

  // Simulated load of notifications and alerts on component mount
  useEffect(() => {
    // Simulate API call
    setLoading(true);

    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'order',
          message: 'New special order request from Sarah Miller',
          time: '5 mins ago',
        },
        {
          id: 2,
          type: 'inventory',
          message: 'Organic Flour stock below threshold',
          time: '20 mins ago',
        },
        {
          id: 3,
          type: 'staff',
          message: 'James Kim requested time off next weekend',
          time: '45 mins ago',
        },
        {
          id: 4,
          type: 'customer',
          message: 'New review from Mark Thompson (4.5 stars)',
          time: '1 hour ago',
        },
      ]);

      setInventoryAlerts([
        { id: 1, ingredient: 'Organic Flour', current: 12, threshold: 20 },
        { id: 2, ingredient: 'Unsalted Butter', current: 8, threshold: 15 },
        { id: 3, ingredient: 'Vanilla Extract', current: 3, threshold: 5 },
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = useCallback(
    (status) => {
      switch (status) {
        case 'Pending':
          return isDarkMode
            ? 'bg-blue-900/30 text-blue-400'
            : 'bg-blue-100 text-blue-800';
        case 'In Progress':
          return isDarkMode
            ? 'bg-yellow-900/30 text-yellow-400'
            : 'bg-yellow-100 text-yellow-800';
        case 'Completed':
          return isDarkMode
            ? 'bg-green-900/30 text-green-400'
            : 'bg-green-100 text-green-800';
        case 'Cancelled':
          return isDarkMode
            ? 'bg-red-900/30 text-red-400'
            : 'bg-red-100 text-red-800';
        default:
          return isDarkMode
            ? 'bg-gray-700 text-gray-300'
            : 'bg-gray-100 text-gray-800';
      }
    },
    [isDarkMode]
  );

  const handleOrderClick = (order) => {
    setQuickViewOrder(order);
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
    };
  }, [salesData]);

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    // In a real app, you would fetch data based on the selected filter
    console.log(`Filter changed to: ${filterId}`);
  };

  // Refresh dashboard data
  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Export dashboard data
  const exportData = () => {
    // In a real app, you would generate and download a report
    console.log('Exporting dashboard data...');
  };

  // Main dashboard render
  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${isMenuCollapsed ? 'w-20' : 'w-64'} h-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* Bakery Logo */}
        <div
          className={`p-4 flex items-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-amber-600'
          } text-white`}
        >
          {!isMenuCollapsed && (
            <div className="mr-2">
              <ChefHat size={28} />
            </div>
          )}
          {!isMenuCollapsed && <h1 className="text-xl font-bold">JB Bakery</h1>}
          {isMenuCollapsed && <ChefHat size={28} className="mx-auto" />}
          <button
            className="ml-auto"
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            aria-label={isMenuCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isMenuCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul>
              {[
                {
                  id: 'dashboard',
                  label: 'Dashboard',
                  icon: <LayoutDashboard />,
                },
                { id: 'orders', label: 'Orders', icon: <ShoppingCart /> },
                { id: 'products', label: 'Products', icon: <ShoppingBag /> },
                { id: 'customers', label: 'Customers', icon: <Users /> },
                { id: 'reports', label: 'Reports', icon: <PieChartIcon /> },
                { id: 'inventory', label: 'Inventory', icon: <Package /> },
                { id: 'staff', label: 'Staff', icon: <Users /> },
                { id: 'promotions', label: 'Promotions', icon: <Gift /> },
                { id: 'settings', label: 'Settings', icon: <Settings /> },
              ].map((item) => (
                <li key={item.id} className="mb-2">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center py-3 px-4 w-full rounded-lg transition-colors ${
                      activeTab === item.id
                        ? isDarkMode
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    }`}
                    aria-current={activeTab === item.id ? 'page' : undefined}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!isMenuCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Profile */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex items-center`}
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!isMenuCollapsed && (
            <div className="ml-3">
              <p className="font-medium">{user?.name || 'Admin User'}</p>
              <p className="text-sm opacity-75">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className={`py-4 px-6 z-40 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm flex items-center justify-between`}
        >
          <div className="flex items-center">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          </div>

          {/* Search Bar */}
          <div
            className={`mx-4 flex-1 max-w-2xl ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            } rounded-lg flex items-center px-4`}
          >
            <input
              type="text"
              placeholder="Search for orders, products, customers..."
              className={`py-2 flex-1 ${
                isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
              } outline-none`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button className="ml-2" aria-label="Submit search">
              🔍
            </button>
          </div>

          <div className="flex items-center">
            {/* Quick Filters */}
            <div className="relative mr-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center py-2 px-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border`}
                aria-expanded={showFilters}
                aria-haspopup="true"
              >
                <Filter size={16} className="mr-2" />
                <span>Filter</span>
              </button>

              {showFilters && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                  role="menu"
                >
                  {dashboardFilters.map((filter) => (
                    <button
                      key={filter.id}
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        activeFilter === filter.id
                          ? isDarkMode
                            ? 'bg-gray-700 text-amber-400'
                            : 'bg-amber-50 text-amber-600'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleFilterChange(filter.id);
                        setShowFilters(false);
                      }}
                      role="menuitem"
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={refreshData}
              className={`mr-2 p-2 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
              } hover:opacity-80`}
              aria-label="Refresh data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={exportData}
              className={`mr-4 p-2 rounded-full ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
              } hover:opacity-80`}
              aria-label="Export data"
            >
              <Download size={18} />
            </button>

            {/* Date Range Selector */}
            <div className="mr-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`py-2 px-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border`}
                aria-label="Select date range"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`mr-4 p-2 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-expanded={showNotifications}
                aria-haspopup="true"
                aria-label="Notifications"
              >
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {notifications.length}
                </span>
                🔔
              </button>

              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-96 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-xl z-10`}
                  role="menu"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full ${
                              notification.type === 'order'
                                ? isDarkMode
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : 'bg-blue-100 text-blue-600'
                                : notification.type === 'inventory'
                                ? isDarkMode
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-yellow-100 text-yellow-600'
                                : notification.type === 'staff'
                                ? isDarkMode
                                  ? 'bg-purple-900/30 text-purple-400'
                                  : 'bg-purple-100 text-purple-600'
                                : isDarkMode
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {notification.type === 'order' ? (
                              <ShoppingBag size={16} />
                            ) : notification.type === 'inventory' ? (
                              <Package size={16} />
                            ) : notification.type === 'staff' ? (
                              <Users size={16} />
                            ) : (
                              <MessageSquare size={16} />
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <p
                              className={`${
                                isDarkMode ? 'text-gray-200' : 'text-gray-800'
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {notification.time}
                            </p>
                          </div>
                          <button
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Dismiss notification"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <button className="text-amber-500 hover:underline w-full text-center">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Revenue Summary
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <ArrowUpRight size={14} className="inline mr-1" />
                          +12.5%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-full ${
                            isDarkMode
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          <DollarSign size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold">
                            ${summaryStats.totalRevenue.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Total Revenue
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Order Summary
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <ArrowUpRight size={14} className="inline mr-1" />
                          +8.2%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-full ${
                            isDarkMode
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          <ShoppingCart size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold">
                            {summaryStats.totalOrders}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Total Orders
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Average Order
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-amber-900/30 text-amber-400'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <ArrowUpRight size={14} className="inline mr-1" />
                          +3.7%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-full ${
                            isDarkMode
                              ? 'bg-amber-900/30 text-amber-400'
                              : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          <DollarSign size={24} />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold">
                            ${summaryStats.avgOrderValue.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Avg. Order Value
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: 'Total Revenue',
                        value: '$15,245.89',
                        change: '+12.5%',
                        icon: <DollarSign className="text-green-500" />,
                        color: isDarkMode
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-green-50 text-green-500',
                      },
                      {
                        title: 'Orders Today',
                        value: '42',
                        change: '+8.1%',
                        icon: <ShoppingCart className="text-blue-500" />,
                        color: isDarkMode
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-blue-50 text-blue-500',
                      },
                      {
                        title: 'New Customers',
                        value: '18',
                        change: '+5.7%',
                        icon: <Users className="text-purple-500" />,
                        color: isDarkMode
                          ? 'bg-purple-900/30 text-purple-400'
                          : 'bg-purple-50 text-purple-500',
                      },
                      {
                        title: 'Inventory Alerts',
                        value: '3',
                        change: '-2',
                        icon: <AlertCircle className="text-amber-500" />,
                        color: isDarkMode
                          ? 'bg-amber-900/30 text-amber-400'
                          : 'bg-amber-50 text-amber-500',
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className={`${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-xl shadow-md p-6`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p
                              className={`${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              } text-sm font-medium`}
                            >
                              {stat.title}
                            </p>
                            <p
                              className={`mt-2 text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {stat.value}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span
                                className={`inline-flex items-center ${
                                  stat.change.startsWith('+')
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                }`}
                              >
                                {stat.change.startsWith('+') ? '↑' : '↓'}{' '}
                                {stat.change.replace('+', '').replace('-', '')}
                              </span>
                              <span
                                className={`ml-2 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                } text-sm`}
                              >
                                vs last week
                              </span>
                            </div>
                          </div>
                          <div className={`${stat.color} p-3 rounded-full`}>
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Performance Metrics */}
                  <div
                    className={`${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } rounded-xl shadow-md p-6`}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Performance Metrics
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            dateRange === 'month'
                              ? isDarkMode
                                ? 'bg-amber-900/30 text-amber-400'
                                : 'bg-amber-100 text-amber-600'
                              : isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          onClick={() => setDateRange('month')}
                        >
                          Monthly
                        </button>
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            dateRange === 'quarter'
                              ? isDarkMode
                                ? 'bg-amber-900/30 text-amber-400'
                                : 'bg-amber-100 text-amber-600'
                              : isDarkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          onClick={() => setDateRange('quarter')}
                        >
                          Quarterly
                        </button>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceMetrics}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                          />
                          <XAxis
                            dataKey="name"
                            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                          />
                          <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDarkMode
                                ? '#1f2937'
                                : '#ffffff',
                              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                              color: isDarkMode ? '#f9fafb' : '#111827',
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sales Chart and Order Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                      className={`lg:col-span-2 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Revenue Overview
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            className={`px-3 py-1 rounded ${
                              dateRange === 'week'
                                ? isDarkMode
                                  ? 'bg-amber-900/30 text-amber-400'
                                  : 'bg-amber-100 text-amber-600'
                                : isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => setDateRange('week')}
                          >
                            Week
                          </button>
                          <button
                            className={`px-3 py-1 rounded ${
                              dateRange === 'month'
                                ? isDarkMode
                                  ? 'bg-amber-900/30 text-amber-400'
                                  : 'bg-amber-100 text-amber-600'
                                : isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                            onClick={() => setDateRange('month')}
                          >
                            Month
                          </button>
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesData}>
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="name"
                              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                            />
                            <YAxis
                              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDarkMode
                                  ? '#1f2937'
                                  : '#ffffff',
                                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f9fafb' : '#111827',
                              }}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#f59e0b"
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                            <Line
                              type="monotone"
                              dataKey="target"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-6 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Order Status
                      </h3>
                      <div className="h-64 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={orderStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {orderStatusData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDarkMode
                                  ? '#1f2937'
                                  : '#ffffff',
                                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f9fafb' : '#111827',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {orderStatusData.map((status) => (
                          <div key={status.name} className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: status.color }}
                            ></div>
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {status.name}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {status.value} orders
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Popular Products and Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Popular Products
                        </h3>
                        <button
                          className={`text-sm ${
                            isDarkMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-800'
                          }`}
                        >
                          View All
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr
                              className={`${
                                isDarkMode
                                  ? 'border-gray-700'
                                  : 'border-gray-200'
                              } border-b`}
                            >
                              <th
                                className={`pb-3 text-left ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                Product
                              </th>
                              <th
                                className={`pb-3 text-right ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                Sales
                              </th>
                              <th
                                className={`pb-3 text-right ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                Stock
                              </th>
                              <th
                                className={`pb-3 text-right ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {popularProducts.map((product) => (
                              <tr
                                key={product.id}
                                className={`${
                                  isDarkMode
                                    ? 'border-gray-700'
                                    : 'border-gray-200'
                                } border-b`}
                              >
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <img
                                      src={product.img || '/placeholder.svg'}
                                      alt={product.name}
                                      className="h-10 w-10 rounded object-cover mr-3"
                                    />
                                    <div>
                                      <p
                                        className={`font-medium ${
                                          isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-900'
                                        }`}
                                      >
                                        {product.name}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }`}
                                      >
                                        {product.category}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 text-right">
                                  {product.sales}
                                </td>
                                <td className="py-3 text-right">
                                  <span
                                    className={
                                      product.stock < 20 ? 'text-red-500' : ''
                                    }
                                  >
                                    {product.stock}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  ${product.price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Recent Orders
                        </h3>
                        <button
                          className={`text-sm ${
                            isDarkMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-800'
                          }`}
                        >
                          View All
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-96">
                        {recentOrders.map((order) => (
                          <div
                            key={order.id}
                            className={`p-4 mb-4 rounded-lg ${
                              isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-gray-50 hover:bg-gray-100'
                            } cursor-pointer transition`}
                            onClick={() => handleOrderClick(order)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p
                                  className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}
                                >
                                  {order.id}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDarkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {order.customer}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-bold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}
                                >
                                  ${order.total.toFixed(2)}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDarkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {order.items} items
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                              <span
                                className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {order.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Inventory Alerts, Customer Insights and Staff */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Inventory Alerts
                        </h3>
                        <button
                          className={`text-sm ${
                            isDarkMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-800'
                          }`}
                        >
                          View All
                        </button>
                      </div>
                      {lowStockIngredients.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 mb-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-red-50'
                          } flex justify-between items-center`}
                        >
                          <div>
                            <div className="flex items-center">
                              <AlertCircle
                                size={16}
                                className="text-red-500 mr-2"
                              />
                              <p
                                className={`font-medium ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {item.name}
                              </p>
                            </div>
                            <p
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              } mt-1`}
                            >
                              {item.current} {item.unit} remaining (Min:{' '}
                              {item.min})
                            </p>
                          </div>
                          <div>
                            <button className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors">
                              Reorder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-6 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Customer Segments
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={customerSegmentation}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {customerSegmentation.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: isDarkMode
                                  ? '#1f2937'
                                  : '#ffffff',
                                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                                color: isDarkMode ? '#f9fafb' : '#111827',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {customerSegmentation.map((segment) => (
                          <div key={segment.name} className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: segment.color }}
                            ></div>
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}
                              >
                                {segment.name}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {segment.value}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className={`mt-4 pt-4 border-t ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            >
                              Total Customers
                            </p>
                            <p
                              className={`text-lg font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              1,248
                            </p>
                          </div>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            >
                              Growth
                            </p>
                            <p className="text-lg font-bold text-green-500">
                              +12.5%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl shadow-md p-6`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          Staff Schedule Today
                        </h3>
                        <button
                          className={`text-sm ${
                            isDarkMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-800'
                          }`}
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {staffSchedule.map((staff) => (
                          <div
                            key={staff.id}
                            className={`p-3 rounded-lg ${
                              staff.status === 'Checked In'
                                ? isDarkMode
                                  ? 'bg-green-900/30'
                                  : 'bg-green-50'
                                : isDarkMode
                                ? 'bg-gray-700'
                                : 'bg-gray-50'
                            } flex justify-between items-center`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                  staff.status === 'Checked In'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {staff.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div className="ml-3">
                                <p
                                  className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}
                                >
                                  {staff.name}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDarkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {staff.role}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-sm font-medium ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                              >
                                {staff.shift}
                              </p>
                              <p
                                className={`text-xs ${
                                  staff.status === 'Checked In'
                                    ? 'text-green-500'
                                    : isDarkMode
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {staff.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && <ProductsComponent theme={theme} />}
              {activeTab === 'customers' && <Customers theme={theme} />}
              {activeTab === 'orders' && <OrderManagement theme={theme} />}
              {activeTab === 'inventory' && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">
                    Inventory Management
                  </h2>
                  <p>Inventory management interface will be displayed here.</p>
                </div>
              )}
              {activeTab === 'staff' && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Staff Management</h2>
                  <p>Staff management interface will be displayed here.</p>
                </div>
              )}
              {activeTab === 'reports' && <ReportsPage theme={theme} />}
              {activeTab === 'promotions' && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Promotions</h2>
                  <p>Promotions interface will be displayed here.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Settings</h2>
                  <p>Settings interface will be displayed here.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BakeryAdminDashboard;
