'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  MapPin,
  Cake,
} from 'lucide-react';
import { updateUserProfile } from '../../features/users/userSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { currentUser } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    address: '',
    preferences: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        address: user.address || '',
        preferences:
          typeof user.preferences === 'object'
            ? JSON.stringify(user.preferences)
            : user.preferences || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Try to parse preferences if it's a JSON string
    let processedPreferences = profileData.preferences;
    try {
      const parsed = JSON.parse(profileData.preferences);
      processedPreferences = parsed;
    } catch (e) {
      // If not valid JSON, keep as is
    }

    dispatch(
      updateUserProfile({
        userId: user.id,
        userData: {
          ...profileData,
          preferences: processedPreferences,
        },
      })
    );

    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
        address: user.address || '',
        preferences:
          typeof user.preferences === 'object'
            ? JSON.stringify(user.preferences, null, 2)
            : user.preferences || '',
      });
    }
    setIsEditing(false);
  };

  // Helper function to display preferences
  const renderPreferences = () => {
    if (!profileData.preferences) return 'No preferences specified';

    try {
      const prefs =
        typeof profileData.preferences === 'string'
          ? JSON.parse(profileData.preferences)
          : profileData.preferences;

      if (typeof prefs === 'object' && prefs !== null) {
        return (
          <ul className="list-disc pl-5 space-y-1">
            {Object.entries(prefs).map(([key, value]) => (
              <li key={key}>
                <span className="font-medium">{key}:</span> {String(value)}
              </li>
            ))}
          </ul>
        );
      }
      return String(profileData.preferences);
    } catch (e) {
      return String(profileData.preferences);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-amber-100">{user?.email}</p>
              <p className="mt-2 bg-white/20 px-3 py-1 rounded-full text-sm inline-block">
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="ml-auto bg-white text-amber-600 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Edit size={18} />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Birthday
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={profileData.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="preferences"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preferences (Favorite products, dietary restrictions, etc.)
                  </label>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={profileData.preferences}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    For object preferences, use JSON format (e.g.,{' '}
                    {'{ "newsletter": true }'})
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Full Name
                    </h3>
                    <p className="text-gray-900">
                      {profileData.name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Email Address
                    </h3>
                    <p className="text-gray-900">
                      {profileData.email || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Phone Number
                    </h3>
                    <p className="text-gray-900">
                      {profileData.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Birthday
                    </h3>
                    <p className="text-gray-900">
                      {profileData.birthday
                        ? new Date(profileData.birthday).toLocaleDateString()
                        : 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </h3>
                    <p className="text-gray-900">
                      {profileData.address || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <Cake className="text-amber-500 mt-1" size={20} />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Preferences
                    </h3>
                    <div className="text-gray-900">{renderPreferences()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Order History Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>

        {/* Placeholder for order history - would be populated from API */}
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div
              key={order}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{1000 + order}</p>
                  <p className="font-medium">
                    {order === 1
                      ? 'Red Velvet Cake'
                      : order === 2
                      ? 'Assorted Pastries'
                      : 'Birthday Cake'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order === 1
                      ? 'Placed on March 15, 2024'
                      : order === 2
                      ? 'Placed on February 28, 2024'
                      : 'Placed on January 10, 2024'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-amber-600">
                    ${order === 1 ? '35.99' : order === 2 ? '24.50' : '42.99'}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${
                      order === 1
                        ? 'bg-green-100 text-green-800'
                        : order === 2
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order === 1
                      ? 'Delivered'
                      : order === 2
                      ? 'In Progress'
                      : 'Completed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
            onClick={() => navigate('/orders')}
          >
            View All Orders
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
