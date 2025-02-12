export interface IElectronAPI {
    closeWindow(): void;
    setTitle: (title: string) => void,
    createFile: (filename: string, text: string) => Promise<string>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
    }
}