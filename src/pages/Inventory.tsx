
import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, ChevronDown, Edit, Trash, AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

import GlassCard from '@/components/GlassCard';
import StatusBadge from '@/components/StatusBadge';
import { usePipes, PipeItem } from '@/lib/db';

const Inventory = () => {
  const { pipes, addPipe, updatePipe, deletePipe } = usePipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPipe, setEditingPipe] = useState<PipeItem | null>(null);
  
  // Get unique pipe types for filter
  const pipeTypes = Array.from(new Set(pipes.map(pipe => pipe.type)));
  
  // Filter pipes based on search and filter
  const filteredPipes = pipes.filter(pipe => {
    const matchesSearch = 
      pipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pipe.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pipe.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pipe.color.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterType ? pipe.type === filterType : true;
    
    return matchesSearch && matchesFilter;
  });
  
  const getStockStatus = (pipe: PipeItem) => {
    if (pipe.stock <= 0) return 'danger';
    if (pipe.stock <= pipe.minStock) return 'warning';
    return 'success';
  };
  
  const handleOpenAddModal = () => {
    setEditingPipe(null);
    setShowAddModal(true);
  };
  
  const handleOpenEditModal = (pipe: PipeItem) => {
    setEditingPipe(pipe);
    setShowAddModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPipe(null);
  };
  
  const handleDeletePipe = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deletePipe(id);
    }
  };
  
  // New pipe form fields
  const [newPipe, setNewPipe] = useState<Omit<PipeItem, 'id'>>({
    name: '',
    type: '',
    diameter: 0,
    color: '',
    length: 0,
    material: '',
    stock: 0,
    minStock: 0,
    buyPrice: 0,
    sellPrice: 0,
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPipe(prev => ({
      ...prev,
      [name]: name === 'diameter' || name === 'length' || name === 'stock' || 
              name === 'minStock' || name === 'buyPrice' || name === 'sellPrice'
              ? parseFloat(value)
              : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPipe) {
      updatePipe(editingPipe.id, newPipe);
    } else {
      addPipe(newPipe);
    }
    
    handleCloseModal();
    
    // Reset form
    setNewPipe({
      name: '',
      type: '',
      diameter: 0,
      color: '',
      length: 0,
      material: '',
      stock: 0,
      minStock: 0,
      buyPrice: 0,
      sellPrice: 0,
      supplier: '',
      lastRestocked: new Date().toISOString().split('T')[0],
    });
  };
  
  React.useEffect(() => {
    if (editingPipe) {
      setNewPipe(editingPipe);
    }
  }, [editingPipe]);

  return (
    <div className="space-y-6 animate-fade-in">
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
              onChange={(e) => setFilterType(e.target.value || null)}
            >
              <option value="">All Types</option>
              {pipeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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
              {filteredPipes.map((pipe) => (
                <tr 
                  key={pipe.id}
                  className="border-b border-white/10 hover:bg-eliva-highlight/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-eliva-purple/20 flex items-center justify-center">
                        <Package size={16} className="text-eliva-accent" />
                      </div>
                      <span className="font-medium">{pipe.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{pipe.type}</td>
                  <td className="py-3 px-4">{pipe.diameter}mm</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ 
                          backgroundColor: 
                            pipe.color.toLowerCase() === 'white' ? '#f8fafc' :
                            pipe.color.toLowerCase() === 'black' ? '#1e293b' :
                            pipe.color.toLowerCase() === 'blue' ? '#3b82f6' :
                            pipe.color.toLowerCase() === 'red' ? '#ef4444' :
                            pipe.color.toLowerCase() === 'green' ? '#10b981' :
                            pipe.color.toLowerCase() === 'yellow' ? '#eab308' :
                            pipe.color.toLowerCase() === 'copper' ? '#d97706' :
                            pipe.color.toLowerCase() === 'silver' ? '#94a3b8' :
                            '#6E59A5'
                        }}
                      ></div>
                      {pipe.color}
                    </div>
                  </td>
                  <td className="py-3 px-4">{pipe.material}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={getStockStatus(pipe)}
                        text={`${pipe.stock} units`}
                        animated={pipe.stock <= pipe.minStock}
                      />
                      {pipe.stock <= pipe.minStock && (
                        <AlertTriangle size={16} className="text-eliva-warning" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">${pipe.buyPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">${pipe.sellPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-1.5 rounded-md bg-eliva-accent/20 text-eliva-accent hover:bg-eliva-accent/30 transition-colors"
                        onClick={() => handleOpenEditModal(pipe)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-md bg-eliva-danger/20 text-eliva-danger hover:bg-eliva-danger/30 transition-colors"
                        onClick={() => handleDeletePipe(pipe.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPipes.length === 0 && (
          <div className="p-8 text-center">
            <Package size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No items found. Try changing your search or filter.</p>
          </div>
        )}
      </GlassCard>
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-2xl p-6 animate-scale-in">
            <h2 className="text-xl font-bold mb-4">
              {editingPipe ? 'Edit Item' : 'Add New Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPipe.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={newPipe.type}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Diameter (mm)</label>
                  <input
                    type="number"
                    name="diameter"
                    value={newPipe.diameter}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newPipe.color}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Length (m)</label>
                  <input
                    type="number"
                    name="length"
                    value={newPipe.length}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={newPipe.material}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newPipe.stock}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Min Stock</label>
                  <input
                    type="number"
                    name="minStock"
                    value={newPipe.minStock}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Buy Price ($)</label>
                  <input
                    type="number"
                    name="buyPrice"
                    value={newPipe.buyPrice}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Sell Price ($)</label>
                  <input
                    type="number"
                    name="sellPrice"
                    value={newPipe.sellPrice}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={newPipe.supplier}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Last Restocked</label>
                  <input
                    type="date"
                    name="lastRestocked"
                    value={newPipe.lastRestocked}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-eliva-card/60 border border-white/10 rounded-lg"
                    required
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
                >
                  {editingPipe ? 'Update Item' : 'Add Item'}
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
