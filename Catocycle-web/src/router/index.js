import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/activities', name: 'Activities', component: () => import('../views/Activities.vue') },
  { path: '/people', name: 'People', component: () => import('../views/People.vue') },
  { path: '/items', name: 'Items', component: () => import('../views/Items.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
