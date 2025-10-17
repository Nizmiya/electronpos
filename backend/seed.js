const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const config = require('./config');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@pos.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'cashier1',
    email: 'cashier@pos.com',
    password: 'cashier123',
    role: 'cashier'
  }
];

const sampleProducts = [
  {
    name: 'Coca Cola',
    description: 'Refreshing soft drink',
    price: 2.50,
    category: 'beverages',
    stock: 100,
    barcode: '1234567890123'
  },
  {
    name: 'Pepsi',
    description: 'Classic cola drink',
    price: 2.50,
    category: 'beverages',
    stock: 80,
    barcode: '1234567890124'
  },
  {
    name: 'Sandwich',
    description: 'Fresh chicken sandwich',
    price: 8.99,
    category: 'food',
    stock: 25,
    barcode: '1234567890125'
  },
  {
    name: 'Burger',
    description: 'Beef burger with fries',
    price: 12.99,
    category: 'food',
    stock: 20,
    barcode: '1234567890126'
  },
  {
    name: 'Chips',
    description: 'Potato chips',
    price: 3.50,
    category: 'snacks',
    stock: 50,
    barcode: '1234567890127'
  },
  {
    name: 'Chocolate Bar',
    description: 'Milk chocolate bar',
    price: 2.99,
    category: 'snacks',
    stock: 75,
    barcode: '1234567890128'
  },
  {
    name: 'Water Bottle',
    description: 'Mineral water 500ml',
    price: 1.50,
    category: 'beverages',
    stock: 200,
    barcode: '1234567890129'
  },
  {
    name: 'Coffee',
    description: 'Hot coffee',
    price: 4.50,
    category: 'beverages',
    stock: 30,
    barcode: '1234567890130'
  },
  {
    name: 'Pizza Slice',
    description: 'Cheese pizza slice',
    price: 6.99,
    category: 'food',
    stock: 15,
    barcode: '1234567890131'
  },
  {
    name: 'Energy Drink',
    description: 'Red Bull energy drink',
    price: 3.99,
    category: 'beverages',
    stock: 40,
    barcode: '1234567890132'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create products
    for (const productData of sampleProducts) {
      const product = new Product({
        ...productData,
        createdBy: users[0]._id // Admin user
      });
      await product.save();
      console.log(`Created product: ${product.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@pos.com / admin123');
    console.log('Cashier: cashier@pos.com / cashier123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
