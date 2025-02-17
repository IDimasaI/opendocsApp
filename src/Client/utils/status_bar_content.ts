import { nextTick, onUnmounted, watch } from "vue";

const parseAllHrefs = (element: HTMLElement): string[] => {
    const hrefs: string[] = [];
    const links = element.querySelectorAll('a');
    links.forEach((link: HTMLAnchorElement) => {
        const href = link.getAttribute('href');
        if (href) {
            hrefs.push(href);
        }
    });
    return hrefs;
};

const openUrlTitle = (event: Event) => {
    const statusBar = document.getElementById('status_bar');
    if (statusBar) {
        statusBar.textContent = (event.target as HTMLAnchorElement).href;
    }
};

const closeUrlTitle = () => {
    const statusBar = document.getElementById('status_bar');
    if (statusBar) {
        statusBar.textContent = '';
    }
};
export const statusbar = async (hook: any, SearchInDomId: string): Promise<void> => {
    let link_listeners: string[] = [];
    watch(hook, async () => {
        await nextTick();
        const element = document.getElementById(SearchInDomId);
        if (!element) {
            console.warn(`Element ${SearchInDomId} not found. Этот хук должен быть вызван после монтирования компонента`);
            return;
        }

        const current_hrefs = parseAllHrefs(element);

        // Удаляем старые слушатели для ссылок, которые больше не существуют
        link_listeners.forEach(href => {
            if (!current_hrefs.includes(href)) {
                const elements = document.querySelectorAll(`a[href="${href}"]`);
                elements.forEach(el => {
                    el.removeEventListener('mouseover', openUrlTitle);
                    el.removeEventListener('mouseout', closeUrlTitle);
                });
            }
        });

        // Добавляем новые слушатели для новых ссылок
        current_hrefs.forEach(href => {
            if (!link_listeners.includes(href)) {
                const elements = document.querySelectorAll(`a[href="${href}"]`);
                elements.forEach(el => {
                    el.addEventListener('mouseover', openUrlTitle);
                    el.addEventListener('mouseout', closeUrlTitle);
                });
            }
        });

        // Обновляем список ссылок
        link_listeners = current_hrefs;

    }, { deep: true, immediate: true });

    onUnmounted(() => {
        link_listeners.forEach(href => {
            const elements = document.querySelectorAll(`a[href="${href}"]`);
            elements.forEach(el => {
                el.removeEventListener('mouseover', openUrlTitle);
                el.removeEventListener('mouseout', closeUrlTitle);
            });
        });
        link_listeners = [];
    });
}