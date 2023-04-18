import { createApp } from 'vue';
import './style.css';
import router from '@/router';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import vuetify from '@/plugins/vuetify';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia).use(router).use(vuetify).mount('#app');
