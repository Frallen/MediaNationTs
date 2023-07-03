import {createApp} from 'vue'
import './assets/styles/main.less'
import App from './App.vue'
import {createPinia} from 'pinia'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
