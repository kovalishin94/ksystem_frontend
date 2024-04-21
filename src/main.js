import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import uiComponents from '@/components/UI'


// axios.defaults.baseURL = https:// + import.meta.env.VITE_API_URL_PROD
axios.defaults.baseURL = 'http://' + import.meta.env.VITE_API_URL

const app = createApp(App)

uiComponents.forEach(element => {
    app.component(element.name, element)
});

app.use(createPinia())
app.use(router, axios)

app.mount('#app')