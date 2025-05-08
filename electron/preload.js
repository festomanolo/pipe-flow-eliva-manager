
const { contextBridge, shell, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  openExternal: (url) => shell.openExternal(url),
  ipcRenderer: {
    send: (channel, data) => {
      // Whitelist channels
      const validChannels = ['db-query', 'db-execute'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      // Whitelist channels
      const validChannels = ['db-result', 'db-error'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, data) => {
      // Whitelist channels
      const validChannels = ['db-query-invoke', 'db-execute-invoke'];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(new Error(`Channel ${channel} is not allowed`));
    }
  }
});
