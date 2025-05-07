
// Type definitions for database operations
export interface Product {
  id: number;
  name: string;
  type_id: number;
  type_name: string;
  diameter: number | null;
  color: string | null;
  length: number | null;
  material: string | null;
  stock: number;
  min_stock: number;
  buy_price: number;
  sell_price: number;
  supplier: string | null;
  last_restocked: string | null;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  title: string | null;
  company: string | null;
  tin_number: string | null;
  email: string | null;
  phone: string | null;
}

export interface Sale {
  id: number;
  date: string;
  customer_id: number | null;
  total: number;
  profit: number;
  payment_method: string | null;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

// Type for the API interface
interface ElectronAPI {
  authenticate: (username: string, password: string) => Promise<boolean>;
  getProducts: () => Promise<Product[]>;
  getProductTypes: () => Promise<ProductType[]>;
  addProduct: (product: Omit<Product, 'id' | 'type_name'>) => Promise<{ success: boolean, id?: number, error?: string }>;
  updateProduct: (id: number, updates: Partial<Omit<Product, 'id' | 'type_name'>>) => Promise<{ success: boolean, changes?: number, error?: string }>;
  deleteProduct: (id: number) => Promise<{ success: boolean, changes?: number, error?: string }>;
}

// Get the API from the window object
const api = window as unknown as Window & {
  api: ElectronAPI;
};

// Database service
const DatabaseService = {
  // Authentication
  authenticate: async (username: string, password: string): Promise<boolean> => {
    try {
      return await api.api.authenticate(username, password);
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  },
  
  // Product operations
  getProducts: async (): Promise<Product[]> => {
    try {
      return await api.api.getProducts();
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  },
  
  getProductTypes: async (): Promise<ProductType[]> => {
    try {
      return await api.api.getProductTypes();
    } catch (error) {
      console.error('Get product types error:', error);
      return [];
    }
  },
  
  addProduct: async (product: Omit<Product, 'id' | 'type_name'>): Promise<{ success: boolean, id?: number, error?: string }> => {
    try {
      return await api.api.addProduct(product);
    } catch (error) {
      console.error('Add product error:', error);
      return { success: false, error: String(error) };
    }
  },
  
  updateProduct: async (id: number, updates: Partial<Omit<Product, 'id' | 'type_name'>>): Promise<{ success: boolean, changes?: number, error?: string }> => {
    try {
      return await api.api.updateProduct(id, updates);
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: String(error) };
    }
  },
  
  deleteProduct: async (id: number): Promise<{ success: boolean, changes?: number, error?: string }> => {
    try {
      return await api.api.deleteProduct(id);
    } catch (error) {
      console.error('Delete product error:', error);
      return { success: false, error: String(error) };
    }
  },
};

export default DatabaseService;
