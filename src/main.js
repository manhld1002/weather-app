import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes.js'
/* import the fontawesome core */
import * as globFunc from '../src/utils/global_func.js';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

// config
app.config.globalProperties.$globFunc = globFunc;
app.config.globalProperties.$router = router;
app.mount('#app')
