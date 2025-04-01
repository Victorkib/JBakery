import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Breadcrumb } from 'antd';

// Example featured products data
const featuredProducts = [
  {
    id: 1,
    name: 'Artisan Sourdough',
    price: '$8.99',
    image: '/api/placeholder/300/200',
    category: 'Bread',
  },
  {
    id: 2,
    name: 'Belgian Chocolate Cake',
    price: '$34.99',
    image: '/api/placeholder/300/200',
    category: 'Cakes',
  },
  {
    id: 3,
    name: 'French Croissant',
    price: '$3.99',
    image: '/api/placeholder/300/200',
    category: 'Pastries',
  },
  {
    id: 4,
    name: 'Blueberry Muffin',
    price: '$4.99',
    image: '/api/placeholder/300/200',
    category: 'Pastries',
  },
];

const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    text: 'Best bakery in town! The sourdough is exceptional.',
  },
  {
    id: 2,
    name: 'John D.',
    rating: 5,
    text: 'Their custom cakes are absolutely amazing!',
  },
  {
    id: 3,
    name: 'Emily R.',
    rating: 5,
    text: 'Fresh pastries every morning - my daily happiness!',
  },
];

const BakeryLanding = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center bg-amber-50"
      >
        <div className="absolute inset-0">
          <img
            src="/api/placeholder/1920/1080"
            alt="Fresh baked goods"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold mb-6"
          >
            JB Bakery & Café
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl mb-8"
          >
            Handcrafted with love since 1995
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-amber-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-600 transition-colors"
          >
            Order Now
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="flex justify-center mb-4">
                <Breadcrumb className="w-12 h-12 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Daily</h3>
              <p className="text-gray-600">
                Baked fresh every morning using traditional recipes
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center p-6"
            >
              <div className="flex justify-center mb-4">
                <Cake className="w-12 h-12 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Orders</h3>
              <p className="text-gray-600">
                Personalized cakes and desserts for special occasions
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="text-center p-6"
            >
              <div className="flex justify-center mb-4">
                <Clock className="w-12 h-12 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
              <p className="text-gray-600">Same-day delivery within the city</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-sm text-amber-500">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{product.price}</span>
                    <button className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.text}</p>
                <p className="font-semibold">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-amber-500">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="mb-8">
              Get updates about new products and special offers!
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
              />
              <button className="bg-gray-900 text-white px-6 py-2 rounded-r-lg hover:bg-gray-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">
                Crafting memories through delicious treats since 1995.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Locations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Custom Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Bakery Street</li>
                <li>City, State 12345</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: hello@bakery.com</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-500">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-amber-500">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-amber-500">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 JB Bakery & Café. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BakeryLanding;
