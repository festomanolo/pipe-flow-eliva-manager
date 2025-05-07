
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  authenticate: (username, password) => ipcRenderer.invoke('authenticate', username, password),
  getProducts: () => ipcRenderer.invoke('get-products'),
  getProductTypes: () => ipcRenderer.invoke('get-product-types'),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id, updates) => ipcRenderer.invoke('update-product', id, updates),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  // Add other API methods as needed
});
