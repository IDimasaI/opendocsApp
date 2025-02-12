import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './Pages/index.vue';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'Home',
            meta: {
                title: 'Home'
            },
            component: () =>  import('./Pages/index.vue') // Оберните import в функцию, чтобы вернуть обещание
        },
        {
            path: '/about',
            name: 'About',
            meta: {
                title: 'About'
            },
            component: () => import('./Pages/about.vue') // Оберните import в функцию, чтобы вернуть обещание
        }
    ]
});

export default router;