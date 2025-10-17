const { ipcRenderer } = require('electron');

// Global state
let currentUser = null;
let products = [];
let cart = [];
let selectedPaymentMethod = null;
let currentOrder = null;

// DOM elements
const loginScreen = document.getElementById('login-screen');
const posScreen = document.getElementById('pos-screen');
const receiptScreen = document.getElementById('receipt-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const cashierName = document.getElementById('cashier-name');
const productSearch = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const productsGrid = document.getElementById('products-grid');
const categoryBtns = document.querySelectorAll('.category-btn');
const cartItems = document.getElementById('cart-items');
const clearCartBtn = document.getElementById('clear-cart-btn');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const paymentBtns = document.querySelectorAll('.payment-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const newSaleBtn = document.getElementById('new-sale-btn');
const printReceiptBtn = document.getElementById('print-receipt-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Frontend: DOM loaded, initializing app');
    
    // Check if all required elements exist
    console.log('Frontend: Checking DOM elements...');
    console.log('Frontend: loginScreen:', loginScreen);
    console.log('Frontend: posScreen:', posScreen);
    console.log('Frontend: loginForm:', loginForm);
    console.log('Frontend: cashierName:', cashierName);
    
    await checkStoredAuth();
    setupEventListeners();
    console.log('Frontend: App initialized');
});

// Check for stored authentication
async function checkStoredAuth() {
    const token = await ipcRenderer.invoke('get-stored-token');
    const user = await ipcRenderer.invoke('get-stored-user');
    
    if (token && user) {
        currentUser = user;
        showPOSScreen();
        await loadProducts();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Product search
    searchBtn.addEventListener('click', handleSearch);
    productSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterProductsByCategory(e.target.dataset.category);
        });
    });
    
    // Cart management
    clearCartBtn.addEventListener('click', clearCart);
    
    // Payment methods
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            paymentBtns.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedPaymentMethod = e.target.dataset.method;
            updateCheckoutButton();
        });
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Receipt actions
    newSaleBtn.addEventListener('click', startNewSale);
    printReceiptBtn.addEventListener('click', handlePrintReceipt);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    console.log('Frontend: Attempting login for:', email);
    
    try {
        const result = await ipcRenderer.invoke('login', { email, password });
        console.log('Frontend: Login result:', result);
        
        if (result.success) {
            currentUser = result.user;
            console.log('Frontend: Login successful, showing POS screen');
            showPOSScreen();
            await loadProducts();
        } else {
            console.error('Frontend: Login failed:', result.error);
            showLoginError(result.error.message || 'Login failed');
        }
    } catch (error) {
        console.error('Frontend: Login error:', error);
        showLoginError('Login failed: ' + error.message);
    }
}

// Handle logout
async function handleLogout() {
    await ipcRenderer.invoke('logout');
    currentUser = null;
    showLoginScreen();
}

// Show login error
function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 5000);
}

// Show POS screen
function showPOSScreen() {
    console.log('Frontend: Showing POS screen');
    console.log('Frontend: Current user:', currentUser);
    
    console.log('Frontend: Before - loginScreen classes:', loginScreen.className);
    console.log('Frontend: Before - posScreen classes:', posScreen.className);
    
    loginScreen.classList.remove('active');
    posScreen.classList.add('active');
    receiptScreen.classList.remove('active');
    
    console.log('Frontend: After - loginScreen classes:', loginScreen.className);
    console.log('Frontend: After - posScreen classes:', posScreen.className);
    console.log('Frontend: posScreen style.display:', posScreen.style.display);
    console.log('Frontend: posScreen computed display:', window.getComputedStyle(posScreen).display);
    
    if (currentUser) {
        cashierName.textContent = `Cashier: ${currentUser.username}`;
        console.log('Frontend: Cashier name updated');
    }
    
    console.log('Frontend: Screen classes updated');
}

// Show login screen
function showLoginScreen() {
    loginScreen.classList.add('active');
    posScreen.classList.remove('active');
    receiptScreen.classList.remove('active');
}

// Show receipt screen
function showReceiptScreen() {
    loginScreen.classList.remove('active');
    posScreen.classList.remove('active');
    receiptScreen.classList.add('active');
}

