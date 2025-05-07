
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('better-sqlite3');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // Set app icon
    icon: path.join(__dirname, '../logo.png'),
    // Make the window look modern
    frame: true,
    transparent: false,
    backgroundColor: '#0F172A',
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);
  
  // Initialize SQLite database
  initDatabase();
  
  // Open DevTools if in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (db) {
      db.close();
      db = null;
    }
  });

  // Handle external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function initDatabase() {
  try {
    const dbPath = isDev 
      ? './eliva_database.db' 
      : path.join(app.getPath('userData'), 'eliva_database.db');
    
    db = new Database(dbPath);
    
    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS product_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type_id INTEGER NOT NULL,
        diameter REAL,
        color TEXT,
        length REAL,
        material TEXT,
        stock INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 5,
        buy_price REAL NOT NULL,
        sell_price REAL NOT NULL,
        supplier TEXT,
        last_restocked TEXT,
        FOREIGN KEY (type_id) REFERENCES product_types(id)
      );
      
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT,
        company TEXT,
        tin_number TEXT,
        email TEXT,
        phone TEXT
      );
      
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        customer_id INTEGER,
        total REAL NOT NULL,
        profit REAL NOT NULL,
        payment_method TEXT,
        status TEXT CHECK(status IN ('completed', 'pending', 'cancelled')),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );
      
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price_per_unit REAL NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (sale_id) REFERENCES sales(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);
    
    // Insert default user if not exists
    const userExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?').get('eliva');
    
    if (!userExists.count) {
      db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('eliva', 'eliva@2011');
    }
    
    // Insert default product types
    const productTypes = [
      'Pipes',
      'Fittings',
      'Cements',
      'Tools',
      'Valves',
      'Fasteners',
      'Electrical',
      'Plumbing',
      'Other'
    ];
    
    const insertType = db.prepare('INSERT OR IGNORE INTO product_types (name) VALUES (?)');
    for (const type of productTypes) {
      insertType.run(type);
    }
    
    // Insert some default products
    const defaultProducts = [
      { name: 'PVC Drain Pipe', type: 'Pipes', diameter: 100, color: 'White', length: 6, material: 'PVC', stock: 45, minStock: 10, buyPrice: 25, sellPrice: 40, supplier: 'PipeMaster Ltd', lastRestocked: '2023-04-15' },
      { name: 'Copper Water Pipe', type: 'Pipes', diameter: 15, color: 'Copper', length: 3, material: 'Copper', stock: 32, minStock: 5, buyPrice: 35, sellPrice: 55, supplier: 'Metal Supplies Inc', lastRestocked: '2023-05-01' },
      { name: 'Steel Gas Pipe', type: 'Pipes', diameter: 20, color: 'Silver', length: 6, material: 'Galvanized Steel', stock: 18, minStock: 8, buyPrice: 45, sellPrice: 75, supplier: 'Industrial Metals Co', lastRestocked: '2023-04-28' },
      { name: 'PVC Elbow 90°', type: 'Fittings', diameter: 25, color: 'White', material: 'PVC', stock: 60, minStock: 15, buyPrice: 2, sellPrice: 5, supplier: 'PipeMaster Ltd', lastRestocked: '2023-04-20' },
      { name: 'PVC Tee Joint', type: 'Fittings', diameter: 25, color: 'White', material: 'PVC', stock: 48, minStock: 12, buyPrice: 3, sellPrice: 7, supplier: 'PipeMaster Ltd', lastRestocked: '2023-04-20' },
      { name: 'PVC Cement', type: 'Cements', color: 'Clear', material: 'Solvent Cement', stock: 25, minStock: 5, buyPrice: 8, sellPrice: 15, supplier: 'Adhesives Pro', lastRestocked: '2023-04-10' },
      { name: 'Pipe Wrench 14"', type: 'Tools', material: 'Steel', stock: 8, minStock: 2, buyPrice: 18, sellPrice: 35, supplier: 'Tool World', lastRestocked: '2023-03-15' },
      { name: 'Ball Valve 1/2"', type: 'Valves', diameter: 12.7, material: 'Brass', stock: 15, minStock: 4, buyPrice: 12, sellPrice: 25, supplier: 'Valve Experts', lastRestocked: '2023-04-05' }
    ];
    
    // Get type IDs
    const getTypeId = db.prepare('SELECT id FROM product_types WHERE name = ?');
    
    // Insert products if they don't exist
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    
    if (!productCount) {
      const insertProduct = db.prepare(`
        INSERT INTO products 
        (name, type_id, diameter, color, length, material, stock, min_stock, buy_price, sell_price, supplier, last_restocked) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const product of defaultProducts) {
        const typeId = getTypeId.get(product.type).id;
        insertProduct.run(
          product.name,
          typeId,
          product.diameter || null,
          product.color || null,
          product.length || null,
          product.material || null,
          product.stock || 0,
          product.minStock || 5,
          product.buyPrice,
          product.sellPrice,
          product.supplier || null,
          product.lastRestocked || null
        );
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Database API handlers
ipcMain.handle('authenticate', (event, username, password) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    return user ? true : false;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
});

ipcMain.handle('get-products', () => {
  try {
    const products = db.prepare(`
      SELECT p.*, pt.name as type_name 
      FROM products p
      JOIN product_types pt ON p.type_id = pt.id
    `).all();
    return products;
  } catch (error) {
    console.error('Get products error:', error);
    return [];
  }
});

ipcMain.handle('get-product-types', () => {
  try {
    return db.prepare('SELECT * FROM product_types').all();
  } catch (error) {
    console.error('Get product types error:', error);
    return [];
  }
});

ipcMain.handle('add-product', (event, product) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO products 
      (name, type_id, diameter, color, length, material, stock, min_stock, buy_price, sell_price, supplier, last_restocked)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      product.name,
      product.typeId,
      product.diameter || null,
      product.color || null,
      product.length || null,
      product.material || null,
      product.stock || 0,
      product.minStock || 5,
      product.buyPrice,
      product.sellPrice,
      product.supplier || null,
      product.lastRestocked || null
    );
    
    return { success: true, id: info.lastInsertRowid };
  } catch (error) {
    console.error('Add product error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-product', (event, id, updates) => {
  try {
    // Build dynamic SQL based on provided updates
    const fields = Object.keys(updates).map(key => {
      // Convert camelCase to snake_case for SQL
      const field = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      return `${field} = ?`;
    });
    
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    const values = [...Object.values(updates), id];
    
    const stmt = db.prepare(sql);
    const info = stmt.run(...values);
    
    return { success: true, changes: info.changes };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-product', (event, id) => {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = stmt.run(id);
    
    return { success: true, changes: info.changes };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: error.message };
  }
});

// Handle external links
ipcMain.handle('open-external-link', (event, url) => {
  shell.openExternal(url);
  return true;
});

// Handle other database operations for customers, sales, etc.
// Similar structure to the product handlers

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
