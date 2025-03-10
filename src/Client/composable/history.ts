import { inject, onMounted, onUnmounted, provide, ref, Ref } from 'vue';
import { type Router, useRouter } from 'vue-router';

export type HistoryType = {
    push: (path: string) => void,
    no_push: (path: string) => void,
    getCurrent: () => Ref<string>,
    back: (route: Router) => Promise<void>,
    forward: (route: Router) => Promise<void>,
    forgetAllAfterCurrent: () => void,
    getAllHistory: () => Ref<string[]>,
};

export const useHistory = () => inject<{
    push: (path: string) => void,
    no_push: (path: string) => void,
    getCurrent: () => Ref<string>,
    back: (route: Router) => Promise<void>,
    forward: (route: Router) => Promise<void>,
    forgetAllAfterCurrent: () => void,
    getAllHistory: () => Ref<string[]>,
}>('history');

// Инициализация навигации в самом главном компоненте.
export const addListenerHistory_Mouse = () => {
    const route = useRouter();
    const history = useHistory();

    route.push(history.getCurrent().value);
    console.log('addListenerHistory_Mouse run');
    onMounted(async () => {
        const handleMouseBackForward = async (event: MouseEvent) => {
            if (event.button === 4) {
                event.preventDefault();
                await history.forward(route);
            }
            if (event.button === 3) {
                event.preventDefault();
                await history.back(route);
            }
        }
        window.addEventListener('mousedown', handleMouseBackForward);
        onUnmounted(() => {
            window.removeEventListener('mousedown', handleMouseBackForward);
        });
    });
}

export async function navigate(route: Router, delta: number): Promise<[string, number]> {
    const history: string[] = JSON.parse(window.sessionStorage.getItem('history') || '[]');
    let current = JSON.parse(window.sessionStorage.getItem('current') || '0');

    const newIndex = current + delta;
    if (newIndex >= 0 && newIndex < history.length) {
        current = newIndex;
        window.sessionStorage.setItem('current', `${current}`);
        await route.push(history[current]);
    }

    return [
        history[current],
        current
    ];
}

export default {
    install: (app: any) => {
        if (!window.sessionStorage.getItem('history')) {
            window.sessionStorage.setItem('history', JSON.stringify(['/']));
            window.sessionStorage.setItem('current', '0');
        }

        class History {
            private history: Ref<string[]>;
            private currentUrl: Ref<string>;
            private currentIndex: number;

            constructor() {
                this.history = ref(JSON.parse(window.sessionStorage.getItem('history') || '[]'));
                this.currentUrl = ref(this.history.value[JSON.parse(window.sessionStorage.getItem('current') || '0')]);
                this.currentIndex = JSON.parse(window.sessionStorage.getItem('current') || '0');
            }

            push(url: string): void {
                if (this.history.value[this.currentIndex] === url) {
                    console.log('push same url');
                    return;
                }
                this.history.value = this.history.value.slice(0, this.currentIndex + 1);
                this.history.value.push(url);
                window.sessionStorage.setItem('history', JSON.stringify(this.history.value));
                window.sessionStorage.setItem('current', `${this.history.value.length - 1}`);
                this.currentIndex = this.history.value.length - 1;
                this.currentUrl.value = url;
            }

            no_push(url: string): void {
                if (this.history.value[this.currentIndex] === url) {
                    console.log('push same url');
                    return;
                }
                this.currentIndex = this.history.value.indexOf(url);
                window.sessionStorage.setItem('current', `${this.currentIndex}`);
                this.currentUrl.value = url;
            }

            getCurrent(): Ref<string> {
                return this.currentUrl;
            }

            async back(route: Router): Promise<void> {
                [this.currentUrl.value, this.currentIndex] = await navigate(route, -1);
            }

            async forward(route: Router): Promise<void> {
                [this.currentUrl.value, this.currentIndex] = await navigate(route, 1);
            }

            forgetAllAfterCurrent(): void {
                //const currentIndex = JSON.parse(window.sessionStorage.getItem('current') || '0');
                //this.history = this.history.slice(0, currentIndex + 1);
                //window.sessionStorage.setItem('history', JSON.stringify(this.history.splice(0, currentIndex + 1)));
                //window.sessionStorage.setItem('history', JSON.stringify(this.history));
            }

            getAllHistory(): Ref<string[]> {
                return this.history;
            }

        }

        app.provide('history', new History());
    }
};