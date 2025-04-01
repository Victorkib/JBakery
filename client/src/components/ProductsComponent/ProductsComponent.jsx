'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Star,
  ChevronDown,
  Grid,
  List,
  RefreshCw,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { ProductDetailsModal } from './product-details-modal';
import { ProductEditModal } from './product-edit-modal';
import { ProductAddModal } from './product-add-modal';
import { Tabs } from '@mui/material';

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: 'Birthday Cake - Chocolate',
    category: 'Birthday Cakes',
    price: 2500,
    stock: 15,
    sold: 124,
    image: '/Belgian_Chocolate_Cake.jpg',
    featured: true,
    description:
      'Rich chocolate cake with buttercream frosting, perfect for birthdays.',
    ingredients: 'Flour, Sugar, Cocoa Powder, Eggs, Butter, Vanilla Extract',
    status: 'active',
  },
  {
    id: 2,
    name: 'Wedding Cake - Three Tier',
    category: 'Wedding Cakes',
    price: 15000,
    stock: 5,
    sold: 28,
    image: '/Artisan_Sourdough.avif',
    featured: true,
    description:
      'Elegant three-tier cake with fondant decorations for weddings.',
    ingredients: 'Flour, Sugar, Butter, Eggs, Vanilla Extract, Fondant',
    status: 'active',
  },
  {
    id: 3,
    name: 'Cupcakes - Vanilla (Box of 6)',
    category: 'Cupcakes',
    price: 600,
    stock: 30,
    sold: 245,
    image: '/Blueberry Muffin.webp',
    featured: false,
    description:
      'Delicious vanilla cupcakes with colorful frosting, sold in boxes of 6.',
    ingredients: 'Flour, Sugar, Butter, Eggs, Vanilla Extract',
    status: 'active',
  },
  {
    id: 4,
    name: 'Cookies - Chocolate Chip (Box of 12)',
    category: 'Cookies',
    price: 450,
    stock: 25,
    sold: 315,
    image: '/croissant-70.jpg',
    featured: false,
    description: 'Classic chocolate chip cookies, sold in boxes of 12.',
    ingredients: 'Flour, Sugar, Butter, Eggs, Chocolate Chips',
    status: 'active',
  },
  {
    id: 5,
    name: 'Red Velvet Layer Cake',
    category: 'Specialty Cakes',
    price: 3200,
    stock: 8,
    sold: 76,
    image: '/bread.jpg',
    featured: true,
    description: 'Moist red velvet cake with cream cheese frosting.',
    ingredients:
      'Flour, Sugar, Cocoa Powder, Food Coloring, Buttermilk, Cream Cheese',
    status: 'active',
  },
  {
    id: 6,
    name: 'Muffins - Blueberry (Box of 4)',
    category: 'Muffins',
    price: 500,
    stock: 20,
    sold: 142,
    image: '/Tiramisu_Slice.jpg',
    featured: false,
    description: 'Fresh blueberry muffins, sold in boxes of 4.',
    ingredients: 'Flour, Sugar, Butter, Eggs, Blueberries',
    status: 'low_stock',
  },
  {
    id: 7,
    name: 'Birthday Cake - Vanilla',
    category: 'Birthday Cakes',
    price: 2300,
    stock: 12,
    sold: 98,
    image: '/Cinnamon_Roll.jpg',
    featured: false,
    description:
      'Light vanilla cake with buttercream frosting, perfect for birthdays.',
    ingredients: 'Flour, Sugar, Butter, Eggs, Vanilla Extract',
    status: 'active',
  },
  {
    id: 8,
    name: 'Bread - White Loaf',
    category: 'Bread',
    price: 150,
    stock: 0,
    sold: 430,
    image: '/Whole_Grain_Baguette.jpg',
    featured: false,
    description: 'Freshly baked white bread loaf.',
    ingredients: 'Flour, Sugar, Yeast, Salt, Water',
    status: 'out_of_stock',
  },
];

// Categories data
const categories = [
  { name: 'All Products', count: 8 },
  { name: 'Birthday Cakes', count: 2 },
  { name: 'Wedding Cakes', count: 1 },
  { name: 'Cupcakes', count: 1 },
  { name: 'Cookies', count: 1 },
  { name: 'Specialty Cakes', count: 1 },
  { name: 'Muffins', count: 1 },
  { name: 'Bread', count: 1 },
];

