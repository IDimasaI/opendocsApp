import { createRouter, createMemoryHistory, HistoryState } from 'vue-router';
import HomeView from './Pages/index.vue';
declare module 'vue-router' {
    interface RouteMeta {
        title: string;
    }
}
const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            meta: {
                title: 'Home'
            },
            component: () => import('./Pages/index.vue') // Оберните import в функцию, чтобы вернуть обещание
        },
        {
            path: '/about',
            name: 'About',
            meta: {
                title: 'About'
            },
            component: () => import('./Pages/about.vue') // Оберните import в функцию, чтобы вернуть обещание
        },
        {
            path: '/Docs/:page?',
            name: 'Docs',
            meta: {
                title: 'Docs'
            },
            children: [
                {
                    path: '/Docs/:page?',
                    name: 'Docs/page',
                    meta: {
                        title: ''
                    },
                    component: () => import('./Pages/docs.vue') // Оберните import в функцию, чтобы вернуть обещание
                }
            ],
            component: () => import('./Pages/docs.vue')
        }
    ]
});
export default router;