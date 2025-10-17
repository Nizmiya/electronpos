import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, Receipt, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '10',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Total Orders',
      value: '0',
      icon: Receipt,
      color: 'text-green-600',
    },
    {
      title: 'Revenue',
      value: '$0.00',
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Growth',
      value: '+0%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your POS Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No orders yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No sales data available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;