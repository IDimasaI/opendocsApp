import { inject, onMounted, onUnmounted, provide, ref, Ref } from 'vue';
import { type Router, useRouter } from 'vue-router';

export const useHistory = () => inject<{
    push: (path: string) => void,
    getCurrent: () => Ref<string>,
    back: (route: Router) => Promise<void>,
    forward: (route: Router) => Promise<void>,
}>('history');

export const addListenerHistory_Mouse = () => {
    const route = useRouter();
    const history = useHistory();
    onMounted(async () => {
        route.push(history.getCurrent().value);
        const handleMouseBackForward = async (event: MouseEvent) => {
            event.preventDefault();
            if (event.button === 4) {
                event.preventDefault();
                history.forward(route);
            }
            if (event.button === 3) {
                event.preventDefault();
                history.back(route);
            }
        }
        window.addEventListener('mousedown', handleMouseBackForward);
        onUnmounted(() => {
            window.removeEventListener('mousedown', handleMouseBackForward);
        });
    });
}

export async function navigate(route: Router, delta: number): Promise<string> {
    const history: string[] = JSON.parse(window.sessionStorage.getItem('history') || '[]');
    let current = JSON.parse(window.sessionStorage.getItem('current') || '0');

    const newIndex = current + delta;
    if (newIndex >= 0 && newIndex < history.length) {
        current = newIndex;
        window.sessionStorage.setItem('current', `${current}`);
        await route.push(history[current]);
    }

    return history[current];
}

export default {
    install: (app: any) => {
        if (!window.sessionStorage.getItem('history')) {
            window.sessionStorage.setItem('history', JSON.stringify(['/']));
            window.sessionStorage.setItem('current', '0');
        }
       
        class History {
            private history: string[];
            private current: Ref<string>;

            constructor() {
                this.history = JSON.parse(window.sessionStorage.getItem('history') || '[]');
                this.current = ref(this.history[JSON.parse(window.sessionStorage.getItem('current') || '0')]);
            }

            push(url: string): void {
                this.history.push(url);
                window.sessionStorage.setItem('history', JSON.stringify(this.history));
                window.sessionStorage.setItem('current', `${this.history.length - 1}`);
                this.current.value = url;
            }

            getCurrent(): Ref<string> {
                return this.current;
            }

            async back(route: Router): Promise<void> {
                this.current.value = await navigate(route, -1);
            }

            async forward(route: Router): Promise<void> {
                this.current.value = await navigate(route, 1);
            }
        }

        app.provide('history', new History());
    }
};