'use client';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import apiRequest from '../../utils/api';

const VerifyEmailPage = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await apiRequest.get(`/auth/verify-email/${token}`);
        setSuccess(true);

        // Redirect to login after 5 seconds
        setTimeout(() => {
          navigate(
            '/auth/login?message=' +
              encodeURIComponent(
                'Your email has been verified successfully! You can now log in.'
              )
          );
        }, 5000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to verify email. The link may be invalid or expired.'
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 text-center">
          <RefreshCw
            size={48}
            className="mx-auto text-amber-500 animate-spin"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
            Verifying Your Email
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 text-center"
      >
        {success ? (
          <>
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle
                size={32}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your email has been verified successfully. You will be redirected
              to the login page in a few seconds.
            </p>
            <div className="mt-8">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
              >
                Go to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle
                size={32}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
            <div className="mt-8 space-y-3">
              <Link
                to="/auth/resend-verification"
                className="inline-flex items-center justify-center w-full px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
              >
                Resend Verification Email
              </Link>
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center w-full px-5 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
