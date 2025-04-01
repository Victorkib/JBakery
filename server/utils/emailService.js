import nodemailer from 'nodemailer';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize environment variables
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILJET_FROM_EMAIL =
  process.env.MAILJET_FROM_EMAIL || process.env.EMAIL_FROM_ADDRESS;
const MAILJET_FROM_NAME =
  process.env.MAILJET_FROM_NAME || process.env.EMAIL_FROM_NAME || 'JB Bakery';

const NODEMAILER_EMAIL = process.env.AUTH_EMAIL || process.env.EMAIL_USERNAME;
const NODEMAILER_PASSWORD =
  process.env.AUTH_PASSWORD || process.env.EMAIL_PASSWORD;
const NODEMAILER_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const NODEMAILER_HOST = process.env.EMAIL_HOST;
const NODEMAILER_PORT = process.env.EMAIL_PORT;

const LOGO_URL = process.env.LOGO_URL || 'https://via.placeholder.com/150';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initialize Nodemailer transport
const createNodemailerTransport = () => {
  // If service is specified, use it
  if (NODEMAILER_SERVICE && NODEMAILER_SERVICE !== 'custom') {
    return nodemailer.createTransport({
      service: NODEMAILER_SERVICE,
      secure: false,
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Otherwise use custom SMTP settings
  return nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: NODEMAILER_PORT === '465',
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Initialize Mailjet client if credentials are available
const getMailjetClient = () => {
  if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
    return Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_SECRET_KEY);
  }
  return null;
};

// Email templates
const emailTemplates = {
  // Base template with header and footer
  baseTemplate: (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
       <img src="${LOGO_URL}" alt="JB Bakery" style="max-width: 150px; height: auto;" />
    </div>
    ${content}
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
      <p>© ${new Date().getFullYear()} JB Bakery. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
`,

  // Welcome email template
  welcome: (name) => `
  <h2 style="color: #333; text-align: center;">Welcome to JB Bakery!</h2>
  <p style="color: #555; font-size: 16px;">Hello ${name},</p>
  <p style="color: #555; font-size: 16px;">
    Thank you for creating an account with JB Bakery. We're excited to have you as a customer!
  </p>
  <p style="color: #555; font-size: 16px;">
    You can now log in to your account to browse our delicious products and place orders.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${FRONTEND_URL}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Browse Products
    </a>
  </div>
`,

  // Password reset template
  resetPassword: (resetLink) => `
  <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
  <p style="color: #555; font-size: 16px;">
    We received a request to reset your password. Click the button below to set a new password:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${resetLink}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Reset Password
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    If you did not request a password reset, please ignore this email or contact support if you have concerns.
  </p>
  <p style="color: #555; font-size: 14px;">
    This link will expire in 10 minutes for security reasons.
  </p>
`,

  // Email verification template
  verifyEmail: (verificationLink) => `
  <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
  <p style="color: #555; font-size: 16px;">
    Thank you for registering! Please verify your email address to complete your registration.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${verificationLink}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Verify Email
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    If you did not create an account, please ignore this email.
  </p>
`,

  // Order confirmation template
  orderConfirmation: (order) => `
  <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
  <p style="color: #555; font-size: 16px;">Hello ${order.user.name},</p>
  <p style="color: #555; font-size: 16px;">
    Thank you for your order! We're preparing your delicious baked goods with care.
  </p>
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <h3 style="color: #f5a637; margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${new Date(
      order.createdAt
    ).toLocaleDateString()}</p>
    <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
    
    <h4 style="margin-bottom: 5px;">Items:</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #f5a637; color: white;">
        <th style="padding: 8px; text-align: left;">Item</th>
        <th style="padding: 8px; text-align: center;">Quantity</th>
        <th style="padding: 8px; text-align: right;">Price</th>
      </tr>
      ${order.items
        .map(
          (item) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${item.product.name}</td>
          <td style="padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; text-align: right;">$${(
            item.price * item.quantity
          ).toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </table>
  </div>
  <p style="color: #555; font-size: 16px;">
    Your order will be ready for ${
      order.type === 'delivery' ? 'delivery' : 'pickup'
    } on 
    ${new Date(order.deliveryDate).toLocaleDateString()} at ${
    order.deliveryTime
  }.
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${FRONTEND_URL}/orders/${order._id}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      View Order Details
    </a>
  </div>
`,

  // Order status update template
  orderStatusUpdate: (order) => `
  <h2 style="color: #333; text-align: center;">Order Status Update</h2>
  <p style="color: #555; font-size: 16px;">Hello ${order.user.name},</p>
  <p style="color: #555; font-size: 16px;">
    Your order #${order.orderNumber} has been updated to: <strong>${
    order.status
  }</strong>
  </p>
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <h3 style="color: #f5a637; margin-top: 0;">Order Details:</h3>
    <p><strong>Order Number:</strong> #${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${new Date(
      order.createdAt
    ).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    ${
      order.status === 'Ready'
        ? `
      <p style="color: #2e7d32; font-weight: bold;">Your order is ready for ${
        order.type === 'delivery' ? 'delivery' : 'pickup'
      }!</p>
    `
        : ''
    }
    ${
      order.status === 'Delivered'
        ? `
      <p style="color: #2e7d32; font-weight: bold;">Your order has been delivered. Enjoy!</p>
    `
        : ''
    }
  </div>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${FRONTEND_URL}/orders/${order._id}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      View Order Details
    </a>
  </div>
`,

  // Low stock alert template
  lowStockAlert: (products) => `
  <h2 style="color: #333; text-align: center;">Low Stock Alert</h2>
  <p style="color: #555; font-size: 16px;">
    The following products are running low on stock and need attention:
  </p>
  <div style="background-color: #fff4f4; border-left: 4px solid #ff4d4f; padding: 15px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr style="background-color: #ff4d4f; color: white;">
        <th style="padding: 8px; text-align: left;">Product</th>
        <th style="padding: 8px; text-align: center;">Current Stock</th>
        <th style="padding: 8px; text-align: right;">Threshold</th>
      </tr>
      ${products
        .map(
          (product) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${product.name}</td>
          <td style="padding: 8px; text-align: center;">${product.stock}</td>
          <td style="padding: 8px; text-align: right;">${product.lowStockThreshold}</td>
        </tr>
      `
        )
        .join('')}
    </table>
  </div>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${FRONTEND_URL}/admin/inventory" 
       style="background-color: #ff4d4f; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Manage Inventory
    </a>
  </div>
`,

  // Staff invitation template
  staffInvitation: (name, invitationLink) => `
  <h2 style="color: #333; text-align: center;">Staff Invitation</h2>
  <p style="color: #555; font-size: 16px;">Hello ${name},</p>
  <p style="color: #555; font-size: 16px;">
    You have been invited to join the JB Bakery staff team. Click the button below to set up your account:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="${invitationLink}" 
       style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
      Accept Invitation
    </a>
  </div>
  <p style="color: #555; font-size: 14px;">
    This invitation link will expire in 7 days.
  </p>
`,

  // Custom notification template
  customNotification: (title, message, buttonText, buttonLink) => `
  <h2 style="color: #333; text-align: center;">${title}</h2>
  <p style="color: #555; font-size: 16px;">${message}</p>
  ${
    buttonText && buttonLink
      ? `
    <div style="text-align: center; margin: 20px 0;">
      <a href="${buttonLink}" 
         style="background-color: #f5a637; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
        ${buttonText}
      </a>
    </div>
  `
      : ''
  }
`,
};

// Send email via Mailjet
const sendMailjetEmail = async (to, subject, htmlContent) => {
  const mailjetClient = getMailjetClient();

  if (!mailjetClient) {
    throw new Error('Mailjet credentials not configured');
  }

  const request = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME,
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: htmlContent,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Email sent successfully via Mailjet');
    return result;
  } catch (err) {
    console.error('Failed to send email via Mailjet', err);
    throw new Error(`Failed to send email via Mailjet: ${err.message}`);
  }
};

// Send email via Nodemailer
const sendNodemailerEmail = async (to, subject, htmlContent) => {
  const transport = createNodemailerTransport();

  try {
    const result = await transport.sendMail({
      from: `"${MAILJET_FROM_NAME}" <${NODEMAILER_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log('Email sent successfully via Nodemailer');
    return result;
  } catch (err) {
    console.error('Failed to send email via Nodemailer', err);
    throw new Error(`Failed to send email via Nodemailer: ${err.message}`);
  }
};

// Main email sending function with fallback
export const sendEmail = async (options) => {
  const { email, subject, template, templateData } = options;

  // If template is provided, use it
  if (template) {
    // Get the template function
    const templateFn = emailTemplates[template];

    if (!templateFn) {
      throw new Error(`Email template "${template}" not found`);
    }

    // Generate the HTML content
    const templateContent = templateFn(templateData);
    const htmlContent = emailTemplates.baseTemplate(templateContent);

    // Try to send via Mailjet first, then fall back to Nodemailer
    try {
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        return await sendMailjetEmail(email, subject, htmlContent);
      } else {
        return await sendNodemailerEmail(email, subject, htmlContent);
      }
    } catch (mailjetError) {
      console.error(
        'Primary email service failed, trying fallback',
        mailjetError
      );

      try {
        return await sendNodemailerEmail(email, subject, htmlContent);
      } catch (nodemailerError) {
        console.error('Both email services failed', nodemailerError);
        throw new Error('Failed to send email through all available methods');
      }
    }
  } else {
    // For backward compatibility with the original implementation
    // that just takes a message
    const htmlContent = emailTemplates.baseTemplate(`
      <p style="color: #555; font-size: 16px;">${
        options.message || options.html
      }</p>
    `);

    try {
      if (MAILJET_API_KEY && MAILJET_SECRET_KEY) {
        return await sendMailjetEmail(email, subject, htmlContent);
      } else {
        return await sendNodemailerEmail(email, subject, htmlContent);
      }
    } catch (error) {
      console.error('Email sending failed', error);
      throw new Error('Failed to send email');
    }
  }
};

// Specific email sending functions
export const sendWelcomeEmail = async (email, name) => {
  return sendEmail({
    email,
    subject: 'Welcome to JB Bakery',
    template: 'welcome',
    templateData: name,
  });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return sendEmail({
    email,
    subject: 'Reset Your Password',
    template: 'resetPassword',
    templateData: resetLink,
  });
};

export const sendVerificationEmail = async (email, verificationLink) => {
  return sendEmail({
    email,
    subject: 'Verify Your Email Address',
    template: 'verifyEmail',
    templateData: verificationLink,
  });
};

export const sendOrderConfirmationEmail = async (email, order) => {
  return sendEmail({
    email,
    subject: `Order Confirmation #${order.orderNumber}`,
    template: 'orderConfirmation',
    templateData: order,
  });
};

export const sendOrderStatusUpdateEmail = async (email, order) => {
  return sendEmail({
    email,
    subject: `Order Status Update: #${order.orderNumber}`,
    template: 'orderStatusUpdate',
    templateData: order,
  });
};

export const sendLowStockAlertEmail = async (email, products) => {
  return sendEmail({
    email,
    subject: 'Low Stock Alert - Action Required',
    template: 'lowStockAlert',
    templateData: products,
  });
};

export const sendStaffInvitationEmail = async (email, name, invitationLink) => {
  return sendEmail({
    email,
    subject: 'Invitation to Join JB Bakery Staff',
    template: 'staffInvitation',
    templateData: { name, invitationLink },
  });
};

export const sendCustomNotificationEmail = async (
  email,
  title,
  message,
  buttonText,
  buttonLink
) => {
  return sendEmail({
    email,
    subject: title,
    template: 'customNotification',
    templateData: { title, message, buttonText, buttonLink },
  });
};
