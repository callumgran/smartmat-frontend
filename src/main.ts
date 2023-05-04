import { createApp } from 'vue';
import './style.css';
import router from '@/router';
import App from '@/App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import vuetify from '@/plugins/vuetify';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement,
);

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia).use(router).use(vuetify).mount('#app');
