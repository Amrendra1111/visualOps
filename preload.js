


const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runCommand: (command, dashboard) => ipcRenderer.send('run-command', command, dashboard),
  onCommandOutput: (callback) => ipcRenderer.on('command-output', (event, output, dashboard) => callback(output, dashboard))
});
