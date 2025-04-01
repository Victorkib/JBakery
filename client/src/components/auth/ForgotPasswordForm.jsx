'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import apiRequest from '../../utils/api';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiRequest.post('/auth/forgot-password', { email });
      setSuccess(true);

      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setResendTimer(60);

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setSuccess(false);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <Link
        to="/auth/login"
        className="inline-flex items-center text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to login
      </Link>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Reset Your Password
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your email address and we'll send you a link to reset your
          password
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {success ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
        >
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-800 p-3">
              <Mail size={24} className="text-green-600 dark:text-green-300" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
            Check your email
          </h3>
          <p className="text-green-700 dark:text-green-400">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={handleResend}
              disabled={resendDisabled}
              className={`text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 font-medium ${
                resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              try again{resendTimer > 0 ? ` (${resendTimer}s)` : ''}
            </button>
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending reset link...
                </span>
              ) : (
                <span className="flex items-center">
                  <Mail size={18} className="mr-2" />
                  Send Reset Link
                </span>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ForgotPasswordForm;
