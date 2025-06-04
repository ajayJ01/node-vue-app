<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-lg p-5 rounded-4 border-0" style="max-width: 420px; width: 100%;">
      <div class="text-center mb-4">
        <i class="bi bi-person-circle fs-1 text-primary"></i>
        <h2 class="mt-2 text-primary">Welcome Back</h2>
        <p class="text-muted mb-0">Please login to your account</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-floating mb-3">
          <input v-model="email" type="email" class="form-control" id="floatingEmail" placeholder="name@example.com"
            required />
          <label for="floatingEmail">Email address</label>
        </div>

        <div class="form-floating mb-3">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password"
            required />
          <label for="floatingPassword">Password</label>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm">
          <i class="bi bi-box-arrow-in-right me-2"></i>Login
        </button>
      </form>

      <p class="text-center mt-4 mb-0">
        Don’t have an account?
        <RouterLink to="/register" class="text-decoration-none text-primary">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/services/apiWrapper'

const email = ref('')
const password = ref('')
const router = useRouter()

const { appContext } = getCurrentInstance()
const toast = appContext.config.globalProperties.$toast

onMounted(() => {
  const logout = localStorage.getItem("logout");
  if (logout) {
    toast.success(logout);
    localStorage.removeItem("logout");
  }
})

const handleLogin = async () => {
  try {
    const [data, error] = await request('post', '/login', {
      email: email.value,
      password: password.value
    })

    if (error) {
      if (error.errors && Object.keys(error.errors).length > 0) {
        for (const [field, msg] of Object.entries(error.errors)) {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
        }
      } else {
        toast.error(error.message)
      }
    } else {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('loggedIn', data.data.message)
      localStorage.setItem('role', data.data.role)
      router.push('/dashboard')
    }
  } catch (err) {
    toast.error('Unexpected error occurred. Please try again later.')
  }
}
</script>
