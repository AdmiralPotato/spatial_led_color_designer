import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/styles.css';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');

// TODO: Add https://www.theatrejs.com/ for timeline control or something
