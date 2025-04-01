import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Function to run a script
const runScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${scriptPath}`);

    const process = spawn('node', [scriptPath], { stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
};

// Check if .env file exists and create it if not
const checkEnvFile = () => {
  const envPath = path.resolve(__dirname, '../.env');
  const envExamplePath = path.resolve(__dirname, '../.env.example');

  if (!fs.existsSync(envPath)) {
    console.log('No .env file found. Creating from .env.example...');

    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(
        '.env file created. Please update it with your actual configuration values.'
      );
    } else {
      console.error(
        '.env.example file not found. Please create a .env file manually.'
      );
    }

    return false;
  }

  return true;
};

// Check if required environment variables are set
const checkRequiredEnvVars = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'DEFAULT_ADMIN_PASSWORD'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log('\n⚠️ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`);
    });
    console.log('\nPlease add these to your .env file before continuing.');

    return false;
  }

  return true;
};

// Main setup function
const setup = async () => {
  try {
    console.log('=== JB Bakery Management System Setup ===');

    // Check .env file
    const envExists = checkEnvFile();

    if (envExists) {
      // Check required environment variables
      const envVarsOk = checkRequiredEnvVars();

      if (!envVarsOk) {
        console.log(
          '\nSetup cannot continue without required environment variables.'
        );
        console.log('Please update your .env file and run setup again.');
        process.exit(1);
      }
    } else {
      console.log(
        '\nPlease update the newly created .env file with your configuration and run setup again.'
      );
      process.exit(0);
    }

    // Create necessary directories
    const dirs = ['logs', 'uploads', 'uploads/products', 'uploads/users'];

    for (const dir of dirs) {
      const dirPath = path.resolve(__dirname, '..', dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }

    // Run admin seeder
    await runScript(path.resolve(__dirname, '../utils/seedAdmin.js'));

    console.log('\n=== Setup Complete ===');
    console.log('You can now start the server with: npm start');
    console.log('Default admin credentials:');
    console.log(
      `Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@jbbakery.com'}`
    );
    console.log('Password: [HIDDEN] (check your .env file)');
    console.log(
      'Please change this password after first login for security reasons.'
    );
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
};

// Run setup
setup();
