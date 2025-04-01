'use client';

import { useTheme } from '../context/ThemeContext';

/**
 * A hook that returns the appropriate class based on the current theme
 * @param {string} lightClass - The class to use in light mode
 * @param {string} darkClass - The class to use in dark mode
 * @returns {string} The appropriate class based on the current theme
 */
export const useThemeClass = (lightClass, darkClass) => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkClass : lightClass;
};

/**
 * A hook that returns a conditional class string based on the current theme
 * @param {Object} options - An object with light and dark mode class mappings
 * @returns {string} The appropriate class string based on the current theme
 *
 * Example usage:
 * const classes = useThemeClasses({
 *   bg: { light: 'bg-white', dark: 'bg-gray-800' },
 *   text: { light: 'text-gray-900', dark: 'text-white' },
 *   border: { light: 'border-gray-200', dark: 'border-gray-700' }
 * });
 * // Returns: "bg-white text-gray-900 border-gray-200" in light mode
 * // Returns: "bg-gray-800 text-white border-gray-700" in dark mode
 */
export const useThemeClasses = (options) => {
  const { isDarkMode } = useTheme();
  const mode = isDarkMode ? 'dark' : 'light';

  return Object.values(options)
    .map((option) => option[mode])
    .filter(Boolean)
    .join(' ');
};
