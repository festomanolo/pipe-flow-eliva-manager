
import { useState, useEffect } from 'react';

// This is a placeholder for SQLite implementation
// In a real Electron app, we would use the 'sqlite3' or 'better-sqlite3' package
// Here, we're creating an adaptation layer that will allow us to switch from localStorage to SQLite

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

// SQLite implementation - in a real app, this would use actual SQLite calls
class SQLiteDatabase {
  private db: any = null;
  private initialized = false;

  constructor() {
    // In a real implementation, we would initialize SQLite here
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      // Simulate database initialization
      console.log('Initializing SQLite database...');
      
      // Check if we have data in localStorage first (migration)
      const pipes = localStorage.getItem('eliva_pipes');
      const customers = localStorage.getItem('eliva_customers');
      const sales = localStorage.getItem('eliva_sales');

      if (!pipes) {
        // Initialize with sample data
        this.setData('pipes', initialPipes);
      }

      if (!customers) {
        this.setData('customers', initialCustomers);
      }

      if (!sales) {
        this.setData('sales', initialSales);
      }

      this.initialized = true;
      console.log('SQLite database initialized');
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  async getData(tableName: string) {
    // For now, we'll continue using localStorage as a bridge
    const data = localStorage.getItem(`eliva_${tableName}`);
    return data ? JSON.parse(data) : null;
  }

  async setData(tableName: string, data: any) {
    localStorage.setItem(`eliva_${tableName}`, JSON.stringify(data));
  }

  async query(sql: string, params: any[] = []) {
    // This would be a real SQL query in an actual implementation
    console.log(`Running query: ${sql} with params:`, params);
    
    // For now, we simulate by handling known query patterns
    if (sql.includes('SELECT') && sql.includes('WHERE date >=') && sql.includes('AND date <=')) {
      // This is a date range query for sales
      const sales = await this.getData('sales') as Sale[];
      const startDate = params[0];
      const endDate = params[1];
      
      return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return saleDate >= start && saleDate <= end;
      });
    }
    
    return [];
  }
}

// Create a singleton instance
const sqliteDb = new SQLiteDatabase();

// Initial data for fresh installations
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
  // Add more sample data for different time periods
  {
    id: '3',
    date: '2023-04-15T11:00:00',
    customerId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        quantity: 15,
        pricePerUnit: 40,
        totalPrice: 600,
      },
    ],
    total: 600,
    profit: 225,
    paymentMethod: 'Cash',
    status: 'completed',
  },
  {
    id: '4',
    date: '2023-03-22T16:45:00',
    customerId: '2',
    items: [
      {
        id: '1',
        productId: '4',
        quantity: 2,
        pricePerUnit: 225,
        totalPrice: 450,
      },
    ],
    total: 450,
    profit: 150,
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
];

// Database hooks with SQLite backend
export function usePipes() {
  const [pipes, setPipes] = useState<PipeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await sqliteDb.getData('pipes');
        setPipes(data || []);
      } catch (error) {
        console.error('Error loading pipes data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const savePipes = async (newPipes: PipeItem[]) => {
    setPipes(newPipes);
    await sqliteDb.setData('pipes', newPipes);
  };

  const addPipe = async (pipe: Omit<PipeItem, 'id'>) => {
    const newPipe = { ...pipe, id: Date.now().toString() };
    const updatedPipes = [...pipes, newPipe];
    await savePipes(updatedPipes);
    return newPipe;
  };

  const updatePipe = async (id: string, updates: Partial<PipeItem>) => {
    const updatedPipes = pipes.map(pipe => 
      pipe.id === id ? { ...pipe, ...updates } : pipe
    );
    await savePipes(updatedPipes);
  };

  const deletePipe = async (id: string) => {
    const updatedPipes = pipes.filter(pipe => pipe.id !== id);
    await savePipes(updatedPipes);
  };

  const getLowStockPipes = () => {
    return pipes.filter(pipe => pipe.stock <= pipe.minStock);
  };

  return { 
    pipes, 
    loading,
    addPipe, 
    updatePipe, 
    deletePipe,
    getLowStockPipes
  };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await sqliteDb.getData('customers');
        setCustomers(data || []);
      } catch (error) {
        console.error('Error loading customers data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const saveCustomers = async (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    await sqliteDb.setData('customers', newCustomers);
  };

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    const updatedCustomers = [...customers, newCustomer];
    await saveCustomers(updatedCustomers);
    return newCustomer;
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    );
    await saveCustomers(updatedCustomers);
  };

  const deleteCustomer = async (id: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== id);
    await saveCustomers(updatedCustomers);
  };

  const getCustomerById = (id: string) => {
    return customers.find(customer => customer.id === id);
  };

  return { 
    customers, 
    loading,
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomerById
  };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const { pipes, updatePipe } = usePipes();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await sqliteDb.getData('sales');
        setSales(data || []);
      } catch (error) {
        console.error('Error loading sales data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const saveSales = async (newSales: Sale[]) => {
    setSales(newSales);
    await sqliteDb.setData('sales', newSales);
  };

  const addSale = async (sale: Omit<Sale, 'id'>) => {
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
        await updatePipe(pipe.id, { stock: newStock });
      }
    }
    
    const updatedSales = [...sales, newSale];
    await saveSales(updatedSales);
    return newSale;
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, ...updates } : sale
    );
    await saveSales(updatedSales);
  };

  const deleteSale = async (id: string) => {
    const updatedSales = sales.filter(sale => sale.id !== id);
    await saveSales(updatedSales);
  };

  const getSalesByDateRange = async (startDate: Date, endDate: Date) => {
    try {
      // Use SQLite query for filtering by date range
      const result = await sqliteDb.query(
        'SELECT * FROM sales WHERE date >= ? AND date <= ?',
        [startDate.toISOString(), endDate.toISOString()]
      );
      
      // Fallback to in-memory filtering if the query doesn't return results
      if (!result || result.length === 0) {
        return sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate >= startDate && saleDate <= endDate;
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error querying sales by date range:', error);
      // Fallback to in-memory filtering
      return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
      });
    }
  };

  const getTodaySales = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getSalesByDateRange(today, tomorrow);
  };

  const getWeeklySales = async () => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return getSalesByDateRange(lastWeek, today);
  };

  const getMonthlySales = async () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return getSalesByDateRange(lastMonth, today);
  };

  const getYearlySales = async () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    return getSalesByDateRange(lastYear, today);
  };

  const getTopSellingProducts = (filteredSales: Sale[] = sales) => {
    const productSales: Record<string, { totalQuantity: number, totalProfit: number }> = {};
    
    filteredSales.forEach(sale => {
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

  const getLowPerformingProducts = (filteredSales: Sale[] = sales) => {
    const topSelling = getTopSellingProducts(filteredSales);
    return topSelling.slice(-5).reverse(); // Get bottom 5
  };

  const calculateTotalProfit = (filteredSales: Sale[] = sales) => {
    return filteredSales.reduce((total, sale) => total + sale.profit, 0);
  };
  
  const calculateTotalRevenue = (filteredSales: Sale[] = sales) => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  };

  return { 
    sales,
    loading,
    addSale, 
    updateSale, 
    deleteSale,
    getSalesByDateRange,
    getTodaySales,
    getWeeklySales,
    getMonthlySales,
    getYearlySales,
    getTopSellingProducts,
    getLowPerformingProducts,
    calculateTotalProfit,
    calculateTotalRevenue
  };
}

// AI Recommendations Service
export function useRecommendations() {
  const { pipes } = usePipes();
  const { sales, getTopSellingProducts, getLowPerformingProducts } = useSales();
  
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
