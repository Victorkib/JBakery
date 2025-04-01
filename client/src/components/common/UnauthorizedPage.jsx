'use client';

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-red-100">
            <ShieldAlert size={48} className="text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>

        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-4 py-2 flex items-center justify-center gap-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            <Home size={18} />
            Home Page
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
