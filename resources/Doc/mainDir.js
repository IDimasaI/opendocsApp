const dir = '';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
async function mainDir(disk, path) {
    const mainDir = `${disk.split(':')[0]}:/${path !== '' ? path : ''}`;
    let accesDirs = [];
    
    try {
        const stdout = await new Promise((resolve, reject) => {
            exec('wmic logicaldisk get caption,providername', (error, stdout) => {
                if (error) {
                    return reject(`exec error: ${error}`);
                }
                resolve(stdout);
            });
        });

        const drives = stdout.split('\r\r\n').filter(drive => /^[A-Za-z]:\s/.test(drive));
        accesDirs = drives.map(drive => {
            return drive.split(' ')[0].replace(':', '');
        });
    } catch (error) {
        console.error(error);
        return;
    }
    
    if (!accesDirs.includes(disk)) {
        console.log('error');
        console.log(accesDirs);
        return;
    } else {
        const files = fs.readdirSync(mainDir);
        console.log({ dir: mainDir, files });
        return { dir: mainDir, files };
    }
}
mainDir('D', 'Games');