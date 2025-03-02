export interface IElectronAPI {
    closeWindow(): void;
    hideWindow(): void;
    maximizeUnmaximizeWindow(): void;
    createFile: (filename: string, text: string) => Promise<string>;
    OpenFolder_Dialog: () => Promise<{ canceled: boolean, path: string, dir: string[] }>;
    OpenExternalFile: (filename: string, path: string) => Promise<string>;
    OpenExternalUrl: (url) => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
    }
}