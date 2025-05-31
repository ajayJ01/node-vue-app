<template>
    <div class="d-flex min-vh-100">
        <!-- Sidebar -->
        <aside class="sidebar bg-white shadow-sm border-end" :class="{ 'sidebar-collapsed': isCollapsed }">
            <div class="text-center py-3 border-bottom">
                <i class="bi bi-kanban-fill fs-2 text-primary"></i>
                <h5 class="mt-2 mb-0 fw-bold">Task Manager</h5>
            </div>
            <ul class="nav flex-column p-3">
                <li class="nav-item mb-2">
                    <RouterLink to="/dashboard" class="nav-link" :class="{ active: isActive('/dashboard') }">
                        <i class="bi bi-speedometer2 me-2"></i> Dashboard
                    </RouterLink>
                </li>
                <li class="nav-item mb-2">
                    <RouterLink to="/dashboard/tasks" class="nav-link"
                        :class="{ active: isActive('/dashboard/tasks') }">
                        <i class="bi bi-list-task me-2"></i> All Tasks
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink to="/dashboard/tasks/create" class="nav-link"
                        :class="{ active: isActive('/dashboard/tasks/create') }">
                        <i class="bi bi-plus-circle me-2"></i> Create Task
                    </RouterLink>
                </li>
            </ul>
        </aside>

        <!-- Main -->
        <main class="flex-grow-1 bg-light p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0 fw-bold text-dark">Dashboard</h2>
                <button @click="logout" class="btn btn-outline-danger d-flex align-items-center gap-2">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </button>
            </div>
            <div class="card p-4 shadow-sm border-0">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)

const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
}

const isActive = (path) => route.path === path
</script>

<style scoped>
.sidebar {
    width: 250px;
    transition: width 0.3s ease;
    background-color: #fff;
}

.sidebar-collapsed {
    width: 60px;
}

.sidebar .nav-link {
    color: #333;
    padding: 10px 15px;
    border-radius: 8px;
    transition: 0.3s;
    font-weight: 500;
}

.sidebar .nav-link:hover {
    background-color: #f0f0f0;
}

.sidebar .nav-link.active {
    background-color: #007bff;
    color: #fff !important;
}
</style>