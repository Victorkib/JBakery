'use client';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import apiRequest from '../../utils/api';

const VerificationSentPage = () => {
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendStatus, setResendStatus] = useState({
    loading: false,
    error: '',
    success: false,
  });

  const location = useLocation();

  useEffect(() => {
    // Extract email from URL query params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleResend = async () => {
    if (resendDisabled) return;

    setResendStatus({ loading: true, error: '', success: false });

    try {
      await apiRequest.post('/auth/resend-verification', { email });

      // Disable resend button for 60 seconds
      setResendDisabled(true);
      setResendTimer(60);
      setResendStatus({ loading: false, error: '', success: true });

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
      setResendStatus({
        loading: false,
        error:
          err.response?.data?.message || 'Failed to resend verification email',
        success: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 text-center"
      >
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Mail size={32} className="text-amber-600 dark:text-amber-400" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
          Verify Your Email
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We've sent a verification email to:
        </p>

        <p className="mt-1 font-medium text-gray-800 dark:text-white">
          {email || 'your email address'}
        </p>

        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Please check your inbox and click the verification link to complete
          your registration.
        </p>

        {resendStatus.error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {resendStatus.error}
          </div>
        )}

        {resendStatus.success && (
          <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
            Verification email resent successfully!
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={handleResend}
            disabled={resendDisabled || resendStatus.loading}
            className={`inline-flex items-center justify-center w-full px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 ${
              resendDisabled || resendStatus.loading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {resendStatus.loading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : null}
            Resend Verification Email
            {resendTimer > 0 ? ` (${resendTimer}s)` : ''}
          </button>

          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center w-full px-5 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          If you don't see the email, check your spam folder or make sure you
          entered the correct email address.
        </p>
      </motion.div>
    </div>
  );
};

export default VerificationSentPage;
