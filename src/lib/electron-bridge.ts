
interface ElectronAPI {
  openExternal: (url: string) => Promise<void>;
  ipcRenderer: {
    send: (channel: string, data: any) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
    invoke: (channel: string, data: any) => Promise<any>;
  }
}

// Check if we're in an Electron environment
export const isElectron = (): boolean => {
  return window && window.process && window.process.type === 'renderer';
};

// Safe access to electron APIs
export const electron: ElectronAPI = window.electron || {
  // Fallback implementations for web environment
  openExternal: (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    return Promise.resolve();
  },
  ipcRenderer: {
    send: () => {},
    receive: () => {},
    invoke: () => Promise.reject(new Error('Not in Electron environment'))
  }
};

// Helper function to open external links
export const openExternal = (url: string): Promise<void> => {
  return electron.openExternal(url);
};
