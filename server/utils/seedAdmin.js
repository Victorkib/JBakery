import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in the environment variables');
      console.error('Please check your .env file or environment configuration');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists:');
      console.log(`Email: ${adminExists.email}`);
      console.log(
        'If you need to reset the admin password, use the forgot password feature or modify directly in the database.'
      );
      return;
    }

    // Get admin credentials from environment variables
    const adminName = process.env.DEFAULT_ADMIN_NAME || 'Admin User';
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@jbbakery.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error(
        'DEFAULT_ADMIN_PASSWORD is not defined in the environment variables'
      );
      console.error('Please add it to your .env file for security');
      process.exit(1);
    }

    // Admin credentials
    const adminData = {
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
    };

    // Create admin user
    const admin = await User.create(adminData);

    console.log('Default admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: [HIDDEN] (check your .env file)`);
    console.log(
      'Please change this password after first login for security reasons.'
    );
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Main function
const seedAdmin = async () => {
  try {
    // Connect to database
    const conn = await connectDB();

    // Create default admin
    await createDefaultAdmin();

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeder
seedAdmin();
