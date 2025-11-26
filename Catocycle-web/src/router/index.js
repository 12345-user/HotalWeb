import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/activities', name: 'Activities', component: () => import('../views/Activities.vue') },
  { path: '/activity/:id', name: 'ActivityDetail', component: () => import('../views/ActivityDetail.vue') },
  { path: '/people', name: 'People', component: () => import('../views/People.vue') },
  { path: '/items', name: 'Items', component: () => import('../views/Items.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
