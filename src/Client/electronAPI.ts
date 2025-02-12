export async function createFile(name: string, text: string) {
    const data = await window.electronAPI.createFile(name, text);
    console.log(data);
}
export async function setTitle(text: string) {
    window.electronAPI.setTitle(text);
}
export function closeWindow() {
    window.electronAPI.closeWindow();
}