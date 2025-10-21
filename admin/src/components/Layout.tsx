import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { 
  Menu, 
  LayoutDashboard, 
  Package, 
  Receipt, 
  User, 
  LogOut,
  X,
  Bell,
  ShoppingCart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface Notification {
  id: string;
  orderNumber: string;
  total: number;
  timestamp: string;
  status: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [seenNotifications, setSeenNotifications] = useState<Set<string>>(new Set());
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const markNotificationAsSeen = (notificationId: string) => {
    setSeenNotifications(prev => {
      const newSet = new Set(prev);
      newSet.add(notificationId);
      return newSet;
    });
  };

  const markAllNotificationsAsSeen = () => {
    const allNotificationIds = notifications.map(n => n.id);
    setSeenNotifications(prev => {
      const newSet = new Set(prev);
      allNotificationIds.forEach(id => newSet.add(id));
      return newSet;
    });
  };

  // Fetch notifications (recent orders)
  useEffect(() => {
    if (token) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const orders = data.orders || [];
        
        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((order: any) => ({
            id: order._id,
            orderNumber: order.orderNumber,
            total: order.total,
            timestamp: order.createdAt,
            status: order.status
          }));

        setNotifications(recentOrders);
        
        // Calculate unread count (total notifications minus seen ones)
        const unreadNotifications = recentOrders.filter((order: Notification) => !seenNotifications.has(order.id));
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { text: 'Products', icon: Package, path: '/products' },
    { text: 'Orders', icon: Receipt, path: '/orders' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100 relative z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-blue-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NZ</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NZ Mart Admin
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {user?.username}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            
            {/* Notification Icon */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100 relative"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
              
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl py-2 z-[9999] border border-blue-100">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                      POS Orders ({notifications.length})
                    </h3>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No recent orders</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => {
                        const isSeen = seenNotifications.has(notification.id);
                        return (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              !isSeen ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                            onClick={() => {
                              markNotificationAsSeen(notification.id);
                              navigate('/orders');
                              setNotificationOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {!isSeen && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <div>
                                  <p className={`font-medium text-sm ${
                                    !isSeen ? 'text-gray-900' : 'text-gray-600'
                                  }`}>
                                    Order #{notification.orderNumber}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600 text-sm">
                                  ${notification.total.toFixed(2)}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  notification.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {notification.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200 space-y-2">
                      <button
                        onClick={() => {
                          markAllNotificationsAsSeen();
                        }}
                        className="w-full text-center text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Mark All as Seen
                      </button>
                      <button
                        onClick={() => {
                          navigate('/orders');
                          setNotificationOpen(false);
                        }}
                        className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All Orders
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl py-2 z-[9999] border border-blue-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-72 bg-white/80 backdrop-blur-sm shadow-xl border-r border-blue-100 min-h-screen`}>
          <nav className="p-6">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-200 ${
                          isActive(item.path) 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:transform hover:scale-105'
                        }`}
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex items-center w-full">
                          <Icon className={`h-5 w-5 ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`} />
                          <span className="font-medium ml-3">{item.text}</span>
                        </div>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;