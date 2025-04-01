'use client';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './index.css';
import { verifyAuth } from './features/auth/authSlice';
import { Layout, RequireAuth } from './layout/Layout2.0';
import ProtectedRoute from './components/common/ProtectedRoute';
import UnauthorizedPage from './components/common/UnauthorizedPage';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import EnhancedBakeryLanding from './pages/EnhancedBakeryLanding';
import OrderComponent from './pages/OrderComponent/OrderComponent';
import UnderDevelopment from './components/UnderDevelopment/UnderDevelopment';
import BakeryAdminDashboard from './pages/admin/BakeryAdminDashboard';
import AuthForm from './pages/auth/authForm';
import UserProfile from './pages/profile/UserProfile';
import UserSettings from './pages/profile/UserSettings';

import CustomerList from './pages/admin/CustomerList';

// Import auth components
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import VerifyEmailPage from './components/auth/VerifyEmailPage';
import VerificationSentPage from './components/auth/VerificationSentPage';
import ResendVerificationForm from './components/auth/ResendVerificationForm';

function App() {
  const dispatch = useDispatch();

  // Verify authentication on app load
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={<EnhancedBakeryLanding />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/auth/login" element={<AuthForm />} />
            <Route path="/auth/register" element={<AuthForm />} />
            <Route path="/auth/forgot-password" element={<AuthForm />} />
            <Route
              path="/auth/reset-password/:resetToken"
              element={<ResetPasswordForm />}
            />
            <Route
              path="/auth/verify-email/:token"
              element={<VerifyEmailPage />}
            />
            <Route
              path="/auth/verification-sent"
              element={<VerificationSentPage />}
            />
            <Route
              path="/auth/resend-verification"
              element={<ResendVerificationForm />}
            />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes - Any authenticated user */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<OrderComponent />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route
                path="/orders"
                element={<h2>Order History (Protected)</h2>}
              />
              <Route
                path="/favorites"
                element={<h2>Favorites (Protected)</h2>}
              />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<BakeryAdminDashboard />} />
              <Route path="/admin/customers" element={<CustomerList />} />
              {/* <Route path="/admin/orders" element={<OrderManagement />} /> */}
              {/* <Route path="/admin/reports" element={<ReportsPage />} /> */}
            </Route>

            <Route path="/*" element={<UnderDevelopment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
