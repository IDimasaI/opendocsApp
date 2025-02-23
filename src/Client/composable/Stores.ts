import { inject, provide, Ref, ref, watchEffect } from "vue";

type config={
    position: string
}

export const config = Symbol();
export const useConfig = () => inject<Ref<config>>(config);
export function initConfig<T>(key: string, defaultValue: T) {
    // Создаем реактивное состояние с типом T
    const value = ref<T>(defaultValue);

    // Функция для чтения значения из localStorage
    const readFromLocalStorage = () => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            try {
                // Парсим значение, если оно JSON
                value.value = JSON.parse(storedValue) as T;
            } catch (e) {
                // Если парсинг не удался, используем значение как строку
                value.value = storedValue as unknown as T;
            }
        } else {
            // Если ключ отсутствует, устанавливаем значение по умолчанию
            value.value = defaultValue;
        }
    };

    // Инициализируем значение при первом вызове
    readFromLocalStorage();

    // Обновляем localStorage при изменении значения
    watchEffect(() => {
        if (value.value !== null && value.value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value.value));
        } else {
            localStorage.removeItem(key);
        }
    });
    return value;
}