const ProductsComponent = ({ theme }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 20000]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Apply theme to MUI components
  useEffect(() => {
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

  // Filter by tab (all, active, out_of_stock, low_stock)
  const filteredByTab = products.filter((product) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active' && product.status === 'active') return true;
    if (selectedTab === 'out_of_stock' && product.status === 'out_of_stock')
      return true;
    if (selectedTab === 'low_stock' && product.status === 'low_stock')
      return true;
    return false;
  });

  // Filter by category, search term, and price range
  const filteredProducts = filteredByTab.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' ||
      product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPriceRange;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'stock') {
      comparison = a.stock - b.stock;
    } else if (sortBy === 'sold') {
      comparison = a.sold - b.sold;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Simulate loading when changing tabs or filters
  const refreshProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    refreshProducts();
  }, [selectedTab, selectedCategory]);

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    setAlertMessage('Product deleted successfully!');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleFeatureProduct = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, featured: !product.featured }
          : product
      )
    );
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active:
        theme === 'dark'
          ? 'bg-green-900/30 text-green-400'
          : 'bg-green-100 text-green-800',
      out_of_stock:
        theme === 'dark'
          ? 'bg-red-900/30 text-red-400'
          : 'bg-red-100 text-red-800',
      low_stock:
        theme === 'dark'
          ? 'bg-yellow-900/30 text-yellow-400'
          : 'bg-yellow-100 text-yellow-800',
    };

    const statusLabels = {
      active: 'In Stock',
      out_of_stock: 'Out of Stock',
      low_stock: 'Low Stock',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const handleOpenDetailsModal = (product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setAlertMessage('Product updated successfully!');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
    setAlertMessage('Product added successfully!');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Products
          </h1>
          <p
            className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Manage your bakery products
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Alert */}
      {showAlert && (
        <Alert
          className={`mb-4 ${
            alertType === 'success'
              ? theme === 'dark'
                ? 'bg-green-900/20 border-green-800'
                : 'bg-green-50 border-green-200'
              : theme === 'dark'
              ? 'bg-red-900/20 border-red-800'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <AlertTitle
            className={
              alertType === 'success'
                ? theme === 'dark'
                  ? 'text-green-400'
                  : 'text-green-800'
                : theme === 'dark'
                ? 'text-red-400'
                : 'text-red-800'
            }
          >
            {alertType === 'success' ? 'Success' : 'Error'}
          </AlertTitle>
          <AlertDescription
            className={
              alertType === 'success'
                ? theme === 'dark'
                  ? 'text-green-300'
                  : 'text-green-700'
                : theme === 'dark'
                ? 'text-red-300'
                : 'text-red-700'
            }
          >
            {alertMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Tabs */}
      <div
        className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-sm mb-6`}
      >
        <div
          className={`p-4 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          } border-b`}
        >
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setSelectedTab}
          >
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  selectedTab === 'all'
                    ? theme === 'dark'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('all')}
              >
                All Products ({products.length})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  selectedTab === 'active'
                    ? theme === 'dark'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('active')}
              >
                Active ({products.filter((p) => p.status === 'active').length})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  selectedTab === 'out_of_stock'
                    ? theme === 'dark'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('out_of_stock')}
              >
                Out of Stock (
                {products.filter((p) => p.status === 'out_of_stock').length})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  selectedTab === 'low_stock'
                    ? theme === 'dark'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('low_stock')}
              >
                Low Stock (
                {products.filter((p) => p.status === 'low_stock').length})
              </button>
            </div>
          </Tabs>
        </div>

        <div className="p-4 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}
              />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className={`pl-10 pr-4 py-2 border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              } rounded-md w-full focus:ring-blue-500 focus:border-blue-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              } rounded-md ${
                theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
              }`}
            >
              <Filter
                size={16}
                className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              />
              Filter
              <ChevronDown
                size={16}
                className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
              />
            </button>

            {showFilters && (
              <div
                className={`absolute mt-1 z-10 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                } border rounded-md shadow-lg w-64 max-h-96 overflow-y-auto`}
              >
                <div
                  className={`p-3 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } border-b`}
                >
                  <h3
                    className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Categories
                  </h3>
                </div>
                <div className="p-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        selectedCategory === category.name
                          ? theme === 'dark'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-blue-50 text-blue-700'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setShowFilters(false);
                      }}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                <div
                  className={`p-3 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } border-t border-b`}
                >
                  <h3
                    className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Price Range
                  </h3>
                </div>
                <div className="p-4">
                  <div
                    className={`flex justify-between text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    } mb-1`}
                  >
                    <span>KSh {priceRange[0]}</span>
                    <span>KSh {priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ])
                    }
                    className={`w-full h-2 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    } rounded-lg appearance-none cursor-pointer`}
                  />
                </div>

                <div
                  className={`p-3 flex justify-end gap-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } border-t`}
                >
                  <button
                    className={`px-3 py-1.5 text-sm ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } rounded-md`}
                    onClick={() => {
                      setSelectedCategory('All Products');
                      setPriceRange([0, 20000]);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <button
            className={`flex items-center gap-2 px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
            } rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
            }`}
          >
            <Download
              size={16}
              className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
            />
            Export
          </button>

          {/* Refresh */}
          <button
            className={`flex items-center gap-2 px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-700'
            } rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
            }`}
            onClick={refreshProducts}
          >
            <RefreshCw
              size={16}
              className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>

          {/* View mode toggle */}
          <div className="ml-auto flex border rounded-md overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === 'grid'
                  ? theme === 'dark'
                    ? 'bg-blue-900/30 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`p-2 ${
                viewMode === 'list'
                  ? theme === 'dark'
                    ? 'bg-blue-900/30 text-blue-400'
                    : 'bg-blue-50 text-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
            }`}
          ></div>
        </div>
      )}

      {/* No results message */}
      {!isLoading && sortedProducts.length === 0 && (
        <div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-sm p-8 text-center`}
        >
          <div
            className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
              theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
            } mb-4`}
          >
            <Search
              size={24}
              className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}
            />
          </div>
          <h3
            className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            } mb-1`}
          >
            No products found
          </h3>
          <p
            className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            } mb-4`}
          >
            Try adjusting your search or filter to find what you{`'`}re looking
            for.
          </p>
          <button
            className={`${
              theme === 'dark'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-800'
            } font-medium`}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Products');
              setPriceRange([0, 20000]);
            }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Products Grid View */}
      {!isLoading && viewMode === 'grid' && sortedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className={`${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow`}
            >
              <div className="relative">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  className={`absolute top-2 right-2 p-1.5 rounded-full ${
                    product.featured
                      ? 'bg-yellow-400 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 hover:text-yellow-400'
                      : 'bg-white text-gray-400 hover:text-yellow-400'
                  }`}
                  onClick={() => handleFeatureProduct(product.id)}
                >
                  <Star size={16} fill={product.featured ? 'white' : 'none'} />
                </button>
                <div className="absolute bottom-2 left-2">
                  <StatusBadge status={product.status} />
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {product.name}
                </h3>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } mb-2`}
                >
                  {product.category}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      className={`p-1.5 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                      } rounded-md`}
                      onClick={() => handleOpenDetailsModal(product)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className={`p-1.5 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'
                          : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                      } rounded-md`}
                      onClick={() => handleOpenEditModal(product)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={`p-1.5 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      } rounded-md`}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {product.sold} sold
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products List View */}
      {!isLoading && viewMode === 'list' && sortedProducts.length > 0 && (
        <div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-sm overflow-hidden`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Product
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortBy === 'price' && (
                      <ChevronDown
                        size={14}
                        className={`ml-1 transform ${
                          sortOrder === 'desc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('stock')}
                >
                  <div className="flex items-center">
                    Stock
                    {sortBy === 'stock' && (
                      <ChevronDown
                        size={14}
                        className={`ml-1 transform ${
                          sortOrder === 'desc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('sold')}
                >
                  <div className="flex items-center">
                    Sold
                    {sortBy === 'sold' && (
                      <ChevronDown
                        size={14}
                        className={`ml-1 transform ${
                          sortOrder === 'desc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
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
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                theme === 'dark'
                  ? 'bg-gray-800 divide-gray-700'
                  : 'bg-white divide-gray-200'
              } divide-y`}
            >
              {sortedProducts.map((product) => (
                <tr
                  key={product.id}
                  className={
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={product.image || '/placeholder.svg'}
                          alt={product.name}
                        />
                        {product.featured && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                            <Star size={8} fill="white" stroke="white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {product.name}
                        </div>
                        <div
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      KSh {product.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className={`p-1.5 ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/30'
                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                        } rounded-md`}
                        onClick={() => handleOpenDetailsModal(product)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className={`p-1.5 ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                        } rounded-md`}
                        onClick={() => handleOpenEditModal(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={`p-1.5 ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30'
                            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                        } rounded-md`}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className={`p-1.5 rounded-md ${
                          product.featured
                            ? theme === 'dark'
                              ? 'text-yellow-400 hover:bg-yellow-900/30'
                              : 'text-yellow-500 hover:bg-yellow-50'
                            : theme === 'dark'
                            ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/30'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                        onClick={() => handleFeatureProduct(product.id)}
                      >
                        <Star
                          size={16}
                          fill={product.featured ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            className={`${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } px-4 py-3 flex items-center justify-between border-t sm:px-6`}
          >
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{sortedProducts.length}</span>{' '}
                  of{' '}
                  <span className="font-medium">{sortedProducts.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-800 text-gray-400'
                        : 'border-gray-300 bg-white text-gray-500'
                    } ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-blue-900/30 text-blue-400'
                        : 'border-gray-300 bg-blue-50 text-blue-600'
                    } text-sm font-medium`}
                  >
                    1
                  </button>
                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-800 text-gray-400'
                        : 'border-gray-300 bg-white text-gray-500'
                    } ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={selectedProduct}
        theme={theme}
      />

      {/* Product Edit Modal */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        theme={theme}
      />

      {/* Product Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Total Products
            </h3>
            <div
              className={`p-2 ${
                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
              } rounded-full`}
            >
              <svg
                className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {products.length}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}
            >
              +12% from last month
            </span>
          </div>
        </div>

        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Out of Stock
            </h3>
            <div
              className={`p-2 ${
                theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
              } rounded-full`}
            >
              <svg
                className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {products.filter((p) => p.status === 'out_of_stock').length}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}
            >
              +2 from last week
            </span>
          </div>
        </div>

        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Low Stock
            </h3>
            <div
              className={`p-2 ${
                theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100'
              } rounded-full`}
            >
              <svg
                className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {products.filter((p) => p.status === 'low_stock').length}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`}
            >
              Critical levels
            </span>
          </div>
        </div>

        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Total Sales
            </h3>
            <div
              className={`p-2 ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
              } rounded-full`}
            >
              <svg
                className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              KSh{' '}
              {products
                .reduce(
                  (total, product) => total + product.price * product.sold,
                  0
                )
                .toLocaleString()}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}
            >
              +8.2% from last month
            </span>
          </div>
        </div>
      </div>

      {/* Best Sellers & Category Distribution */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Best Sellers
            </h3>
            <button
              className={`text-sm ${
                theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {products
              .sort((a, b) => b.sold - a.sold)
              .slice(0, 5)
              .map((product) => (
                <div
                  key={`bestseller-${product.id}`}
                  className="flex items-center"
                >
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h4
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {product.name}
                      </h4>
                      <span
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        KSh {product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {product.category}
                      </span>
                      <span
                        className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {product.sold} sold
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg shadow-sm p-6 border`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Category Distribution
            </h3>
            <button
              className={`text-sm ${
                theme === 'dark'
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {categories
              .filter((category) => category.name !== 'All Products')
              .map((category) => {
                const percentage = (category.count / products.length) * 100;
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {category.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {category.count} products
                      </span>
                    </div>
                    <div
                      className={`h-2 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      } rounded-full overflow-hidden`}
                    >
                      <div
                        className={`h-full ${
                          theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                        } rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bulk Action Section */}
      <div
        className={`mt-8 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        } rounded-lg shadow-sm p-6 border`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Bulk Actions
          </h3>
          <div className="flex space-x-3">
            <button
              className={`px-4 py-2 border ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } rounded-md text-sm font-medium`}
            >
              Import Products
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              Export Products
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-4 border ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } rounded-lg cursor-pointer transition-colors`}
          >
            <div className="flex items-center mb-3">
              <div
                className={`p-2 ${
                  theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                } rounded-full mr-3`}
              >
                <svg
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  ></path>
                </svg>
              </div>
              <h4
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Inventory Update
              </h4>
            </div>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Update stock levels for multiple products at once.
            </p>
          </div>
          <div
            className={`p-4 border ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } rounded-lg cursor-pointer transition-colors`}
          >
            <div className="flex items-center mb-3">
              <div
                className={`p-2 ${
                  theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                } rounded-full mr-3`}
              >
                <svg
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </div>
              <h4
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Visibility Control
              </h4>
            </div>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Change visibility status for multiple products.
            </p>
          </div>
          <div
            className={`p-4 border ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } rounded-lg cursor-pointer transition-colors`}
          >
            <div className="flex items-center mb-3">
              <div
                className={`p-2 ${
                  theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                } rounded-full mr-3`}
              >
                <svg
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
              </div>
              <h4
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Batch Pricing
              </h4>
            </div>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Apply price changes or discounts to multiple products.
            </p>
          </div>
          <div
            className={`p-4 border ${
              theme === 'dark'
                ? 'border-gray-700 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            } rounded-lg cursor-pointer transition-colors`}
          >
            <div className="flex items-center mb-3">
              <div
                className={`p-2 ${
                  theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                } rounded-full mr-3`}
              >
                <svg
                  className={`h-5 w-5 ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </div>
              <h4
                className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Bulk Delete
              </h4>
            </div>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Remove multiple products from your inventory.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-8 right-8">
        <div className="relative group">
          <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Plus size={24} />
          </button>
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
            <div
              className={`${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } rounded-lg shadow-lg p-2 border`}
            >
              <div className="flex flex-col space-y-1">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } rounded-md`}
                >
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } rounded-md`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                  <span>Duplicate</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } rounded-md`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                  <span>Create Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-8 left-8">
        <button
          className={`${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } p-3 rounded-full shadow-lg transition-colors`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </div>

      <ProductAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
        theme={theme}
      />
    </div>
  );
};

export default ProductsComponent;
