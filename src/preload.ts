// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => {
        ipcRenderer.send('close-window');
    },
    createFile: (filename: string, text: any) => { return ipcRenderer.invoke('create-file', filename, text) },
    OpenFolder_Dialog: () => { return ipcRenderer.invoke('OpenFolder_Dialog', true) },
    OpenExternalFile: (filename: string, path: string) => { return ipcRenderer.invoke('OpenExternalFile', filename, path) },
});