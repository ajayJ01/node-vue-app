import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import TaskList from '../views/TaskList.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    meta: { requiresAuth: true },
    component: {
      render() {
        const role = localStorage.getItem('role')
        return h(role === 'admin' ? AdminDashboard : UserDashboard)
      },
    },
  },
  {
    path: '/tasks',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [{ path: '', component: TaskList }],
  },
  {
    path: '/user/create',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        component: Register,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.meta.requiresAuth && !token) {
    // Not logged in
    next('/login')
  } else if (to.meta.requiresAdmin && role !== 'admin') {
    next('/dashboard') // redirect to user's dashboard
  } else {
    next()
  }
})

export default router
