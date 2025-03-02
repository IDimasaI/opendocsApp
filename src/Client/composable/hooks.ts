// useNetworkStatus.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useNetworkStatus() {
    const isOnline = ref(navigator.onLine); // Изначальное состояние сети

    const updateNetworkStatus = () => {
        isOnline.value = navigator.onLine; // Обновляем состояние
    };

    // Подписываемся на события изменения сети
    onMounted(() => {
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
    });

    // Отписываемся от событий при уничтожении компонента
    onUnmounted(() => {
        window.removeEventListener('online', updateNetworkStatus);
        window.removeEventListener('offline', updateNetworkStatus);
    });

    return { isOnline };
}