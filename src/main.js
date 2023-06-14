import { createApp } from 'vue'
import App from './App.vue'
import ZoneUI from 'tpl-editor'
import './assets/tpl-editor.css'

const app = createApp(App);
app.use(ZoneUI)
app.mount('#app')
