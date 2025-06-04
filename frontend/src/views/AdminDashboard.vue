<template>
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light">
    <!-- Top navbar -->
    <div class="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
      <h4 class="mb-0 text-primary fw-bold">Dashboard</h4>
      <button @click="logout" class="btn btn-outline-danger">
        <i class="bi bi-box-arrow-right me-1"></i> Logout
      </button>
    </div>

    <div class="row flex-grow-1">
      <!-- Sidebar -->
      <div class="col-md-3 col-lg-2 bg-white shadow-sm p-3">
        <h5 class="fw-bold mb-4 text-primary"><i class="bi bi-kanban me-2"></i>Task Manager</h5>
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <RouterLink to="/dashboard" class="nav-link text-dark" active-class="fw-bold text-primary">
              <i class="bi bi-speedometer2 me-2"></i>Dashboard
            </RouterLink>
          </li>
          <li class="nav-item mb-2">
            <RouterLink to="/tasks" class="nav-link text-dark" active-class="fw-bold text-primary">
              <i class="bi bi-list-check me-2"></i>All Tasks
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/tasks/create" class="nav-link text-dark" active-class="fw-bold text-primary">
              <i class="bi bi-plus-circle me-2"></i>Create Task
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Main content -->
      <div class="col p-4">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body">
            <h4 class="fw-semibold mb-3">Task List</h4>
            <RouterLink to="/tasks/create" class="btn btn-primary mb-3">
              <i class="bi bi-plus-circle me-1"></i> Create Task
            </RouterLink>

            <!-- Placeholder or slot for task list -->
            <p class="text-muted">You don't have any tasks yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
// onMounted(() => {
//   const loggedIn = localStorage.getItem("loggedIn");
//   if (loggedIn) {
//     toast.success(logout);
//     localStorage.removeItem("loggedIn");
//   }
// })
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.setItem('logout', 'Logged Out Successfully')
  router.push('/login')
}
</script>