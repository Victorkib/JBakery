'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Image,
  Plus,
  Minus,
  HelpCircle,
  AlertCircle,
  Check,
  ChevronDown,
  Upload,
  RefreshCw,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductEditModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  theme,
}) => {
  const [formData, setFormData] = useState(product || {});
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [previewImages, setPreviewImages] = useState([
    product?.image || '/placeholder.svg?height=400&width=400',
    '/placeholder.svg?height=400&width=400&text=Add+Image',
    '/placeholder.svg?height=400&width=400&text=Add+Image',
    '/placeholder.svg?height=400&width=400&text=Add+Image',
  ]);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData(product);
      setPreviewImages([
        product.image || '/placeholder.svg?height=400&width=400',
        '/placeholder.svg?height=400&width=400&text=Add+Image',
        '/placeholder.svg?height=400&width=400&text=Add+Image',
        '/placeholder.svg?height=400&width=400&text=Add+Image',
      ]);
      setIsDirty(false);
      setErrors({});
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setIsDirty(true);

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than zero';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    if (!formData.ingredients || formData.ingredients.trim() === '') {
      newErrors.ingredients = 'Ingredients are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const incrementStock = () => {
    setFormData((prev) => ({
      ...prev,
      stock: (prev.stock || 0) + 1,
    }));
    setIsDirty(true);
  };

  const decrementStock = () => {
    if (formData.stock > 0) {
      setFormData((prev) => ({
        ...prev,
        stock: prev.stock - 1,
      }));
      setIsDirty(true);
    }
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

  const confirmationVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
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
            className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } shadow-2xl`}
            variants={modalVariants}
          >
            {/* Header */}
            <div
              className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
                theme === 'dark'
                  ? 'border-gray-800 bg-gray-900/95'
                  : 'border-gray-200 bg-white/95'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center">
                <h2
                  className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formData.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                {isDirty && (
                  <span
                    className={`ml-3 px-2 py-1 text-xs rounded-full ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    Unsaved changes
                  </span>
                )}
              </div>
              <button
                onClick={handleCancel}
                className={`p-2 rounded-full ${
                  theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs navigation */}
            <div
              className={`sticky top-16 z-10 flex border-b ${
                theme === 'dark'
                  ? 'border-gray-800 bg-gray-900/90'
                  : 'border-gray-200 bg-white/90'
              } backdrop-blur-sm`}
            >
              {['basic', 'details', 'pricing', 'media'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
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
                      layoutId="activeEditTab"
                    />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 pb-24">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div className="col-span-2">
                        <div className="flex justify-between">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Product Name <span className="text-red-500">*</span>
                          </label>
                          {errors.name && (
                            <span className="text-xs text-red-500 flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {errors.name}
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            errors.name ? 'border-red-500' : ''
                          } ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                          placeholder="e.g., Chocolate Birthday Cake"
                          data-error={errors.name ? 'true' : 'false'}
                        />
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Choose a clear, descriptive name for your product
                        </p>
                      </div>

                      {/* Category */}
                      <div>
                        <div className="flex justify-between">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Category <span className="text-red-500">*</span>
                          </label>
                          {errors.category && (
                            <span className="text-xs text-red-500 flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {errors.category}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            name="category"
                            value={formData.category || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              errors.category ? 'border-red-500' : ''
                            } ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none`}
                            data-error={errors.category ? 'true' : 'false'}
                          >
                            <option value="">Select a category</option>
                            <option value="Birthday Cakes">
                              Birthday Cakes
                            </option>
                            <option value="Wedding Cakes">Wedding Cakes</option>
                            <option value="Cupcakes">Cupcakes</option>
                            <option value="Cookies">Cookies</option>
                            <option value="Specialty Cakes">
                              Specialty Cakes
                            </option>
                            <option value="Muffins">Muffins</option>
                            <option value="Bread">Bread</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Status
                        </label>
                        <div className="relative">
                          <select
                            name="status"
                            value={formData.status || 'active'}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none`}
                          >
                            <option value="active">Active (In Stock)</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          />
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Controls visibility and availability
                        </p>
                      </div>

                      {/* Description */}
                      <div className="col-span-2">
                        <div className="flex justify-between">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Description <span className="text-red-500">*</span>
                          </label>
                          {errors.description && (
                            <span className="text-xs text-red-500 flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {errors.description}
                            </span>
                          )}
                        </div>
                        <textarea
                          name="description"
                          value={formData.description || ''}
                          onChange={handleChange}
                          rows="4"
                          className={`w-full px-3 py-2 border ${
                            errors.description ? 'border-red-500' : ''
                          } ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none`}
                          placeholder="Describe your product in detail..."
                          data-error={errors.description ? 'true' : 'false'}
                        ></textarea>
                        <div className="flex justify-between mt-1">
                          <p
                            className={`text-xs ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            Provide a detailed description of your product
                          </p>
                          <span
                            className={`text-xs ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            {formData.description?.length || 0}/500
                          </span>
                        </div>
                      </div>

                      {/* Ingredients */}
                      <div className="col-span-2">
                        <div className="flex justify-between">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Ingredients <span className="text-red-500">*</span>
                          </label>
                          {errors.ingredients && (
                            <span className="text-xs text-red-500 flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {errors.ingredients}
                            </span>
                          )}
                        </div>
                        <textarea
                          name="ingredients"
                          value={formData.ingredients || ''}
                          onChange={handleChange}
                          rows="3"
                          className={`w-full px-3 py-2 border ${
                            errors.ingredients ? 'border-red-500' : ''
                          } ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none`}
                          placeholder="Flour, Sugar, Butter, Eggs, etc."
                          data-error={errors.ingredients ? 'true' : 'false'}
                        ></textarea>
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Separate ingredients with commas
                        </p>
                      </div>
                    </div>

                    {/* Featured toggle */}
                    <div
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              theme === 'dark'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}
                          >
                            <Star size={18} />
                          </div>
                          <div>
                            <h4
                              className={`font-medium ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              Featured Product
                            </h4>
                            <p
                              className={`text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              Featured products appear prominently on your store
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured || false}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div
                            className={`relative w-11 h-6 ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${
                              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600'
                            }`}
                          ></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <h3
                      className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Product Details
                    </h3>

                    {/* SKU and Barcode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          SKU (Stock Keeping Unit)
                        </label>
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku || ''}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                          placeholder="e.g., CAKE-CHOC-001"
                        />
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Unique identifier for your product
                        </p>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Barcode (UPC, EAN)
                        </label>
                        <input
                          type="text"
                          name="barcode"
                          value={formData.barcode || ''}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                          placeholder="e.g., 123456789012"
                        />
                      </div>
                    </div>

                    {/* Dimensions and Weight */}
                    <div
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <h4
                        className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } mb-3`}
                      >
                        Product Dimensions & Weight
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Weight (g)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            value={formData.weight || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Length (cm)
                          </label>
                          <input
                            type="number"
                            name="length"
                            value={formData.length || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Width (cm)
                          </label>
                          <input
                            type="number"
                            name="width"
                            value={formData.width || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            value={formData.height || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Nutritional Information */}
                    <div>
                      <h4
                        className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } mb-3`}
                      >
                        Nutritional Information (per 100g)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Calories
                          </label>
                          <input
                            type="number"
                            name="calories"
                            value={formData.calories || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Protein (g)
                          </label>
                          <input
                            type="number"
                            name="protein"
                            value={formData.protein || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Carbs (g)
                          </label>
                          <input
                            type="number"
                            name="carbs"
                            value={formData.carbs || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Fat (g)
                          </label>
                          <input
                            type="number"
                            name="fat"
                            value={formData.fat || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Allergens */}
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        } mb-1`}
                      >
                        Allergens
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          'Gluten',
                          'Dairy',
                          'Nuts',
                          'Eggs',
                          'Soy',
                          'Wheat',
                          'Peanuts',
                          'Sesame',
                        ].map((allergen) => (
                          <div key={allergen} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`allergen-${allergen}`}
                              name={`allergen-${allergen}`}
                              checked={
                                formData[`allergen-${allergen}`] || false
                              }
                              onChange={handleChange}
                              className={`h-4 w-4 rounded ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500'
                                  : 'bg-white border-gray-300 text-blue-600 focus:ring-blue-500'
                              }`}
                            />
                            <label
                              htmlFor={`allergen-${allergen}`}
                              className={`ml-2 text-sm ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              }`}
                            >
                              {allergen}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shelf Life */}
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        } mb-1`}
                      >
                        Shelf Life (days)
                      </label>
                      <input
                        type="number"
                        name="shelfLife"
                        value={formData.shelfLife || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                        placeholder="e.g., 7"
                        min="1"
                      />
                      <p
                        className={`mt-1 text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        How long the product stays fresh after production
                      </p>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <h3
                      className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Pricing & Inventory
                    </h3>

                    {/* Price and Cost */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Price (KSh) <span className="text-red-500">*</span>
                          </label>
                          {errors.price && (
                            <span className="text-xs text-red-500 flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {errors.price}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            KSh
                          </span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-3 py-2 border ${
                              errors.price ? 'border-red-500' : ''
                            } ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            data-error={errors.price ? 'true' : 'false'}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Cost Price (KSh)
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            KSh
                          </span>
                          <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice || ''}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          For calculating profit margins (not shown to
                          customers)
                        </p>
                      </div>
                    </div>

                    {/* Compare at price and profit margin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Compare-at Price (KSh)
                        </label>
                        <div className="relative">
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            KSh
                          </span>
                          <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice || ''}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Original price (if on sale)
                        </p>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Profit Margin
                        </label>
                        <div
                          className={`p-3 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                          } flex items-center justify-between`}
                        >
                          <div>
                            <div
                              className={`text-sm font-medium ${
                                theme === 'dark'
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {formData.costPrice && formData.price
                                ? `${Math.round(
                                    ((formData.price - formData.costPrice) /
                                      formData.price) *
                                      100
                                  )}%`
                                : '—'}
                            </div>
                            <div
                              className={`text-xs ${
                                theme === 'dark'
                                  ? 'text-gray-400'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formData.costPrice && formData.price
                                ? `KSh ${(
                                    formData.price - formData.costPrice
                                  ).toFixed(2)} per unit`
                                : 'Add cost price to calculate'}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded ${
                              formData.costPrice && formData.price
                                ? ((formData.price - formData.costPrice) /
                                    formData.price) *
                                    100 >
                                  30
                                  ? theme === 'dark'
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-green-100 text-green-800'
                                  : ((formData.price - formData.costPrice) /
                                      formData.price) *
                                      100 >
                                    15
                                  ? theme === 'dark'
                                    ? 'bg-yellow-900/30 text-yellow-400'
                                    : 'bg-yellow-100 text-yellow-800'
                                  : theme === 'dark'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-red-100 text-red-800'
                                : theme === 'dark'
                                ? 'bg-gray-700 text-gray-400'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {formData.costPrice && formData.price
                              ? ((formData.price - formData.costPrice) /
                                  formData.price) *
                                  100 >
                                30
                                ? 'Good'
                                : ((formData.price - formData.costPrice) /
                                    formData.price) *
                                    100 >
                                  15
                                ? 'Average'
                                : 'Low'
                              : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inventory */}
                    <div
                      className={`p-5 rounded-xl ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <h4
                        className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } mb-4`}
                      >
                        Inventory Management
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between">
                            <label
                              className={`block text-sm font-medium ${
                                theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-700'
                              } mb-1`}
                            >
                              Current Stock{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            {errors.stock && (
                              <span className="text-xs text-red-500 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.stock}
                              </span>
                            )}
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={decrementStock}
                              className={`px-3 py-2 rounded-l-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                              }`}
                              disabled={formData.stock <= 0}
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              name="stock"
                              value={formData.stock || 0}
                              onChange={handleChange}
                              className={`w-full text-center border-y ${
                                errors.stock ? 'border-red-500' : ''
                              } ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              min="0"
                              data-error={errors.stock ? 'true' : 'false'}
                            />
                            <button
                              type="button"
                              onClick={incrementStock}
                              className={`px-3 py-2 rounded-r-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            } mb-1`}
                          >
                            Low Stock Threshold
                          </label>
                          <input
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                            placeholder="e.g., 5"
                            min="0"
                          />
                          <p
                            className={`mt-1 text-xs ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            Get alerts when stock falls below this level
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Stock Status
                        </label>
                        <div
                          className={`p-3 rounded-lg ${
                            formData.stock > 10
                              ? theme === 'dark'
                                ? 'bg-green-900/20 border border-green-800/30'
                                : 'bg-green-50 border border-green-100'
                              : formData.stock > 0
                              ? theme === 'dark'
                                ? 'bg-yellow-900/20 border border-yellow-800/30'
                                : 'bg-yellow-50 border border-yellow-100'
                              : theme === 'dark'
                              ? 'bg-red-900/20 border border-red-800/30'
                              : 'bg-red-50 border border-red-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                formData.stock > 10
                                  ? theme === 'dark'
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-green-100 text-green-600'
                                  : formData.stock > 0
                                  ? theme === 'dark'
                                    ? 'bg-yellow-900/30 text-yellow-400'
                                    : 'bg-yellow-100 text-yellow-600'
                                  : theme === 'dark'
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {formData.stock > 10 ? (
                                <Check size={18} />
                              ) : formData.stock > 0 ? (
                                <AlertCircle size={18} />
                              ) : (
                                <X size={18} />
                              )}
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  formData.stock > 10
                                    ? theme === 'dark'
                                      ? 'text-green-400'
                                      : 'text-green-800'
                                    : formData.stock > 0
                                    ? theme === 'dark'
                                      ? 'text-yellow-400'
                                      : 'text-yellow-800'
                                    : theme === 'dark'
                                    ? 'text-red-400'
                                    : 'text-red-800'
                                }`}
                              >
                                {formData.stock > 10
                                  ? 'In Stock'
                                  : formData.stock > 0
                                  ? 'Low Stock'
                                  : 'Out of Stock'}
                              </div>
                              <div
                                className={`text-sm ${
                                  formData.stock > 10
                                    ? theme === 'dark'
                                      ? 'text-green-300'
                                      : 'text-green-700'
                                    : formData.stock > 0
                                    ? theme === 'dark'
                                      ? 'text-yellow-300'
                                      : 'text-yellow-700'
                                    : theme === 'dark'
                                    ? 'text-red-300'
                                    : 'text-red-700'
                                }`}
                              >
                                {formData.stock > 10
                                  ? `${formData.stock} units available`
                                  : formData.stock > 0
                                  ? `Only ${formData.stock} units left`
                                  : 'Product is out of stock'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tax and Shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Tax Class
                        </label>
                        <div className="relative">
                          <select
                            name="taxClass"
                            value={formData.taxClass || 'standard'}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none`}
                          >
                            <option value="standard">
                              Standard Rate (16%)
                            </option>
                            <option value="reduced">Reduced Rate (8%)</option>
                            <option value="zero">Zero Rate (0%)</option>
                            <option value="exempt">Tax Exempt</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          } mb-1`}
                        >
                          Shipping Class
                        </label>
                        <div className="relative">
                          <select
                            name="shippingClass"
                            value={formData.shippingClass || 'standard'}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none`}
                          >
                            <option value="standard">Standard Shipping</option>
                            <option value="express">Express Shipping</option>
                            <option value="fragile">Fragile Items</option>
                            <option value="refrigerated">Refrigerated</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                              theme === 'dark'
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <h3
                      className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Product Images
                    </h3>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewImages.map((img, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square rounded-lg overflow-hidden border ${
                            theme === 'dark'
                              ? 'border-gray-700'
                              : 'border-gray-200'
                          } group`}
                        >
                          <img
                            src={img || '/placeholder.svg'}
                            alt={`Product view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                              theme === 'dark'
                                ? 'bg-gray-900/70'
                                : 'bg-gray-800/50'
                            }`}
                          >
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                              >
                                <Upload size={16} />
                              </button>
                              {index === 0 ? (
                                <button
                                  type="button"
                                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                                  title="Main image (cannot be removed)"
                                  disabled
                                >
                                  <Image size={16} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/70 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-blue-500/80 text-white rounded-md backdrop-blur-sm">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Upload Instructions */}
                    <div
                      className={`p-4 rounded-lg border border-dashed ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-gray-800/50'
                          : 'border-gray-300 bg-gray-50'
                      } text-center`}
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload
                          className={`mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                          size={24}
                        />
                        <p
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Drag and drop images here or click to upload
                        </p>
                        <p
                          className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          } mt-1`}
                        >
                          Supports JPG, PNG, WEBP. Max 5MB each.
                        </p>
                        <button
                          type="button"
                          className={`mt-3 px-4 py-2 text-sm font-medium rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          } transition-colors`}
                        >
                          Select Files
                        </button>
                      </div>
                    </div>

                    {/* Image Recommendations */}
                    <div
                      className={`p-4 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-blue-900/20 border border-blue-800/30'
                          : 'bg-blue-50 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full mr-3 ${
                            theme === 'dark'
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          <HelpCircle size={18} />
                        </div>
                        <div>
                          <h4
                            className={`font-medium ${
                              theme === 'dark'
                                ? 'text-blue-400'
                                : 'text-blue-800'
                            }`}
                          >
                            Image Recommendations
                          </h4>
                          <ul
                            className={`text-sm mt-1 space-y-1 ${
                              theme === 'dark'
                                ? 'text-blue-300'
                                : 'text-blue-700'
                            }`}
                          >
                            <li>
                              • Use high-quality images (at least 1000×1000px)
                            </li>
                            <li>• Show the product from multiple angles</li>
                            <li>
                              • Use a consistent background for all products
                            </li>
                            <li>
                              • Ensure proper lighting to showcase details
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div
                className={`absolute bottom-0 left-0 right-0 flex justify-between p-4 border-t ${
                  theme === 'dark'
                    ? 'bg-gray-900/95 border-gray-800'
                    : 'bg-white/95 border-gray-200'
                } backdrop-blur-sm`}
              >
                <div>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      theme === 'dark'
                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800/30'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    } transition-colors`}
                  >
                    <Trash2 size={16} className="inline-block mr-1.5 -mt-0.5" />
                    Delete Product
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Confirmation Dialog */}
            <AnimatePresence>
              {showConfirmation && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={overlayVariants}
                >
                  <motion.div
                    className={`relative w-full max-w-md rounded-xl ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    } shadow-2xl p-6`}
                    variants={confirmationVariants}
                  >
                    <div className="text-center mb-5">
                      <div
                        className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                          theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                        } mb-4`}
                      >
                        <AlertCircle
                          size={24}
                          className={
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }
                        />
                      </div>
                      <h3
                        className={`text-lg font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        } mb-2`}
                      >
                        Discard changes?
                      </h3>
                      <p
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        You have unsaved changes. Are you sure you want to
                        discard them?
                      </p>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowConfirmation(false);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
