# POS System Setup Guide

This guide will help you set up and run the complete POS system on your local machine.

## 📋 System Requirements

### Minimum Requirements

- **Operating System**: Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Node.js**: Version 16.0 or higher
- **MongoDB**: Version 4.4 or higher

### Recommended Requirements

- **RAM**: 8GB or more
- **Storage**: 5GB free space
- **Node.js**: Version 18.0 or higher (LTS)
- **MongoDB**: Version 5.0 or higher

## 🔧 Installation Steps

### Step 1: Install Prerequisites

#### Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer and follow the setup wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Install MongoDB

**Windows:**

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer with default settings
3. MongoDB will start automatically as a Windows service

**macOS:**

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Clone and Setup Project

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd pos_electron
   ```

2. **Install all dependencies:**

   ```bash
   npm run install-all
   ```

   This command will install dependencies for:

   - Root project
   - Backend API
   - Admin panel (React)
   - POS terminal (Electron)

### Step 3: Database Configuration

1. **Start MongoDB service:**

   **Windows:** MongoDB should start automatically

   **macOS/Linux:**

   ```bash
   sudo systemctl start mongod  # Linux
   brew services start mongodb/brew/mongodb-community  # macOS
   ```

2. **Verify MongoDB is running:**

   ```bash
   mongosh --eval "db.runCommand({ connectionStatus: 1 })"
   ```

3. **Create database (optional - will be created automatically):**
   ```bash
   mongosh
   use pos_system
   exit
   ```

### Step 4: Environment Configuration

1. **Create environment file:**

   ```bash
   cd backend
   cp config.js config.example.js
   ```

2. **Update configuration in `backend/config.js`:**

   ```javascript
   module.exports = {
     PORT: process.env.PORT || 5000,
     MONGODB_URI:
       process.env.MONGODB_URI || "mongodb://localhost:27017/pos_system",
     JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key_here",
     NODE_ENV: process.env.NODE_ENV || "development",
   };
   ```

3. **For production, create a `.env` file:**
   ```bash
   cd backend
   echo "PORT=5000" > .env
   echo "MONGODB_URI=mongodb://localhost:27017/pos_system" >> .env
   echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env
   echo "NODE_ENV=production" >> .env
   ```

### Step 5: Initialize Database with Sample Data

1. **Start the backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Create default users using the API or admin panel**

### Step 6: Run the Complete System

1. **Start all services:**

   ```bash
   npm start
   ```

   This will start:

   - Backend API on `http://localhost:5000`
   - Admin Panel on `http://localhost:3000`
   - POS Terminal (Electron app)

2. **Access the applications:**
   - **Admin Panel**: Open `http://localhost:3000` in your browser
   - **POS Terminal**: The Electron app will open automatically

## 🧪 Testing the Setup

### Test Backend API

```bash
# Test API health
curl http://localhost:5000/api/products

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos.com","password":"admin123"}'
```

### Test Admin Panel

1. Open `http://localhost:3000`
2. Login with admin credentials
3. Try adding a product
4. Check the dashboard

### Test POS Terminal

1. Launch the Electron app
2. Login with cashier credentials
3. Add products to cart
4. Process a test order

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log  # Linux
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
```

#### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Update Node.js if needed
# Download latest LTS from nodejs.org
```

#### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Permission Issues (Linux/macOS)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Reset Everything

If you need to start fresh:

```bash
# Stop all services
# Kill any running Node.js processes

# Clear node_modules
rm -rf node_modules backend/node_modules admin/node_modules pos/node_modules

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm run install-all

# Restart MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb/brew/mongodb-community  # macOS
```

## 📊 Default Data

### Default Users

The system doesn't create default users automatically. You need to create them:

1. **Admin User:**

   - Email: `admin@pos.com`
   - Password: `admin123`
   - Role: `admin`

2. **Cashier User:**
   - Email: `cashier@pos.com`
   - Password: `cashier123`
   - Role: `cashier`

### Sample Products

You can add sample products through the admin panel or create a data seeding script.

## 🚀 Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set strong JWT secrets
4. Use a reverse proxy (nginx)
5. Set up SSL certificates

### Admin Panel Deployment

1. Build the React app: `npm run build`
2. Serve static files with nginx or similar
3. Configure API endpoints for production

### POS Terminal Distribution

1. Build Electron app: `npm run dist`
2. Distribute the built application
3. Configure backend API URL for production

## 📞 Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Check MongoDB and Node.js versions
4. Review error logs in the console
5. Create an issue in the repository with detailed error information

---

**Happy Setup! 🎉**
