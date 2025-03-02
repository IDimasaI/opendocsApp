/**
 * @description Вспомогательные функции для работы с LocalStorage
 * @example 
 * LocalStorage.get('key');
 * LocalStorage.set('key', 'value');
 * LocalStorage.remove('key');
 */
export namespace LocalStorage {

    /**
     * @description Чтение хранимой переменной
     * @param key Название хранимой переменной
     * @returns Значение
     */
    export function get<T>(key: string): T | null {
        return JSON.parse(localStorage.getItem(key)) as T ?? null;
    }

    /**
     * @description Добавление хранимой переменной
     * @param key Название хранимой переменной
     * @param value  Значение
     */
    export function set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    export function push(key: string, value: any): void {
        const values = get<string[]>(key) ?? [];
        values.push(value);
        localStorage.setItem(key, JSON.stringify(values));
    }

    /**
     * @description Удаление хранимой переменной
     * @param key Название хранимой переменной
     */
    export function remove(key: string): void {
        localStorage.removeItem(key);
    }


    /**
     * @description Класс для работы с хранимой переменной со временем жизни
     * @example 
     * LocalStorage.Expired.get('key');
     * LocalStorage.Expired.set('key', 'value', 60 * 60 * 1000);
     */
    export class Expired {
        /**
         * @description Чтение хранимой переменной со временем жизни, если время жизни истекло - удаляет переменную и возвращает `null`
         * @param key Название переменной
         * @returns Значение или `null`
         */
        static get(key: string): any | null {
            const value = localStorage.getItem(key);
            if (value) {
                const { timestamp, expire, value: storedValue } = JSON.parse(value);
                if (Date.now() - timestamp > expire) {
                    localStorage.removeItem(key);
                } else {
                    return storedValue;
                }
            }
            return null;
        }

        /**
         * @description Добавление хранимой переменной со временем жизни
         * @param key Назание хранимой переменной
         * @param value Значение
         * @param expire Время жизни в миллисекундах, по умолчанию 1 час
         * 
         */
        static set(key: string, value: string, expire: number = 1000 * 60 * 60): void {
            if (typeof expire !== 'number') {
                throw new Error('expire должно быть числом');
            }
            localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), expire, value }));
        }
    }

}
/**
* @description Класс для работы с хранимой переменной со временем жизни
* @code {@link LocalStorage.Expired}
*/
export const Expired = LocalStorage.Expired;