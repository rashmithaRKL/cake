# Sweet Delights - Cake Shop E-commerce Platform

A full-stack e-commerce application for a cake shop, built with React, Node.js, Express, and MongoDB.

## 🌟 Features

- **User Authentication & Authorization**
  - Email/Password registration and login
  - JWT-based authentication
  - Role-based access control (Customer/Admin)
  - Password reset functionality
  - Email verification

- **Product Management**
  - Browse products by category
  - Search and filter functionality
  - Product reviews and ratings
  - Image optimization and storage
  - Inventory management

- **Shopping Experience**
  - Shopping cart functionality
  - Wishlist management
  - Real-time product availability
  - Custom cake order options
  - Advanced product search

- **Order Processing**
  - Secure checkout process
  - Multiple payment options (Stripe integration)
  - Order tracking
  - Email notifications
  - Order history

- **Admin Dashboard**
  - Sales analytics
  - Inventory management
  - Order management
  - Customer management
  - Product management

- **Additional Features**
  - Responsive design
  - Real-time updates (Socket.IO)
  - Image optimization
  - Email notifications
  - Error logging and monitoring

## 🚀 Tech Stack

### Frontend
- React
- TailwindCSS
- Framer Motion
- React Query
- Socket.IO Client
- Axios
- Formik & Yup
- GSAP

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Multer
- Sharp
- Nodemailer

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sweet-delights.git
   cd sweet-delights
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. Start the development servers:
   ```bash
   npm start
   ```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# SMTP Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📁 Project Structure

```
sweet-delights/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom hooks
│       ├── utils/         # Utility functions
│       └── styles/        # CSS styles
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   └── utils/           # Utility functions
└── README.md             # Project documentation
```

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Input Validation
- XSS Protection
- CORS Configuration
- Rate Limiting
- Secure Headers (Helmet)
- File Upload Validation

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop devices
- Tablets
- Mobile devices

## 🧪 Testing

Run tests for both client and server:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚀 Deployment

1. Build the client:
   ```bash
   npm run build
   ```

2. Set up environment variables for production

3. Deploy to your preferred hosting platform

## 📈 Performance Optimization

- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- CDN integration
- Database indexing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.