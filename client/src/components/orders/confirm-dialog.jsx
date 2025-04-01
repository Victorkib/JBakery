'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-lg shadow-xl max-w-md w-full ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div
          className={`p-4 flex items-start ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div
            className={`mr-4 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-500'
            }`}
          >
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={
              theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700'
            }
          >
            <X size={20} />
          </button>
        </div>
        <div
          className={`p-4 flex justify-end space-x-3 ${
            theme === 'dark'
              ? 'border-t border-gray-700'
              : 'border-t border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;
