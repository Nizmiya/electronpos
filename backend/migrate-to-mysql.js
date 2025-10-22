const { sequelize, User, Product, Order, OrderItem } = require('./models');

async function setupMySQL() {
  try {
    console.log('Setting up MySQL database...');
    
    // Connect to MySQL
    await sequelize.authenticate();
    console.log('Connected to MySQL');
    
    // Sync MySQL database (create tables)
    await sequelize.sync({ force: true });
    console.log('MySQL database synchronized');
    
    console.log('MySQL setup completed successfully!');
    console.log('You can now run: npm run seed');
    
  } catch (error) {
    console.error('MySQL setup failed:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupMySQL();
}

module.exports = { setupMySQL };
