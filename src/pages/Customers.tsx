
import React, { useState } from 'react';
import { 
  Users, Plus, Search, Edit, Trash, User, Mail, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

import GlassCard from '@/components/GlassCard';
import { useCustomers, Customer } from '@/lib/db';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tinNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setShowAddModal(true);
  };
  
  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowAddModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCustomer(null);
  };
  
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };
  
  // New customer form fields
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    title: '',
    company: '',
    tinNumber: '',
    email: '',
    phone: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, newCustomer);
    } else {
      addCustomer(newCustomer);
    }
    
    handleCloseModal();
    
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
  
  React.useEffect(() => {
    if (editingCustomer) {
      setNewCustomer(editingCustomer);
    }
  }, [editingCustomer]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-eliva-card/40 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-eliva-accent/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="glass-button flex items-center justify-center"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>
      
      {/* Customers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <GlassCard key={customer.id} className="p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-eliva-purple/20 flex items-center justify-center text-eliva-accent font-bold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.title}</p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button 
                  className="p-1.5 rounded-md bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                  onClick={() => handleOpenEditModal(customer)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="p-1.5 rounded-md bg-eliva-danger/20 text-eliva-danger hover:bg-eliva-danger/30 transition-colors"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-start">
                <User size={16} className="text-muted-foreground mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm">{customer.company}</p>
                </div>
              </div>
              
              <div className="flex items-start mt-3">
                <Mail size={16} className="text-muted-foreground mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-start mt-3">
                <Phone size={16} className="text-muted-foreground mt-0.5 mr-2" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start mt-3">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-muted-foreground w-4 h-4 mt-0.5 mr-2" 
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M7 15h.01M11 15h.01M15 15h.01" />
                </svg>
                <div>
                  <p className="text-xs text-muted-foreground">TIN Number</p>
                  <p className="text-sm">{customer.tinNumber}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No customers found. Try changing your search or add a new customer.</p>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                  required
                />
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
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Customers;
