'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  BarChart2,
  PieChart,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

const ReportsPage = ({ theme }) => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [activeTab, setActiveTab] = useState('sales');

  // Mock data - would be fetched from API
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  // Colors for charts based on theme
  const chartColors = {
    dark: {
      text: '#E5E7EB',
      background: '#1F2937',
      grid: '#374151',
      tooltip: '#111827',
      primary: '#F59E0B',
      secondary: '#10B981',
      tertiary: '#3B82F6',
    },
    light: {
      text: '#374151',
      background: '#FFFFFF',
      grid: '#E5E7EB',
      tooltip: '#FFFFFF',
      primary: '#F59E0B',
      secondary: '#10B981',
      tertiary: '#3B82F6',
    },
  };

  const currentColors = chartColors[theme];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Generate mock sales data for the last 30 days
      const mockSalesData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return {
          date: date.toISOString().split('T')[0],
          name: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          sales: Math.floor(Math.random() * 500) + 100,
          orders: Math.floor(Math.random() * 15) + 1,
        };
      });

      // Generate mock product data
      const mockProductData = [
        { name: 'Birthday Cakes', sales: 1250, percentage: 35 },
        { name: 'Pastries', sales: 850, percentage: 24 },
        { name: 'Bread', sales: 650, percentage: 18 },
        { name: 'Cookies', sales: 450, percentage: 13 },
        { name: 'Custom Orders', sales: 350, percentage: 10 },
      ];

      // Generate mock customer data
      const mockCustomerData = [
        {
          name: 'New Customers',
          value: 45,
          percentage: 30,
          color: currentColors.tertiary,
        },
        {
          name: 'Returning Customers',
          value: 105,
          percentage: 70,
          color: currentColors.secondary,
        },
      ];

      setSalesData(mockSalesData);
      setProductData(mockProductData);
      setCustomerData(mockCustomerData);
      setLoading(false);
    }, 1500);
  }, []);

  // Calculate summary metrics
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Export report data
  const exportReport = () => {
    // In a real app, this would generate a CSV or PDF file
    console.log('Exporting report data...');
    alert('Report exported successfully!');
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-md shadow-lg ${
            theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          <p
            className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {label}
          </p>
          {payload.map((item, index) => (
            <p
              key={index}
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {item.name}:{' '}
              <span style={{ color: item.color }}>{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          Reports & Analytics
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportReport}
          className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700"
        >
          <Download size={18} />
          Export Report
        </motion.button>
      </div>

      {/* Date range selector */}
      <div
        className={`rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          <Calendar size={20} />
          <span>Date Range:</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="start-date"
              className={`block text-sm mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="end-date"
              className={`block text-sm mb-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500'
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
          </div>

          <div className="flex items-end">
            <button
              className={`px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              } text-white rounded-md`}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="ml-auto">
          <button
            className={`px-4 py-2 border rounded-md flex items-center gap-2 ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter
              size={18}
              className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            />
            More Filters
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-lg shadow-md p-6 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Total Sales
            </h3>
            <div
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
              }`}
            >
              <TrendingUp
                size={20}
                className={
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }
              />
            </div>
          </div>

          {loading ? (
            <div
              className={`h-12 animate-pulse rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            ></div>
          ) : (
            <>
              <p
                className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                ${totalSales.toLocaleString()}
              </p>
              <p
                className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}
              >
                +12% from previous period
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`rounded-lg shadow-md p-6 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Total Orders
            </h3>
            <div
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}
            >
              <BarChart2
                size={20}
                className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
              />
            </div>
          </div>

          {loading ? (
            <div
              className={`h-12 animate-pulse rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            ></div>
          ) : (
            <>
              <p
                className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {totalOrders}
              </p>
              <p
                className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                +8% from previous period
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`rounded-lg shadow-md p-6 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Average Order Value
            </h3>
            <div
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'
              }`}
            >
              <PieChart
                size={20}
                className={
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }
              />
            </div>
          </div>

          {loading ? (
            <div
              className={`h-12 animate-pulse rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            ></div>
          ) : (
            <>
              <p
                className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                ${averageOrderValue.toFixed(2)}
              </p>
              <p
                className={`text-sm mt-2 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`}
              >
                +5% from previous period
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Report tabs */}
      <div
        className={`rounded-lg shadow-md overflow-hidden mb-8 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div
          className={`border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'sales'
                  ? theme === 'dark'
                    ? 'border-b-2 border-amber-500 text-amber-400'
                    : 'border-b-2 border-amber-500 text-amber-600'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sales Report
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'products'
                  ? theme === 'dark'
                    ? 'border-b-2 border-amber-500 text-amber-400'
                    : 'border-b-2 border-amber-500 text-amber-600'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Performance
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'customers'
                  ? theme === 'dark'
                    ? 'border-b-2 border-amber-500 text-amber-400'
                    : 'border-b-2 border-amber-500 text-amber-600'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Insights
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div
              className={`h-64 animate-pulse rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            ></div>
          ) : (
            <>
              {activeTab === 'sales' && (
                <div>
                  <h3
                    className={`text-lg font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    } mb-4`}
                  >
                    Sales Trend
                  </h3>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={salesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorSales"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={currentColors.primary}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={currentColors.primary}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={currentColors.grid}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: currentColors.text }}
                          tickMargin={10}
                        />
                        <YAxis tick={{ fill: currentColors.text }} />
                        <Tooltip
                          content={<CustomTooltip />}
                          contentStyle={{
                            backgroundColor: currentColors.tooltip,
                            borderColor:
                              theme === 'dark' ? '#374151' : '#E5E7EB',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke={currentColors.primary}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6">
                    <h4
                      className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      } mb-3`}
                    >
                      Sales Breakdown
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead
                          className={
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                          }
                        >
                          <tr>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              Orders
                            </th>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              Sales
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
                          {salesData.slice(-7).map((day, index) => (
                            <tr key={index}>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                {new Date(day.date).toLocaleDateString()}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-500'
                                }`}
                              >
                                {day.orders}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                ${day.sales.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <h3
                    className={`text-lg font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    } mb-4`}
                  >
                    Product Performance
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={currentColors.grid}
                          />
                          <XAxis
                            type="number"
                            tick={{ fill: currentColors.text }}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: currentColors.text }}
                            width={80}
                          />
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: currentColors.tooltip,
                              borderColor:
                                theme === 'dark' ? '#374151' : '#E5E7EB',
                            }}
                          />
                          <Bar
                            dataKey="sales"
                            fill={currentColors.primary}
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="percentage"
                            label={renderCustomizedLabel}
                          >
                            {productData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  [
                                    currentColors.primary,
                                    currentColors.secondary,
                                    currentColors.tertiary,
                                    '#9CA3AF',
                                    '#F472B6',
                                  ][index % 5]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: currentColors.tooltip,
                              borderColor:
                                theme === 'dark' ? '#374151' : '#E5E7EB',
                            }}
                          />
                          <Legend
                            wrapperStyle={{
                              color: currentColors.text,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4
                      className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      } mb-3`}
                    >
                      Top Products
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead
                          className={
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                          }
                        >
                          <tr>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              Product Category
                            </th>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              Sales
                            </th>
                            <th
                              scope="col"
                              className={`px-6 py-3 text-left text-xs font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              } uppercase tracking-wider`}
                            >
                              % of Total
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
                          {productData.map((product, index) => (
                            <tr key={index}>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                {product.name}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-500'
                                }`}
                              >
                                ${product.sales.toFixed(2)}
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                {product.percentage}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div>
                  <h3
                    className={`text-lg font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    } mb-4`}
                  >
                    Customer Insights
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={renderCustomizedLabel}
                          >
                            {customerData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: currentColors.tooltip,
                              borderColor:
                                theme === 'dark' ? '#374151' : '#E5E7EB',
                            }}
                          />
                          <Legend
                            wrapperStyle={{
                              color: currentColors.text,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { name: 'Jan', new: 30, returning: 70 },
                            { name: 'Feb', new: 35, returning: 75 },
                            { name: 'Mar', new: 40, returning: 80 },
                            { name: 'Apr', new: 45, returning: 85 },
                            { name: 'May', new: 50, returning: 90 },
                            { name: 'Jun', new: 45, returning: 105 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={currentColors.grid}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: currentColors.text }}
                          />
                          <YAxis tick={{ fill: currentColors.text }} />
                          <Tooltip
                            content={<CustomTooltip />}
                            contentStyle={{
                              backgroundColor: currentColors.tooltip,
                              borderColor:
                                theme === 'dark' ? '#374151' : '#E5E7EB',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="new"
                            stroke={currentColors.tertiary}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="returning"
                            stroke={currentColors.secondary}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4
                        className={`font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        } mb-3`}
                      >
                        Customer Breakdown
                      </h4>
                      <div
                        className={`rounded-lg border p-4 ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="space-y-4">
                          {customerData.map((category, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span
                                  className={`text-sm font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {category.name}
                                </span>
                                <span
                                  className={`text-sm ${
                                    theme === 'dark'
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {category.value} ({category.percentage}%)
                                </span>
                              </div>
                              <div
                                className={`w-full rounded-full h-2.5 ${
                                  theme === 'dark'
                                    ? 'bg-gray-700'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <div
                                  className={`h-2.5 rounded-full`}
                                  style={{
                                    width: `${category.percentage}%`,
                                    backgroundColor: category.color,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4
                        className={`font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        } mb-3`}
                      >
                        Customer Retention
                      </h4>
                      <div
                        className={`rounded-lg border p-4 ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p
                              className={`text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              Retention Rate
                            </p>
                            <p
                              className={`text-2xl font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              68%
                            </p>
                          </div>
                          <div
                            className={`p-2 rounded-full ${
                              theme === 'dark'
                                ? 'bg-green-900/30'
                                : 'bg-green-100'
                            }`}
                          >
                            <TrendingUp
                              size={20}
                              className={
                                theme === 'dark'
                                  ? 'text-green-400'
                                  : 'text-green-600'
                              }
                            />
                          </div>
                        </div>
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          68% of customers made repeat purchases in the last 30
                          days, which is 5% higher than the previous period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
