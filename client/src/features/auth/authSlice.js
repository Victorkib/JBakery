import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../../utils/api';
import Cookies from 'js-cookie';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest.post('/auth/login', credentials);

      // Store token in cookies and localStorage for persistence
      const { token, user } = response.data;
      Cookies.set('authToken', token, { expires: 7 });
      localStorage.setItem('authToken', token);

      return { token, user };
    } catch (error) {
      // More specific error handling for email verification
      if (
        error.response?.data?.message?.toLowerCase().includes('verify') ||
        error.response?.data?.message?.toLowerCase().includes('verification')
      ) {
        return rejectWithValue('Please verify your email before logging in');
      }
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRequest.post('/auth/register', userData);

      // Store token in cookies and localStorage for persistence
      const { token, user, message } = response.data;
      Cookies.set('authToken', token, { expires: 7 });
      localStorage.setItem('authToken', token);

      return { token, user, message };
    } catch (error) {
      // More specific error handling for registration
      const errorMsg = error.response?.data?.message || 'Registration failed';

      // Check for specific error types
      if (errorMsg.toLowerCase().includes('already exists')) {
        return rejectWithValue('This email is already registered');
      }

      return rejectWithValue(errorMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: notify the server about logout
      await apiRequest.post('/auth/logout');

      // Clear tokens
      Cookies.remove('authToken');
      localStorage.removeItem('authToken');

      return null;
    } catch (error) {
      // Still clear tokens even if the server request fails
      Cookies.remove('authToken');
      localStorage.removeItem('authToken');

      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const verifyAuth = createAsyncThunk(
  'auth/verify',
  async (_, { rejectWithValue }) => {
    try {
      const token =
        Cookies.get('authToken') || localStorage.getItem('authToken');

      if (!token) {
        return null;
      }

      // Try to get current user data
      const response = await apiRequest.get('/auth/me');

      if (response.data?.success) {
        return response.data.data;
      } else {
        // Clear invalid tokens
        Cookies.remove('authToken');
        localStorage.removeItem('authToken');
        return null;
      }
    } catch (error) {
      // Clear tokens on error
      Cookies.remove('authToken');
      localStorage.removeItem('authToken');
      return rejectWithValue(
        error.response?.data?.message || 'Verification failed'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRequest.put('/auth/update-details', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiRequest.put(
        '/auth/update-password',
        passwordData
      );

      // Update token if a new one is returned
      if (response.data.token) {
        Cookies.set('authToken', response.data.token, { expires: 7 });
        localStorage.setItem('authToken', response.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update password'
      );
    }
  }
);

const initialState = {
  user: null,
  token: Cookies.get('authToken') || localStorage.getItem('authToken') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Verify auth cases
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(verifyAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
        }
        state.successMessage = 'Password updated successfully';
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, setUser } = authSlice.actions;

export default authSlice.reducer;
