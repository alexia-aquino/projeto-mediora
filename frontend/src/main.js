import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import LoadingSpinner from './components/LoadingSpinner.vue'

const app = createApp(App)

app.component('LoadingSpinner', LoadingSpinner) 
app.use(router)

app.mount('#app')

createApp(App).use(router).mount('#app')