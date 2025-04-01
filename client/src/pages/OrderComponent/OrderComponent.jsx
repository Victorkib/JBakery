'use client';

import { useState, useEffect, useRef } from 'react';
import 'regenerator-runtime/runtime';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

import {
  Calendar,
  ShoppingCart,
  Filter,
  CreditCard,
  Heart,
  Search,
  Zap,
  Check,
  ChevronDown,
  MapPin,
  Camera,
  Coffee,
  Volume2,
  X,
  Plus,
  Info,
  Minus,
  Star,
  Clock,
  Sparkles,
  AlertCircle,
  Truck,
  Gift,
  Percent,
  Wallet,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { toast, ToastContainer } from 'react-toastify';

// Custom hook for nutritional insights
const useNutritionalInsights = (product) => {
  const [nutritionVisible, setNutritionVisible] = useState(false);
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && nutritionVisible) {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setNutrition({
          calories: Math.floor(Math.random() * 400) + 100,
          protein: Math.floor(Math.random() * 10) + 2,
          carbs: Math.floor(Math.random() * 30) + 15,
          fat: Math.floor(Math.random() * 15) + 5,
          sugar: Math.floor(Math.random() * 20) + 5,
          fiber: Math.floor(Math.random() * 5) + 1,
        });
        setLoading(false);
      }, 600);
    }
  }, [product, nutritionVisible]);

  return { nutrition, nutritionVisible, setNutritionVisible, loading };
};

// Smart reorder prediction algorithm
const useSmartReorder = (orderHistory) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderHistory && orderHistory.length > 0) {
      setLoading(true);
      // Simulate API call for ML-based recommendations
      setTimeout(() => {
        // This would be a more complex algorithm in production
        const frequentItems = orderHistory.flat().reduce((acc, item) => {
          acc[item.id] = (acc[item.id] || 0) + 1;
          return acc;
        }, {});

        const topItems = Object.entries(frequentItems)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id]) =>
            mockProducts.find((p) => p.id === Number.parseInt(id))
          );

        setSuggestions(topItems);
        setLoading(false);
      }, 800);
    }
  }, [orderHistory]);

  return { suggestions, loading };
};

// Mock data
const mockProducts = [
  {
    id: 1,
    name: 'Classic Sourdough',
    category: 'Bread',
    price: 6.99,
    image: '/Artisan_Sourdough.avif',
    rating: 4.8,
    reviews: 124,
    tags: ['bestseller', 'organic'],
    allergens: ['gluten'],
    isVegan: false,
    isGlutenFree: false,
    description:
      'Our signature sourdough with a perfect crust and tangy flavor. Made with organic flour and our 28-year-old starter.',
  },
  {
    id: 2,
    name: 'Red Velvet Cake',
    category: 'Cake',
    price: 35.99,
    image: '/Belgian_Chocolate_Cake.jpg',
    rating: 4.9,
    reviews: 87,
    tags: ['popular', 'celebration'],
    allergens: ['gluten', 'dairy', 'eggs'],
    isVegan: false,
    isGlutenFree: false,
    description:
      'Luxurious red velvet cake with cream cheese frosting. Perfect for special occasions and celebrations.',
  },
  {
    id: 3,
    name: 'Almond Croissant',
    category: 'Pastry',
    price: 4.5,
    image: '/croissant-70.jpg',
    rating: 4.7,
    reviews: 56,
    tags: ['breakfast', 'french'],
    allergens: ['gluten', 'nuts', 'dairy'],
    isVegan: false,
    isGlutenFree: false,
    description:
      'Buttery croissant filled with rich almond cream and topped with sliced almonds. A French classic.',
  },
  {
    id: 4,
    name: 'Gluten-Free Brownie',
    category: 'Dessert',
    price: 3.99,
    image: '/Whole_Grain_Baguette.jpg',
    rating: 4.5,
    reviews: 43,
    tags: ['healthy', 'afternoon-tea'],
    allergens: ['dairy', 'eggs'],
    isVegan: false,
    isGlutenFree: true,
    description:
      "Rich, fudgy brownie made with premium gluten-free flour. You won't believe it's gluten-free!",
  },
  {
    id: 5,
    name: 'Vegan Cinnamon Roll',
    category: 'Pastry',
    price: 5.49,
    image: '/Cinnamon_Roll.jpg',
    rating: 4.6,
    reviews: 32,
    tags: ['vegan', 'breakfast'],
    allergens: ['gluten'],
    isVegan: true,
    isGlutenFree: false,
    description:
      'Soft, gooey cinnamon roll made without animal products. Topped with dairy-free vanilla glaze.',
  },
  {
    id: 6,
    name: 'Tiramisu Slice',
    category: 'Pastry',
    price: 5.49,
    image: '/Tiramisu_Slice.jpg',
    rating: 4.6,
    reviews: 32,
    tags: ['italian', 'coffee'],
    allergens: ['gluten', 'dairy', 'eggs'],
    isVegan: false,
    isGlutenFree: false,
    description:
      'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream. Dusted with cocoa powder.',
  },
];

const mockOrderHistory = [
  [
    { id: 1, quantity: 2 },
    { id: 5, quantity: 1 },
  ],
  [{ id: 2, quantity: 1 }],
  [
    { id: 1, quantity: 1 },
    { id: 3, quantity: 3 },
  ],
  [
    { id: 1, quantity: 1 },
    { id: 4, quantity: 2 },
  ],
];

// Promo codes
const promoCodes = [
  { code: 'WELCOME10', discount: 0.1, description: '10% off your first order' },
  {
    code: 'FREESHIP',
    discount: 0,
    freeShipping: true,
    description: 'Free shipping on your order',
  },
  { code: 'SAVE15', discount: 0.15, description: '15% off orders over $50' },
];

