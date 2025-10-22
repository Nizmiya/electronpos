const { User, Product, Order, OrderItem } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Seeding MySQL database...');
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@pos.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log('Created admin user');
    
    // Create cashier user
    const cashierUser = await User.create({
      username: 'cashier',
      email: 'cashier@pos.com',
      password: 'cashier123',
      role: 'cashier',
      isActive: true
    });
    console.log('Created cashier user');
    
    // Create sample products
    const products = [
      {
        name: 'Coca Cola',
        description: 'Refreshing soft drink',
        price: 2.50,
        category: 'Beverages',
        stock: 100,
        barcode: '123456789',
        isActive: true,
        createdBy: adminUser.id
      },
      {
        name: 'Pepsi',
        description: 'Popular soft drink',
        price: 2.50,
        category: 'Beverages',
        stock: 80,
        barcode: '123456790',
        isActive: true,
        createdBy: adminUser.id
      },
      {
        name: 'Chocolate Bar',
        description: 'Delicious chocolate treat',
        price: 3.00,
        category: 'Snacks',
        stock: 50,
        barcode: '123456791',
        isActive: true,
        createdBy: adminUser.id
      },
      {
        name: 'Sandwich',
        description: 'Fresh sandwich',
        price: 5.50,
        category: 'Food',
        stock: 25,
        barcode: '123456792',
        isActive: true,
        createdBy: adminUser.id
      },
      {
        name: 'Coffee',
        description: 'Hot coffee',
        price: 2.00,
        category: 'Beverages',
        stock: 60,
        barcode: '123456793',
        isActive: true,
        createdBy: adminUser.id
      },
      {
        name: 'Chips',
        description: 'Crispy potato chips',
        price: 1.50,
        category: 'Snacks',
        stock: 75,
        barcode: '123456794',
        isActive: true,
        createdBy: adminUser.id
      }
    ];
    
    const createdProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`Created product: ${product.name}`);
    }
    
    // Create sample orders
    const sampleOrders = [
      {
        orderNumber: '1',
        subtotal: 8.00,
        tax: 0.80,
        discount: 0,
        total: 8.80,
        paymentMethod: 'card',
        paymentStatus: 'completed',
        status: 'completed',
        cashier: cashierUser.id,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        items: [
          { productId: createdProducts[0].id, quantity: 2, price: 2.50, subtotal: 5.00 },
          { productId: createdProducts[2].id, quantity: 1, price: 3.00, subtotal: 3.00 }
        ]
      },
      {
        orderNumber: '2',
        subtotal: 4.50,
        tax: 0.45,
        discount: 0,
        total: 4.95,
        paymentMethod: 'cash',
        paymentStatus: 'completed',
        status: 'completed',
        cashier: cashierUser.id,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '987-654-3210',
        items: [
          { productId: createdProducts[1].id, quantity: 1, price: 2.50, subtotal: 2.50 },
          { productId: createdProducts[5].id, quantity: 1, price: 1.50, subtotal: 1.50 }
        ]
      }
    ];
    
    for (const orderData of sampleOrders) {
      const { items, ...orderInfo } = orderData;
      const order = await Order.create(orderInfo);
      
      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        });
      }
      
      console.log(`Created order: ${order.orderNumber}`);
    }
    
    console.log('Database seeded successfully!');
    console.log('Admin login: admin@pos.com / admin123');
    console.log('Cashier login: cashier@pos.com / cashier123');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase };
