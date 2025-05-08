
interface Window {
  electron?: {
    openExternal: (url: string) => Promise<void>;
    ipcRenderer: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
      invoke: (channel: string, data: any) => Promise<any>;
    }
  }
  process?: {
    type: string;
  }
}