const OrderComponent = () => {
  // Get theme from context
  const { isDarkMode } = useTheme();

  // State management
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState({
    vegan: false,
    glutenFree: false,
  });
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [customizations, setCustomizations] = useState({
    size: 'Medium',
    quantity: 1,
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [orderType, setOrderType] = useState('pickup'); // 'pickup' or 'delivery'
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState('12:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [giftOptions, setGiftOptions] = useState({
    isGift: false,
    message: '',
    packaging: 'standard',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Browse, 2: Customize, 3: Checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showARPreview, setShowARPreview] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isPromoValid, setIsPromoValid] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard'); // standard, express, scheduled
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, Anytown, USA',
      default: true,
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Office Blvd, Business City, USA',
      default: false,
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([
    { id: 1, type: 'card', last4: '4242', brand: 'Visa', default: true },
    { id: 2, type: 'card', last4: '1234', brand: 'Mastercard', default: false },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);

  // References
  const filterMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const checkoutModalRef = useRef(null);

  // Custom hooks
  const { suggestions, loading: suggestionsLoading } =
    useSmartReorder(mockOrderHistory);
  const {
    nutrition,
    nutritionVisible,
    setNutritionVisible,
    loading: nutritionLoading,
  } = useNutritionalInsights(selectedProduct);

  // Speech recognition setup
  const {
    transcript,
    resetTranscript,
    listening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    commands: [
      {
        command: 'add * to cart',
        callback: (product) => {
          const foundProduct = mockProducts.find((p) =>
            p.name.toLowerCase().includes(product.toLowerCase())
          );
          if (foundProduct) {
            addToCart(foundProduct);
            toast.success(`Added ${foundProduct.name} to cart!`);
          }
        },
      },
      {
        command: 'show * category',
        callback: (category) => {
          setSelectedCategory(category);
          toast.info(`Showing ${category} category`);
        },
      },
      {
        command: 'checkout',
        callback: () => {
          proceedToCheckout();
          toast.info('Opening checkout');
        },
      },
    ],
  });

  // Animation hooks
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  // Methods
  const addToCart = (product, quantity = 1, customOptions = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity,
            customizations:
              customOptions ||
              (customizations.size
                ? {
                    size: customizations.size,
                    specialInstructions,
                    giftOptions: giftOptions.isGift ? giftOptions : null,
                  }
                : null),
          },
        ];
      }
    });

    // Add to recently viewed if not already there
    setRecentlyViewed((prev) => {
      if (!prev.some((item) => item.id === product.id)) {
        return [product, ...prev].slice(0, 4);
      }
      return prev;
    });

    // Show success toast
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavoriteItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      toast.success(
        favoriteItems.includes(productId)
          ? `Removed ${product.name} from favorites`
          : `Added ${product.name} to favorites`
      );
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setCustomizationOpen(true);
    setCurrentStep(2);
    setCustomizations({
      size: 'Medium',
      quantity: 1,
    });
    setSpecialInstructions('');
    setGiftOptions({
      isGift: false,
      message: '',
      packaging: 'standard',
    });
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'dietary') {
      setDietaryFilters((prev) => ({ ...prev, [value]: !prev[value] }));
    } else if (filterType === 'price') {
      setPriceRange(value);
    }
  };

  const proceedToCheckout = () => {
    setIsCheckoutOpen(true);
    setCurrentStep(3);
    setPromoCode('');
    setAppliedPromo(null);
    setIsPromoValid(null);
    setShowPromoInput(false);
  };

  const toggleVoiceCommand = () => {
    if (!SpeechRecognition || !SpeechRecognition.startListening) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    if (isVoiceEnabled) {
      stopListening();
    } else {
      startListening();
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const validatePromoCode = () => {
    // Check if promo code exists
    const promo = promoCodes.find((p) => p.code === promoCode.toUpperCase());

    if (promo) {
      setAppliedPromo(promo);
      setIsPromoValid(true);
      toast.success(`Promo code ${promo.code} applied!`);
    } else {
      setAppliedPromo(null);
      setIsPromoValid(false);
      toast.error('Invalid promo code');
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessingOrder(true);

    // Simulate order processing
    setTimeout(() => {
      setIsProcessingOrder(false);
      setOrderComplete(true);
      setOrderNumber(Math.floor(Math.random() * 10000) + 1000);
      setShowConfetti(true);

      // Clear cart after successful order
      setCart([]);

      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }, 2000);
  };

  const closeOrderComplete = () => {
    setOrderComplete(false);
    setIsCheckoutOpen(false);
    setCurrentStep(1);
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedPromo?.discount
    ? subtotal * appliedPromo.discount
    : 0;
  const tax = (subtotal - discount) * 0.08;
  const deliveryFee = appliedPromo?.freeShipping
    ? 0
    : orderType === 'delivery'
    ? 4.99
    : 0;
  const total = subtotal - discount + tax + deliveryFee;

  // Filter products based on criteria
  const filteredProducts = mockProducts.filter((product) => {
    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory)
      return false;

    // Search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Dietary preferences
    if (dietaryFilters.vegan && !product.isVegan) return false;
    if (dietaryFilters.glutenFree && !product.isGlutenFree) return false;

    // Price range
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;

    return true;
  });

  // Handle click outside modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuOpen &&
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setFilterMenuOpen(false);
      }

      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMenuOpen, showDatePicker]);

  // Close modals on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (customizationOpen) setCustomizationOpen(false);
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        if (filterMenuOpen) setFilterMenuOpen(false);
        if (showDatePicker) setShowDatePicker(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [customizationOpen, isCheckoutOpen, filterMenuOpen, showDatePicker]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-neutral-50 text-gray-800'
      }`}
    >
      {/* Main container */}
      <motion.div style={fadeIn} className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with voice command toggle */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-amber-400' : 'text-amber-800'
            }`}
          >
            JB Bakery Orders
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleVoiceCommand}
              className={`p-2 rounded-full transition-all ${
                isVoiceEnabled
                  ? 'bg-red-500 text-white animate-pulse'
                  : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
              aria-label="Toggle voice commands"
            >
              <Volume2 size={20} />
            </button>

            {isVoiceEnabled && (
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-neutral-600'
                }`}
              >
                {listening ? 'Listening...' : 'Voice enabled'}
              </span>
            )}

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className={`relative p-2 ${
                isDarkMode
                  ? 'bg-amber-900/50 hover:bg-amber-800/70'
                  : 'bg-amber-100 hover:bg-amber-200'
              } rounded-full transition-colors`}
              aria-label="View cart"
            >
              <ShoppingCart
                size={20}
                className={isDarkMode ? 'text-amber-400' : 'text-amber-800'}
              />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Order type selector */}
        <div
          className={`mb-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } p-4 rounded-lg shadow-sm`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2
                className={`font-semibold text-lg ${
                  isDarkMode ? 'text-white' : 'text-neutral-800'
                }`}
              >
                Choose Order Type
              </h2>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                }`}
              >
                Select how you{`'`}d like to receive your treats
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setOrderType('pickup')}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                  orderType === 'pickup'
                    ? isDarkMode
                      ? 'bg-amber-900/50 text-amber-400 border-2 border-amber-700'
                      : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    : 'bg-neutral-100 text-neutral-600 border-2 border-transparent hover:bg-neutral-200'
                }`}
              >
                <Coffee size={18} />
                <span>Store Pickup</span>
              </button>

              <button
                onClick={() => {
                  setOrderType('delivery');
                  setShowDeliveryOptions(true);
                }}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                  orderType === 'delivery'
                    ? isDarkMode
                      ? 'bg-amber-900/50 text-amber-400 border-2 border-amber-700'
                      : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-2 border-transparent hover:bg-gray-600'
                    : 'bg-neutral-100 text-neutral-600 border-2 border-transparent hover:bg-neutral-200'
                }`}
              >
                <MapPin size={18} />
                <span>Delivery</span>
              </button>
            </div>
          </div>

          {/* Conditional delivery details */}
          {orderType === 'delivery' && (
            <div
              className={`mt-4 pt-4 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-neutral-200'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <div className="flex items-center mb-2">
                    <h3
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Delivery Address
                    </h3>
                    <button
                      onClick={() =>
                        setShowAddressSelector(!showAddressSelector)
                      }
                      className={`ml-2 text-xs ${
                        isDarkMode ? 'text-amber-400' : 'text-amber-600'
                      } hover:underline`}
                    >
                      {savedAddresses.length > 0
                        ? 'Select saved address'
                        : 'Add new address'}
                    </button>
                  </div>

                  {showAddressSelector && savedAddresses.length > 0 && (
                    <div
                      className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      } p-2`}
                    >
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => {
                            setSelectedAddress(address.id);
                            setDeliveryAddress(address.address);
                            setShowAddressSelector(false);
                          }}
                          className={`p-2 rounded-md cursor-pointer ${
                            selectedAddress === address.id
                              ? isDarkMode
                                ? 'bg-amber-900/50 text-amber-400'
                                : 'bg-amber-100 text-amber-800'
                              : isDarkMode
                              ? 'hover:bg-gray-600'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{address.name}</span>
                            {address.default && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isDarkMode
                                    ? 'bg-gray-600 text-gray-300'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {address.address}
                          </p>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 border-gray-600">
                        <button
                          className={`w-full text-center text-sm ${
                            isDarkMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 hover:text-amber-700'
                          }`}
                        >
                          + Add new address
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-neutral-300 text-gray-900 border'
                    }`}
                  />
                </div>

                {showDeliveryOptions && (
                  <div className="md:w-1/3">
                    <h3
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Delivery Options
                    </h3>
                    <div className="space-y-2">
                      <div
                        onClick={() => setDeliveryOption('standard')}
                        className={`p-3 rounded-md cursor-pointer border ${
                          deliveryOption === 'standard'
                            ? isDarkMode
                              ? 'border-amber-600 bg-amber-900/30'
                              : 'border-amber-500 bg-amber-50'
                            : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Truck
                              size={18}
                              className={
                                isDarkMode ? 'text-amber-400' : 'text-amber-600'
                              }
                            />
                            <span className="ml-2 font-medium">
                              Standard Delivery
                            </span>
                          </div>
                          <span
                            className={
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                          >
                            $4.99
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Estimated delivery: 45-60 minutes
                        </p>
                      </div>

                      <div
                        onClick={() => setDeliveryOption('express')}
                        className={`p-3 rounded-md cursor-pointer border ${
                          deliveryOption === 'express'
                            ? isDarkMode
                              ? 'border-amber-600 bg-amber-900/30'
                              : 'border-amber-500 bg-amber-50'
                            : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Zap
                              size={18}
                              className={
                                isDarkMode ? 'text-amber-400' : 'text-amber-600'
                              }
                            />
                            <span className="ml-2 font-medium">
                              Express Delivery
                            </span>
                          </div>
                          <span
                            className={
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                          >
                            $7.99
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Estimated delivery: 20-30 minutes
                        </p>
                      </div>

                      <div
                        onClick={() => setDeliveryOption('scheduled')}
                        className={`p-3 rounded-md cursor-pointer border ${
                          deliveryOption === 'scheduled'
                            ? isDarkMode
                              ? 'border-amber-600 bg-amber-900/30'
                              : 'border-amber-500 bg-amber-50'
                            : isDarkMode
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Clock
                              size={18}
                              className={
                                isDarkMode ? 'text-amber-400' : 'text-amber-600'
                              }
                            />
                            <span className="ml-2 font-medium">
                              Scheduled Delivery
                            </span>
                          </div>
                          <span
                            className={
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }
                          >
                            $4.99
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Choose your preferred time
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date and time selector */}
          <div
            className={`mt-4 pt-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-neutral-200'
            } flex flex-wrap gap-4`}
          >
            <div className="relative date-picker-container">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-opacity-80 transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-neutral-100 text-gray-700 hover:bg-neutral-200'
                }`}
              >
                <Calendar size={18} />
                <span>{deliveryDate.toLocaleDateString()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showDatePicker ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showDatePicker && (
                <div
                  className={`absolute z-10 mt-2 p-4 rounded-md shadow-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div
                    className={`mb-2 pb-2 border-b ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <h3
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Select Date
                    </h3>
                  </div>
                  {/* Simple date picker UI - would use a proper calendar component in production */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setDeliveryDate(date);
                            setShowDatePicker(false);
                          }}
                          className={`p-2 rounded-md text-center ${
                            date.toDateString() === deliveryDate.toDateString()
                              ? isDarkMode
                                ? 'bg-amber-900/50 text-amber-400'
                                : 'bg-amber-100 text-amber-800'
                              : isDarkMode
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-neutral-100'
                          }`}
                        >
                          <div
                            className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                            }`}
                          >
                            {date.toLocaleDateString('en-US', {
                              weekday: 'short',
                            })}
                          </div>
                          <div className="font-medium">{date.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 border-none focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-neutral-100 text-gray-700'
              }`}
            >
              <option value="9:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
        </div>

        {/* Smart reorder suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Zap
                size={20}
                className={
                  isDarkMode ? 'text-amber-400 mr-2' : 'text-amber-500 mr-2'
                }
              />
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-neutral-800'
                }`}
              >
                Recommended For You
              </h2>
            </div>

            {suggestionsLoading ? (
              <div
                className={`flex justify-center py-8 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-sm`}
              >
                <Loader2
                  className={`animate-spin ${
                    isDarkMode ? 'text-amber-400' : 'text-amber-500'
                  }`}
                  size={24}
                />
                <span
                  className={`ml-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Personalizing recommendations...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {suggestions.map((product) => (
                  <motion.div
                    key={`reorder-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-center p-4`}
                  >
                    <div className="relative">
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          isDarkMode
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        <Sparkles size={12} />
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3
                        className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-neutral-800'
                        }`}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center">
                        <p
                          className={`text-sm ${
                            isDarkMode ? 'text-amber-400' : 'text-amber-600'
                          }`}
                        >
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex ml-2">
                          {[...Array(Math.floor(product.rating))].map(
                            (_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className="text-amber-400 fill-current"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className={`ml-4 p-2 rounded-full transition-colors ${
                        isDarkMode
                          ? 'bg-amber-900/50 hover:bg-amber-800/70 text-amber-400'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      }`}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={20}
                className={isDarkMode ? 'text-gray-500' : 'text-neutral-400'}
              />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for cakes, pastries, bread..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-neutral-200 text-gray-900'
              }`}
            />
          </div>

          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className={`px-4 py-3 border rounded-lg flex items-center space-x-2 transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-neutral-200 text-gray-700 hover:bg-neutral-50'
              }`}
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>

            {filterMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-10 p-4 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                }`}
              >
                <h3
                  className={`font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-neutral-800'
                  }`}
                >
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['All', 'Bread', 'Cake', 'Pastry', 'Dessert'].map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedCategory === category
                            ? isDarkMode
                              ? 'bg-amber-900/50 text-amber-400'
                              : 'bg-amber-100 text-amber-800'
                            : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {category}
                      </button>
                    )
                  )}
                </div>

                <h3
                  className={`font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-neutral-800'
                  }`}
                >
                  Dietary Preferences
                </h3>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryFilters.vegan}
                      onChange={() => handleFilterChange('dietary', 'vegan')}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : ''}>
                      Vegan
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dietaryFilters.glutenFree}
                      onChange={() =>
                        handleFilterChange('dietary', 'glutenFree')
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : ''}>
                      Gluten Free
                    </span>
                  </label>
                </div>

                <h3
                  className={`font-medium mb-3 ${
                    isDarkMode ? 'text-white' : 'text-neutral-800'
                  }`}
                >
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, Number.parseInt(e.target.value)])
                    }
                    className={`w-full h-2 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-neutral-200'
                    } rounded-lg appearance-none cursor-pointer`}
                  />
                  <div
                    className={`flex justify-between mt-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                    }`}
                  >
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg ${
                viewMode === 'grid'
                  ? isDarkMode
                    ? 'bg-amber-900/50 text-amber-400'
                    : 'bg-amber-100 text-amber-800'
                  : isDarkMode
                  ? 'bg-gray-800 border border-gray-700 text-gray-300'
                  : 'bg-white border border-neutral-200 text-neutral-500'
              }`}
              aria-label="Grid view"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg ${
                viewMode === 'list'
                  ? isDarkMode
                    ? 'bg-amber-900/50 text-amber-400'
                    : 'bg-amber-100 text-amber-800'
                  : isDarkMode
                  ? 'bg-gray-800 border border-gray-700 text-gray-300'
                  : 'bg-white border border-neutral-200 text-neutral-500'
              }`}
              aria-label="List view"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product display */}
        {filteredProducts.length === 0 ? (
          <div
            className={`py-12 text-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-sm`}
          >
            <AlertCircle
              className={`mx-auto mb-4 ${
                isDarkMode ? 'text-amber-400' : 'text-amber-500'
              }`}
              size={48}
            />
            <p
              className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-neutral-500'
              }`}
            >
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietaryFilters({ vegan: false, glutenFree: false });
                setPriceRange([0, 50]);
              }}
              className={`mt-4 px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors ${
                isDarkMode
                  ? 'bg-amber-900/50 text-amber-400'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                    className={`${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="relative">
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onClick={() => handleProductSelect(product)}
                      />

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all ${
                          isDarkMode
                            ? 'bg-gray-900 bg-opacity-80'
                            : 'bg-white bg-opacity-80'
                        }`}
                        aria-label={
                          favoriteItems.includes(product.id)
                            ? 'Remove from favorites'
                            : 'Add to favorites'
                        }
                      >
                        <Heart
                          size={18}
                          className={
                            favoriteItems.includes(product.id)
                              ? 'text-red-500 fill-red-500'
                              : isDarkMode
                              ? 'text-gray-400'
                              : 'text-neutral-400'
                          }
                        />
                      </button>

                      {product.tags.includes('bestseller') && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md">
                          Bestseller
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className={`font-medium text-lg cursor-pointer hover:text-amber-500 ${
                            isDarkMode ? 'text-white' : 'text-neutral-800'
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          {product.name}
                        </h3>
                        <span
                          className={`font-semibold ${
                            isDarkMode ? 'text-amber-400' : 'text-amber-800'
                          }`}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-current'
                                  : 'stroke-current fill-transparent'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span
                          className={`text-xs ml-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                          }`}
                        >
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className={`px-2 py-1 text-xs rounded-md ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {allergen}
                          </span>
                        ))}
                        {product.isVegan && (
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${
                              isDarkMode
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            Vegan
                          </span>
                        )}
                        {product.isGlutenFree && (
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${
                              isDarkMode
                                ? 'bg-purple-900/30 text-purple-400'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            Gluten-Free
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleProductSelect(product)}
                          className={`flex-grow px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 ${
                            isDarkMode
                              ? 'bg-amber-700 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          <span>Customize</span>
                          <Coffee size={18} />
                        </button>

                        <button
                          onClick={() => addToCart(product)}
                          className={`px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors flex items-center justify-center ${
                            isDarkMode
                              ? 'bg-amber-900/50 text-amber-400'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // List view
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    key={product.id}
                    className={`rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-md"
                      onClick={() => handleProductSelect(product)}
                    />

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3
                            className={`font-medium text-lg hover:text-amber-500 cursor-pointer ${
                              isDarkMode ? 'text-white' : 'text-neutral-800'
                            }`}
                            onClick={() => handleProductSelect(product)}
                          >
                            {product.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                            }`}
                          >
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-semibold text-lg ${
                              isDarkMode ? 'text-amber-400' : 'text-amber-800'
                            }`}
                          >
                            ${product.price.toFixed(2)}
                          </span>
                          <div className="flex items-center mt-1">
                            <span className="text-amber-500">
                              {product.rating}
                            </span>
                            <Star size={16} className="text-amber-500 ml-1" />
                            <span
                              className={`text-xs ml-1 ${
                                isDarkMode
                                  ? 'text-gray-400'
                                  : 'text-neutral-500'
                              }`}
                            >
                              ({product.reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 text-xs rounded-full ${
                              isDarkMode
                                ? 'bg-amber-900/30 text-amber-400'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {product.allergens.map((allergen) => (
                            <span
                              key={allergen}
                              className={`px-2 py-1 text-xs rounded-md ${
                                isDarkMode
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {allergen}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className={`p-2 rounded-full transition-colors ${
                              favoriteItems.includes(product.id)
                                ? isDarkMode
                                  ? 'bg-red-900/30 text-red-400'
                                  : 'bg-red-50 text-red-500'
                                : isDarkMode
                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                            }`}
                          >
                            <Heart
                              size={18}
                              className={
                                favoriteItems.includes(product.id)
                                  ? 'fill-current'
                                  : ''
                              }
                            />
                          </button>

                          <button
                            onClick={() => handleProductSelect(product)}
                            className={`px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center space-x-2 ${
                              isDarkMode
                                ? 'bg-amber-700 text-white'
                                : 'bg-amber-600 text-white'
                            }`}
                          >
                            <span>Customize</span>
                            <Coffee size={18} />
                          </button>

                          <button
                            onClick={() => addToCart(product)}
                            className={`px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors flex items-center space-x-2 ${
                              isDarkMode
                                ? 'bg-amber-900/50 text-amber-400'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <ShoppingCart size={18} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recently viewed products */}
        {recentlyViewed.length > 0 && (
          <div className="mt-12">
            <h2
              className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-neutral-800'
              }`}
            >
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((product) => (
                <motion.div
                  key={`recent-${product.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                    onClick={() => handleProductSelect(product)}
                  />
                  <h3
                    className={`font-medium text-sm truncate ${
                      isDarkMode ? 'text-white' : 'text-neutral-800'
                    }`}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-amber-400' : 'text-amber-800'
                      }`}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className={`p-2 rounded-full hover:bg-opacity-80 transition-colors ${
                        isDarkMode
                          ? 'bg-amber-900/30 text-amber-400'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Product customization modal */}
        <AnimatePresence>
          {customizationOpen && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              {/* Backdrop with blur effect */}
              <div
                className={`fixed inset-0 ${
                  isDarkMode ? 'bg-gray-900/70' : 'bg-black/50'
                } backdrop-blur-md`}
                onClick={() => setCustomizationOpen(false)}
              />

              <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <motion.div
                  ref={modalRef}
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white'
                  } shadow-2xl relative`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`sticky top-0 z-10 p-4 flex items-center justify-between border-b ${
                      isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                        : 'bg-white/90 backdrop-blur-sm border-neutral-200'
                    }`}
                  >
                    <h2
                      className={`text-xl font-semibold ${
                        isDarkMode ? 'text-white' : 'text-neutral-800'
                      }`}
                    >
                      Customize Your Order
                    </h2>
                    <button
                      onClick={() => setCustomizationOpen(false)}
                      className={`p-2 rounded-full transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400'
                          : 'hover:bg-neutral-100 text-gray-500'
                      }`}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/2">
                        <div className="relative">
                          <img
                            src={selectedProduct.image || '/placeholder.svg'}
                            alt={selectedProduct.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          {favoriteItems.includes(selectedProduct.id) && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                              <Heart size={16} className="fill-current" />
                            </div>
                          )}
                        </div>

                        <div
                          className={`mt-4 p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                          }`}
                        >
                          <h3
                            className={`font-medium mb-2 ${
                              isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            Product Description
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
                            {selectedProduct.description ||
                              'A delicious treat from our bakery.'}
                          </p>
                        </div>

                        {showARPreview && (
                          <div
                            className={`mt-4 p-4 text-center rounded-lg ${
                              isDarkMode ? 'bg-gray-700' : 'bg-neutral-100'
                            }`}
                          >
                            <Camera
                              size={24}
                              className={`mx-auto mb-2 ${
                                isDarkMode
                                  ? 'text-gray-400'
                                  : 'text-neutral-600'
                              }`}
                            />
                            <p
                              className={`text-sm ${
                                isDarkMode
                                  ? 'text-gray-400'
                                  : 'text-neutral-600'
                              }`}
                            >
                              AR preview available
                            </p>
                            <button
                              className={`mt-2 px-4 py-2 rounded-md w-full hover:bg-opacity-90 transition-colors ${
                                isDarkMode
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-amber-600 text-white'
                              }`}
                            >
                              View in Your Space
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="md:w-1/2">
                        <h3
                          className={`text-2xl font-semibold mb-2 ${
                            isDarkMode ? 'text-white' : 'text-neutral-800'
                          }`}
                        >
                          {selectedProduct.name}
                        </h3>

                        <div className="flex items-center mb-4">
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={
                                  i < Math.floor(selectedProduct.rating)
                                    ? 'fill-current'
                                    : ''
                                }
                              />
                            ))}
                          </div>
                          <span
                            className={`ml-2 text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                            }`}
                          >
                            {selectedProduct.reviews} reviews
                          </span>
                        </div>

                        <div className="space-y-6">
                          {/* Size selection */}
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                isDarkMode
                                  ? 'text-gray-300'
                                  : 'text-neutral-700'
                              }`}
                            >
                              Size
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {['Small', 'Medium', 'Large'].map((size) => (
                                <button
                                  key={size}
                                  onClick={() =>
                                    setCustomizations((prev) => ({
                                      ...prev,
                                      size,
                                    }))
                                  }
                                  className={`py-2 px-4 rounded-md border-2 transition-colors ${
                                    customizations.size === size
                                      ? isDarkMode
                                        ? 'border-amber-600 bg-amber-900/30 text-amber-400'
                                        : 'border-amber-600 bg-amber-50 text-amber-800'
                                      : isDarkMode
                                      ? 'border-gray-700 hover:border-gray-600 text-gray-300'
                                      : 'border-neutral-200 hover:border-neutral-300 text-gray-700'
                                  }`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Special instructions */}
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                isDarkMode
                                  ? 'text-gray-300'
                                  : 'text-neutral-700'
                              }`}
                            >
                              Special Instructions
                            </label>
                            <textarea
                              value={specialInstructions}
                              onChange={(e) =>
                                setSpecialInstructions(e.target.value)
                              }
                              placeholder="Any special requests?"
                              className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                  : 'bg-white border-neutral-200 text-gray-900'
                              }`}
                              rows="3"
                            />
                          </div>

                          {/* Gift options */}
                          <div>
                            <label className="flex items-center space-x-2 mb-4">
                              <input
                                type="checkbox"
                                checked={giftOptions.isGift}
                                onChange={(e) =>
                                  setGiftOptions((prev) => ({
                                    ...prev,
                                    isGift: e.target.checked,
                                  }))
                                }
                                className="rounded text-amber-600 focus:ring-amber-500"
                              />
                              <span
                                className={`text-sm ${
                                  isDarkMode
                                    ? 'text-gray-300'
                                    : 'text-neutral-700'
                                }`}
                              >
                                This is a gift
                              </span>
                            </label>

                            {giftOptions.isGift && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                              >
                                <input
                                  type="text"
                                  value={giftOptions.message}
                                  onChange={(e) =>
                                    setGiftOptions((prev) => ({
                                      ...prev,
                                      message: e.target.value,
                                    }))
                                  }
                                  placeholder="Add a gift message"
                                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                    isDarkMode
                                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                      : 'bg-white border-neutral-200 text-gray-900'
                                  }`}
                                />

                                <select
                                  value={giftOptions.packaging}
                                  onChange={(e) =>
                                    setGiftOptions((prev) => ({
                                      ...prev,
                                      packaging: e.target.value,
                                    }))
                                  }
                                  className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                    isDarkMode
                                      ? 'bg-gray-700 border-gray-600 text-white'
                                      : 'bg-white border-neutral-200 text-gray-900'
                                  }`}
                                >
                                  <option value="standard">
                                    Standard Gift Box
                                  </option>
                                  <option value="premium">
                                    Premium Gift Box (+$5)
                                  </option>
                                  <option value="deluxe">
                                    Deluxe Gift Box (+$10)
                                  </option>
                                </select>
                              </motion.div>
                            )}
                          </div>

                          {/* Nutritional information */}
                          <div>
                            <button
                              onClick={() =>
                                setNutritionVisible(!nutritionVisible)
                              }
                              className={`flex items-center space-x-2 text-sm hover:text-amber-500 ${
                                isDarkMode
                                  ? 'text-gray-300'
                                  : 'text-neutral-600'
                              }`}
                            >
                              <Info size={18} />
                              <span>Nutritional Information</span>
                              <ChevronDown
                                size={18}
                                className={`transition-transform ${
                                  nutritionVisible ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {nutritionVisible && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-4 p-4 rounded-lg ${
                                  isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                                }`}
                              >
                                {nutritionLoading ? (
                                  <div className="flex justify-center py-4">
                                    <Loader2
                                      className={`animate-spin ${
                                        isDarkMode
                                          ? 'text-amber-400'
                                          : 'text-amber-500'
                                      }`}
                                      size={24}
                                    />
                                    <span
                                      className={`ml-2 ${
                                        isDarkMode
                                          ? 'text-gray-400'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      Loading nutritional information...
                                    </span>
                                  </div>
                                ) : nutrition ? (
                                  <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(nutrition).map(
                                      ([key, value]) => (
                                        <div key={key} className="text-sm">
                                          <span
                                            className={`font-medium capitalize ${
                                              isDarkMode
                                                ? 'text-gray-300'
                                                : 'text-neutral-700'
                                            }`}
                                          >
                                            {key}:
                                          </span>
                                          <span
                                            className={`ml-2 ${
                                              isDarkMode
                                                ? 'text-gray-400'
                                                : 'text-neutral-600'
                                            }`}
                                          >
                                            {key === 'calories'
                                              ? value
                                              : `${value}g`}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p
                                    className={`text-sm ${
                                      isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    Nutritional information not available for
                                    this product.
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </div>
                          {/* Quantity selector */}
                          <div>
                            <label
                              className={`block text-sm font-medium mb-2 ${
                                isDarkMode
                                  ? 'text-gray-300'
                                  : 'text-neutral-700'
                              }`}
                            >
                              Quantity
                            </label>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  if (customizations.quantity > 1) {
                                    setCustomizations((prev) => ({
                                      ...prev,
                                      quantity: prev.quantity - 1,
                                    }));
                                  }
                                }}
                                className={`p-2 rounded-md border hover:bg-opacity-80 ${
                                  isDarkMode
                                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                                    : 'border-neutral-200 hover:bg-neutral-100 text-gray-700'
                                }`}
                              >
                                <Minus size={18} />
                              </button>
                              <input
                                type="number"
                                value={customizations.quantity || 1}
                                onChange={(e) => {
                                  const value = Number.parseInt(e.target.value);
                                  if (value > 0) {
                                    setCustomizations((prev) => ({
                                      ...prev,
                                      quantity: value,
                                    }));
                                  }
                                }}
                                className={`w-20 text-center px-2 py-1 border rounded-md ${
                                  isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-neutral-200 text-gray-900'
                                }`}
                              />
                              <button
                                onClick={() =>
                                  setCustomizations((prev) => ({
                                    ...prev,
                                    quantity: (prev.quantity || 1) + 1,
                                  }))
                                }
                                className={`p-2 rounded-md border hover:bg-opacity-80 ${
                                  isDarkMode
                                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                                    : 'border-neutral-200 hover:bg-neutral-100 text-gray-700'
                                }`}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Total price calculation */}
                          <div
                            className={`mt-6 pt-6 border-t ${
                              isDarkMode
                                ? 'border-gray-700'
                                : 'border-neutral-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <span
                                className={
                                  isDarkMode
                                    ? 'text-gray-300'
                                    : 'text-neutral-600'
                                }
                              >
                                Subtotal
                              </span>
                              <span
                                className={`font-medium text-lg ${
                                  isDarkMode ? 'text-white' : 'text-neutral-800'
                                }`}
                              >
                                $
                                {(
                                  selectedProduct.price *
                                    (customizations.quantity || 1) +
                                  (giftOptions.isGift &&
                                  giftOptions.packaging !== 'standard'
                                    ? giftOptions.packaging === 'premium'
                                      ? 5
                                      : 10
                                    : 0)
                                ).toFixed(2)}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(
                                  selectedProduct,
                                  customizations.quantity || 1,
                                  {
                                    size: customizations.size,
                                    specialInstructions,
                                    giftOptions: giftOptions.isGift
                                      ? giftOptions
                                      : null,
                                  }
                                );
                                setCustomizationOpen(false);
                              }}
                              className={`w-full py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 ${
                                isDarkMode
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-amber-600 text-white'
                              }`}
                            >
                              <ShoppingCart size={20} />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout modal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              {/* Backdrop with blur effect */}
              <div
                className={`fixed inset-0 ${
                  isDarkMode ? 'bg-gray-900/70' : 'bg-black/50'
                } backdrop-blur-md`}
                onClick={() =>
                  !isProcessingOrder &&
                  !orderComplete &&
                  setIsCheckoutOpen(false)
                }
              />

              <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <motion.div
                  ref={checkoutModalRef}
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white'
                  } shadow-2xl relative`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Order complete view */}
                  {orderComplete ? (
                    <div className="p-8 text-center">
                      {showConfetti && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(50)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`absolute w-2 h-2 rounded-full ${
                                [
                                  'bg-amber-500',
                                  'bg-green-500',
                                  'bg-blue-500',
                                  'bg-purple-500',
                                  'bg-pink-500',
                                ][Math.floor(Math.random() * 5)]
                              }`}
                              initial={{
                                x: '50%',
                                y: '60%',
                              }}
                              animate={{
                                x: `${Math.random() * 100}%`,
                                y: `${Math.random() * -100}%`,
                                opacity: [1, 0.8, 0],
                              }}
                              transition={{
                                duration: 2 + Math.random() * 2,
                                ease: 'easeOut',
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                          isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                        }`}
                      >
                        <Check size={40} className="text-green-500" />
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-2xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : ''
                        }`}
                      >
                        Order Confirmed!
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`text-lg mb-6 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        Thank you for your order. Your order number is{' '}
                        <span className="font-bold">#{orderNumber}</span>
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`p-4 rounded-lg mb-6 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                        }`}
                      >
                        <p
                          className={`mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {orderType === 'pickup' ? (
                            <>
                              Your order will be ready for pickup at{' '}
                              <span className="font-bold">{deliveryTime}</span>{' '}
                              on{' '}
                              <span className="font-bold">
                                {deliveryDate.toLocaleDateString()}
                              </span>
                            </>
                          ) : (
                            <>
                              Your order will be delivered to{' '}
                              <span className="font-bold">
                                {deliveryAddress}
                              </span>{' '}
                              at{' '}
                              <span className="font-bold">{deliveryTime}</span>{' '}
                              on{' '}
                              <span className="font-bold">
                                {deliveryDate.toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          You will receive a confirmation email shortly.
                        </p>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={closeOrderComplete}
                        className={`px-6 py-3 rounded-lg ${
                          isDarkMode
                            ? 'bg-amber-700 hover:bg-amber-600'
                            : 'bg-amber-600 hover:bg-amber-700'
                        } text-white font-medium`}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`sticky top-0 z-10 p-4 flex items-center justify-between border-b ${
                          isDarkMode
                            ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                            : 'bg-white/90 backdrop-blur-sm border-neutral-200'
                        }`}
                      >
                        <h2
                          className={`text-xl font-semibold ${
                            isDarkMode ? 'text-white' : 'text-neutral-800'
                          }`}
                        >
                          Checkout
                        </h2>
                        {!isProcessingOrder && (
                          <button
                            onClick={() => setIsCheckoutOpen(false)}
                            className={`p-2 rounded-full transition-colors ${
                              isDarkMode
                                ? 'hover:bg-gray-700 text-gray-400'
                                : 'hover:bg-neutral-100 text-gray-500'
                            }`}
                          >
                            <X size={24} />
                          </button>
                        )}
                      </div>

                      <div className="p-6">
                        {isProcessingOrder ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2
                              size={48}
                              className={`animate-spin mb-4 ${
                                isDarkMode ? 'text-amber-400' : 'text-amber-500'
                              }`}
                            />
                            <h3
                              className={`text-xl font-medium mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}
                            >
                              Processing Your Order
                            </h3>
                            <p
                              className={`text-center ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Please wait while we process your order...
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* Order summary */}
                            <div className="mb-8">
                              <h3
                                className={`text-lg font-medium mb-4 ${
                                  isDarkMode ? 'text-white' : 'text-neutral-800'
                                }`}
                              >
                                Order Summary
                              </h3>

                              {cart.length === 0 ? (
                                <div
                                  className={`p-8 text-center rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                                  }`}
                                >
                                  <ShoppingCart
                                    size={48}
                                    className={`mx-auto mb-4 ${
                                      isDarkMode
                                        ? 'text-gray-500'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                  <p
                                    className={`${
                                      isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                    }`}
                                  >
                                    Your cart is empty
                                  </p>
                                  <button
                                    onClick={() => setIsCheckoutOpen(false)}
                                    className={`mt-4 px-4 py-2 rounded-md ${
                                      isDarkMode
                                        ? 'bg-amber-700 text-white'
                                        : 'bg-amber-600 text-white'
                                    }`}
                                  >
                                    Browse Products
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {cart.map((item) => (
                                    <div
                                      key={item.id}
                                      className={`p-4 rounded-lg ${
                                        isDarkMode
                                          ? 'bg-gray-700'
                                          : 'bg-white border border-gray-100'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <img
                                            src={
                                              item.image || '/placeholder.svg'
                                            }
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                          />
                                          <div>
                                            <h4
                                              className={`font-medium ${
                                                isDarkMode
                                                  ? 'text-white'
                                                  : 'text-neutral-800'
                                              }`}
                                            >
                                              {item.name}
                                            </h4>
                                            <div className="flex items-center">
                                              <p
                                                className={`text-sm ${
                                                  isDarkMode
                                                    ? 'text-gray-400'
                                                    : 'text-neutral-500'
                                                }`}
                                              >
                                                Qty: {item.quantity}
                                              </p>
                                              {item.customizations?.size && (
                                                <span
                                                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                                    isDarkMode
                                                      ? 'bg-gray-600 text-gray-300'
                                                      : 'bg-gray-200 text-gray-700'
                                                  }`}
                                                >
                                                  {item.customizations.size}
                                                </span>
                                              )}
                                            </div>
                                            {item.customizations
                                              ?.specialInstructions && (
                                              <p
                                                className={`text-sm mt-1 ${
                                                  isDarkMode
                                                    ? 'text-gray-400'
                                                    : 'text-neutral-500'
                                                }`}
                                              >
                                                Note:{' '}
                                                {
                                                  item.customizations
                                                    .specialInstructions
                                                }
                                              </p>
                                            )}
                                            {item.customizations?.giftOptions
                                              ?.isGift && (
                                              <div
                                                className={`mt-1 flex items-center text-xs ${
                                                  isDarkMode
                                                    ? 'text-amber-400'
                                                    : 'text-amber-600'
                                                }`}
                                              >
                                                <Gift
                                                  size={12}
                                                  className="mr-1"
                                                />
                                                Gift
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p
                                            className={`font-medium ${
                                              isDarkMode
                                                ? 'text-white'
                                                : 'text-neutral-800'
                                            }`}
                                          >
                                            $
                                            {(
                                              item.price * item.quantity
                                            ).toFixed(2)}
                                          </p>
                                          <button
                                            onClick={() =>
                                              removeFromCart(item.id)
                                            }
                                            className={`text-sm ${
                                              isDarkMode
                                                ? 'text-red-400 hover:text-red-300'
                                                : 'text-red-500 hover:text-red-600'
                                            }`}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Promo code section */}
                            <div className="mb-8">
                              {showPromoInput ? (
                                <div
                                  className={`p-4 rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                                  }`}
                                >
                                  <div className="flex items-center mb-2">
                                    <h3
                                      className={`text-sm font-medium ${
                                        isDarkMode
                                          ? 'text-white'
                                          : 'text-neutral-800'
                                      }`}
                                    >
                                      Promo Code
                                    </h3>
                                    <button
                                      onClick={() => setShowPromoInput(false)}
                                      className={`ml-auto text-sm ${
                                        isDarkMode
                                          ? 'text-gray-400'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <div className="flex">
                                    <input
                                      type="text"
                                      value={promoCode}
                                      onChange={(e) =>
                                        setPromoCode(e.target.value)
                                      }
                                      placeholder="Enter promo code"
                                      className={`flex-grow px-3 py-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                        isDarkMode
                                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                          : 'bg-white border-neutral-200 text-gray-900'
                                      } ${
                                        isPromoValid === false
                                          ? 'border-red-500'
                                          : ''
                                      }`}
                                    />
                                    <button
                                      onClick={validatePromoCode}
                                      className={`px-4 py-2 rounded-r-md ${
                                        isDarkMode
                                          ? 'bg-amber-700 text-white'
                                          : 'bg-amber-600 text-white'
                                      }`}
                                    >
                                      Apply
                                    </button>
                                  </div>
                                  {isPromoValid === false && (
                                    <p className="text-red-500 text-sm mt-1">
                                      Invalid promo code
                                    </p>
                                  )}
                                  {isPromoValid === true && (
                                    <p
                                      className={`text-sm mt-1 ${
                                        isDarkMode
                                          ? 'text-green-400'
                                          : 'text-green-600'
                                      }`}
                                    >
                                      {appliedPromo.description}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowPromoInput(true)}
                                  className={`flex items-center text-sm ${
                                    isDarkMode
                                      ? 'text-amber-400 hover:text-amber-300'
                                      : 'text-amber-600 hover:text-amber-700'
                                  }`}
                                >
                                  <Percent size={16} className="mr-1" />
                                  Add promo code
                                </button>
                              )}
                            </div>

                            {/* Payment method selection */}
                            <div className="mb-8">
                              <div className="flex items-center justify-between mb-4">
                                <h3
                                  className={`text-lg font-medium ${
                                    isDarkMode
                                      ? 'text-white'
                                      : 'text-neutral-800'
                                  }`}
                                >
                                  Payment Method
                                </h3>
                                <button
                                  onClick={() =>
                                    setShowPaymentOptions(!showPaymentOptions)
                                  }
                                  className={`text-sm ${
                                    isDarkMode
                                      ? 'text-amber-400 hover:text-amber-300'
                                      : 'text-amber-600 hover:text-amber-700'
                                  }`}
                                >
                                  {showPaymentOptions
                                    ? 'Hide options'
                                    : 'Change'}
                                </button>
                              </div>

                              {showPaymentOptions ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {[
                                    'card',
                                    'paypal',
                                    'applepay',
                                    'googlepay',
                                  ].map((method) => (
                                    <button
                                      key={method}
                                      onClick={() => setPaymentMethod(method)}
                                      className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition-colors ${
                                        paymentMethod === method
                                          ? isDarkMode
                                            ? 'border-amber-600 bg-amber-900/30'
                                            : 'border-amber-600 bg-amber-50'
                                          : isDarkMode
                                          ? 'border-gray-700 hover:border-gray-600'
                                          : 'border-neutral-200 hover:border-neutral-300'
                                      }`}
                                    >
                                      <CreditCard
                                        size={24}
                                        className={
                                          isDarkMode
                                            ? 'text-gray-300'
                                            : 'text-neutral-600'
                                        }
                                      />
                                      <span
                                        className={`font-medium capitalize ${
                                          isDarkMode ? 'text-white' : ''
                                        }`}
                                      >
                                        {method.replace('pay', ' Pay')}
                                      </span>
                                      {paymentMethod === method && (
                                        <Check
                                          size={20}
                                          className="text-amber-600 ml-auto"
                                        />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div
                                  className={`p-4 rounded-lg ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                                  } flex items-center justify-between`}
                                >
                                  <div className="flex items-center">
                                    {paymentMethod === 'card' && (
                                      <>
                                        <CreditCard
                                          size={20}
                                          className={
                                            isDarkMode
                                              ? 'text-gray-300'
                                              : 'text-gray-600'
                                          }
                                        />
                                        <span
                                          className={`ml-2 ${
                                            isDarkMode
                                              ? 'text-white'
                                              : 'text-gray-800'
                                          }`}
                                        >
                                          •••• 4242
                                        </span>
                                      </>
                                    )}
                                    {paymentMethod === 'paypal' && (
                                      <>
                                        <Wallet
                                          size={20}
                                          className={
                                            isDarkMode
                                              ? 'text-gray-300'
                                              : 'text-gray-600'
                                          }
                                        />
                                        <span
                                          className={`ml-2 ${
                                            isDarkMode
                                              ? 'text-white'
                                              : 'text-gray-800'
                                          }`}
                                        >
                                          PayPal
                                        </span>
                                      </>
                                    )}
                                    {paymentMethod === 'applepay' && (
                                      <>
                                        <Wallet
                                          size={20}
                                          className={
                                            isDarkMode
                                              ? 'text-gray-300'
                                              : 'text-gray-600'
                                          }
                                        />
                                        <span
                                          className={`ml-2 ${
                                            isDarkMode
                                              ? 'text-white'
                                              : 'text-gray-800'
                                          }`}
                                        >
                                          Apple Pay
                                        </span>
                                      </>
                                    )}
                                    {paymentMethod === 'googlepay' && (
                                      <>
                                        <Wallet
                                          size={20}
                                          className={
                                            isDarkMode
                                              ? 'text-gray-300'
                                              : 'text-gray-600'
                                          }
                                        />
                                        <span
                                          className={`ml-2 ${
                                            isDarkMode
                                              ? 'text-white'
                                              : 'text-gray-800'
                                          }`}
                                        >
                                          Google Pay
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <ShieldCheck
                                    size={20}
                                    className={
                                      isDarkMode
                                        ? 'text-gray-400'
                                        : 'text-gray-500'
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            {/* Order details and totals */}
                            <div
                              className={`rounded-lg p-6 ${
                                isDarkMode ? 'bg-gray-700' : 'bg-neutral-50'
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span
                                    className={
                                      isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-neutral-600'
                                    }
                                  >
                                    Subtotal
                                  </span>
                                  <span>${subtotal.toFixed(2)}</span>
                                </div>

                                {discount > 0 && (
                                  <div className="flex justify-between text-green-500">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                  </div>
                                )}

                                <div className="flex justify-between">
                                  <span
                                    className={
                                      isDarkMode
                                        ? 'text-gray-300'
                                        : 'text-neutral-600'
                                    }
                                  >
                                    Tax
                                  </span>
                                  <span>${tax.toFixed(2)}</span>
                                </div>

                                {orderType === 'delivery' && (
                                  <div className="flex justify-between">
                                    <span
                                      className={
                                        isDarkMode
                                          ? 'text-gray-300'
                                          : 'text-neutral-600'
                                      }
                                    >
                                      Delivery Fee
                                      {appliedPromo?.freeShipping && (
                                        <span className="ml-2 line-through text-sm">
                                          $4.99
                                        </span>
                                      )}
                                    </span>
                                    <span>
                                      {appliedPromo?.freeShipping ? (
                                        <span className="text-green-500">
                                          FREE
                                        </span>
                                      ) : (
                                        `$${deliveryFee.toFixed(2)}`
                                      )}
                                    </span>
                                  </div>
                                )}

                                <div
                                  className={`pt-3 border-t ${
                                    isDarkMode
                                      ? 'border-gray-600'
                                      : 'border-neutral-200'
                                  }`}
                                >
                                  <div className="flex justify-between text-lg font-semibold">
                                    <span
                                      className={
                                        isDarkMode
                                          ? 'text-white'
                                          : 'text-neutral-800'
                                      }
                                    >
                                      Total
                                    </span>
                                    <span
                                      className={
                                        isDarkMode
                                          ? 'text-white'
                                          : 'text-neutral-800'
                                      }
                                    >
                                      ${total.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Place order button */}
                            <button
                              onClick={placeOrder}
                              disabled={cart.length === 0}
                              className={`mt-8 w-full py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                                cart.length === 0
                                  ? isDarkMode
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : isDarkMode
                                  ? 'bg-amber-700 text-white hover:bg-amber-600'
                                  : 'bg-amber-600 text-white hover:bg-amber-700'
                              }`}
                            >
                              <Check size={24} />
                              <span>Place Order</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ToastContainer
        theme={isDarkMode ? 'dark' : 'light'}
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderComponent;
