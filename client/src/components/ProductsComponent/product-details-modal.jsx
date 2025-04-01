'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  Heart,
  Share2,
  Tag,
  Clock,
  Award,
  Truck,
  Shield,
  BarChart3,
  TrendingUp,
  Star,
  Printer,
  Download,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetailsModal = ({ isOpen, onClose, product, theme }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock additional images
  const productImages = [
    product?.image || '/placeholder.svg?height=400&width=400',
    '/placeholder.svg?height=400&width=400&text=Angle+2',
    '/placeholder.svg?height=400&width=400&text=Angle+3',
    '/placeholder.svg?height=400&width=400&text=Angle+4',
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setSelectedImage(0);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Calculate metrics
  const revenue = product.price * product.sold;
  const profitMargin = 0.35; // Assuming 35% profit margin
  const profit = revenue * profitMargin;
  const stockValue = product.price * product.stock;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div
            className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } shadow-2xl`}
            variants={modalVariants}
          >
            {/* Close button - floating style */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              } shadow-md transition-all duration-200 hover:scale-105`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Left side - Image gallery */}
              <div className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                {/* Main image with loading state */}
                <div className="relative aspect-square overflow-hidden">
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      imageLoaded ? 'opacity-0' : 'opacity-100'
                    } transition-opacity duration-300 bg-gradient-to-br ${
                      theme === 'dark'
                        ? 'from-gray-800 to-gray-900'
                        : 'from-gray-100 to-gray-200'
                    }`}
                  >
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <motion.img
                    key={selectedImage}
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoaded(true)}
                    initial="hidden"
                    animate={imageLoaded ? 'visible' : 'hidden'}
                    variants={imageVariants}
                  />

                  {/* Featured badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                          theme === 'dark'
                            ? 'bg-yellow-500/90'
                            : 'bg-yellow-500'
                        } text-white font-medium text-sm shadow-lg`}
                      >
                        <Award size={14} />
                        <span>Featured</span>
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <div
                      className={`px-3 py-1.5 rounded-full font-medium text-sm shadow-lg ${
                        product.status === 'active'
                          ? 'bg-green-500/90 text-white'
                          : product.status === 'out_of_stock'
                          ? 'bg-red-500/90 text-white'
                          : 'bg-yellow-500/90 text-white'
                      }`}
                    >
                      {product.status === 'active'
                        ? 'In Stock'
                        : product.status === 'out_of_stock'
                        ? 'Out of Stock'
                        : 'Low Stock'}
                    </div>
                  </div>
                </div>

                {/* Thumbnail gallery */}
                <div className="flex p-2 gap-2 bg-black/30 backdrop-blur-sm">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setImageLoaded(false);
                        setSelectedImage(index);
                      }}
                      className={`relative w-16 h-16 rounded-md overflow-hidden transition-all ${
                        selectedImage === index
                          ? 'ring-2 ring-blue-500 opacity-100 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img || '/placeholder.svg'}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side - Product details */}
              <div
                className={`w-full lg:w-1/2 flex flex-col ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                } overflow-auto`}
              >
                {/* Tabs navigation */}
                <div
                  className={`sticky top-0 z-10 flex border-b ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  } bg-opacity-90 backdrop-blur-sm ${
                    theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'
                  }`}
                >
                  {['details', 'analytics', 'inventory'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-4 text-sm font-medium transition-colors relative ${
                        activeTab === tab
                          ? theme === 'dark'
                            ? 'text-blue-400'
                            : 'text-blue-600'
                          : theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                            theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                          }`}
                          layoutId="activeTab"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 overflow-auto">
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Header with actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h1
                              className={`text-2xl font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {product.name}
                            </h1>
                            <div className="flex items-center mt-1">
                              <span
                                className={`text-sm ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {product.category}
                              </span>
                              <ChevronRight
                                size={14}
                                className={`mx-1 ${
                                  theme === 'dark'
                                    ? 'text-gray-600'
                                    : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                ID: #{product.id}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsLiked(!isLiked)}
                              className={`p-2 rounded-full transition-colors ${
                                isLiked
                                  ? 'bg-red-100 text-red-500'
                                  : theme === 'dark'
                                  ? 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                  : 'bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50'
                              }`}
                            >
                              <Heart
                                size={18}
                                fill={isLiked ? 'currentColor' : 'none'}
                              />
                            </button>
                            <button
                              className={`p-2 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-blue-400'
                                  : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
                              }`}
                            >
                              <Share2 size={18} />
                            </button>
                            <button
                              className={`p-2 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-purple-400'
                                  : 'bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-500'
                              }`}
                            >
                              <Printer size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Price and rating */}
                        <div className="flex items-end justify-between mt-2">
                          <div>
                            <div
                              className={`text-3xl font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {formatCurrency(product.price)}
                            </div>
                            {product.price > 1000 && (
                              <div className="flex items-center mt-1">
                                <span
                                  className={`text-sm line-through ${
                                    theme === 'dark'
                                      ? 'text-gray-500'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {formatCurrency(
                                    Math.round(product.price * 1.15)
                                  )}
                                </span>
                                <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                  15% OFF
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={
                                    star <= 4
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                  fill={star <= 4 ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                            <span
                              className={`ml-2 text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              (42 reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div
                        className={`grid grid-cols-3 gap-3 p-4 rounded-xl ${
                          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            In Stock
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {product.stock}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            Sold
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {product.sold}
                          </div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            Revenue
                          </div>
                          <div
                            className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {formatCurrency(revenue)}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } mb-2`}
                        >
                          Description
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {product.description}
                        </p>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } mb-2`}
                        >
                          Ingredients
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {product.ingredients
                            .split(', ')
                            .map((ingredient, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 text-sm rounded-full ${
                                  theme === 'dark'
                                    ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {ingredient}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Product features */}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } mb-3`}
                        >
                          Product Features
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div
                            className={`flex items-center p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                theme === 'dark'
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              <Truck size={18} />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Free Delivery
                              </div>
                              <div
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                For orders over KSh 2,000
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                theme === 'dark'
                                  ? 'bg-green-900/30 text-green-400'
                                  : 'bg-green-100 text-green-600'
                              }`}
                            >
                              <Shield size={18} />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Quality Guarantee
                              </div>
                              <div
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                Fresh ingredients only
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                theme === 'dark'
                                  ? 'bg-purple-900/30 text-purple-400'
                                  : 'bg-purple-100 text-purple-600'
                              }`}
                            >
                              <Tag size={18} />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Special Occasions
                              </div>
                              <div
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                Custom orders available
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                theme === 'dark'
                                  ? 'bg-yellow-900/30 text-yellow-400'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}
                            >
                              <Clock size={18} />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  theme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                }`}
                              >
                                Freshly Baked
                              </div>
                              <div
                                className={`text-xs ${
                                  theme === 'dark'
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                Made to order
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <h2
                        className={`text-xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Product Analytics
                      </h2>

                      {/* Key metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`p-4 rounded-xl ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`text-sm font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              Total Revenue
                            </div>
                            <div
                              className={`p-1.5 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-green-900/30 text-green-400'
                                  : 'bg-green-100 text-green-600'
                              }`}
                            >
                              <BarChart3 size={16} />
                            </div>
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {formatCurrency(revenue)}
                          </div>
                          <div
                            className={`text-xs ${
                              theme === 'dark'
                                ? 'text-green-400'
                                : 'text-green-600'
                            } flex items-center mt-1`}
                          >
                            <TrendingUp size={14} className="mr-1" />
                            +12.5% from last month
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-xl ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`text-sm font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              Profit
                            </div>
                            <div
                              className={`p-1.5 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              <TrendingUp size={16} />
                            </div>
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {formatCurrency(profit)}
                          </div>
                          <div
                            className={`text-xs ${
                              theme === 'dark'
                                ? 'text-blue-400'
                                : 'text-blue-600'
                            } flex items-center mt-1`}
                          >
                            <TrendingUp size={14} className="mr-1" />
                            Profit margin: {Math.round(profitMargin * 100)}%
                          </div>
                        </div>
                      </div>

                      {/* Sales chart placeholder */}
                      <div
                        className={`p-4 rounded-xl ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3
                            className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            Sales History
                          </h3>
                          <select
                            className={`text-sm p-1 rounded ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 border-gray-600'
                                : 'bg-white text-gray-700 border-gray-300'
                            } border`}
                          >
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Last year</option>
                          </select>
                        </div>
                        <div className="h-48 flex items-center justify-center">
                          <div
                            className={`text-sm ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            Sales chart visualization would appear here
                          </div>
                        </div>
                      </div>

                      {/* Customer feedback */}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } mb-3`}
                        >
                          Customer Feedback
                        </h3>
                        <div
                          className={`p-4 rounded-xl ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center mb-4">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={18}
                                  className={
                                    star <= 4
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }
                                  fill={star <= 4 ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                            <span
                              className={`text-lg font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              4.0
                            </span>
                            <span
                              className={`ml-2 text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              (42 reviews)
                            </span>
                          </div>

                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              // Mock percentages
                              const percentages = {
                                5: 45,
                                4: 30,
                                3: 15,
                                2: 7,
                                1: 3,
                              };
                              return (
                                <div key={rating} className="flex items-center">
                                  <div className="flex items-center w-12">
                                    <span
                                      className={`text-sm ${
                                        theme === 'dark'
                                          ? 'text-gray-400'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      {rating}
                                    </span>
                                    <Star
                                      size={12}
                                      className="ml-1 text-yellow-400"
                                      fill="currentColor"
                                    />
                                  </div>
                                  <div
                                    className={`flex-1 h-2 mx-2 rounded-full ${
                                      theme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-200'
                                    }`}
                                  >
                                    <div
                                      className="h-2 rounded-full bg-yellow-400"
                                      style={{
                                        width: `${percentages[rating]}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <div
                                    className={`w-9 text-right text-sm ${
                                      theme === 'dark'
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    {percentages[rating]}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inventory Tab */}
                  {activeTab === 'inventory' && (
                    <div className="space-y-6">
                      <h2
                        className={`text-xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Inventory Management
                      </h2>

                      {/* Inventory status */}
                      <div
                        className={`p-5 rounded-xl ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3
                            className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            Current Status
                          </h3>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.status === 'active'
                                ? theme === 'dark'
                                  ? 'bg-green-900/30 text-green-400'
                                  : 'bg-green-100 text-green-800'
                                : product.status === 'out_of_stock'
                                ? theme === 'dark'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-red-100 text-red-800'
                                : theme === 'dark'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.status === 'active'
                              ? 'In Stock'
                              : product.status === 'out_of_stock'
                              ? 'Out of Stock'
                              : 'Low Stock'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div
                              className={`text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              } mb-1`}
                            >
                              Current Stock
                            </div>
                            <div
                              className={`text-2xl font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {product.stock} units
                            </div>
                          </div>
                          <div>
                            <div
                              className={`text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              } mb-1`}
                            >
                              Stock Value
                            </div>
                            <div
                              className={`text-2xl font-bold ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {formatCurrency(stockValue)}
                            </div>
                          </div>
                        </div>

                        {/* Stock level visualization */}
                        <div className="mb-2">
                          <div className="flex justify-between mb-1">
                            <div
                              className={`text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              Stock Level
                            </div>
                            <div
                              className={`text-sm font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              }`}
                            >
                              {product.stock > 0
                                ? Math.min(
                                    Math.round((product.stock / 20) * 100),
                                    100
                                  )
                                : 0}
                              %
                            </div>
                          </div>
                          <div
                            className={`h-2 w-full rounded-full ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`h-2 rounded-full ${
                                product.stock > 10
                                  ? 'bg-green-500'
                                  : product.stock > 0
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${
                                  product.stock > 0
                                    ? Math.min(
                                        Math.round((product.stock / 20) * 100),
                                        100
                                      )
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div
                          className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {product.stock <= 5 &&
                            product.stock > 0 &&
                            'Low stock alert! Consider restocking soon.'}
                          {product.stock === 0 &&
                            'Out of stock! Restock immediately to avoid losing sales.'}
                          {product.stock > 10 && 'Stock levels are healthy.'}
                        </div>
                      </div>

                      {/* Inventory history */}
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          } mb-3`}
                        >
                          Inventory History
                        </h3>
                        <div
                          className={`rounded-xl overflow-hidden ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                          } border`}
                        >
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead
                              className={
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                              }
                            >
                              <tr>
                                <th
                                  scope="col"
                                  className={`px-4 py-3 text-left text-xs font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300'
                                      : 'text-gray-500'
                                  } uppercase tracking-wider`}
                                >
                                  Date
                                </th>
                                <th
                                  scope="col"
                                  className={`px-4 py-3 text-left text-xs font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300'
                                      : 'text-gray-500'
                                  } uppercase tracking-wider`}
                                >
                                  Action
                                </th>
                                <th
                                  scope="col"
                                  className={`px-4 py-3 text-left text-xs font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300'
                                      : 'text-gray-500'
                                  } uppercase tracking-wider`}
                                >
                                  Quantity
                                </th>
                                <th
                                  scope="col"
                                  className={`px-4 py-3 text-left text-xs font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300'
                                      : 'text-gray-500'
                                  } uppercase tracking-wider`}
                                >
                                  User
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              className={`divide-y ${
                                theme === 'dark'
                                  ? 'divide-gray-700'
                                  : 'divide-gray-200'
                              }`}
                            >
                              {[
                                {
                                  date: '2025-03-15',
                                  action: 'Restock',
                                  quantity: 10,
                                  user: 'John Doe',
                                },
                                {
                                  date: '2025-03-10',
                                  action: 'Sale',
                                  quantity: -2,
                                  user: 'System',
                                },
                                {
                                  date: '2025-03-05',
                                  action: 'Adjustment',
                                  quantity: -1,
                                  user: 'Jane Smith',
                                },
                                {
                                  date: '2025-03-01',
                                  action: 'Restock',
                                  quantity: 15,
                                  user: 'John Doe',
                                },
                              ].map((record, idx) => (
                                <tr
                                  key={idx}
                                  className={
                                    theme === 'dark'
                                      ? 'hover:bg-gray-750'
                                      : 'hover:bg-gray-50'
                                  }
                                >
                                  <td
                                    className={`px-4 py-3 text-sm ${
                                      theme === 'dark'
                                        ? 'text-gray-300'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {record.date}
                                  </td>
                                  <td
                                    className={`px-4 py-3 text-sm ${
                                      theme === 'dark'
                                        ? 'text-gray-300'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        record.action === 'Restock'
                                          ? theme === 'dark'
                                            ? 'bg-green-900/30 text-green-400'
                                            : 'bg-green-100 text-green-800'
                                          : record.action === 'Sale'
                                          ? theme === 'dark'
                                            ? 'bg-blue-900/30 text-blue-400'
                                            : 'bg-blue-100 text-blue-800'
                                          : theme === 'dark'
                                          ? 'bg-yellow-900/30 text-yellow-400'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {record.action}
                                    </span>
                                  </td>
                                  <td
                                    className={`px-4 py-3 text-sm font-medium ${
                                      record.quantity > 0
                                        ? theme === 'dark'
                                          ? 'text-green-400'
                                          : 'text-green-600'
                                        : theme === 'dark'
                                        ? 'text-red-400'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {record.quantity > 0
                                      ? `+${record.quantity}`
                                      : record.quantity}
                                  </td>
                                  <td
                                    className={`px-4 py-3 text-sm ${
                                      theme === 'dark'
                                        ? 'text-gray-300'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {record.user}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Restock recommendations */}
                      <div
                        className={`p-4 rounded-xl border ${
                          product.stock <= 5
                            ? theme === 'dark'
                              ? 'bg-red-900/20 border-red-800/30 text-red-400'
                              : 'bg-red-50 border-red-100 text-red-800'
                            : theme === 'dark'
                            ? 'bg-green-900/20 border-green-800/30 text-green-400'
                            : 'bg-green-50 border-green-100 text-green-800'
                        }`}
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              product.stock <= 5
                                ? theme === 'dark'
                                  ? 'bg-red-900/30'
                                  : 'bg-red-100'
                                : theme === 'dark'
                                ? 'bg-green-900/30'
                                : 'bg-green-100'
                            }`}
                          >
                            {product.stock <= 5 ? (
                              <Clock size={18} />
                            ) : (
                              <Shield size={18} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {product.stock <= 5
                                ? 'Restock Recommendation'
                                : 'Stock Status'}
                            </h4>
                            <p className="text-sm mt-1">
                              {product.stock <= 5
                                ? `Current stock is low (${product.stock} units). We recommend restocking with at least 15 more units.`
                                : `Current stock level is healthy (${product.stock} units). No immediate action required.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div
                  className={`sticky bottom-0 flex justify-between p-4 border-t ${
                    theme === 'dark'
                      ? 'bg-gray-900/90 border-gray-800'
                      : 'bg-white/90 border-gray-200'
                  } backdrop-blur-sm`}
                >
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <Download
                        size={16}
                        className="inline-block mr-1.5 -mt-0.5"
                      />
                      Export
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      <ExternalLink
                        size={16}
                        className="inline-block mr-1.5 -mt-0.5"
                      />
                      View Full
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onClose}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      <Edit size={16} className="inline-block mr-1.5 -mt-0.5" />
                      Edit Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
