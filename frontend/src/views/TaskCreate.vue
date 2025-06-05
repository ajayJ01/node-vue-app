<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="card shadow-lg p-5 rounded-4 border-0" style="max-width: 720px; width: 100%;">
      <div class="text-center mb-4">
        <i class="bi bi-card-checklist fs-1 text-primary"></i>
        <p class="text-muted mb-0">Create and assign a task to a user</p>
      </div>

      <form @submit.prevent="handleTaskCreate">
        <div class="form-floating mb-3">
          <input v-model="title" type="text" class="form-control" id="floatingTitle" placeholder="Task Title"
            required />
          <label for="floatingTitle">Task Title</label>
        </div>

        <div class="form-floating mb-3">
          <textarea v-model="description" class="form-control" placeholder="Task Description" id="floatingDesc"
            style="height: 100px" required></textarea>
          <label for="floatingDesc">Description</label>
        </div>

        <div class="form-floating mb-3">
          <input v-model="dueDate" type="date" class="form-control" id="floatingDueDate" required />
          <label for="floatingDueDate">Due Date</label>
        </div>

        <!-- ✅ Assign To (User ID) -->
        <div class="form-floating mb-4">
          <select v-model="assignedTo" class="form-select" id="floatingUser" required>
            <option disabled value="">Select User</option>
            <option v-for="user in users" :key="user._id" :value="user._id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
          <label for="floatingUser">Assign To</label>
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm">
          <i class="bi bi-plus-circle me-2"></i>Create Task
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { request } from '@/services/apiWrapper'
import { useRouter } from 'vue-router'
const { appContext } = getCurrentInstance()
const toast = appContext.config.globalProperties.$toast

const router = useRouter()
const title = ref('')
const description = ref('')
const dueDate = ref('')
const assignedTo = ref('')
const users = ref([])

onMounted(async () => {
  const [data, error] = await request('get', '/users') // Assuming this returns a list of users
  if (!error) users.value = data
})

const handleTaskCreate = async () => {
  try {
    const [data, error] = await request('post', '/tasks', {
      title: title.value,
      description: description.value,
      dueDate: dueDate.value,
      assignedTo: assignedTo.value
    })

    if (error) {
      toast.error(error.message || 'Failed to create task')
    } else {
      toast.success(data.message || 'Task created successfully!')
      title.value = ''
      description.value = ''
      dueDate.value = ''
      assignedTo.value = ''
      router.push('/admin/tasks')
    }
  } catch (err) {
    toast.error('Unexpected error occurred.')
  }
}
</script>
