import fs from 'fs';
import path from 'path';
const getFilePath = (filename: string) => path.join('resources', filename);

export function createFile(filename:string,text: string) {
    fs.writeFileSync(getFilePath(filename), text);
    return 'ok';
}