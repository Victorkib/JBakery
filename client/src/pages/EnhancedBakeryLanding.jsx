'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ShoppingBag,
  Star,
  Clock,
  Cake,
  Coffee,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Heart,
  Phone,
  Mail,
  MapPin,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EnhancedBakeryLanding = () => {
  // Get theme from context
  const { isDarkMode, toggleTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Animated counter for statistics
  const [count, setCount] = useState({ customers: 0, products: 0, years: 0 });
  const targetCount = { customers: 15000, products: 50, years: 28 };

  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 2000; // 2 seconds for animation

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCount({
        customers: Math.floor(progress * targetCount.customers),
        products: Math.floor(progress * targetCount.products),
        years: Math.floor(progress * targetCount.years),
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetCount.customers, targetCount.products, targetCount.years]);

  // Custom cursor effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
    },
  };

  // Example featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Artisan Sourdough',
      price: '$8.99',
      image: '/Artisan_Sourdough.avif',
      category: 'Bread',
    },
    {
      id: 2,
      name: 'Belgian Chocolate Cake',
      price: '$34.99',
      image: '/Belgian_Chocolate_Cake.jpg',
      category: 'Cake',
    },
    {
      id: 3,
      name: 'French Croissant',
      price: '$3.99',
      image: '/croissant-70.jpg',
      category: 'Pastry',
    },
    {
      id: 4,
      name: 'Blueberry Muffin',
      price: '$4.99',
      image: '/Blueberry Muffin.webp',
      category: 'Pastry',
    },
    {
      id: 5,
      name: 'Espresso Macchiato',
      price: '$3.49',
      image: '/Espresso_Macchiato.jpg',
      category: 'Coffee',
    },
    {
      id: 6,
      name: 'Cinnamon Roll',
      price: '$4.49',
      image: '/Cinnamon_Roll.jpg',
      category: 'Pastry',
    },
    {
      id: 7,
      name: 'Whole Grain Baguette',
      price: '$5.99',
      image: '/Whole_Grain_Baguette.jpg',
      category: 'Bread',
    },
    {
      id: 8,
      name: 'Tiramisu Slice',
      price: '$6.99',
      image: '/Tiramisu_Slice.jpg',
      category: 'Cake',
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-gradient-to-b from-gray-900 to-gray-800'
          : 'bg-gradient-to-b from-amber-50 to-white'
      }`}
    >
      {/* Theme Toggle Button */}
      {/* <motion.button
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          isDarkMode
            ? 'bg-gray-700 text-amber-400'
            : 'bg-white text-amber-600 shadow-md'
        }`}
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button> */}

      {/* Custom Cursor */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 ${
          isDarkMode ? 'bg-amber-400' : 'bg-amber-500'
        } rounded-full mix-blend-difference pointer-events-none z-50`}
        variants={cursorVariants}
        animate={cursorVariant}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <motion.section
        id="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
          className="absolute inset-0"
        >
          <img
            src="/logo.avif"
            alt="Fresh baked goods"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? 'bg-gradient-to-r from-black/80 to-black/60'
                : 'bg-gradient-to-r from-black/60 to-black/30'
            }`}
          />
        </motion.div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1
              className={`text-7xl font-bold mb-6 bg-clip-text text-transparent ${
                isDarkMode
                  ? 'bg-gradient-to-r from-amber-300 to-amber-500'
                  : 'bg-gradient-to-r from-amber-200 to-amber-500'
              }`}
            >
              JB Bakery & Café
            </h1>
            <p className="text-2xl mb-8 text-amber-100">
              Where tradition meets innovation
            </p>
            <motion.button
              className={`${
                isDarkMode
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-amber-500 hover:bg-amber-600'
              } text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Menu
              <ArrowRight className="inline-block ml-2" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [-10, 10],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
          className="absolute bottom-20 left-20"
        >
          <img
            src="/Jb_logo.webp"
            alt="Floating pastry"
            className={`w-24 h-24 rounded-full shadow-lg ${
              isDarkMode
                ? 'border-4 border-amber-200/30 hover:border-amber-300/50'
                : 'border-4 border-amber-100/50 hover:border-amber-200/70'
            } transition-all duration-300`}
          />
        </motion.div>
      </motion.section>

      {/* Statistics Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-amber-500 mb-2">
                {count.customers.toLocaleString()}+
              </h3>
              <p
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Happy Customers
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-amber-500 mb-2">
                {count.products}+
              </h3>
              <p
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Unique Products
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl font-bold text-amber-500 mb-2">
                {count.years}
              </h3>
              <p
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Years of Excellence
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products with 3D effect */}
      <section
        className={`py-20 ${
          isDarkMode
            ? 'bg-gradient-to-b from-gray-800 to-gray-900'
            : 'bg-gradient-to-b from-amber-50 to-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Featured Products
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: isDarkMode
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                className={`${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } rounded-xl overflow-hidden shadow-lg transform perspective-1000`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-48 object-cover transform transition-transform hover:scale-110"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                  >
                    <button
                      className={`${
                        isDarkMode
                          ? 'bg-gray-800 text-amber-400'
                          : 'bg-white text-amber-500'
                      } px-6 py-2 rounded-full`}
                    >
                      Quick View
                    </button>
                  </motion.div>
                </div>
                <div className="p-6">
                  <span className="text-sm text-amber-500 font-semibold">
                    {product.category}
                  </span>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : ''
                    }`}
                  >
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-lg font-bold ${
                        isDarkMode ? 'text-amber-400' : ''
                      }`}
                    >
                      {product.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`${
                        isDarkMode ? 'bg-amber-600' : 'bg-amber-500'
                      } text-white p-3 rounded-full`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with 3D Cards */}
      <section
        id="contact"
        className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Get in Touch
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 rounded-xl text-white text-center"
            >
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p>(555) 123-4567</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="bg-gradient-to-br from-amber-600 to-amber-700 p-8 rounded-xl text-white text-center"
            >
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p>hello@bakery.com</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="bg-gradient-to-br from-amber-700 to-amber-800 p-8 rounded-xl text-white text-center"
            >
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p>123 Bakery Street, Cityville</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Particle Effect */}
      <section className="py-20 bg-gradient-to-r from-amber-700 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 400,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * 400,
                  Math.random() * 400,
                  Math.random() * 400,
                ],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              Subscribe to Our Newsletter
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              Get exclusive offers, new product alerts, and seasonal recipes
              delivered to your inbox
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                } text-white px-6 py-3 rounded-r-lg sm:mt-0 mt-3 sm:rounded-l-none rounded-lg`}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section
        id="menu"
        className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Explore Our Menu
          </motion.h2>

          <div className="flex flex-wrap justify-center mb-12">
            {['all', 'bread', 'pastry', 'cake', 'coffee'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`mx-2 mb-2 px-6 py-2 rounded-full capitalize ${
                  activeCategory === category
                    ? 'bg-amber-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts
              .filter(
                (product) =>
                  activeCategory === 'all' ||
                  product.category.toLowerCase() === activeCategory
              )
              .map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      boxShadow: isDarkMode
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                    className={`${
                      isDarkMode ? 'bg-gray-700' : 'bg-white'
                    } rounded-xl overflow-hidden shadow-md relative`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <div>
                          <span className="text-amber-300 font-medium block">
                            {product.category}
                          </span>
                          <h3 className="text-white text-xl font-bold">
                            {product.name}
                          </h3>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-amber-500 text-white p-3 rounded-full"
                        >
                          <Heart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3
                            className={`text-xl font-bold mb-1 group-hover:text-amber-500 transition-colors ${
                              isDarkMode ? 'text-white' : ''
                            }`}
                          >
                            {product.name}
                          </h3>
                          <span
                            className={`${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            {product.category}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-amber-500">
                          {product.price}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= 4
                                    ? 'text-amber-400 fill-current'
                                    : isDarkMode
                                    ? 'text-gray-600'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-sm ml-2 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            (24)
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* About Section with Parallax */}
      <section
        id="about"
        className={`py-32 ${
          isDarkMode ? 'bg-gray-900' : 'bg-amber-50'
        } relative overflow-hidden`}
      >
        {/* Parallax Background */}
        <div
          ref={scrollRef}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/api/placeholder/1920/1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: isDarkMode ? 'brightness(0.2)' : 'brightness(0.3)',
          }}
        />

        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Section Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-6xl font-bold mb-12 bg-clip-text text-transparent ${
                isDarkMode
                  ? 'bg-gradient-to-r from-amber-300 to-amber-500'
                  : 'bg-gradient-to-r from-amber-400 to-amber-600'
              }`}
            >
              Our Story
            </motion.h2>

            {/* Section Content */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`space-y-8 text-lg ${
                isDarkMode ? 'text-amber-100' : 'text-amber-900'
              }`}
            >
              <p>
                Founded in 1995, JB Bakery began as a small family shop with a
                mission to bring authentic European baking traditions to our
                community. What started as a passion project has blossomed into
                a beloved establishment known for quality, creativity, and
                exceptional taste.
              </p>
              <p>
                Our master bakers trained in prestigious culinary schools across
                France, Italy, and Switzerland, bringing centuries-old
                techniques and combining them with modern innovation. Every
                loaf, pastry, and cake that leaves our kitchen embodies our
                commitment to excellence.
              </p>
              <p>
                Today, we continue to use only the finest ingredients - organic
                flours, European butter, farm-fresh eggs, and seasonal produce
                from local farmers. We believe that exceptional baked goods
                start with exceptional ingredients.
              </p>
            </motion.div>

            {/* Call-to-Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isDarkMode
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                } text-white px-10 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl`}
              >
                Learn More About Us
                <ChevronRight className="inline-block ml-3 w-6 h-6" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'mirror',
          }}
          className="absolute top-1/4 left-10 opacity-30"
        >
          <Cake
            className={`w-24 h-24 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-400'
            }`}
          />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'mirror',
          }}
          className="absolute bottom-1/4 right-10 opacity-30"
        >
          <Coffee
            className={`w-24 h-24 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-400'
            }`}
          />
        </motion.div>
      </section>

      {/* Testimonials with 3D Cards */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={`text-4xl font-bold text-center mb-12 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            What Our Customers Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: 'Sarah Johnson',
                image: '/sarah.jpg',
                rating: 5,
                text: 'The sourdough bread is exceptional - perfect crust and incredible flavor. My weekly order is the highlight of my weekend breakfasts!',
                position: 'Food Blogger',
              },
              {
                id: 2,
                name: 'Michael Chen',
                image: '/michael_chen.webp',
                rating: 5,
                text: 'Ordered a custom birthday cake and it exceeded all expectations. Not only was it visually stunning, but the taste was phenomenal. Will definitely order again!',
                position: 'Regular Customer',
              },
              {
                id: 3,
                name: 'Emily Rodriguez',
                image: '/Emily_Dickinson.webp',
                rating: 5,
                text: 'As someone with dietary restrictions, I appreciate that they offer gluten-free options that actually taste amazing. Their attention to detail is impressive.',
                position: 'Fitness Instructor',
              },
            ].map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50, rotateY: 25 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: isDarkMode
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                className={`${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-8 rounded-xl shadow-lg transform perspective-1000`}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={review.image || '/placeholder.svg'}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div className="ml-4">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? 'text-white' : ''
                      }`}
                    >
                      {review.name}
                    </h3>
                    <p className="text-amber-500">{review.position}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <p
                  className={`italic ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {`"`}
                  {review.text}
                  {`"`}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="py-24 bg-gradient-to-r from-amber-600 to-amber-400 relative overflow-hidden">
        {/* Animated Elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 left-20 opacity-20"
        >
          <Coffee className="w-24 h-24 text-white" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-20 right-32 opacity-20"
        >
          <Cake className="w-32 h-32 text-white" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to Experience JB Bakery Excellence?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-10"
            >
              Whether you{`'`}re craving fresh bread, planning a special
              celebration, or looking for a cozy spot to enjoy quality coffee
              and pastries, we{`'`}re here to serve you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Order Online
                <ShoppingBag className="inline-block ml-2" />
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-colors"
              >
                Book a Table
                <Clock className="inline-block ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer with animated background */}
      <footer
        className={`${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-900'
        } text-white py-16 relative overflow-hidden`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-800"
            style={{ backgroundSize: '400% 400%' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-6"
              >
                JB Bakery
              </motion.h3>
              <p className="text-gray-400 mb-6">
                Crafting delicious memories since 1995. Committed to quality
                ingredients and authentic techniques.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </motion.a>
              </div>
            </div>

            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold mb-6"
              >
                Quick Links
              </motion.h3>
              <ul className="space-y-3">
                {['Menu', 'About Us', 'Locations', 'Careers', 'Catering'].map(
                  (item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <motion.a
                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                        className="text-gray-400 hover:text-amber-500 transition-colors flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {item}
                      </motion.a>
                    </motion.li>
                  )
                )}
              </ul>
            </div>

            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold mb-6"
              >
                Contact Us
              </motion.h3>
              <ul className="space-y-4">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start"
                >
                  <MapPin className="w-5 h-5 mr-3 text-amber-500 mt-1" />
                  <span className="text-gray-400">
                    123 Bakery Street, Cityville, State 12345
                  </span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center"
                >
                  <Phone className="w-5 h-5 mr-3 text-amber-500" />
                  <span className="text-gray-400">(555) 123-4567</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center"
                >
                  <Mail className="w-5 h-5 mr-3 text-amber-500" />
                  <span className="text-gray-400">hello@JB_bakery.com</span>
                </motion.li>
              </ul>
            </div>

            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="text-xl font-bold mb-6"
              >
                Hours
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="space-y-2 text-gray-400"
              >
                <p className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>7:00 AM - 7:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span>7:00 AM - 8:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span>8:00 AM - 6:00 PM</span>
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500"
          >
            <p>
              &copy; {new Date().getFullYear()} JB Bakery & Café. All rights
              reserved.
            </p>
            <p className="mt-2 text-sm">
              <a
                href="#"
                className="hover:text-amber-500 mx-2 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="mx-2">|</span>
              <a
                href="#"
                className="hover:text-amber-500 mx-2 transition-colors"
              >
                Terms of Service
              </a>
              <span className="mx-2">|</span>
              <a
                href="#"
                className="hover:text-amber-500 mx-2 transition-colors"
              >
                Accessibility
              </a>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedBakeryLanding;
