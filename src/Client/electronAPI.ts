/**
 * 
 * @param filename название файла. 
 * @param text содержимое
 * @example
 * createFile('Doc/test.txt', 'Hello World!')
 * @description Файлы создаются в ресурсах
 */
export async function createFile(filename: string, text: string) {
    const data = await window.electronAPI.createFile(filename, text);
    console.log(data);
}

export function closeWindow() {
    window.electronAPI.closeWindow();
}

export function hideWindow() {
    window.electronAPI.hideWindow();
}

export function maximizeUnmaximizeWindow() {
    window.electronAPI.maximizeUnmaximizeWindow();
}

export function OpenFolder_Dialog() {
    return window.electronAPI.OpenFolder_Dialog();
}

export function OpenExternalFile(filename: string, path: string) {
    return window.electronAPI.OpenExternalFile(filename, path);
}

export function OpenExternalUrl(url: string) {
    return window.electronAPI.OpenExternalUrl(url);
}