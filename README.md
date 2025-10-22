# NZ Mart - Complete Retail Solution

A comprehensive retail solution featuring a Point of Sale (POS) system, admin panel, and public website for NZ Mart retail store. Built with Electron.js for the POS terminal, React.js for the admin panel and public website, with a Node.js backend API.

## 🚀 Features

### Admin Panel (React Web App)

- **Product Management**: Add, edit, delete, and manage product inventory
- **Order Management**: View all orders, update order status, and track sales
- **Dashboard**: Real-time sales statistics and analytics
- **User Authentication**: Secure login system for admin users
- **Stock Management**: Update product stock levels

### POS Terminal (Electron App)

- **Product Selection**: Browse and search products by category
- **Shopping Cart**: Add/remove items, adjust quantities
- **Payment Processing**: Support for Cash, Card, and UPI payments
- **Receipt Generation**: Print receipts for completed orders
- **Offline Capability**: Works independently with local data storage

### Backend API (Node.js + Express)

- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based authentication system
- **Database**: MySQL integration with Sequelize ORM
- **Real-time Updates**: Live data synchronization between admin and POS

## 🛠️ Technology Stack

| Component          | Technology                                     |
| ------------------ | ---------------------------------------------- |
| **Backend API**    | Node.js, Express.js, MySQL, Sequelize          |
| **Admin Panel**    | React.js, TypeScript, Material-UI, React Query |
| **POS Terminal**   | Electron.js, HTML5, CSS3, JavaScript           |
| **Authentication** | JWT (JSON Web Tokens)                          |
| **Database**       | MySQL                                          |
| **Styling**        | Material-UI, Custom CSS                        |

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pos_electron
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install-all
```

### 3. Setup MySQL

1. **Create MySQL Database:**

   ```sql
   CREATE DATABASE pos_system;
   ```

2. **Configure Environment:**
   Copy `backend/env.example` to `backend/.env` and update the values:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=pos_system
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

3. **Setup Database:**
   ```bash
   cd backend
   npm run setup    # Create tables
   npm run seed     # Add sample data
   ```

### 4. Start the Application

```bash
# Start all services (Backend, Admin Panel, POS Terminal)
npm start
```

This will start:

- Backend API on `http://localhost:5000`
- Admin Panel on `http://localhost:3000`
- POS Terminal (Electron app)

## 📁 Project Structure

```
pos_electron/
├── backend/                 # Node.js API Server
│   ├── models/             # MySQL models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config.js          # Configuration
│   └── server.js          # Main server file
├── admin/                  # React Admin Panel
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   └── public/
├── pos/                    # Electron POS Terminal
│   ├── main.js            # Main Electron process
│   ├── renderer.js        # Renderer process
│   ├── index.html         # POS UI
│   └── styles.css         # POS styling
└── package.json           # Root package.json
```

## 👥 Default Users

The system comes with default user accounts:

### Admin Account

- **Email**: `admin@pos.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

### Cashier Account

- **Email**: `cashier@pos.com`
- **Password**: `cashier123`
- **Role**: Cashier (POS access only)

## 🔧 Individual Service Commands

### Backend API

```bash
cd backend
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

### Admin Panel

```bash
cd admin
npm start          # Start React development server
npm run build      # Build for production
```

### POS Terminal

```bash
cd pos
npm start          # Start Electron app
npm run dev        # Start with developer tools
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `PATCH /api/products/:id/stock` - Update stock (Admin only)

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/stats/overview` - Get order statistics

## 🎯 Usage Guide

### Admin Panel Usage

1. **Login**: Use admin credentials to access the admin panel
2. **Add Products**: Navigate to Products → Add Product
3. **Manage Inventory**: Update stock levels and product information
4. **View Orders**: Check order history and update order status
5. **Dashboard**: Monitor sales statistics and performance

### POS Terminal Usage

1. **Login**: Use cashier credentials to access the POS terminal
2. **Browse Products**: Use search or category filters to find products
3. **Add to Cart**: Click on products to add them to the cart
4. **Manage Cart**: Adjust quantities or remove items
5. **Select Payment**: Choose payment method (Cash/Card/UPI)
6. **Process Payment**: Complete the transaction
7. **Print Receipt**: Generate and print receipt for customer

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and Cashier role separation
- **Input Validation**: Server-side validation for all inputs
- **Password Hashing**: Bcrypt password hashing
- **CORS Protection**: Configured CORS policies

## 🚀 Deployment

### Production Build

```bash
# Build admin panel
cd admin && npm run build

# Build POS app
cd pos && npm run build

# Start production backend
cd backend && npm start
```

### Environment Variables for Production

```env
PORT=5000
DB_HOST=your-production-mysql-host
DB_PORT=3306
DB_NAME=pos_system
DB_USER=your-production-mysql-user
DB_PASSWORD=your-production-mysql-password
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## 🛠️ Development

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`
2. **Admin Panel**: Add pages in `admin/src/pages/`
3. **POS Terminal**: Update `pos/renderer.js` and `pos/index.html`

### Database Schema

- **Users**: Authentication and user management
- **Products**: Product catalog and inventory
- **Orders**: Sales transactions and order history

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Selling! 🛒💳**
