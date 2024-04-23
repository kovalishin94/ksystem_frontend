import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import uiComponents from '@/components/UI'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const app = createApp(App)

uiComponents.forEach(element => {
    app.component(element.name, element)
});

app.use(createPinia())
app.use(router, axios)

app.mount('#app')