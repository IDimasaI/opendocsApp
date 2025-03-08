import { nextTick, onBeforeUnmount, watch } from "vue";
import type { Ref } from "vue";

let closeTimeout: number | undefined;

const openUrlTitle = (event: Event) => {
    const statusBar = document.getElementById('status_bar');
    if (statusBar && event.target instanceof HTMLAnchorElement) {
        statusBar.textContent = event.target.href;
        statusBar.style.opacity = '1';
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
    }
};

const closeUrlTitle = () => {
    const statusBar = document.getElementById('status_bar');
    if (statusBar) {
        statusBar.style.opacity = '0';
        closeTimeout = window.setTimeout(() => {
            statusBar.textContent = '';
        }, 1000); //  transition:opacity 0.4s ease-in-out;
    }
};

const handleMouseOver = (event: Event) => {
    if (event.target instanceof HTMLAnchorElement && event.target.href) {
        openUrlTitle(event);
    }
};

const handleMouseOut = (event: Event) => {
    if (event.target instanceof HTMLAnchorElement && event.target.href) {
        closeUrlTitle();
    }
};

const addListeners = (element: HTMLElement) => {
    if (element) {
        element.addEventListener('mouseover', handleMouseOver);
        element.addEventListener('mouseout', handleMouseOut);
    }
};

const removeListeners = (element: HTMLElement) => {
    if (element) {
        element.removeEventListener('mouseover', handleMouseOver);
        element.removeEventListener('mouseout', handleMouseOut);
    }
};
/**
 * @param trigers Реактивное свойство, которое будет тригерить обновление списка ссылок
 * @param searchInDomId id элемента, в котором будет происходить поиск ссылок
 */
export const useStatusBar = (trigers: Ref<any>[], searchInDomId: string): void => {
    let element: HTMLElement | null = null;

    const updateListeners = async () => {
        closeUrlTitle();
        await nextTick();
        const newElement = document.getElementById(searchInDomId) || null;
        // Если элемент изменился или был удален
        if (element !== newElement) {
            removeListeners(element); // Удаляем слушатели со старого элемента
            element = newElement; // Обновляем ссылку на элемент
            if (element) {
                addListeners(element); // Добавляем слушатели на новый элемент
            }
        }
    };

    // Инициализация
    element = document.getElementById(searchInDomId);
    if (element) {
        addListeners(element);
    } else {
        console.error(`StatusBar .Element ${searchInDomId} not found. Данный хук вызывается только после монтирования компонента`);
        return;
    }

    // Отслеживание изменений
    watch(trigers, updateListeners, { deep: true, immediate: true });

    // Очистка при уничтожении компонента
    onBeforeUnmount(() => {
        removeListeners(element);
        element = null;
        console.log('StatusBar destroyed');
    });
};