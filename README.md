# E-Commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features a modern, responsive design with comprehensive functionality for both customers and administrators.

## 🚀 Features

### Customer Features
- **User Authentication & Authorization**
  - Registration with email verification
  - Secure login/logout
  - Password reset functionality
  - Social login (Google, Facebook)
  - Two-factor authentication support

- **Product Browsing & Search**
  - Advanced product filtering and sorting
  - Real-time search with autocomplete
  - Product categories and subcategories
  - Product variants (size, color, material)
  - Product reviews and ratings
  - Wishlist functionality

- **Shopping Cart & Checkout**
  - Persistent shopping cart
  - Coupon and discount codes
  - Multiple shipping options
  - Secure payment processing (Stripe)
  - Order tracking and history

- **User Profile Management**
  - Profile information updates
  - Address book management
  - Order history and tracking
  - Loyalty points system
  - Notification preferences

### Admin Features
- **Dashboard & Analytics**
  - Sales analytics and reporting
  - Customer insights
  - Inventory management
  - Revenue tracking

- **Product Management**
  - Add, edit, delete products
  - Bulk product operations
  - Category management
  - Inventory tracking
  - Product image management

- **Order Management**
  - Order processing and fulfillment
  - Shipping label generation
  - Return and refund processing
  - Customer communication

- **User Management**
  - Customer account management
  - Role-based access control
  - User activity monitoring

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router 6** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **CSS3** - Modern styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email sending
- **Stripe** - Payment processing

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **Morgan** - HTTP request logging

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcommerceApplication
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secrets
   - SMTP settings for email
   - Stripe keys for payments
   - Other API keys as needed

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in the client directory:
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the React development server**
   ```bash
   npm start
   ```

### Full Stack Development

Run both frontend and backend simultaneously:
```bash
# From the root directory
npm run dev
```

## 🗄 Database Schema

### User Model
- Personal information (name, email, phone)
- Authentication (password, verification status)
- Addresses and preferences
- Wishlist and loyalty points
- Security features (2FA, login attempts)

### Product Model
- Basic information (name, description, price)
- Variants (size, color, material)
- Inventory management
- SEO optimization
- Reviews and ratings
- Media (images, videos)

### Order Model
- Order items and pricing
- Shipping and billing addresses
- Payment information
- Order status and tracking
- Return and refund handling

## 🔐 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Password Security**: Bcrypt hashing with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation
- **HTTPS**: SSL/TLS encryption in production
- **CORS**: Configured cross-origin policies
- **Security Headers**: Helmet.js implementation

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Environment Variables**
   Set all required environment variables in your hosting platform

2. **Database**
   Use MongoDB Atlas for cloud database hosting

3. **File Storage**
   Configure AWS S3 or similar for file uploads

### Frontend Deployment (Netlify/Vercel)

1. **Build the application**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy**
   Upload the `build` folder to your hosting platform

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Reset password

### Product Endpoints
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

## 🧪 Testing

### Backend Testing
```bash
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@shopsmart.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with core e-commerce functionality
- **v1.1.0** - Added wishlist and loyalty points
- **v1.2.0** - Enhanced admin dashboard and analytics
- **v1.3.0** - Mobile responsiveness improvements

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the flexible database
- Stripe for secure payment processing
- All open-source contributors

---

**Happy Shopping! 🛒**