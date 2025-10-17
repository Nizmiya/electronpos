import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const EditProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Modify product information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Edit product functionality coming soon...</p>
            <p className="text-sm text-gray-500 mt-2">
              This page will allow you to edit existing products.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;