const nodemailer = require('nodemailer');
const { logger } = require('../config/db');

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #ec4899; text-align: center;">Welcome to Sweet Delights!</h1>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with Sweet Delights. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" 
             style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can also click this link:</p>
        <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you didn't create an account with Sweet Delights, please ignore this email.
        </p>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #ec4899; text-align: center;">Password Reset</h1>
        <p>Hello ${data.name},</p>
        <p>You recently requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" 
             style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also click this link:</p>
        <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          For security reasons, please update your password regularly.
        </p>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - #${data.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #ec4899; text-align: center;">Thank You for Your Order!</h1>
        <p>Hello ${data.name},</p>
        <p>Your order has been confirmed and is being processed.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}</p>
          
          <h3 style="color: #666;">Items</h3>
          ${data.items.map(item => `
            <div style="margin-bottom: 10px;">
              <p style="margin: 0;"><strong>${item.name}</strong> x ${item.quantity}</p>
              <p style="margin: 0; color: #666;">$${item.price.toFixed(2)}</p>
            </div>
          `).join('')}
          
          <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px;">
            <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${data.pricing.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Tax:</strong> $${data.pricing.tax.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Shipping:</strong> $${data.pricing.deliveryFee.toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 18px;"><strong>Total:</strong> $${data.pricing.total.toFixed(2)}</p>
          </div>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Shipping Address</h3>
          <p style="margin: 5px 0;">${data.shippingAddress.street}</p>
          <p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.trackingUrl}" 
             style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you have any questions, please contact our customer service.
        </p>
      </div>
    `
  }),

  orderStatusUpdate: (data) => ({
    subject: `Order Status Update - #${data.orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #ec4899; text-align: center;">Order Status Update</h1>
        <p>Hello ${data.name},</p>
        <p>Your order status has been updated to: <strong>${data.status}</strong></p>
        
        <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Update Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.trackingUrl}" 
             style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Thank you for choosing Sweet Delights!
        </p>
      </div>
    `
  })
};

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    logger.error(`SMTP Connection Error: ${error.message}`);
  } else {
    logger.info('SMTP Server is ready to send emails');
  }
});

/**
 * Send email using template
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.template - Template name
 * @param {Object} options.data - Template data
 */
const sendEmail = async (options) => {
  try {
    const template = templates[options.template](options.data);

    const mailOptions = {
      from: `"Sweet Delights" <${process.env.SMTP_FROM}>`,
      to: options.email,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Send Email Error: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;