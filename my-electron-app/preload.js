
// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
});

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getImage: (callBack) => ipcRenderer.on("get-image", callBack),
  getTitle: (callBack) => ipcRenderer.on('update-window-title', callBack),
  // getTime: (callBack) => ipcRenderer.on('update-window-time', callBack),
  closeWindow2: () => ipcRenderer.send('close-window-2'),
})