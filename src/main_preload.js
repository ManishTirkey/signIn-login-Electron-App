// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("darkMode", {
  invoke: (channel) => ipcRenderer.invoke(channel),
});

contextBridge.exposeInMainWorld("window_title_bar", {
  send: (channel) => ipcRenderer.send(channel),
  invoke: (channel) => ipcRenderer.invoke(channel),

  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("Links", {
  open: (url) => ipcRenderer.send("external:links", url),
});
