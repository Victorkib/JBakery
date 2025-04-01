'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  FilePlus,
  RefreshCw,
  Database,
  MessageSquare,
  Trash2,
  Edit,
  Eye,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingCart,
  UserPlus,
  Zap,
  Award,
  Heart,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Table,
  Input,
  Select,
  Popconfirm,
  DatePicker,
  Timeline,
  Tag,
  Badge,
  Empty,
} from 'antd';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent } from '../../ui/card';

// Mock data
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    joined: '2024-12-10',
    orders: 5,
    spent: 249.95,
    status: 'Active',
    lastOrder: '2025-03-10',
    address: '123 Main St, New York, NY 10001',
    avatar: '/placeholder.svg?height=40&width=40',
    notes: 'Prefers email communication',
    tags: ['Loyal', 'High Value'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    joined: '2025-01-15',
    orders: 3,
    spent: 189.97,
    status: 'Active',
    lastOrder: '2025-03-05',
    address: '456 Oak Ave, Chicago, IL 60611',
    avatar: '/placeholder.svg?height=40&width=40',
    notes: '',
    tags: ['New'],
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '(555) 456-7890',
    joined: '2025-02-05',
    orders: 2,
    spent: 99.98,
    status: 'Active',
    lastOrder: '2025-02-28',
    address: '789 Pine Blvd, Los Angeles, CA 90001',
    avatar: '/placeholder.svg?height=40&width=40',
    notes: 'Interested in office supplies',
    tags: ['New'],
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '(555) 234-5678',
    joined: '2025-02-20',
    orders: 4,
    spent: 159.96,
    status: 'Active',
    lastOrder: '2025-03-12',
    address: '321 Maple Dr, Houston, TX 77001',
    avatar: '/placeholder.svg?height=40&width=40',
    notes: '',
    tags: ['Repeat'],
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael.w@example.com',
    phone: '(555) 876-5432',
    joined: '2025-03-01',
    orders: 1,
    spent: 179.98,
    status: 'Inactive',
    lastOrder: '2025-03-01',
    address: '654 Cedar St, Phoenix, AZ 85001',
    avatar: '/placeholder.svg?height=40&width=40',
    notes: 'Requested product catalog',
    tags: ['New'],
  },
];

