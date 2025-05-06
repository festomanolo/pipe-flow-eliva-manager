
import React, { useState } from 'react';
import { 
  ShoppingCart, Users, ChevronDown, Plus, Search, Download, FileText,
  Trash, ShoppingBag, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import { usePipes, useCustomers, useSales, Customer, PipeItem, SaleItem } from '@/lib/db';
import { generateSaleReceipt, savePdf, SaleReceiptProps } from '@/lib/pdfGenerator';

const Sales = () => {
  const { pipes } = usePipes();
  const { customers, addCustomer } = useCustomers();
  const { sales, addSale } = useSales();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  
  // Filter sales based on search
  const filteredSales = sales.filter(sale => {
    const customer = customers.find(c => c.id === sale.customerId);
    return (
      sale.id.includes(searchTerm) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // New sale form state
  const [newSale, setNewSale] = useState({
    customerId: '',
    items: [] as {
      productId: string;
      quantity: number;
    }[],
    paymentMethod: 'Credit Card',
    status: 'completed' as 'completed' | 'pending' | 'cancelled',
  });
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    title: '',
    company: '',
    tinNumber: '',
    email: '',
    phone: '',
  });
  
  const handleNewSaleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSale(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddItemToSale = () => {
    setNewSale(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: '', quantity: 1 }
      ]
    }));
  };
  
  const handleRemoveItemFromSale = (index: number) => {
    setNewSale(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    setNewSale(prev => {
      const updatedItems = [...prev.items];
      if (field === 'productId') {
        updatedItems[index] = { ...updatedItems[index], productId: value as string };
      } else {
        updatedItems[index] = { ...updatedItems[index], quantity: Number(value) };
      }
      return { ...prev, items: updatedItems };
    });
  };
  
  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = addCustomer(newCustomer);
    setNewSale(prev => ({ ...prev, customerId: customer.id }));
    setShowAddCustomerModal(false);
    
    // Reset form
    setNewCustomer({
      name: '',
      title: '',
      company: '',
      tinNumber: '',
      email: '',
      phone: '',
    });
  };
  
  const calculateSaleTotal = (items: typeof newSale.items) => {
    return items.reduce((total, item) => {
      const product = pipes.find(p => p.id === item.productId);
      if (product) {
        return total + (product.sellPrice * item.quantity);
      }
      return total;
    }, 0);
  };
  
  const calculateSaleProfit = (items: typeof newSale.items) => {
    return items.reduce((total, item) => {
      const product = pipes.find(p => p.id === item.productId);
      if (product) {
        return total + ((product.sellPrice - product.buyPrice) * item.quantity);
      }
      return total;
    }, 0);
  };
  
  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate totals and prepare sale items
    const saleItems = newSale.items.map(item => {
      const product = pipes.find(p => p.id === item.productId);
      if (!product) throw new Error("Product not found");
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        productId: item.productId,
        quantity: item.quantity,
        pricePerUnit: product.sellPrice,
        totalPrice: product.sellPrice * item.quantity,
      };
    });
    
    const total = calculateSaleTotal(newSale.items);
    const profit = calculateSaleProfit(newSale.items);
    
    // Create the sale
    const sale = addSale({
      ...newSale,
      items: saleItems,
      total,
      profit,
      date: new Date().toISOString(),
    });
    
    // Generate receipt
    handleGenerateReceipt(sale.id);
    
    // Reset form and close modal
    setNewSale({
      customerId: '',
      items: [],
      paymentMethod: 'Credit Card',
      status: 'completed',
    });
    
    setShowNewSaleModal(false);
  };
  
  const handleGenerateReceipt = async (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;
    
    const customer = customers.find(c => c.id === sale.customerId);
    if (!customer) return;
    
    const items = sale.items.map(item => {
      const product = pipes.find(p => p.id === item.productId);
      if (!product) throw new Error("Product not found");
      
      return {
        product,
        quantity: item.quantity,
        price: item.pricePerUnit,
        totalPrice: item.totalPrice,
      };
    });
    
    const pdfPath = await generateSaleReceipt({ sale, customer, items });
    savePdf(pdfPath);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search sales..."
              className="pl-10 pr-4 py-2 bg-eliva-card/40 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-eliva-accent/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="glass-button flex items-center justify-center"
            onClick={() => setShowNewSaleModal(true)}
          >
            <Plus size={18} className="mr-2" />
            New Sale
          </button>
        </div>
      </div>
      
      {/* Sales Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-eliva-card/80">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Order ID</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Customer</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Items</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Total</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Profit</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                
                return (
                  <tr 
                    key={sale.id}
                    className="border-b border-white/10 hover:bg-eliva-highlight/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{sale.id}</td>
                    <td className="py-3 px-4">{formatDate(sale.date)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{customer?.company}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full bg-eliva-card/60 text-xs">
                        {sale.items.length} items
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">${sale.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-eliva-success font-medium">${sale.profit.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={
                          sale.status === 'completed' ? 'success' :
                          sale.status === 'pending' ? 'warning' : 'danger'
                        } 
                        text={sale.status}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-1.5 rounded-md bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                          onClick={() => handleGenerateReceipt(sale.id)}
                          title="Download Receipt"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredSales.length === 0 && (
          <div className="p-8 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No sales found. Try changing your search or create a new sale.</p>
          </div>
        )}
      </GlassCard>
      
      {/* New Sale Modal */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-3xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBag size={20} className="mr-2 text-eliva-accent" />
              Create New Sale
            </h2>
            
            <form onSubmit={handleCreateSale} className="space-y-6">
              {/* Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Customer</label>
                <div className="flex gap-2">
                  <select
                    name="customerId"
                    value={newSale.customerId}
                    onChange={handleNewSaleInputChange}
                    className="flex-1 p-2 bg-eliva-card/60 border border-white/10 rounded-lg appearance-none"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                    onClick={() => setShowAddCustomerModal(true)}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-muted-foreground">Items</label>
                  <button
                    type="button"
                    className="text-xs text-eliva-accent flex items-center gap-1 hover:underline"
                    onClick={handleAddItemToSale}
                  >
                    <Plus size={14} />
                    Add Item
                  </button>
                </div>
                
                {newSale.items.length === 0 ? (
                  <div className="p-6 border border-dashed border-white/20 rounded-lg text-center">
                    <p className="text-muted-foreground">No items added yet. Click "Add Item" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newSale.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-eliva-highlight/30 rounded-lg">
                        <div className="col-span-7">
                          <label className="block text-xs text-muted-foreground mb-1">Product</label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg appearance-none"
                            required
                          >
                            <option value="">Select Product</option>
                            {pipes.map(pipe => (
                              <option key={pipe.id} value={pipe.id} disabled={pipe.stock <= 0}>
                                {pipe.name} - {pipe.diameter}mm - ${pipe.sellPrice.toFixed(2)}
                                {pipe.stock <= 0 ? ' (Out of Stock)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-xs text-muted-foreground mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                            required
                          />
                        </div>
                        <div className="col-span-2 flex items-end">
                          <button
                            type="button"
                            className="w-full p-2 rounded-lg bg-eliva-danger/20 text-eliva-danger hover:bg-eliva-danger/30 transition-colors flex items-center justify-center"
                            onClick={() => handleRemoveItemFromSale(index)}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        
                        {item.productId && (
                          <div className="col-span-12 pt-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span>Price per unit:</span>
                              <span className="font-medium">
                                ${pipes.find(p => p.id === item.productId)?.sellPrice.toFixed(2) || '0.00'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-eliva-accent">
                              <span>Total:</span>
                              <span className="font-bold">
                                ${((pipes.find(p => p.id === item.productId)?.sellPrice || 0) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Sale Summary */}
                    <div className="mt-4 p-3 bg-eliva-card/60 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">${calculateSaleTotal(newSale.items).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-eliva-success">
                        <span>Profit:</span>
                        <span className="font-bold">${calculateSaleProfit(newSale.items).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sale Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={newSale.paymentMethod}
                    onChange={handleNewSaleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg appearance-none"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    name="status"
                    value={newSale.status}
                    onChange={handleNewSaleInputChange as any}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg appearance-none"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-eliva-highlight/50 text-white hover:bg-eliva-highlight/80 transition-colors"
                  onClick={() => setShowNewSaleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-eliva-accent text-white hover:bg-eliva-accent/80 transition-colors flex items-center"
                  disabled={newSale.items.length === 0 || !newSale.customerId}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Complete Sale
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
      
      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Users size={20} className="mr-2 text-eliva-accent" />
              Add New Customer
            </h2>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newCustomer.title}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={newCustomer.company}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">TIN Number</label>
                <input
                  type="text"
                  name="tinNumber"
                  value={newCustomer.tinNumber}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleNewCustomerInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-eliva-highlight/50 text-white hover:bg-eliva-highlight/80 transition-colors"
                  onClick={() => setShowAddCustomerModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-eliva-accent text-white hover:bg-eliva-accent/80 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Sales;