// Load products
async function loadProducts() {
    try {
        const result = await ipcRenderer.invoke('api-request', {
            method: 'GET',
            url: '/products'
        });
        
        if (result.success) {
            products = result.data.products;
            renderProducts();
        } else {
            console.error('Failed to load products:', result.error);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products
function renderProducts(filteredProducts = products) {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="loading">No products found</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = `product-card ${product.stock === 0 ? 'out-of-stock' : ''}`;
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock}</div>
        `;
        
        if (product.stock > 0) {
            productCard.addEventListener('click', () => addToCart(product));
        }
        
        productsGrid.appendChild(productCard);
    });
}

// Filter products by category
function filterProductsByCategory(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
        renderProducts(filtered);
    }
}

// Handle search
function handleSearch() {
    const searchTerm = productSearch.value.toLowerCase();
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product._id);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('Not enough stock available');
            return;
        }
    } else {
        cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            stock: product.stock
        });
    }
    
    renderCart();
    updateTotals();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateTotals();
}

// Update cart item quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= item.stock) {
            item.quantity = newQuantity;
            renderCart();
            updateTotals();
        } else {
            alert('Not enough stock available');
        }
    }
}

// Render cart
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="loading">Cart is empty</div>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Update totals
function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
    
    updateCheckoutButton();
}

// Update checkout button state
function updateCheckoutButton() {
    const hasItems = cart.length > 0;
    const hasPaymentMethod = selectedPaymentMethod !== null;
    
    checkoutBtn.disabled = !hasItems || !hasPaymentMethod;
}

// Clear cart
function clearCart() {
    cart = [];
    selectedPaymentMethod = null;
    paymentBtns.forEach(btn => btn.classList.remove('selected'));
    renderCart();
    updateTotals();
}

// Handle checkout
async function handleCheckout() {
    if (cart.length === 0 || !selectedPaymentMethod) {
        return;
    }
    
    const orderData = {
        items: cart.map(item => ({
            product: item.id,
            quantity: item.quantity
        })),
        paymentMethod: selectedPaymentMethod,
        customerInfo: {
            name: 'Walk-in Customer',
            email: '',
            phone: ''
        }
    };
    
    try {
        const result = await ipcRenderer.invoke('api-request', {
            method: 'POST',
            url: '/orders',
            data: orderData
        });
        
        if (result.success) {
            currentOrder = result.data;
            showReceipt();
        } else {
            alert('Failed to process order: ' + (result.error.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to process order');
    }
}

// Show receipt
function showReceipt() {
    if (!currentOrder) return;
    
    // Update receipt elements
    document.getElementById('receipt-order-number').textContent = currentOrder.orderNumber;
    document.getElementById('receipt-date').textContent = new Date().toLocaleString();
    
    // Render receipt items
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const receiptItem = document.createElement('div');
        receiptItem.className = 'receipt-item';
        receiptItem.innerHTML = `
            <span>${item.product.name} x${item.quantity}</span>
            <span>$${item.subtotal.toFixed(2)}</span>
        `;
        receiptItems.appendChild(receiptItem);
    });
    
    // Update totals
    document.getElementById('receipt-subtotal').textContent = `$${currentOrder.subtotal.toFixed(2)}`;
    document.getElementById('receipt-tax').textContent = `$${currentOrder.tax.toFixed(2)}`;
    document.getElementById('receipt-total').textContent = `$${currentOrder.total.toFixed(2)}`;
    document.getElementById('receipt-payment').textContent = currentOrder.paymentMethod.toUpperCase();
    
    showReceiptScreen();
}

// Start new sale
function startNewSale() {
    clearCart();
    currentOrder = null;
    showPOSScreen();
}

// Handle print receipt
async function handlePrintReceipt() {
    if (!currentOrder) return;
    
    try {
        const result = await ipcRenderer.invoke('print-receipt', currentOrder);
        if (result.success) {
            alert('Receipt sent to printer');
        } else {
            alert('Failed to print receipt');
        }
    } catch (error) {
        console.error('Print error:', error);
        alert('Failed to print receipt');
    }
}

// Make functions available globally for onclick handlers
window.updateCartQuantity = updateCartQuantity;
