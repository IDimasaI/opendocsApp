import fs from 'fs';
import fsP from 'fs/promises';
import path from 'path';
import type { IElectronAPI } from './IElectronAPI';
import { app } from 'electron';
import { DocsManager } from './Server/FApis/DocsManager';
/**
 * 
 * @param filename Название файла
 * @param text Содержимое
 * @returns `'ok' | 'error'`
 * @example
 * createFile('Doc/test.txt', 'Hello World!')
 * @description Файлы создаются в ресурсах
 */



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


const getFilePath = (filename: string) => path.join('resources', filename);
async function ensureResourcesDirExists(name: string): Promise<void> {
    try {
        await fsP.access(getFilePath(name));
    } catch {
        await fsP.mkdir(getFilePath(name), { recursive: true });
    }
}

export async function createFile(filePath: string, data: string): Promise<void> {
    await ensureResourcesDirExists(filePath);
    await fsP.writeFile(filePath, data, 'utf-8');
}


// Основная функция для получения содержимого документа
export async function GetDocs(name: string, isOnline: boolean): Promise<string> {
    const shortName = name.split('/').pop();
    const docsManager = new DocsManager({
        cacheDurationMs: 1000 * 60 * 60, // 1 час
        baseUrl: 'https://open-docs-web.vercel.app/api/v1/Docs/getDocs',
        cacheCleanupThresholdMs: 0,
    });
    let content = '';
    try {
        const { data, message } = await docsManager.getDocs(name, `resources/Docs/${shortName}.md`, isOnline);
        console.log(message);
        content = data;
    } catch (error) {
        console.error('Failed to load document:', error);
    }

    return content;
}

export async function GetManifest() {
    const docsManager = new DocsManager({
        cacheDurationMs: 1000 * 60 * 60, // 1 час
        baseUrl: 'https://open-docs-web.vercel.app/api/v1/Docs/getManifest',
        cacheCleanupThresholdMs: 0,
    });
    const { data, message } = await docsManager.getManifest();
    console.log(message);
    return data;
}