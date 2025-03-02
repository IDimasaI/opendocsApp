import fs from 'fs';
import path from 'path';
import type { IElectronAPI } from './IElectronAPI';
const getFilePath = (filename: string) => path.join('resources', filename);

/**
 * 
 * @param filename Название файла
 * @param text Содержимое
 * @returns `'ok' | 'error'`
 * @example
 * createFile('Doc/test.txt', 'Hello World!')
 * @description Файлы создаются в ресурсах
 */
export function createFile(filename: string, text: string): 'ok' | 'error' {
    try {
        const filePath = getFilePath(filename);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, text);
    } catch (error) {
        console.log(error);
        return 'error';
    }
    return 'ok';
}

/**
 * Функиця выходит до корня диска и просматиривает что там есть node
 */
export async function OpenFolder_Dialog(): Promise<{ canceled: boolean; path: string; dir: string[]; }> {
    const { dialog } = require('electron')
    const { canceled, filePaths } = await (dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }))


    if (canceled) {
        return { canceled, path: filePaths[0].normalize().replace(/\\/g, '/'), dir: [] };
    } else {
        const dir = fs.readdirSync(filePaths[0]).sort((a, b) => {
            const aIsFile = fs.statSync(`${filePaths[0]}/${a}`).isFile();
            const bIsFile = fs.statSync(`${filePaths[0]}/${b}`).isFile();

            if (aIsFile && !bIsFile) return 1;
            if (!aIsFile && bIsFile) return -1;

            return a.localeCompare(b);
        });

        for (let i = 0; i < dir.length; i++) {
            if (fs.statSync(`${filePaths[0]}/${dir[i]}`).isDirectory()) {
                dir[i] = `${dir[i]}/`;
            }
        }
        console.log(dir);
        return { canceled, path: filePaths[0].normalize().replace(/\\/g, '/'), dir };
    }

}

export async function OpenExternalFile(filename: string, path: string): Promise<string> {
    const filePath = `${path}/${filename}`;
    return fs.readFileSync(filePath, 'utf-8');
}

export async function OpenExternalUrl(url: string) {
    const { shell } = require('electron')
    shell.openExternal(url).then(() => {
        console.log(`redirect to ${url} in browser`);
    }).catch(err => console.log(err));
}