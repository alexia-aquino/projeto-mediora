import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/Login.vue'
import RegisterView from '../components/Register.vue'
import AppointmentView from '../components/Appointment.vue'
import DashboardView from '../components/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'Login', 
      component: LoginView 
    },
    { 
      path: '/register', 
      name: 'Register', 
      component: RegisterView 
    },
    { 
      path: '/appointment', 
      name: 'Appointment', 
      component: AppointmentView,
      meta: { requiresAuth: true }
    },
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ]
})

// Guard de navegação
router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  }

  if (!to.meta.requiresAuth && isAuthenticated) {
    return '/dashboard'
  }
})

export default router