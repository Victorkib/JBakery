import { useState, useEffect } from 'react';
import {
  Camera,
  BarChart3,
  Users,
  ShoppingBag,
  Gift,
  Bell,
  Settings,
  Search,
  MessageSquare,
  LogOut,
  Calendar,
  Menu,
  X,
  ChevronDown,
  Cake,
  TrendingUp,
  Heart,
  CreditCard,
  Clock,
  PieChart,
} from 'lucide-react';
import { format } from 'date-fns';

// Main Dashboard Component
const JaybieCakeHouseCRM = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    totalCustomers: 324,
    activeOrders: 28,
    loyaltyMembers: 156,
    pendingDeliveries: 12,
    revenueThisMonth: 178500,
    totalOrders: 576,
  };

  // Mock data for customers
  const customers = [
    {
      id: 1,
      name: 'Jane Doe',
      phone: '+254712345678',
      email: 'jane.doe@example.com',
      loyaltyPoints: 240,
      birthday: '1990-05-15',
      address: 'Ngong Road, Nairobi',
      preferences: 'Chocolate, Vanilla',
      dietaryRestrictions: 'Gluten-free',
      totalOrders: 12,
      totalSpent: 15600,
      lastOrder: '2024-09-30',
      customerSince: '2022-03-14',
      profileImage: '/api/placeholder/80/80',
    },
    {
      id: 2,
      name: 'John Smith',
      phone: '+254723456789',
      email: 'john.smith@example.com',
      loyaltyPoints: 375,
      birthday: '1985-08-22',
      address: 'Westlands, Nairobi',
      preferences: 'Red Velvet, Cheesecake',
      dietaryRestrictions: 'None',
      totalOrders: 18,
      totalSpent: 24300,
      lastOrder: '2024-10-02',
      customerSince: '2021-12-02',
      profileImage: '/api/placeholder/80/80',
    },
    {
      id: 3,
      name: 'Mary Wanjiku',
      phone: '+254734567890',
      email: 'mary.wanjiku@example.com',
      loyaltyPoints: 120,
      birthday: '1992-11-07',
      address: 'South B, Nairobi',
      preferences: 'Carrot Cake, Black Forest',
      dietaryRestrictions: 'Dairy-free',
      totalOrders: 8,
      totalSpent: 8400,
      lastOrder: '2024-09-15',
      customerSince: '2023-01-30',
      profileImage: '/api/placeholder/80/80',
    },
  ];

  // Mock data for recent orders
  const recentOrders = [
    {
      id: 'ORD-2024-10-01',
      customerId: 2,
      customerName: 'John Smith',
      products: ['Birthday Cake (Chocolate)', 'Cupcakes (12)'],
      status: 'Pending',
      totalAmount: 3500,
      orderDate: '2024-10-02',
      deliveryDate: '2024-10-05',
      paymentStatus: 'Paid',
      deliveryAddress: 'Westlands, Nairobi',
      notes: 'Happy Birthday message on cake',
    },
    {
      id: 'ORD-2024-09-28',
      customerId: 1,
      customerName: 'Jane Doe',
      products: ['Wedding Cake (3-tier)', 'Macarons (24)'],
      status: 'In Progress',
      totalAmount: 12000,
      orderDate: '2024-09-30',
      deliveryDate: '2024-10-15',
      paymentStatus: 'Partial',
      deliveryAddress: 'Ngong Road, Nairobi',
      notes: 'Gluten-free cake, white and gold theme',
    },
    {
      id: 'ORD-2024-09-25',
      customerId: 3,
      customerName: 'Mary Wanjiku',
      products: ['Carrot Cake', 'Cookies (Assorted)'],
      status: 'Completed',
      totalAmount: 2200,
      orderDate: '2024-09-15',
      deliveryDate: '2024-09-18',
      paymentStatus: 'Paid',
      deliveryAddress: 'South B, Nairobi',
      notes: 'Dairy-free frosting',
    },
  ];

  // Mock data for analytics
  const salesData = [
    { month: 'Apr', amount: 89000 },
    { month: 'May', amount: 103000 },
    { month: 'Jun', amount: 118000 },
    { month: 'Jul', amount: 97000 },
    { month: 'Aug', amount: 145000 },
    { month: 'Sep', amount: 156000 },
    { month: 'Oct', amount: 178500 },
  ];

  const topProducts = [
    { name: 'Birthday Cakes', percentage: 35, amount: 62475 },
    { name: 'Wedding Cakes', percentage: 25, amount: 44625 },
    { name: 'Cupcakes', percentage: 15, amount: 26775 },
    { name: 'Custom Cakes', percentage: 15, amount: 26775 },
    { name: 'Cookies & Others', percentage: 10, amount: 17850 },
  ];

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-600 rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-800">
            Loading Jaybie Cake House CRM...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-purple-800 to-purple-900 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-700">
          <div
            className={`flex items-center ${
              !sidebarOpen && 'justify-center w-full'
            }`}
          >
            <Cake size={24} className="text-yellow-300" />
            {sidebarOpen && (
              <span className="ml-2 font-bold text-xl">Jaybie CRM</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`${
              !sidebarOpen && 'hidden'
            } text-purple-300 hover:text-white`}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-6">
          <div
            className={`${
              !sidebarOpen && 'flex flex-col items-center'
            } px-4 mb-8`}
          >
            <div
              className={`bg-purple-700 rounded-lg p-2 ${
                !sidebarOpen
                  ? 'w-12 h-12 flex items-center justify-center'
                  : 'flex items-center'
              }`}
            >
              <Search size={18} className="text-purple-300" />
              {sidebarOpen && (
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent border-none text-white placeholder-purple-300 ml-2 focus:outline-none w-full"
                  onChange={handleSearch}
                  value={searchQuery}
                />
              )}
            </div>
          </div>

          <ul>
            <li
              className={`mb-2 ${
                activeTab === 'dashboard' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <BarChart3 size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li>

            <li
              className={`mb-2 ${
                activeTab === 'customers' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <Users size={20} />
                {sidebarOpen && <span className="ml-3">Customers</span>}
              </button>
            </li>

            <li
              className={`mb-2 ${
                activeTab === 'orders' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <ShoppingBag size={20} />
                {sidebarOpen && <span className="ml-3">Orders</span>}
              </button>
            </li>

            <li
              className={`mb-2 ${
                activeTab === 'loyalty' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('loyalty')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <Gift size={20} />
                {sidebarOpen && <span className="ml-3">Loyalty Program</span>}
              </button>
            </li>

            <li
              className={`mb-2 ${
                activeTab === 'analytics' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <PieChart size={20} />
                {sidebarOpen && <span className="ml-3">Analytics</span>}
              </button>
            </li>

            <li
              className={`mb-2 ${
                activeTab === 'settings' ? 'bg-purple-700' : ''
              } rounded-r-lg transition-colors duration-200`}
            >
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center ${
                  !sidebarOpen ? 'justify-center' : ''
                } w-full py-3 px-4 hover:bg-purple-700 rounded-r-lg transition-colors duration-200`}
              >
                <Settings size={20} />
                {sidebarOpen && <span className="ml-3">Settings</span>}
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-purple-700">
          <button
            className={`flex items-center ${
              !sidebarOpen ? 'justify-center w-full' : ''
            } text-purple-300 hover:text-white`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mr-4 text-gray-600 hover:text-purple-600"
                >
                  <Menu size={24} />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-800">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'customers' && 'Customer Management'}
                {activeTab === 'orders' && 'Order Management'}
                {activeTab === 'loyalty' && 'Loyalty Program'}
                {activeTab === 'analytics' && 'Analytics & Reporting'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
                    <div className="p-3 border-b">
                      <h3 className="text-sm font-medium text-gray-700">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 border-b hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">
                          New Order Received
                        </p>
                        <p className="text-xs text-gray-500">
                          Order #ORD-2024-10-03 from Mary Wanjiku
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          10 minutes ago
                        </p>
                      </div>
                      <div className="p-3 border-b hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">
                          Pending Delivery
                        </p>
                        <p className="text-xs text-gray-500">
                          Order #ORD-2024-10-01 is due for delivery today
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">
                          Customer Birthday
                        </p>
                        <p className="text-xs text-gray-500">
                          Jane Doe{`'`}s birthday is tomorrow
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="p-2 border-t text-center">
                      <button className="text-xs text-purple-600 hover:text-purple-800">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-medium text-purple-800">JB</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@jaybie.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome to Jaybie Cake House CRM
                </h2>
                <p className="text-gray-600">
                  Here{`'`}s an overview of your business performance
                </p>
              </div>

              {/* Dashboard Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Customers
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.totalCustomers}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users size={20} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Active Orders
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.activeOrders}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <ShoppingBag size={20} className="text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+5%</span>
                    <span className="text-gray-500 ml-1">from last week</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Monthly Revenue
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        KSh {dashboardMetrics.revenueThisMonth.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard size={20} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+14%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Orders
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {order.orderDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            KSh {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-purple-600 hover:text-purple-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t text-center">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View All Orders
                  </button>
                </div>
              </div>

              {/* Sales Analytics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sales Analytics
                </h3>
                <div className="h-64 w-full">
                  {/* Placeholder for chart */}
                  <div className="flex items-end h-full w-full space-x-2">
                    {salesData.map((data, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="w-full bg-purple-500 rounded-t-md"
                          style={{ height: `${(data.amount / 200000) * 100}%` }}
                        ></div>
                        <p className="text-xs text-gray-600 mt-2">
                          {data.month}
                        </p>
                        <p className="text-xs font-medium">
                          {(data.amount / 1000).toFixed(0)}K
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Customer Management
                  </h2>
                  <p className="text-gray-600">
                    Manage your customer relationships
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-white rounded-md shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">Grid</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">List</span>
                      </div>
                    </button>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm">
                    <div className="flex items-center space-x-1">
                      <span>Add Customer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search customers by name, email, or phone..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        value={searchQuery}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-auto">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm w-full md:w-auto">
                      <div className="flex items-center space-x-1">
                        <span>Filter</span>
                        <ChevronDown size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                            <img
                              src={customer.profileImage}
                              alt={customer.name}
                              className="w-16 h-16 rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {customer.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {customer.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500">
                                Loyalty Points
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {customer.loyaltyPoints}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Total Orders
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {customer.totalOrders}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Last Order
                              </p>
                              <p className="text-sm font-medium text-gray-800">
                                {customer.lastOrder}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Loyalty Points
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Orders
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Order
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  src={customer.profileImage}
                                  alt={customer.name}
                                  className="h-10 w-10 rounded-full"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {customer.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.phone}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.loyaltyPoints}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.totalOrders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.lastOrder}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Customer Details Modal */}
              {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Customer Details
                      </h3>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:space-x-6">
                        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                          <div className="w-32 h-32 rounded-full mb-4">
                            <img
                              src={selectedCustomer.profileImage}
                              alt={selectedCustomer.name}
                              className="w-32 h-32 rounded-full"
                            />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {selectedCustomer.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Customer since {selectedCustomer.customerSince}
                          </p>
                          <div className="mt-4 flex items-center space-x-2">
                            <Heart size={18} className="text-red-500" />
                            <span className="text-sm font-medium">
                              {selectedCustomer.loyaltyPoints} Loyalty Points
                            </span>
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Contact Information
                              </h4>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">Phone:</span>{' '}
                                  {selectedCustomer.phone}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">Email:</span>{' '}
                                  {selectedCustomer.email}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">Address:</span>{' '}
                                  {selectedCustomer.address}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">Birthday:</span>{' '}
                                  {selectedCustomer.birthday}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Order Information
                              </h4>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">
                                    Total Orders:
                                  </span>{' '}
                                  {selectedCustomer.totalOrders}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">
                                    Last Order:
                                  </span>{' '}
                                  {selectedCustomer.lastOrder}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">
                                    Total Spent:
                                  </span>{' '}
                                  KSh{' '}
                                  {selectedCustomer.totalSpent.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">
                                Preferences
                              </h4>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">
                                    Favorite Products:
                                  </span>{' '}
                                  {selectedCustomer.preferences}
                                </p>
                                <p className="text-sm text-gray-800">
                                  <span className="font-medium">
                                    Dietary Restrictions:
                                  </span>{' '}
                                  {selectedCustomer.dietaryRestrictions}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">
                              Recent Orders
                            </h4>
                            <div className="bg-gray-50 rounded-md p-4">
                              <div className="space-y-4">
                                {recentOrders
                                  .filter(
                                    (order) =>
                                      order.customerId === selectedCustomer.id
                                  )
                                  .map((order) => (
                                    <div
                                      key={order.id}
                                      className="bg-white p-3 rounded-md shadow-sm"
                                    >
                                      <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-800">
                                          {order.id}
                                        </span>
                                        <span
                                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                                            order.status === 'Pending'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : order.status === 'In Progress'
                                              ? 'bg-blue-100 text-blue-800'
                                              : order.status === 'Completed'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-gray-100 text-gray-800'
                                          }`}
                                        >
                                          {order.status}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-1">
                                        Order Date: {order.orderDate}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Products: {order.products.join(', ')}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Amount: KSh{' '}
                                        {order.totalAmount.toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setOrderModalOpen(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                          New Order
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Order Management
                  </h2>
                  <p className="text-gray-600">
                    Track and manage customer orders
                  </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm">
                  New Order
                </button>
              </div>

              {/* Order Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search orders by ID, customer, or product..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex space-x-2">
                    <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm">
                      <div className="flex items-center space-x-1">
                        <span>Filter</span>
                        <ChevronDown size={16} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Products
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.products.map((product, idx) => (
                            <span key={idx} className="block">
                              {product}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.orderDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          KSh {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Loyalty Program Tab */}
          {activeTab === 'loyalty' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Loyalty Program
                </h2>
                <p className="text-gray-600">
                  Manage customer loyalty rewards and points
                </p>
              </div>

              {/* Loyalty Program Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Loyalty Members
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        {dashboardMetrics.loyaltyMembers}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Users size={20} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Points Earned This Month
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        12,450
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Gift size={20} className="text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+15%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Points Redeemed
                      </p>
                      <p className="text-2xl font-semibold text-gray-800">
                        4,280
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <ShoppingBag size={20} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">+5%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              </div>

              {/* Top Loyalty Members */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Top Loyalty Members
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Points
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Member Since
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Orders
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total Spent
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers
                        .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
                        .map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    src={customer.profileImage}
                                    alt={customer.name}
                                    className="h-10 w-10 rounded-full"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {customer.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-purple-600">
                                {customer.loyaltyPoints}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.customerSince}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.totalOrders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              KSh {customer.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-purple-600 hover:text-purple-900">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loyalty Rewards */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Loyalty Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">
                        Free Cupcake
                      </h4>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        50 Points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Redeem 50 points for a free cupcake of your choice.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">
                        10% Off Order
                      </h4>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        100 Points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Redeem 100 points for 10% off your next order.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">
                        Free Birthday Cake
                      </h4>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                        500 Points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Redeem 500 points for a free small birthday cake.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Analytics & Reporting
                </h2>
                <p className="text-gray-600">
                  Gain insights into your business performance
                </p>
              </div>

              {/* Sales Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sales Overview
                </h3>
                <div className="h-64 w-full">
                  <div className="flex items-end h-full w-full space-x-2">
                    {salesData.map((data, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className="w-full bg-purple-500 rounded-t-md"
                          style={{ height: `${(data.amount / 200000) * 100}%` }}
                        ></div>
                        <p className="text-xs text-gray-600 mt-2">
                          {data.month}
                        </p>
                        <p className="text-xs font-medium">
                          {(data.amount / 1000).toFixed(0)}K
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Top Products
                  </h3>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-800">
                            {product.name}
                          </span>
                          <span className="text-gray-600">
                            {product.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${product.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Customer Acquisition
                  </h3>
                  {/* Placeholder for customer acquisition chart */}
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <span className="text-gray-500">
                      Customer acquisition chart will be displayed here
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Status Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">
                      8
                    </div>
                    <p className="text-gray-600">Pending</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      12
                    </div>
                    <p className="text-gray-600">In Progress</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      18
                    </div>
                    <p className="text-gray-600">Completed</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-500 mb-2">
                      2
                    </div>
                    <p className="text-gray-600">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  System Settings
                </h2>
                <p className="text-gray-600">
                  Manage your CRM settings and preferences
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    General Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value="Jaybie Cake House"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Email
                      </label>
                      <input
                        type="email"
                        value="info@jaybiecakes.com"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Phone
                      </label>
                      <input
                        type="text"
                        value="+254 712 345 678"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <textarea
                        rows="3"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        defaultValue="Westlands, Nairobi, Kenya"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notification Settings
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Email Notifications
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive email notifications for new orders
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle1"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle1"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          SMS Notifications
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive SMS alerts for new orders
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle2"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          htmlFor="toggle2"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Order Status Updates
                        </p>
                        <p className="text-xs text-gray-500">
                          Receive notifications when order status changes
                        </p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="toggle3"
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          defaultChecked
                        />
                        <label
                          htmlFor="toggle3"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    User Management
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="font-medium text-purple-800">
                            JB
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Admin User
                          </p>
                          <p className="text-xs text-gray-500">
                            admin@jaybie.com
                          </p>
                        </div>
                      </div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Admin
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="font-medium text-gray-800">MC</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Manager User
                          </p>
                          <p className="text-xs text-gray-500">
                            manager@jaybie.com
                          </p>
                        </div>
                      </div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Manager
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="font-medium text-gray-800">CS</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Staff User
                          </p>
                          <p className="text-xs text-gray-500">
                            staff@jaybie.com
                          </p>
                        </div>
                      </div>
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Staff
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-sm">
                      Add New User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* New Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Order
              </h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={selectedCustomer ? selectedCustomer.name : ''}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Products
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Product</option>
                    <option value="birthday-cake">Birthday Cake</option>
                    <option value="wedding-cake">Wedding Cake</option>
                    <option value="cupcakes">Cupcakes</option>
                    <option value="cookies">Cookies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    rows="3"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Any special requests or instructions for this order..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t">
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Create Order
                </button>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JaybieCakeHouseCRM;
