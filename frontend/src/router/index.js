import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import TaskList from '../views/TaskList.vue';
import TaskCreate from '../views/TaskCreate.vue';
import TaskEdit from '../views/TaskEdit.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/tasks', component: TaskList },
  { path: '/tasks/create', component: TaskCreate },
  { path: '/tasks/:id/edit', component: TaskEdit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;