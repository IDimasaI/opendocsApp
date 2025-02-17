export interface IElectronAPI {
    closeWindow(): void;
    createFile: (filename: string, text: string) => Promise<string>;
    OpenFolder_Dialog: () => Promise<{ canceled: boolean, path: string, dir: string[] }>;
    OpenExternalFile: (filename: string, path: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
    }
}