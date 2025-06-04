<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-lg p-5 rounded-4 border-0" style="max-width: 420px; width: 100%;">
      <div class="text-center mb-4">
        <i class="bi bi-person-plus-fill fs-1 text-success"></i>
        <h2 class="mt-2 text-success">Create Account</h2>
        <p class="text-muted mb-0">Register to manage your tasks</p>
      </div>

      <form @submit.prevent="handleRegister">
  <div class="form-floating mb-3">
    <input v-model="name" type="text" class="form-control" id="floatingName" placeholder="John Doe" required />
    <label for="floatingName">Full Name</label>
  </div>

  <div class="form-floating mb-3">
    <input v-model="email" type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" required />
    <label for="floatingEmail">Email address</label>
  </div>

  <div class="form-floating mb-3">
    <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" required />
    <label for="floatingPassword">Password</label>
  </div>

  <!-- ✅ Role dropdown -->
  <div class="form-floating mb-4">
    <select v-model="role" class="form-select" id="floatingRole" required>
      <option disabled value="">Select a role</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>
    <label for="floatingRole">Role</label>
  </div>

  <button type="submit" class="btn btn-success w-100 py-2 shadow-sm">
    <i class="bi bi-check-circle me-2"></i>Register
  </button>
</form>


      <p class="text-center mt-4 mb-0">
        Already have an account?
        <RouterLink to="/login" class="text-decoration-none text-success">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/services/apiWrapper' // wrapper ka use

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('') // ✅ add this

const handleRegister = async () => {
  try {
    const [data, error] = await request('post', '/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value // ✅ include role in request
    })

    if (error) {
      if (Object.keys(error.errors).length > 0) {
        for (const [field, msg] of Object.entries(error.errors)) {
          toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
        }
      } else {
        toast.error(error.message)
      }
    } else {
      toast.success(data.message || 'Registered successfully!')
      router.push('/login')
    }
  } catch (err) {
    toast.error('Unexpected error occurred. Please try again later.')
  }
}

</script>
