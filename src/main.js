import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
// Theme CSS will be loaded dynamically
import 'primevue/resources/primevue.min.css';
import './styles/transitions.css';
import './styles/theme-overrides.css';

// Create theme link element
const themeLink = document.createElement('link');
themeLink.id = 'theme-link';
themeLink.rel = 'stylesheet';
themeLink.href = '/node_modules/primevue/resources/themes/saga-blue/theme.css';
document.head.appendChild(themeLink);

createApp(App)
    .use(createPinia())
    .use(router)
    .use(PrimeVue, { ripple: true })
    .use(ToastService)
    .use(ConfirmationService)
    .mount('#app');
