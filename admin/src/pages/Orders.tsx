import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Receipt, User, CreditCard, Package, Table, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
  cashier: {
    _id: string;
    username: string;
  } | null;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <span>💰</span>;
      case 'upi':
        return <span>📱</span>;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-gray-600 text-lg">View and manage customer orders from POS system</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'table' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <Table className="h-4 w-4 inline mr-2" />
            Table View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              viewMode === 'card' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            <List className="h-4 w-4 inline mr-2" />
            Card View
          </button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-white">
            <Receipt className="h-6 w-6 mr-3" />
            Order History ({orders.length} orders)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">
                Orders will appear here once customers make purchases through the POS system.
              </p>
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cashier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {orders.map((order, orderIndex) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {orderIndex + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {getPaymentIcon(order.paymentMethod)}
                          <span className="ml-2">{order.paymentMethod.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.cashier ? order.cashier.username : 'POS System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {orders.map((order, orderIndex) => (
                <div key={order._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Serial: {orderIndex + 1} | ID: {order._id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-600 mt-2">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Cashier: {order.cashier ? order.cashier.username : 'POS System'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      {getPaymentIcon(order.paymentMethod)}
                      <span className="ml-2 font-medium">{order.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                      <Package className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="font-medium">{order.items.length} item(s)</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Subtotal: <span className="text-green-600 font-bold">${order.subtotal.toFixed(2)}</span></p>
                        <p className="font-medium">Tax: <span className="text-orange-600 font-bold">${order.tax.toFixed(2)}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Total: ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3 text-gray-700 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm text-gray-800">
                                {item.product ? item.product.name : 'Unknown Product'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-green-600">${item.subtotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;