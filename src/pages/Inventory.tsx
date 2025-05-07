
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package, Plus, Search, Filter, ChevronDown, Edit, Trash, AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import DatabaseService, { Product, ProductType } from '@/services/database';

const Inventory = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Fetch products
  const { data: products = [], isLoading: loadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: DatabaseService.getProducts,
  });
  
  // Fetch product types
  const { data: productTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ['productTypes'],
    queryFn: DatabaseService.getProductTypes,
  });
  
  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: DatabaseService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product added",
        description: "The product has been added successfully",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast({
        title: "Failed to add product",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number, updates: Partial<Omit<Product, 'id' | 'type_name'>> }) => 
      DatabaseService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast({
        title: "Failed to update product",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: DatabaseService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete product",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  // Filter products based on search and filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.type_name && product.type_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.material && product.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.color && product.color.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = filterType ? product.type_id === filterType : true;
    
    return matchesSearch && matchesFilter;
  });
  
  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return 'danger';
    if (product.stock <= product.min_stock) return 'warning';
    return 'success';
  };
  
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      type_id: productTypes.length > 0 ? productTypes[0].id : 0,
      diameter: null,
      color: '',
      length: null,
      material: '',
      stock: 0,
      min_stock: 5,
      buy_price: 0,
      sell_price: 0,
      supplier: '',
      last_restocked: new Date().toISOString().split('T')[0],
    });
    setShowAddModal(true);
  };
  
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      type_id: product.type_id,
      diameter: product.diameter,
      color: product.color || '',
      length: product.length,
      material: product.material || '',
      stock: product.stock,
      min_stock: product.min_stock,
      buy_price: product.buy_price,
      sell_price: product.sell_price,
      supplier: product.supplier || '',
      last_restocked: product.last_restocked || new Date().toISOString().split('T')[0],
    });
    setShowAddModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };
  
  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteProductMutation.mutate(id);
    }
  };
  
  // New product form fields
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'type_name'>>({
    name: '',
    type_id: 0,
    diameter: null,
    color: '',
    length: null,
    material: '',
    stock: 0,
    min_stock: 5,
    buy_price: 0,
    sell_price: 0,
    supplier: '',
    last_restocked: new Date().toISOString().split('T')[0],
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? value === '' ? null : parseFloat(value)
        : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProductMutation.mutate({ 
        id: editingProduct.id, 
        updates: newProduct 
      });
    } else {
      addProductMutation.mutate(newProduct);
    }
  };
  
  useEffect(() => {
    if (productTypes.length > 0 && newProduct.type_id === 0) {
      setNewProduct(prev => ({ ...prev, type_id: productTypes[0].id }));
    }
  }, [productTypes]);

  if (productsError) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500 mb-2">Error Loading Inventory</h1>
        <p className="text-muted-foreground">There was a problem connecting to the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2 bg-eliva-card/40 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-eliva-accent/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 bg-eliva-card/40 backdrop-blur-sm border border-white/10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-eliva-accent/50"
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">All Types</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
          
          <button 
            className="glass-button flex items-center justify-center"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} className="mr-2" />
            Add Item
          </button>
        </div>
      </div>
      
      {/* Inventory Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-eliva-card/80">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Type</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Diameter</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Color</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Material</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Stock</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Buy Price</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Sell Price</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading inventory...</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    className="border-b border-white/10 hover:bg-eliva-highlight/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-eliva-purple/20 flex items-center justify-center">
                          <Package size={16} className="text-eliva-accent" />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.type_name}</td>
                    <td className="py-3 px-4">{product.diameter ? `${product.diameter}mm` : '-'}</td>
                    <td className="py-3 px-4">
                      {product.color ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ 
                              backgroundColor: 
                                product.color.toLowerCase() === 'white' ? '#f8fafc' :
                                product.color.toLowerCase() === 'black' ? '#1e293b' :
                                product.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                product.color.toLowerCase() === 'red' ? '#ef4444' :
                                product.color.toLowerCase() === 'green' ? '#10b981' :
                                product.color.toLowerCase() === 'yellow' ? '#eab308' :
                                product.color.toLowerCase() === 'copper' ? '#d97706' :
                                product.color.toLowerCase() === 'silver' ? '#94a3b8' :
                                product.color.toLowerCase() === 'clear' ? '#e5e7eb' :
                                '#6E59A5'
                            }}
                          ></div>
                          {product.color}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">{product.material || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={getStockStatus(product)}
                          text={`${product.stock} units`}
                          animated={product.stock <= product.min_stock}
                        />
                        {product.stock <= product.min_stock && (
                          <AlertTriangle size={16} className="text-eliva-warning" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">${product.buy_price.toFixed(2)}</td>
                    <td className="py-3 px-4">${product.sell_price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1.5 rounded-md bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                          onClick={() => handleOpenEditModal(product)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-1.5 rounded-md bg-eliva-danger/20 text-eliva-danger hover:bg-eliva-danger/30 transition-colors"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loadingProducts && filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No items found. Try changing your search or filter.</p>
          </div>
        )}
      </GlassCard>
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Item' : 'Add New Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                  <select
                    name="type_id"
                    value={newProduct.type_id}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  >
                    {loadingTypes ? (
                      <option>Loading...</option>
                    ) : (
                      productTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Diameter (mm)</label>
                  <input
                    type="number"
                    name="diameter"
                    value={newProduct.diameter === null ? '' : newProduct.diameter}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newProduct.color}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Length (m)</label>
                  <input
                    type="number"
                    name="length"
                    value={newProduct.length === null ? '' : newProduct.length}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={newProduct.material}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Min Stock</label>
                  <input
                    type="number"
                    name="min_stock"
                    value={newProduct.min_stock}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Buy Price ($)</label>
                  <input
                    type="number"
                    name="buy_price"
                    value={newProduct.buy_price}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Sell Price ($)</label>
                  <input
                    type="number"
                    name="sell_price"
                    value={newProduct.sell_price}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={newProduct.supplier}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Last Restocked</label>
                  <input
                    type="date"
                    name="last_restocked"
                    value={newProduct.last_restocked}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-eliva-highlight/50 text-white hover:bg-eliva-highlight/80 transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-eliva-accent text-white hover:bg-eliva-accent/80 transition-colors"
                  disabled={addProductMutation.isPending || updateProductMutation.isPending}
                >
                  {addProductMutation.isPending || updateProductMutation.isPending ? 
                    'Processing...' : 
                    editingProduct ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Inventory;
