import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  getCurrentUser: () => 
    api.get('/auth/me'),
};

export const productsAPI = {
  getProducts: (params?: any) => 
    api.get('/products', { params }),
  getProduct: (id: string) => 
    api.get(`/products/${id}`),
  createProduct: (productData: any) => 
    api.post('/products', productData),
  updateProduct: (id: string, productData: any) => 
    api.put(`/products/${id}`, productData),
  deleteProduct: (id: string) => 
    api.delete(`/products/${id}`),
  updateStock: (id: string, stock: number) => 
    api.patch(`/products/${id}/stock`, { stock }),
};

export const ordersAPI = {
  getOrders: (params?: any) => 
    api.get('/orders', { params }),
  getOrder: (id: string) => 
    api.get(`/orders/${id}`),
  createOrder: (orderData: any) => 
    api.post('/orders', orderData),
  updateOrderStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
  getOrderStats: () => 
    api.get('/orders/stats/overview'),
};

export default api;
