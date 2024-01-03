import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes.js'
import * as globFunc from '../src/utils/global_func.js';

// initialize
const app = createApp(App)
app.use(router)

// config
app.config.globalProperties.$globFunc = globFunc;
app.config.globalProperties.$router = router;

// mount
app.mount('#app')
