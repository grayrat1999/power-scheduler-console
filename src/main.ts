import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/main.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App).use(Antd).use(router)

app.mount('#app')
