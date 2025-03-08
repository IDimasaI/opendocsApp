import fs from 'fs/promises';

// Конфигурация по умолчанию (можно вынести в отдельный файл или передавать через конструктор)
const DEFAULT_CONFIG = {
    cacheDurationMs: 1000 * 60 * 60 * 24, // 1 день
    cacheCleanupThresholdMs: 1000 * 60 * 60 * 24 * 30, // 30 дней для очистки старых файлов. Если 0, то никогда не удалять
    baseUrl: 'http://doc/api/docs', // Базовый URL для запросов
    requestTimeoutMs: 5000, // Тайм-аут для сетевых запросов
};

class DocsManager {
    private cacheDurationMs: number;
    private cacheCleanupThresholdMs: number;
    private baseUrl: string;
    private requestTimeoutMs: number;

    constructor(config: Partial<typeof DEFAULT_CONFIG> = {}) {
        const finalConfig = { ...DEFAULT_CONFIG, ...config };
        this.cacheDurationMs = finalConfig.cacheDurationMs;
        this.cacheCleanupThresholdMs = finalConfig.cacheCleanupThresholdMs;
        this.baseUrl = finalConfig.baseUrl;
        this.requestTimeoutMs = finalConfig.requestTimeoutMs;
    }

    /**
     * Основной метод для получения документа.
     * @param name - Имя документа или путь к нему.
     * @param filePath - Путь к файлу для кэширования на диск.
     * @returns Содержимое документа.
     */
    public async getDocs(name: string, filePath: string, isOnlite?: boolean): Promise<{ data: string, message: string }> {
        try {
            // Проверка кэша на диске
            if (await this.fileExists(filePath)) {
                console.log('file exists');
                if (isOnlite == false) {
                    return { data: await this.openFile(filePath), message: 'Using cached data, because you offline' };
                }
                const stats = await this.fileStats(filePath);
                const mtime = stats.mtimeMs;

                if (Date.now() - mtime < this.cacheDurationMs) {
                    return { data: await this.openFile(filePath), message: 'Using cached data' };
                }
            } else {
                let data
                try {
                    // Загрузка данных из сети
                    data = await this.netResponse(name, `name=${name.split('/').pop().toLocaleLowerCase()}`,isOnlite);

                    // Сохранение данных на диск
                    const dataTrimmed = data.replace(/[\s\f\n\r]+/g, '').replace(/[\u0000-\u001F]+/g, '');
                    if (dataTrimmed.length > 0) {
                        await this.createFile(filePath, data);
                    }
                    // Очистка старых файлов кэша
                    if (this.cacheCleanupThresholdMs > 0) {
                        await this.cleanupOldCache(filePath);
                    }

                    return { data, message: 'Success get new docs' };
                } catch (error) {
                    if (await this.fileExists(filePath)) {
                        return {
                            data: await this.openFile(filePath),
                            message: `Network response failed: ${error.message}; Using cached data`,
                        }
                    }else{
                        return { data: '', message: `Network response failed: ${error.message}; File not found; return string empty` };
                    }
                }
            }
        } catch (error) {
            return { data: '', message: `Failed to load document: ${error.message}` };
        }
    }

    public async getManifest(): Promise<{ data: string, message: string }> {
        try {
            return { data: await this.netResponse('https://open-docs-web.vercel.app/api/v1/Docs/getManifest', 'none'), message: 'Success get new manifest' };
        } catch (error) {
            return { data: '', message: `Failed to load manifest: ${error.message}` };
        }
    }

    /**
     * Проверяет, существует ли файл.
     */
    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Получает статистику файла.
     */
    private async fileStats(filePath: string): Promise<{ mtimeMs: number; size: number }> {
        return fs.stat(filePath);
    }

    /**
     * Читает содержимое файла.
     */
    private async openFile(filePath: string): Promise<string> {
        return fs.readFile(filePath, 'utf-8');
    }

    /**
     * Создает файл с данными.
     */
    private async createFile(filePath: string, data: string): Promise<void> {
        const path = require('path');
        const dir = path.dirname(filePath);

        // Если директории не существует, создаем её
        if (!(await this.fileExists(dir))) {
            await fs.mkdir(dir, { recursive: true });
        }

        await fs.writeFile(filePath, data, 'utf-8');
    }

    /**
     * Выполняет сетевой запрос для получения данных.
     */
    private async netResponse(name: string, params?: string, isOnlite?: boolean): Promise<string | any> {
        if(isOnlite == false){
            throw new Error('You offline');
        }
        const { net } = require('electron');
        //Берем документы.
        let url = `${this.baseUrl}`
        if (params !== 'none') {
            if (params) {//по идеи манифест
                url += `?${params}`;
                console.log(url);
            } else {//документы
                url += `?data=${name}`
            }
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.requestTimeoutMs);

        try {
            const res = await net.fetch(url, {
                method: 'GET',
                cache: 'no-cache',
                signal: controller.signal,
            });

            if (!res.ok) {
                throw new Error(`Network response failed: ${res.statusText}`);
            }
            if (res.headers.get('Content-Type').includes('application/json')) {
                return res.json();
            } else {
                return res.text();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    /**
     * Очищает старые файлы кэша.
     */
    private async cleanupOldCache(currentFilePath: string): Promise<void> {
        const path = require('path');
        const dir = path.dirname(currentFilePath);

        try {
            const files = await fs.readdir(dir);
            const now = Date.now();

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);

                if (now - stats.mtimeMs > this.cacheCleanupThresholdMs) {
                    await fs.unlink(filePath);
                    console.log(`Deleted old cache file: ${filePath}`);
                }
            }
        } catch (error) {
            console.error('Error during cache cleanup:', error);
        }
    }
}

export { DocsManager };