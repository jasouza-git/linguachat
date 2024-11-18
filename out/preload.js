const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    get: (from, prop) => ipcRenderer.invoke('get', from, prop),
    set: (from, prop,val) => ipcRenderer.invoke('set', from, prop, val),
    run: (from, args) => ipcRenderer.invoke('run', from, args),
    send: (channel, ...data) => ipcRenderer.send(channel, ...data),
    on: (channel, callback) => ipcRenderer.on(channel, (event, ...data) => callback(...data)),
});
