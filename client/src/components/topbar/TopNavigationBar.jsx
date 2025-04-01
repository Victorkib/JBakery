'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Cake,
  Clock,
  Heart,
  LogOut,
  Settings,
  LayoutDashboard,
  Users,
  ChevronDown,
  Home,
  Info,
  Phone,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ShoppingBasket,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Coffee,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const TopNavigationBar = () => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Use theme context instead of local state
  const { isDarkMode, toggleTheme } = useTheme();

  // Refs for click outside detection
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const homeMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Router and Redux hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items || []);
  const notifications = [
    { id: 1, title: 'New offer available!', read: false, time: '5m ago' },
    { id: 2, title: 'Your order has been shipped', read: true, time: '2h ago' },
    { id: 3, title: 'Welcome to JB Bakery!', read: true, time: '1d ago' },
  ];

  const isAdmin = user?.role === 'admin';
  const isHomePage = location.pathname === '/';

  // Languages available
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  // Handle smooth scrolling for homepage sections
  const scrollToSection = useCallback(
    (id) => {
      if (isHomePage) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      } else {
        navigate('/', { state: { scrollToId: id } });
      }
      setIsHomeMenuOpen(false);
    },
    [isHomePage, navigate]
  );

  // Handle scrolling after navigation
  useEffect(() => {
    if (location.state?.scrollToId && isHomePage) {
      const id = location.state.scrollToId;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 500);
    }
  }, [location.state, isHomePage]);

  // Home page sections for dropdown
  const homeSections = [
    { name: 'Menu', icon: <Coffee size={18} />, id: 'menu' },
    { name: 'About Us', icon: <Info size={18} />, id: 'about' },
    { name: 'Contact', icon: <Phone size={18} />, id: 'contact' },
    { name: 'Testimonials', icon: <Heart size={18} />, id: 'testimonials' },
    { name: 'Gallery', icon: <Cake size={18} />, id: 'gallery' },
  ];

  // Main navigation links
  const navigationLinks = [
    {
      name: 'Home',
      icon: <Home size={18} />,
      action: () => navigate('/'),
      alwaysShow: true,
    },
    {
      name: 'Sections',
      icon: <Home size={18} />,
      action: () => setIsHomeMenuOpen(!isHomeMenuOpen),
      hasDropdown: true,
      alwaysShow: true,
    },
  ];

  // User-specific links
  const userLinks = [
    {
      name: 'Order History',
      icon: <Clock size={18} />,
      action: () => navigate('/orders'),
      showWhen: isAuthenticated,
    },
    {
      name: 'Favorites',
      icon: <Heart size={18} />,
      action: () => navigate('/favorites'),
      showWhen: isAuthenticated,
    },
    {
      name: 'Saved Items',
      icon: <Bookmark size={18} />,
      action: () => navigate('/saved'),
      showWhen: isAuthenticated,
    },
    {
      name: 'Payment Methods',
      icon: <CreditCard size={18} />,
      action: () => navigate('/payment-methods'),
      showWhen: isAuthenticated,
    },
  ];

  // Admin links
  const adminLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate('/');
    setIsProfileMenuOpen(false);
  }, [dispatch, navigate]);

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    },
    [searchQuery, navigate]
  );

  // Change language
  const changeLanguage = useCallback((language) => {
    setCurrentLanguage(language.name);
    setIsLanguageMenuOpen(false);
  }, []);

  // Generate breadcrumbs based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setBreadcrumbs([]);
      return;
    }

    const segments = path.split('/').filter(Boolean);
    const crumbs = segments.map((segment, index) => {
      const url = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        name:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        url,
      };
    });

    const newBreadcrumbsString = JSON.stringify([
      { name: 'Home', url: '/' },
      ...crumbs,
    ]);
    const currentBreadcrumbsString = JSON.stringify(breadcrumbs);

    if (newBreadcrumbsString !== currentBreadcrumbsString) {
      setBreadcrumbs([{ name: 'Home', url: '/' }, ...crumbs]);
    }
  }, [location.pathname]);

  // Update cart count from Redux store
  useEffect(() => {
    const currentCartCount = cart?.length || 0;
    if (cartCount !== currentCartCount) {
      setCartCount(currentCartCount);
    }
  }, [cart?.length]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close all menus when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsAdminMenuOpen(false);
    setIsHomeMenuOpen(false);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
      if (isAdminMenuOpen && !event.target.closest('.admin-menu')) {
        setIsAdminMenuOpen(false);
      }
      if (
        isHomeMenuOpen &&
        !event.target.closest('.home-menu') &&
        homeMenuRef.current &&
        !homeMenuRef.current.contains(event.target)
      ) {
        setIsHomeMenuOpen(false);
      }
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
      if (
        isNotificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        isLanguageMenuOpen &&
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    isProfileMenuOpen,
    isAdminMenuOpen,
    isHomeMenuOpen,
    isSearchOpen,
    isNotificationsOpen,
    isLanguageMenuOpen,
  ]);

  // Animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    hidden: {
      y: -50,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    // This would typically update your notifications in your state management
    console.log('Marking all notifications as read');
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isDarkMode ? 'dark bg-gray-900/90 text-white' : 'bg-white/90'
        } backdrop-blur-lg ${isScrolled ? 'shadow-md py-2' : 'py-3'}`}
        initial="visible"
        animate="visible"
        variants={navbarVariants}
      >
        <div className="container mx-auto px-4 flex justify-between items-center relative">
          {/* Logo */}
          <motion.div
            className="cursor-pointer flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <h1
              className={`text-2xl font-bold ${
                isDarkMode
                  ? 'bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent'
              }`}
            >
              JB Bakery
            </h1>
          </motion.div>

          {/* Breadcrumbs - Only show on non-home pages and desktop */}
          {!isHomePage && breadcrumbs.length > 0 && (
            <div className="hidden md:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                  )}
                  <button
                    onClick={() => navigate(crumb.url)}
                    className={`hover:text-amber-500 transition-colors ${
                      index === breadcrumbs.length - 1
                        ? 'font-medium text-amber-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </motion.button>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center gap-1 lg:gap-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Main navigation links */}
            {navigationLinks.map((item) => (
              <div
                key={item.name}
                className={item.hasDropdown ? 'relative home-menu' : ''}
                ref={item.hasDropdown ? homeMenuRef : null}
              >
                <motion.button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                    isDarkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  onClick={item.action}
                  aria-expanded={item.hasDropdown ? isHomeMenuOpen : undefined}
                  aria-haspopup={item.hasDropdown ? 'true' : undefined}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={16}
                      className={
                        isHomeMenuOpen
                          ? 'transform rotate-180 transition-transform'
                          : 'transition-transform'
                      }
                    />
                  )}
                </motion.button>

                {/* Home dropdown menu */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isHomeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute left-0 mt-1 w-64 rounded-md shadow-lg py-1 z-50 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                        role="menu"
                      >
                        <div
                          className={`px-4 py-2 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            Home Page Sections
                          </p>
                        </div>
                        {homeSections.map((section) => (
                          <motion.button
                            key={section.name}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            whileHover={{ x: 5 }}
                            onClick={() => scrollToSection(section.id)}
                            role="menuitem"
                          >
                            {section.icon}
                            {section.name}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Admin Menu */}
            {isAdmin && (
              <div className="relative admin-menu">
                <motion.button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${
                    isDarkMode
                      ? 'text-gray-200 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  aria-expanded={isAdminMenuOpen}
                  aria-haspopup="true"
                >
                  <LayoutDashboard size={18} />
                  <span>Admin</span>
                  <ChevronDown
                    size={16}
                    className={
                      isAdminMenuOpen
                        ? 'transform rotate-180 transition-transform'
                        : 'transition-transform'
                    }
                  />
                </motion.button>

                <AnimatePresence>
                  {isAdminMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg py-1 z-50 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                      role="menu"
                    >
                      {adminLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                          }`}
                          onClick={() => setIsAdminMenuOpen(false)}
                          role="menuitem"
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-1 ml-2">
              {/* Search button */}
              <div className="relative" ref={searchRef}>
                <motion.button
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-expanded={isSearchOpen}
                  aria-label="Search"
                >
                  <Search
                    size={20}
                    className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  />
                </motion.button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, width: '200px' }}
                      animate={{ opacity: 1, y: 0, width: '300px' }}
                      exit={{ opacity: 0, y: 10, width: '200px' }}
                      className={`absolute right-0 mt-2 p-3 rounded-md shadow-lg z-50 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <form
                        onSubmit={handleSearch}
                        className="flex items-center"
                      >
                        <input
                          type="text"
                          placeholder="Search products, recipes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full p-2 rounded-l-md border ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          aria-label="Search query"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-amber-500 text-white rounded-r-md hover:bg-amber-600"
                          aria-label="Submit search"
                        >
                          <Search size={20} />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <motion.button
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                aria-label={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-amber-400" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </motion.button>

              {/* Language selector */}
              <div className="relative" ref={languageMenuRef}>
                <motion.button
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  aria-expanded={isLanguageMenuOpen}
                  aria-haspopup="true"
                  aria-label="Select language"
                >
                  <Globe
                    size={20}
                    className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  />
                </motion.button>

                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 z-50 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                      }`}
                      role="menu"
                    >
                      {languages.map((language) => (
                        <motion.button
                          key={language.code}
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            currentLanguage === language.name
                              ? 'bg-amber-50 text-amber-600'
                              : isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          whileHover={{ x: 5 }}
                          onClick={() => changeLanguage(language)}
                          role="menuitem"
                        >
                          {language.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications */}
              {isAuthenticated && (
                <div className="relative" ref={notificationsRef}>
                  <motion.button
                    className={`p-2 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    } relative`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    aria-expanded={isNotificationsOpen}
                    aria-haspopup="true"
                    aria-label="Notifications"
                  >
                    <Bell
                      size={20}
                      className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    />
                    {notifications.some((n) => !n.read) && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                        aria-label="Unread notifications"
                      ></span>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-50 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                        role="menu"
                      >
                        <div
                          className={`px-4 py-2 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          } flex justify-between items-center`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            Notifications
                          </p>
                          <button
                            className="text-xs text-amber-500 hover:text-amber-600"
                            onClick={markAllAsRead}
                          >
                            Mark all as read
                          </button>
                        </div>
                        {notifications.length > 0 ? (
                          <>
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 border-b ${
                                  isDarkMode
                                    ? 'border-gray-700'
                                    : 'border-gray-100'
                                } ${
                                  !notification.read
                                    ? isDarkMode
                                      ? 'bg-gray-700/50'
                                      : 'bg-amber-50/50'
                                    : ''
                                }`}
                                role="menuitem"
                              >
                                <div className="flex justify-between">
                                  <p
                                    className={`text-sm font-medium ${
                                      isDarkMode
                                        ? 'text-gray-200'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span
                                      className="w-2 h-2 bg-amber-500 rounded-full"
                                      aria-label="Unread"
                                    ></span>
                                  )}
                                </div>
                                <p
                                  className={`text-xs ${
                                    isDarkMode
                                      ? 'text-gray-400'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {notification.time}
                                </p>
                              </div>
                            ))}
                            <div className="px-4 py-2">
                              <button
                                className="w-full text-center text-sm text-amber-500 hover:text-amber-600"
                                onClick={() => {
                                  navigate('/notifications');
                                  setIsNotificationsOpen(false);
                                }}
                              >
                                View all notifications
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              No notifications yet
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Shopping cart */}
              <Link to="/dashboard">
                <motion.button
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  } relative`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Shopping cart"
                >
                  <ShoppingBasket
                    size={20}
                    className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center"
                      aria-label={`${cartCount} items in cart`}
                    >
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              </Link>

              {/* Profile / Login button */}
              <div className="relative profile-menu">
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isDarkMode
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/auth');
                    } else {
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }
                  }}
                  aria-expanded={
                    isAuthenticated ? isProfileMenuOpen : undefined
                  }
                  aria-haspopup={isAuthenticated ? 'true' : undefined}
                >
                  {!isAuthenticated ? (
                    <>
                      Login
                      <User size={18} />
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline-block">
                        {user?.name?.split(' ')[0] || 'Profile'}
                      </span>
                      <User size={18} />
                    </>
                  )}
                </motion.button>

                {/* Profile dropdown menu */}
                {isAuthenticated && (
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 z-50 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                        role="menu"
                      >
                        <div
                          className={`px-4 py-3 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            {user?.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <div className="mt-2 inline-block px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                              Admin
                            </div>
                          )}
                        </div>

                        {/* User links */}
                        {userLinks.map((item) => (
                          <button
                            key={item.name}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                            onClick={() => {
                              item.action();
                              setIsProfileMenuOpen(false);
                            }}
                            role="menuitem"
                          >
                            {item.icon}
                            {item.name}
                          </button>
                        ))}

                        <div
                          className={`border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          } my-1`}
                        ></div>

                        <Link
                          to="/profile"
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                          }`}
                          onClick={() => setIsProfileMenuOpen(false)}
                          role="menuitem"
                        >
                          <User size={16} />
                          Your Profile
                        </Link>

                        <Link
                          to="/settings"
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            isDarkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                          }`}
                          onClick={() => setIsProfileMenuOpen(false)}
                          role="menuitem"
                        >
                          <Settings size={16} />
                          Settings
                        </Link>

                        <button
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                            isDarkMode
                              ? 'text-red-400 hover:bg-gray-700'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          onClick={handleLogout}
                          role="menuitem"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className={`fixed top-0 right-0 h-screen w-80 shadow-lg z-50 overflow-y-auto ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="p-6 space-y-6">
              {/* Header with close button */}
              <div className="flex justify-between items-center">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent'
                  }`}
                >
                  JB Bakery
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Close menu"
                >
                  <X
                    size={24}
                    className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  />
                </motion.button>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products, recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full p-3 rounded-l-md border ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  aria-label="Search query"
                />
                <button
                  type="submit"
                  className="p-3 bg-amber-500 text-white rounded-r-md hover:bg-amber-600"
                  aria-label="Submit search"
                >
                  <Search size={20} />
                </button>
              </form>

              {/* User info if authenticated */}
              {isAuthenticated && (
                <div
                  className={`mb-6 pb-6 border-b ${
                    isDarkMode ? 'border-gray-800' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full ${
                        isDarkMode ? 'bg-amber-500' : 'bg-amber-100'
                      } flex items-center justify-center ${
                        isDarkMode ? 'text-white' : 'text-amber-600'
                      } font-semibold text-lg`}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {user?.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="bg-amber-100 rounded-md p-2 text-sm text-amber-700">
                      Admin Access
                    </div>
                  )}
                </div>
              )}

              {/* Theme and language toggles */}
              <div
                className={`flex justify-between mb-6 pb-6 border-b ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    isDarkMode
                      ? 'bg-gray-800 text-amber-400'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  aria-label={
                    isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    aria-expanded={isLanguageMenuOpen}
                    aria-haspopup="true"
                  >
                    <Globe size={18} />
                    {currentLanguage}
                  </button>

                  <AnimatePresence>
                    {isLanguageMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 z-50 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                        role="menu"
                      >
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                              currentLanguage === language.name
                                ? 'bg-amber-50 text-amber-600'
                                : isDarkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => changeLanguage(language)}
                            role="menuitem"
                          >
                            {language.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Home sections */}
              <div
                className={`mb-6 pb-6 border-b ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-100'
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Home Sections
                </h3>
                {homeSections.map((section) => (
                  <motion.button
                    key={section.name}
                    className={`flex items-center gap-3 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-amber-400'
                        : 'text-gray-600 hover:text-amber-500'
                    } transition-colors w-full mb-3`}
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      scrollToSection(section.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {section.icon}
                    {section.name}
                  </motion.button>
                ))}
              </div>

              {/* Main navigation */}
              <div
                className={`mb-6 pb-6 border-b ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-100'
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Navigation
                </h3>
                {navigationLinks
                  .filter((link) => !link.hasDropdown)
                  .map((item) => (
                    <motion.button
                      key={item.name}
                      className={`flex items-center gap-3 ${
                        isDarkMode
                          ? 'text-gray-300 hover:text-amber-400'
                          : 'text-gray-600 hover:text-amber-500'
                      } transition-colors w-full mb-3`}
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </motion.button>
                  ))}
              </div>

              {/* User links if authenticated */}
              {isAuthenticated && (
                <div
                  className={`mb-6 pb-6 border-b ${
                    isDarkMode ? 'border-gray-800' : 'border-gray-100'
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Your Account
                  </h3>
                  {userLinks.map((item) => (
                    <motion.button
                      key={item.name}
                      className={`flex items-center gap-3 ${
                        isDarkMode
                          ? 'text-gray-300 hover:text-amber-400'
                          : 'text-gray-600 hover:text-amber-500'
                      } transition-colors w-full mb-3`}
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        item.action();
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Admin links if user is admin */}
              {isAdmin && (
                <div
                  className={`mb-6 pb-6 border-b ${
                    isDarkMode ? 'border-gray-800' : 'border-gray-100'
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Admin
                  </h3>
                  {adminLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 ${
                        isDarkMode
                          ? 'text-gray-300 hover:text-amber-400'
                          : 'text-gray-600 hover:text-amber-500'
                      } transition-colors w-full mb-3`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Help & Support */}
              <div
                className={`mb-6 pb-6 border-b ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-100'
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Help & Support
                </h3>
                <Link
                  to="/help"
                  className={`flex items-center gap-3 ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-amber-400'
                      : 'text-gray-600 hover:text-amber-500'
                  } transition-colors w-full mb-3`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HelpCircle size={18} />
                  Help Center
                </Link>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <motion.button
                    className="w-full bg-amber-500 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                  >
                    Login / Sign Up
                    <User size={18} />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      className="w-full bg-amber-500 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        navigate('/order');
                        setIsMenuOpen(false);
                      }}
                    >
                      Order Now
                      <ShoppingBag size={18} />
                    </motion.button>

                    <Link
                      to="/profile"
                      className={`w-full border px-6 py-3 rounded-md flex items-center justify-center gap-2 ${
                        isDarkMode
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                      <User size={18} />
                    </Link>

                    <motion.button
                      className="w-full border border-red-200 text-red-600 px-6 py-3 rounded-md flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                      <LogOut size={18} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top button - appears when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-40 ${
              isDarkMode
                ? 'bg-gray-800 text-amber-400'
                : 'bg-white text-amber-500'
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <ArrowLeft className="transform rotate-90" size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(TopNavigationBar);
