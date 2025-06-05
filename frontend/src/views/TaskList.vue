<template>
  <div class="container-fluid bg-light py-4">
    <!-- Create Task Modal -->
    <div class="modal fade" id="createTaskModal" tabindex="-1" aria-labelledby="createTaskModalLabel"
      ref="createTaskModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3 rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-primary" id="createTaskModalLabel">
              <i class="bi bi-card-checklist me-2"></i>Create and assign a task
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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

              <div class="mb-4">
                <label class="form-label fw-semibold">Assign To</label>
                <multiselect v-model="assignedTo" :options="users" :custom-label="customLabel" track-by="_id"
                  placeholder="Select users" :multiple="true" :close-on-select="false" class="form-control" />
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm">
                <i class="bi bi-plus-circle me-2"></i>Create Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Task List Card -->
    <div class="card shadow-sm rounded-4 border-0 p-4" style="width: 100%; max-width: 960px;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0 text-primary"><i class="bi bi-list-check me-2"></i>Task List</h4>
        <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createTaskModal">
          <i class="bi bi-plus-circle me-1"></i> New Task
        </button>
      </div>

      <div class="table-responsive">
        <table class="table align-middle text-nowrap">
          <thead class="table-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task._id">
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ formatDate(task.dueDate) }}</td>
              <td>
                <span v-for="(user, idx) in task.assignedUsers" :key="user._id">
                  {{ user.name }}<span v-if="idx < task.assignedUsers.length - 1">, </span>
                </span>
              </td>
              <td>
                <span :class="{
                  'badge bg-success': task.status === 'completed',
                  'badge bg-warning text-dark': task.status === 'pending',
                  'badge bg-secondary': !task.status
                }">
                  {{ task.status || 'Pending' }}
                </span>
              </td>
            </tr>
            <tr v-if="tasks.length === 0">
              <td colspan="5" class="text-center text-muted py-4">No tasks found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Prev</button>
          </li>
          <li v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }" class="page-item">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { request } from '@/services/apiWrapper'
import * as bootstrap from 'bootstrap'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

// define component
defineOptions({
  components: { Multiselect }
})
const customLabel = (user) => `${user.name} (${user.email})`

const title = ref('')
const description = ref('')
const dueDate = ref('')
const assignedTo = ref([])
const users = ref([])
const resetKey = ref(0)

const tasks = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 10

const createTaskModal = ref(null)
const { appContext } = getCurrentInstance()
const toast = appContext.config.globalProperties.$toast

const fetchTasks = async (page = 1) => {
  const [data, error] = await request('get', `/tasks?page=${page}&limit=${perPage}`)
  if (error) {
    toast.error(error.message || 'Failed to load tasks')
  } else {
    tasks.value = data.tasks || []
    totalPages.value = data.totalPages || 1
    currentPage.value = page
  }
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchTasks(page)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString()
}

const handleTaskCreate = async () => {
  const [data, error] = await request('post', '/tasks/create', {
    title: title.value,
    description: description.value,
    dueDate: dueDate.value,
    assignedTo: assignedTo.value.map(user => user._id)
  })

  if (error) {
    toast.error(error.message || 'Failed to create task')
  } else {
    toast.success(data.message || 'Task created successfully!')
    title.value = ''
    description.value = ''
    dueDate.value = ''
    assignedTo.value = [users.value[0], users.value[2]]
    resetKey.value++
    fetchTasks()

    const modalInstance = bootstrap.Modal.getInstance(createTaskModal.value) || new bootstrap.Modal(createTaskModal.value)
    modalInstance.hide()
  }
}

onMounted(async () => {
  await fetchTasks()

  const [data, error] = await request('get', '/users')
  if (!error) {
    users.value = data.data
  }

  if (createTaskModal.value) {
    new bootstrap.Modal(createTaskModal.value)
  }
})
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}

.table th {
  white-space: nowrap;
}
</style>
