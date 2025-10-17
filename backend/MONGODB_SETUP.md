# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Cloud)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (choose FREE tier)
4. Wait for cluster to be created (takes a few minutes)

### Step 2: Setup Database Access

1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Give "Read and write to any database" permissions

### Step 3: Setup Network Access

1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `pos_system`

### Step 5: Create .env file

Create a file named `.env` in the backend folder with:

```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/pos_system?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_here_12345
PORT=5000
NODE_ENV=development
```

## Option 2: Local MongoDB (Laptop la install)

### Step 1: Install MongoDB

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service

### Step 2: Update .env file

```
MONGODB_URI=mongodb://localhost:27017/pos_system
JWT_SECRET=your_super_secure_jwt_secret_key_here_12345
PORT=5000
NODE_ENV=development
```

## Testing Connection

After setup, run:

```bash
cd backend
npm start
```

You should see "Connected to MongoDB" message.
