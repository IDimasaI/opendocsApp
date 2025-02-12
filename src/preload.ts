// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => {
        ipcRenderer.send('close-window');
    },
    setTitle: (title: any) => ipcRenderer.send('set-title', title),
    createFile: (filename: string, text: any) => { return ipcRenderer.invoke('create-file', filename, text) },
});