'use client';

import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { ArrowUpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import './layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import TopNavigationBar from '../components/topbar/TopNavigationBar';
import { motion } from 'framer-motion';
import { verifyAuth } from '../features/auth/authSlice';

export const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  // Function to determine if the current navigation is an anchor link
  const isAnchorLink = (pathname) => pathname.includes('#');

  // Handle scroll visibility for the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
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

  // Scroll to top on route change, but skip for in-page navigation
  useEffect(() => {
    if (!isAnchorLink(location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="layout">
      <TopNavigationBar />
      <main className="layoutMain">
        <Outlet />
      </main>
      <motion.button
        className={`scroll-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpCircle size={24} />
      </motion.button>
    </div>
  );
};

export const RequireAuth = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};
