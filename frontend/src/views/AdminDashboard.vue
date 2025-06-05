<template>
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light">
    <!-- Top navbar -->
    <div class="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
      <h4 class="mb-0 text-primary fw-bold">Dashboard</h4>
      <span class="text-dark fw-semibold"> 👋 Hello, {{ userName }} </span>
    </div>

    <div class="row flex-grow-1">
      <!-- Sidebar -->
      <div class="col-md-3 col-lg-2 bg-white p-4 shadow-sm d-flex flex-column justify-content-between sidebar-modern">
        <div>
          <h5 class="text-dark fw-semibold mb-4 d-flex align-items-center">
            <i class="bi bi-kanban me-2 fs-5 text-primary"></i> Task Manager
          </h5>
          <ul class="nav flex-column gap-2">
            <li class="nav-item">
              <RouterLink to="/dashboard" class="nav-link nav-modern" active-class="active-modern">
                <i class="bi bi-speedometer2 me-2"></i>Dashboard
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/tasks" class="nav-link nav-modern" active-class="active-modern">
                <i class="bi bi-list-task me-2"></i>All Tasks
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/user/create" class="nav-link nav-modern" active-class="active-modern">
                <i class="bi bi-person-plus me-2"></i>Create User
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="mt-4 border-top pt-3">
          <button @click="logout"
            class="btn btn-light border w-100 text-danger fw-semibold d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      <!-- Main content -->
      <div class="col p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
const userName = ref("");
import { useToast } from "@/composables/useToast";
const toast = useToast();

const router = useRouter();
onMounted(() => {
  const loggedIn = localStorage.getItem("loggedInSuccessMsg");
  const name = localStorage.getItem("userName");
  if (name) userName.value = name;

  if (loggedIn) {
    toast.success(loggedIn);
    localStorage.removeItem("loggedInSuccessMsg");
  }
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.setItem("logout", "Logged Out Successfully");
  router.push("/login");
};
</script>

<style>
.sidebar-modern {
  border-radius: 12px;
  background-color: #fff;
}

.nav-modern {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  color: #333;
  font-weight: 500;
  transition: background 0.3s ease, color 0.3s ease;
}

.nav-modern:hover {
  background-color: #f1f5f9;
  color: #0d6efd;
}

.active-modern {
  background-color: #e0f0ff;
  color: #0d6efd !important;
  font-weight: 600;
  border-left: 4px solid #0d6efd;
}
</style>
