import { createRouter, createWebHistory } from 'vue-router'
import LandingView  from '@/views/LandingView.vue'
import DiscoverView from '@/views/DiscoverView.vue'
import ResultView   from '@/views/ResultView.vue'
import MapPageView  from '@/views/MapPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',         name: 'landing',  component: LandingView },
    { path: '/discover', name: 'discover', component: DiscoverView },
    { path: '/result',   name: 'result',   component: ResultView },
    { path: '/map',      name: 'map',      component: MapPageView },
  ],
})

export default router
