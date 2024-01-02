import { createRouter, createWebHashHistory } from 'vue-router'
// import SearchField from './components/SearchField.vue';
import LocationInfo from './components/LocationInfo.vue'
import WeatherPage from './components/WeatherPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: WeatherPage, },
    { path: '/detail/:id?', component: LocationInfo, name: 'detail', props: true }
  ]
})

export default router