// Date formatter
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Customers Component
const Customers = ({ theme }) => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success',
  });
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isViewCustomerModalOpen, setIsViewCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [bulkSelected, setBulkSelected] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
    tags: ['New'],
    notes: '',
  });

  // Add this at the top of the component to ensure dark mode is applied to MUI components
  useEffect(() => {
    // Apply appropriate styles to MUI components based on theme
    const muiComponents = document.querySelectorAll(
      '.MuiPaper-root, .MuiDialog-paper, .MuiInputBase-root, .MuiButton-root, .MuiTabs-root'
    );
    muiComponents.forEach((component) => {
      if (theme === 'dark') {
        component.classList.add('dark-mui');
      } else {
        component.classList.remove('dark-mui');
      }
    });
  }, [theme]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active',
      tags: ['New'],
      notes: '',
    });
    setIsAddCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      tags: [...customer.tags],
      notes: customer.notes,
    });
    setIsAddCustomerModalOpen(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsViewCustomerModalOpen(true);
  };

  const handleDeleteCustomer = (customerId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== customerId
      );
      setCustomers(updatedCustomers);
      setLoading(false);
      setNotification({
        open: true,
        message: 'Customer deleted successfully!',
        type: 'success',
      });
    }, 1000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setSelectedStatus('all');
    } else if (newValue === 1) {
      setSelectedStatus('Active');
    } else if (newValue === 2) {
      setSelectedStatus('Inactive');
    }
  };

  const handleBulkSelect = (selectedRowKeys) => {
    setBulkSelected(selectedRowKeys);
  };

  const handleBulkDelete = () => {
    if (bulkSelected.length === 0) return;

    setLoading(true);
    setTimeout(() => {
      const updatedCustomers = customers.filter(
        (customer) => !bulkSelected.includes(customer.id)
      );
      setCustomers(updatedCustomers);
      setBulkSelected([]);
      setLoading(false);
      setNotification({
        open: true,
        message: `${bulkSelected.length} customers deleted successfully`,
        type: 'success',
      });
    }, 1000);
  };

  const handleSaveCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      setNotification({
        open: true,
        message: 'Name and email are required',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let updatedCustomers;

      if (selectedCustomer) {
        // Edit existing customer
        updatedCustomers = customers.map((customer) =>
          customer.id === selectedCustomer.id
            ? {
                ...customer,
                name: newCustomer.name,
                email: newCustomer.email,
                phone: newCustomer.phone,
                address: newCustomer.address,
                status: newCustomer.status,
                tags: newCustomer.tags,
                notes: newCustomer.notes,
              }
            : customer
        );
        setNotification({
          open: true,
          message: 'Customer updated successfully',
          type: 'success',
        });
      } else {
        // Add new customer
        const newId = Math.max(...customers.map((c) => c.id)) + 1;
        const today = new Date().toISOString().split('T')[0];

        const customerToAdd = {
          id: newId,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          status: newCustomer.status,
          tags: newCustomer.tags,
          notes: newCustomer.notes,
          joined: today,
          orders: 0,
          spent: 0,
          lastOrder: null,
          avatar: '/placeholder.svg?height=40&width=40',
        };

        updatedCustomers = [...customers, customerToAdd];
        setNotification({
          open: true,
          message: 'Customer added successfully',
          type: 'success',
        });
      }

      setCustomers(updatedCustomers);
      setLoading(false);
      setIsAddCustomerModalOpen(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (value) => {
    setNewCustomer((prev) => ({
      ...prev,
      tags: value,
    }));
  };

  // Filter customers based on search, status, and date range
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || customer.status === selectedStatus;

    let matchesDateRange = true;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const joinedDate = new Date(customer.joined);
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      matchesDateRange = joinedDate >= startDate && joinedDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Customer analytics data
  const customerAcquisitionData = [
    { month: 'Oct', customers: 120 },
    { month: 'Nov', customers: 145 },
    { month: 'Dec', customers: 190 },
    { month: 'Jan', customers: 220 },
    { month: 'Feb', customers: 250 },
    { month: 'Mar', customers: 275 },
  ];

  const customerRetentionData = [
    { category: 'One-time', count: 120 },
    { category: '2-3 orders', count: 85 },
    { category: '4-6 orders', count: 55 },
    { category: '7+ orders', count: 40 },
  ];

  const customerSpendingData = [
    { name: '$0-$50', value: 30 },
    { name: '$51-$100', value: 25 },
    { name: '$101-$200', value: 20 },
    { name: '$201-$500', value: 15 },
    { name: '$500+', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} alt={text} className="mr-2">
            {text.charAt(0)}
          </Avatar>
          <div>
            <p
              className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {text}
            </p>
            <p
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {record.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
      render: (text) => (
        <span
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      render: (text) => <Badge count={text} className="site-badge-count-4" />,
    },
    {
      title: 'Spent',
      dataIndex: 'spent',
      key: 'spent',
      render: (text) => (
        <span
          className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          ${text.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            text === 'Active'
              ? theme === 'dark'
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-100 text-green-800'
              : theme === 'dark'
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Tag
              key={tag}
              color={
                tag === 'Loyal'
                  ? 'blue'
                  : tag === 'High Value'
                  ? 'gold'
                  : tag === 'New'
                  ? 'green'
                  : tag === 'Repeat'
                  ? 'purple'
                  : 'default'
              }
            >
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-1">
          <Tooltip title="View Customer">
            <IconButton
              size="small"
              className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
              onClick={() => handleViewCustomer(record)}
            >
              <Eye className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Customer">
            <IconButton
              size="small"
              className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}
              onClick={() => handleEditCustomer(record)}
            >
              <Edit className="h-4 w-4" />
            </IconButton>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDeleteCustomer(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Customer">
              <IconButton
                size="small"
                className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}
              >
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Send Message">
            <IconButton
              size="small"
              className={
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }
            >
              <MessageSquare className="h-4 w-4" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } p-6 rounded-xl shadow-md`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2
              className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Customers
            </h2>
            <p
              className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Manage your customer base
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="contained"
              className={`${
                theme === 'dark'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              } shadow-sm`}
              startIcon={<FilePlus className="h-5 w-5" />}
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
            <Button
              variant="outlined"
              className={`${
                theme === 'dark'
                  ? 'border-amber-400 text-amber-400 hover:bg-amber-900/20'
                  : 'border-amber-600 text-amber-600 hover:bg-amber-50'
              }`}
              startIcon={<RefreshCw className="h-5 w-5" />}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              className={`${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              startIcon={<Filter className="h-5 w-5" />}
            >
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                Customer Satisfaction
              </h3>
              <div
                className={`${
                  theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                } p-2 rounded-full`}
              >
                <Zap
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="relative w-24 h-24">
                <CircularProgress
                  variant="determinate"
                  value={85}
                  size={96}
                  thickness={4}
                  sx={{ color: '#10B981' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    85%
                  </span>
                </Box>
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Total Ratings
                </p>
                <p
                  className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  324
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  +5% from last month
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-1">
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                >
                  ★
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  5
                </p>
                <div
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } h-16 rounded-md relative`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      theme === 'dark' ? 'bg-green-600' : 'bg-green-500'
                    } rounded-md`}
                    style={{ height: '70%' }}
                  ></div>
                </div>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mt-1`}
                >
                  70%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                >
                  ★
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  4
                </p>
                <div
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } h-16 rounded-md relative`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
                    } rounded-md`}
                    style={{ height: '15%' }}
                  ></div>
                </div>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mt-1`}
                >
                  15%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                >
                  ★
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  3
                </p>
                <div
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } h-16 rounded-md relative`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-400'
                    } rounded-md`}
                    style={{ height: '8%' }}
                  ></div>
                </div>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mt-1`}
                >
                  8%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                >
                  ★
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  2
                </p>
                <div
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } h-16 rounded-md relative`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      theme === 'dark' ? 'bg-orange-500' : 'bg-orange-400'
                    } rounded-md`}
                    style={{ height: '5%' }}
                  ></div>
                </div>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mt-1`}
                >
                  5%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                >
                  ★
                </p>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  1
                </p>
                <div
                  className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  } h-16 rounded-md relative`}
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 ${
                      theme === 'dark' ? 'bg-red-600' : 'bg-red-500'
                    } rounded-md`}
                    style={{ height: '2%' }}
                  ></div>
                </div>
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  } mt-1`}
                >
                  2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                Customer Acquisition
              </h3>
              <div
                className={`${
                  theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                } p-2 rounded-full`}
              >
                <UserPlus
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                />
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={customerAcquisitionData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCustomers"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme === 'dark' ? '#9CA3AF' : '#9CA3AF'}
                  />
                  <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#9CA3AF'} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                    }}
                    itemStyle={{
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorCustomers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  New This Month
                </p>
                <p
                  className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  +35
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Growth Rate
                </p>
                <p
                  className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  +12.5%
                </p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Target
                </p>
                <p
                  className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  50
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}
              >
                Customer Spending
              </h3>
              <div
                className={`${
                  theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                } p-2 rounded-full`}
              >
                <CreditCard
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}
                />
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSpendingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {customerSpendingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                    }}
                    formatter={(value, name, props) => [
                      `${value} customers`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Average Spend
              </p>
              <div className="flex items-center">
                <p
                  className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  $175.95
                </p>
                <span
                  className={`ml-2 text-xs ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  +8.3% from last month
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
      >
        <CardContent className="p-6">
          <div className="mb-6">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="All Customers" />
                <Tab label="Active" />
                <Tab label="Inactive" />
              </Tabs>
            </Box>
          </div>

          <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search customers..."
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                className="w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                }}
              />
              <DatePicker.RangePicker
                style={{
                  width: 240,
                  backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                }}
                onChange={setDateRange}
                placeholder={['Join Date From', 'Join Date To']}
              />
              <Select
                placeholder="Status"
                style={{
                  width: 120,
                  backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                }}
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {bulkSelected.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 className="h-4 w-4" />}
                  onClick={handleBulkDelete}
                >
                  Delete ({bulkSelected.length})
                </Button>
              )}
              <Button
                variant="outlined"
                className={`${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                startIcon={<Database className="h-4 w-4" />}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                className={`${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                startIcon={<MessageSquare className="h-4 w-4" />}
              >
                Bulk Message
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            loading={loading}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: bulkSelected,
              onChange: handleBulkSelect,
            }}
            expandable={{
              expandedRowRender: (record) => (
                <div
                  className={`p-4 ${
                    theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                  } rounded-lg`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Contact Information
                      </p>
                      <div className="flex items-center mt-2">
                        <Mail
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {record.email}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {record.phone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Address
                      </p>
                      <div className="flex items-center mt-2">
                        <MapPin
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {record.address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Order History
                      </p>
                      <div className="flex items-center mt-2">
                        <ShoppingCart
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium">Total Orders:</span>{' '}
                          {record.orders}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <CreditCard
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium">Total Spent:</span> $
                          {record.spent.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar
                          className={`h-4 w-4 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mr-2`}
                        />
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span className="font-medium">Last Order:</span>{' '}
                          {record.lastOrder
                            ? formatDate(record.lastOrder)
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {record.notes && (
                    <>
                      <Divider className="my-4" />
                      <div>
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Customer Notes
                        </p>
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mt-1 p-2 ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          } rounded-md`}
                        >
                          {record.notes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ),
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span
                      className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      No customers found
                    </span>
                  }
                />
              ),
            }}
            className="customers-table"
          />
        </CardContent>
      </Card>

      {/* View Customer Modal */}
      <Dialog
        open={isViewCustomerModalOpen}
        onClose={() => setIsViewCustomerModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: theme === 'dark' ? 'dark-mui' : '',
        }}
      >
        <DialogTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User
                className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                } mr-2`}
              />
              <span>Customer Profile</span>
            </div>
            {selectedCustomer && (
              <Chip
                label={selectedCustomer.status}
                color={
                  selectedCustomer.status === 'Active' ? 'success' : 'error'
                }
              />
            )}
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <div className="space-y-6 mt-2">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Avatar
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedCustomer.name.charAt(0)}
                </Avatar>
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedCustomer.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <Mail
                      className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } mr-2`}
                    />
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {selectedCustomer.email}
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <Phone
                      className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } mr-2`}
                    />
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedCustomer.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        color={
                          tag === 'Loyal'
                            ? 'primary'
                            : tag === 'High Value'
                            ? 'warning'
                            : tag === 'New'
                            ? 'success'
                            : tag === 'Repeat'
                            ? 'secondary'
                            : 'default'
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`p-4 border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <div className="flex items-center mb-3">
                    <Calendar
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      } mr-2`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Account Info
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Customer Since
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {formatDate(selectedCustomer.joined)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Status
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {selectedCustomer.status}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Customer ID
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        #{selectedCustomer.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <div className="flex items-center mb-3">
                    <MapPin
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      } mr-2`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Address
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {selectedCustomer.address}
                  </p>
                </div>

                <div
                  className={`p-4 border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <div className="flex items-center mb-3">
                    <Heart
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      } mr-2`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Loyalty
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Loyalty Points
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {Math.floor(selectedCustomer.spent * 10)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Loyalty Level
                      </p>
                      <div className="flex items-center">
                        <Award
                          className={`h-4 w-4 ${
                            theme === 'dark'
                              ? 'text-yellow-400'
                              : 'text-yellow-500'
                          } mr-1`}
                        />
                        <p
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {selectedCustomer.spent > 200
                            ? 'Gold'
                            : selectedCustomer.spent > 100
                            ? 'Silver'
                            : 'Bronze'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } rounded-lg`}
              >
                <div className="flex items-center mb-3">
                  <ShoppingCart
                    className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    } mr-2`}
                  />
                  <h3
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Order History
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div
                    className={`${
                      theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                    } p-3 rounded-lg`}
                  >
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Total Orders
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                      }`}
                    >
                      {selectedCustomer.orders}
                    </p>
                  </div>
                  <div
                    className={`${
                      theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
                    } p-3 rounded-lg`}
                  >
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Total Spent
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}
                    >
                      ${selectedCustomer.spent.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`${
                      theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
                    } p-3 rounded-lg`}
                  >
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Last Order
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                      }`}
                    >
                      {selectedCustomer.lastOrder
                        ? formatDate(selectedCustomer.lastOrder)
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedCustomer.orders > 0 ? (
                  <div>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      } mb-2`}
                    >
                      Recent Orders
                    </p>
                    <Timeline
                      items={[
                        {
                          color: 'green',
                          children: (
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Order #1089
                              </p>
                              <p
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {formatDate(selectedCustomer.lastOrder)}
                              </p>
                              <p
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                }`}
                              >
                                $79.99 - 2 items
                              </p>
                            </div>
                          ),
                        },
                        {
                          color: 'blue',
                          children: (
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Order #1056
                              </p>
                              <p
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {formatDate(
                                  new Date(
                                    new Date(
                                      selectedCustomer.lastOrder
                                    ).setDate(
                                      new Date(
                                        selectedCustomer.lastOrder
                                      ).getDate() - 15
                                    )
                                  )
                                )}
                              </p>
                              <p
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-700'
                                }`}
                              >
                                $45.50 - 1 item
                              </p>
                            </div>
                          ),
                        },
                        {
                          color: 'gray',
                          children: (
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                View all orders
                              </p>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      No orders yet
                    </p>
                  </div>
                )}
              </div>

              {selectedCustomer.notes && (
                <div
                  className={`p-4 border ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <div className="flex items-center mb-3">
                    <MessageSquare
                      className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                      } mr-2`}
                    />
                    <h3
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Notes
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } p-3 ${
                      theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                    } rounded-md`}
                  >
                    {selectedCustomer.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewCustomerModalOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            className={`${
              theme === 'dark'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            onClick={() => {
              setIsViewCustomerModalOpen(false);
              handleEditCustomer(selectedCustomer);
            }}
          >
            Edit Customer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Customer Modal */}
      <Dialog
        open={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: theme === 'dark' ? 'dark-mui' : '',
        }}
      >
        <DialogTitle>
          <div className="flex items-center">
            <FilePlus
              className={`h-5 w-5 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              } mr-2`}
            />
            <span>
              {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                placeholder="John Doe"
                InputProps={{
                  className: theme === 'dark' ? 'dark-mui-input' : '',
                }}
              />
              <TextField
                label="Email Address"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                placeholder="john.doe@example.com"
                type="email"
                InputProps={{
                  className: theme === 'dark' ? 'dark-mui-input' : '',
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Phone Number"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                placeholder="(555) 123-4567"
                InputProps={{
                  className: theme === 'dark' ? 'dark-mui-input' : '',
                }}
              />
              <Select
                placeholder="Status"
                style={{
                  width: '100%',
                  backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                }}
                value={newCustomer.status}
                onChange={(value) =>
                  setNewCustomer((prev) => ({ ...prev, status: value }))
                }
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            </div>
            <TextField
              label="Address"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="123 Main St, New York, NY 10001"
              multiline
              rows={2}
              InputProps={{
                className: theme === 'dark' ? 'dark-mui-input' : '',
              }}
            />
            <div>
              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                } mb-2`}
              >
                Tags
              </p>
              <Select
                mode="multiple"
                placeholder="Select tags"
                style={{
                  width: '100%',
                  backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                  color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
                }}
                value={newCustomer.tags}
                onChange={handleTagChange}
                options={[
                  { value: 'New', label: 'New' },
                  { value: 'Loyal', label: 'Loyal' },
                  { value: 'High Value', label: 'High Value' },
                  { value: 'Repeat', label: 'Repeat' },
                  { value: 'VIP', label: 'VIP' },
                ]}
              />
            </div>
            <TextField
              label="Notes"
              name="notes"
              value={newCustomer.notes}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Add any notes about this customer"
              multiline
              rows={3}
              InputProps={{
                className: theme === 'dark' ? 'dark-mui-input' : '',
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddCustomerModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            className={`${
              theme === 'dark'
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
            onClick={handleSaveCustomer}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : selectedCustomer ? (
              'Update Customer'
            ) : (
              'Add Customer'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Customers;
