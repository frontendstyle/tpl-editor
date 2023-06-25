import { createApp } from 'vue'
import App from './App.vue'
import ZoneUI from 'tpl-editor'
import 'tpl-editor/lib/style.css'

const app = createApp(App);
app.use(ZoneUI)
app.mount('#app')
