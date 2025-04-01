'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash,
  Download,
  X,
  ShoppingBag,
  DollarSign,
  Heart,
} from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock data - would be fetched from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers([
        {
          id: 1,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+254 712 345 678',
          joinDate: '2023-05-15',
          orders: 12,
          totalSpent: 450.75,
          lastOrder: '2024-03-10',
          preferences: 'Chocolate cakes, Gluten-free options',
        },
        {
          id: 2,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+254 723 456 789',
          joinDate: '2022-11-20',
          orders: 8,
          totalSpent: 320.5,
          lastOrder: '2024-02-28',
          preferences: 'Fruit pastries, Birthday cakes',
        },
        {
          id: 3,
          name: 'Alice Johnson',
          email: 'alice.j@example.com',
          phone: '+254 734 567 890',
          joinDate: '2023-08-05',
          orders: 5,
          totalSpent: 180.25,
          lastOrder: '2024-03-15',
          preferences: 'Vegan options',
        },
        {
          id: 4,
          name: 'Robert Williams',
          email: 'robert.w@example.com',
          phone: '+254 745 678 901',
          joinDate: '2022-06-12',
          orders: 20,
          totalSpent: 750.0,
          lastOrder: '2024-03-18',
          preferences: 'Custom celebration cakes',
        },
        {
          id: 5,
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          phone: '+254 756 789 012',
          joinDate: '2023-12-01',
          orders: 3,
          totalSpent: 95.5,
          lastOrder: '2024-02-10',
          preferences: 'Bread, Croissants',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  // Handle customer selection for details view
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  // Export customer data as CSV
  const exportCustomers = () => {
    // In a real app, this would generate a CSV file
    console.log('Exporting customer data...');

    // Create CSV content
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Join Date',
      'Orders',
      'Total Spent',
    ];
    const csvContent = [
      headers.join(','),
      ...customers.map(
        (customer) =>
          `${customer.name},${customer.email},${customer.phone},${customer.joinDate},${customer.orders},${customer.totalSpent}`
      ),
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'customers.csv');
    a.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Customer Management
        </h1>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCustomers}
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Search and filter bar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter size={18} />
              Filter
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4">
                <h3 className="font-medium text-gray-700 mb-2">
                  Filter Options
                </h3>
                {/* Filter options would go here */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-amber-600 mr-2"
                    />
                    <span className="text-sm">Recent customers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-amber-600 mr-2"
                    />
                    <span className="text-sm">High value customers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-amber-600 mr-2"
                    />
                    <span className="text-sm">Inactive customers</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer table */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <User size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
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
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Orders
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
                    Last Order
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
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
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Since{' '}
                            {new Date(customer.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-amber-600 hover:text-amber-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash size={18} />
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

      {/* Customer details modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Customer Details
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-2xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-gray-500">
                    Customer since{' '}
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingBag className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Orders
                    </h4>
                    <p className="text-gray-900">{selectedCustomer.orders}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Spent
                    </h4>
                    <p className="text-gray-900">
                      ${selectedCustomer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Last Order
                    </h4>
                    <p className="text-gray-900">
                      {new Date(
                        selectedCustomer.lastOrder
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Preferences
                    </h4>
                    <p className="text-gray-900">
                      {selectedCustomer.preferences ||
                        'No preferences specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-800 mb-4">
                  Recent Orders
                </h4>
                <p className="text-gray-500 text-sm italic">
                  Order history would be displayed here
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
                  Edit Customer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
