
import { useState, useEffect } from 'react';

// Simulate a database with local storage for now
// In a real app, this would be replaced with SQLite via Electron

// Types
export interface PipeItem {
  id: string;
  name: string;
  type: string;
  diameter: number;
  color: string;
  length: number;
  material: string;
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  supplier: string;
  lastRestocked: string;
}

export interface Customer {
  id: string;
  name: string;
  title: string;
  company: string;
  tinNumber: string;
  email: string;
  phone: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  items: SaleItem[];
  total: number;
  profit: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
}

// Initial data
const initialPipes: PipeItem[] = [
  {
    id: '1',
    name: 'PVC Drain Pipe',
    type: 'PVC',
    diameter: 100,
    color: 'White',
    length: 6,
    material: 'PVC',
    stock: 45,
    minStock: 10,
    buyPrice: 25,
    sellPrice: 40,
    supplier: 'PipeMaster Ltd',
    lastRestocked: '2023-04-15',
  },
  {
    id: '2',
    name: 'Copper Water Pipe',
    type: 'Copper',
    diameter: 15,
    color: 'Copper',
    length: 3,
    material: 'Copper',
    stock: 32,
    minStock: 5,
    buyPrice: 35,
    sellPrice: 55,
    supplier: 'Metal Supplies Inc',
    lastRestocked: '2023-05-01',
  },
  {
    id: '3',
    name: 'Steel Gas Pipe',
    type: 'Steel',
    diameter: 20,
    color: 'Silver',
    length: 6,
    material: 'Galvanized Steel',
    stock: 18,
    minStock: 8,
    buyPrice: 45,
    sellPrice: 75,
    supplier: 'Industrial Metals Co',
    lastRestocked: '2023-04-28',
  },
  {
    id: '4',
    name: 'HDPE Irrigation Pipe',
    type: 'HDPE',
    diameter: 50,
    color: 'Black',
    length: 100,
    material: 'High-Density Polyethylene',
    stock: 5,
    minStock: 10,
    buyPrice: 150,
    sellPrice: 225,
    supplier: 'Farm Supplies Ltd',
    lastRestocked: '2023-03-20',
  },
  {
    id: '5',
    name: 'Cast Iron Drain Pipe',
    type: 'Cast Iron',
    diameter: 100,
    color: 'Black',
    length: 3,
    material: 'Cast Iron',
    stock: 12,
    minStock: 5,
    buyPrice: 90,
    sellPrice: 140,
    supplier: 'Historic Plumbing Co',
    lastRestocked: '2023-04-10',
  },
];

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    title: 'Purchasing Manager',
    company: 'Build Right Construction',
    tinNumber: 'TIN123456789',
    email: 'john@buildright.com',
    phone: '+1234567890',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Project Manager',
    company: 'Modern Homes Ltd',
    tinNumber: 'TIN987654321',
    email: 'sarah@modernhomes.com',
    phone: '+1987654321',
  },
];

const initialSales: Sale[] = [
  {
    id: '1',
    date: '2023-05-01T09:30:00',
    customerId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        quantity: 10,
        pricePerUnit: 40,
        totalPrice: 400,
      },
      {
        id: '2',
        productId: '2',
        quantity: 5,
        pricePerUnit: 55,
        totalPrice: 275,
      },
    ],
    total: 675,
    profit: 175,
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
  {
    id: '2',
    date: '2023-05-02T14:15:00',
    customerId: '2',
    items: [
      {
        id: '1',
        productId: '3',
        quantity: 8,
        pricePerUnit: 75,
        totalPrice: 600,
      },
    ],
    total: 600,
    profit: 240,
    paymentMethod: 'Bank Transfer',
    status: 'completed',
  },
];

