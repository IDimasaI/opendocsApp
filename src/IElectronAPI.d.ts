export interface IElectronAPI {
    closeWindow(): void;
    hideWindow(): void;
    maximizeUnmaximizeWindow(): void;
    createFile: (filename: string, text: string) => Promise<string>;
    OpenFolder_Dialog: () => Promise<{ canceled: boolean, path: string, dir: string[] }>;
    OpenExternalFile: (filename: string, path: string) => Promise<string>;
    OpenExternalUrl: (url) => Promise<void>;
    GetDocs: (name: string, isOnline: boolean) => Promise<string>;
    GetManifest: () => Promise<{ title: string, url: string, tag: string }[]>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
    }
}