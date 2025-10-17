import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Receipt } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Orders will appear here once customers start making purchases.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;