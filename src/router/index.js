import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: CalendarioView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    }
  ]
})

export default router