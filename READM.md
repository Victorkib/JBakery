# JB Bakery Management System - Backend

This is the backend API for the JB Bakery Management System, providing endpoints for authentication, product management, order processing, inventory management, and more.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Victorkib/JBakery
cd server
npm install
npm run seed:admin
npm run dev
```

2.

```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root of your server directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/jb-bakery
# Or if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://:@cluster0.mongodb.net/jb-bakery

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Default Admin Account (used only for initial setup)
DEFAULT_ADMIN_NAME=Admin User
DEFAULT_ADMIN_EMAIL=admin@jbbakery.com
DEFAULT_ADMIN_PASSWORD=Admin123!

# Email Settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_EMAIL=bakery@example.com
SMTP_PASSWORD=your_smtp_password
FROM_NAME=JB Bakery
FROM_EMAIL=noreply@jbbakery.com

# Mailjet Configuration (optional)
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
MAILJET_FROM_EMAIL=noreply@jbbakery.com
MAILJET_FROM_NAME=JB Bakery

# Alternative Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM_ADDRESS=your_email@gmail.com
EMAIL_FROM_NAME=JB Bakery

# Auth Email (can be same as EMAIL_USERNAME)
AUTH_EMAIL=your_email@gmail.com
AUTH_PASSWORD=your_email_password

# Admin Notification Emails (comma separated)
ADMIN_EMAILS=admin@jbbakery.com,manager@jbbakery.com

# Frontend URL (for password reset links, etc.)
FRONTEND_URL=http://localhost:3000

# Branding
LOGO_URL=https://your-domain.com/logo.png
```
