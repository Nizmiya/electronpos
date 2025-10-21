import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, Package, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  barcode: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  
  const itemsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const fetchedProducts = data.products || [];
        setProducts(fetchedProducts);
        
        // Calculate stats
        const categorySet = new Set(fetchedProducts.map((p: Product) => p.category));
        const categories = Array.from(categorySet);
        const lowStock = fetchedProducts.filter((p: Product) => p.stock > 0 && p.stock < 10).length;
        const outOfStock = fetchedProducts.filter((p: Product) => p.stock === 0).length;
        
        setStats({
          totalProducts: fetchedProducts.length,
          totalCategories: categories.length,
          lowStock,
          outOfStock,
        });
        
        setError(null);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-green-100 text-green-800';
      case 'beverages':
        return 'bg-blue-100 text-blue-800';
      case 'snacks':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 font-semibold';
    if (stock < 10) return 'text-yellow-600 font-semibold';
    return 'text-green-600 font-semibold';
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination window logic - show 4 page numbers at a time
  const getVisiblePages = () => {
    const maxVisible = 4;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();
  const canGoBack = visiblePages[0] > 1;
  const canGoForward = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePreviousPages = () => {
    const newStart = Math.max(1, visiblePages[0] - 4);
    setCurrentPage(newStart);
  };

  const handleNextPages = () => {
    const newStart = Math.min(totalPages - 3, visiblePages[visiblePages.length - 1] + 1);
    setCurrentPage(newStart);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-gray-600 text-lg">Manage your product inventory</p>
        </div>
        <Button 
          onClick={() => navigate('/products/add')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-lg">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-gray-300 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-300 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalCategories}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">C</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-gray-300 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-sm">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border border-gray-300 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">X</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-300 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Add your first product to get started with your inventory.
                </p>
                <Button 
                  onClick={() => navigate('/products/add')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          currentProducts.map((product) => (
            <Card key={product._id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)} shadow-sm`}>
                        {product.category}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStockColor(product.stock)} bg-opacity-10`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">Price</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/products/edit/${product._id}`)}
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {product.barcode && (
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-xs text-gray-500 font-medium">
                        Barcode: {product.barcode}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {products.length > 0 && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-300 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                {/* Product Count Info - Left Side */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Total Products: <span className="font-bold text-blue-600">{products.length}</span>
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-gray-800">{Math.min(endIndex, products.length)}</span> of{' '}
                    <span className="font-semibold text-gray-800">{products.length}</span> products
                  </span>
                </div>

                {/* Pagination Controls - Right Side */}
                {products.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {/* Previous Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                    >
                      ← Previous
                    </Button>
                    
                    {/* Previous Pages Button (<) */}
                    {canGoBack && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPages}
                        className="hover:bg-blue-50 hover:border-blue-300"
                        title="Previous 4 pages"
                      >
                        &lt;
                      </Button>
                    )}
                    
                    {/* Page Numbers (4 at a time) */}
                    <div className="flex space-x-1">
                      {totalPages > 0 && Array.from({ length: Math.min(4, totalPages) }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md border-blue-600"
                              : "text-gray-600 border-gray-400 hover:bg-gray-50 hover:border-gray-500"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Next Pages Button (>) */}
                    {canGoForward && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPages}
                        className="hover:bg-blue-50 hover:border-blue-300"
                        title="Next 4 pages"
                      >
                        &gt;
                      </Button>
                    )}
                    
                    {/* Next Page Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                    >
                      Next →
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Page Info */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>
                    {Math.ceil(products.length / itemsPerPage)} pages total
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Products;