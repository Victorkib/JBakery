'use client';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Set active tab based on URL path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'register') {
      setActiveTab('register');
    } else if (path === 'forgot-password') {
      setActiveTab('forgot-password');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/auth/${tab === 'login' ? '' : tab}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Bakery branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex flex-col items-center justify-center p-8 bg-amber-600 rounded-lg text-white"
        >
          <img
            src="/Jb_logo.webp"
            alt="JB Bakery Logo"
            className="w-32 h-32 object-contain mb-6"
          />
          <h1 className="text-3xl font-bold mb-4 text-center">
            JB Bakery & Café
          </h1>
          <p className="text-center text-amber-100 mb-6">
            Where tradition meets innovation. Join our community of cake lovers
            and enjoy personalized experiences.
          </p>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="italic text-sm text-center">
              "The customer service I received was exceptional. The support team
              went above and beyond to address my concerns."
            </p>
            <p className="text-right mt-2 text-amber-200 font-medium">
              — Happy Customer
            </p>
          </div>
        </motion.div>

        {/* Right side - Auth forms */}
        <div>
          {/* Form container */}
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'register' && <RegisterForm />}
          {activeTab === 'forgot-password' && <ForgotPasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