// Database hooks
export function usePipes() {
  const [pipes, setPipes] = useState<PipeItem[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const storedPipes = localStorage.getItem('eliva_pipes');
    if (storedPipes) {
      setPipes(JSON.parse(storedPipes));
    } else {
      setPipes(initialPipes);
      localStorage.setItem('eliva_pipes', JSON.stringify(initialPipes));
    }
  }, []);

  const savePipes = (newPipes: PipeItem[]) => {
    setPipes(newPipes);
    localStorage.setItem('eliva_pipes', JSON.stringify(newPipes));
  };

  const addPipe = (pipe: Omit<PipeItem, 'id'>) => {
    const newPipe = { ...pipe, id: Date.now().toString() };
    const updatedPipes = [...pipes, newPipe];
    savePipes(updatedPipes);
    return newPipe;
  };

  const updatePipe = (id: string, updates: Partial<PipeItem>) => {
    const updatedPipes = pipes.map(pipe => 
      pipe.id === id ? { ...pipe, ...updates } : pipe
    );
    savePipes(updatedPipes);
  };

  const deletePipe = (id: string) => {
    const updatedPipes = pipes.filter(pipe => pipe.id !== id);
    savePipes(updatedPipes);
  };

  const getLowStockPipes = () => {
    return pipes.filter(pipe => pipe.stock <= pipe.minStock);
  };

  return { 
    pipes, 
    addPipe, 
    updatePipe, 
    deletePipe,
    getLowStockPipes
  };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const storedCustomers = localStorage.getItem('eliva_customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    } else {
      setCustomers(initialCustomers);
      localStorage.setItem('eliva_customers', JSON.stringify(initialCustomers));
    }
  }, []);

  const saveCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    localStorage.setItem('eliva_customers', JSON.stringify(newCustomers));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    const updatedCustomers = [...customers, newCustomer];
    saveCustomers(updatedCustomers);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    );
    saveCustomers(updatedCustomers);
  };

  const deleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    saveCustomers(updatedCustomers);
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  return { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomerById
  };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const { pipes, updatePipe } = usePipes();

  useEffect(() => {
    const storedSales = localStorage.getItem('eliva_sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    } else {
      setSales(initialSales);
      localStorage.setItem('eliva_sales', JSON.stringify(initialSales));
    }
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem('eliva_sales', JSON.stringify(newSales));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { 
      ...sale, 
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    // Update inventory
    for (const item of sale.items) {
      const pipe = pipes.find(p => p.id === item.productId);
      if (pipe) {
        const newStock = pipe.stock - item.quantity;
        updatePipe(pipe.id, { stock: newStock });
      }
    }
    
    const updatedSales = [...sales, newSale];
    saveSales(updatedSales);
    return newSale;
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, ...updates } : sale
    );
    saveSales(updatedSales);
  };

  const deleteSale = (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    saveSales(updatedSales);
  };

  const getSalesByDateRange = (startDate: Date, endDate: Date) => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  const getTodaySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getSalesByDateRange(today, tomorrow);
  };

  const getWeeklySales = () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return getSalesByDateRange(lastWeek, today);
  };

  const getMonthlySales = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return getSalesByDateRange(lastMonth, today);
  };

  const getTopSellingProducts = () => {
    const productSales: Record<string, { totalQuantity: number, totalProfit: number }> = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { totalQuantity: 0, totalProfit: 0 };
        }
        
        const pipe = pipes.find(p => p.id === item.productId);
        if (pipe) {
          const profit = (item.pricePerUnit - pipe.buyPrice) * item.quantity;
          productSales[item.productId].totalQuantity += item.quantity;
          productSales[item.productId].totalProfit += profit;
        }
      });
    });
    
    // Convert to array and sort by quantity
    return Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        ...data,
        product: pipes.find(p => p.id === productId)
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);
  };

  const getLowPerformingProducts = () => {
    const topSelling = getTopSellingProducts();
    return topSelling.slice(-5).reverse(); // Get bottom 5
  };

  const calculateTotalProfit = () => {
    return sales.reduce((total, sale) => total + sale.profit, 0);
  };

  return { 
    sales, 
    addSale, 
    updateSale, 
    deleteSale,
    getTodaySales,
    getWeeklySales,
    getMonthlySales,
    getTopSellingProducts,
    getLowPerformingProducts,
    calculateTotalProfit
  };
}

// AI Recommendations Service
export function useRecommendations() {
  const { pipes } = usePipes();
  const { getTopSellingProducts, getLowPerformingProducts } = useSales();
  
  const getPriceOptimizationRecommendations = () => {
    const topSelling = getTopSellingProducts();
    const lowPerforming = getLowPerformingProducts();
    const recommendations = [];
    
    // Recommend price increase for top selling items (if margin is too low)
    for (const item of topSelling.slice(0, 3)) {
      const pipe = pipes.find(p => p.id === item.productId);
      if (pipe) {
        const currentMargin = ((pipe.sellPrice - pipe.buyPrice) / pipe.buyPrice) * 100;
        if (currentMargin < 50) {
          const suggestedPrice = Math.round(pipe.buyPrice * 1.6);
          recommendations.push({
            type: 'price-increase',
            productId: pipe.id,
            productName: pipe.name,
            currentPrice: pipe.sellPrice,
            suggestedPrice,
            reason: `High-demand item with low profit margin of ${currentMargin.toFixed(1)}%`
          });
        }
      }
    }
    
    // Recommend price decrease for low performing items
    for (const item of lowPerforming.slice(0, 3)) {
      const pipe = pipes.find(p => p.id === item.productId);
      if (pipe) {
        const currentMargin = ((pipe.sellPrice - pipe.buyPrice) / pipe.buyPrice) * 100;
        if (currentMargin > 70) {
          const suggestedPrice = Math.round(pipe.buyPrice * 1.4);
          recommendations.push({
            type: 'price-decrease',
            productId: pipe.id,
            productName: pipe.name,
            currentPrice: pipe.sellPrice,
            suggestedPrice,
            reason: `Low-demand item with high profit margin of ${currentMargin.toFixed(1)}%`
          });
        }
      }
    }
    
    return recommendations;
  };
  
  const getInventoryRecommendations = () => {
    const recommendations = [];
    
    // Check for overstocked items
    for (const pipe of pipes) {
      if (pipe.stock > pipe.minStock * 5) {
        recommendations.push({
          type: 'overstock',
          productId: pipe.id,
          productName: pipe.name,
          currentStock: pipe.stock,
          minStock: pipe.minStock,
          reason: 'Item is significantly overstocked, consider running a promotion'
        });
      }
    }
    
    return recommendations;
  };
  
  return {
    getPriceOptimizationRecommendations,
    getInventoryRecommendations
  };
}
