import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/submit', component: () => import('../pages/SubmitEnhanced.vue') },
    { path: '/dashboard', component: () => import('../pages/DashboardEnhanced.vue') },
    { path: '/ideas', component: () => import('../pages/Ideas.vue') },
    {
        path: '/style-guide',
        component: () => import('../pages/StyleGuideEnhanced.vue'),
    },
];

export default createRouter({ history: createWebHistory(), routes });
