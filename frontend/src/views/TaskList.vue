<template>
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light px-2 py-3">
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
                <input v-model="dueDate" type="datetime-local" :min="minDate" :max="maxDate" class="form-control" />
                <label for="floatingDueDate">Due Date</label>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Assign To</label>
                <multiselect v-model="assignedTo" :options="users" :custom-label="customLabel" track-by="_id"
                  placeholder="Select users" :multiple="true" :close-on-select="false" />
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
    <div class="card shadow-sm rounded-4 border-0 p-3 flex-grow-1 w-100 overflow-auto">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 class="text-primary m-0"><i class="bi bi-list-check me-2"></i>Task List</h4>
        <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#createTaskModal">
          <i class="bi bi-plus-circle me-1"></i> New Task
        </button>
      </div>

      <!-- Task Table -->
      <div class="table-responsive">
        <table class="table align-middle text-nowrap table-sm">
          <thead class="table-light">
            <tr>
              <th>Sr.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in tasks" :key="task._id">
              <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td class="text-truncate" style="max-width: 150px;" :title="task.title">{{ task.title }}</td>
              <td class="text-truncate" style="max-width: 200px;" :title="task.description">{{ task.description }}</td>
              <td>{{ formatDate(task.dueDate) }}</td>
              <td>
                <span v-if="Array.isArray(task.assignedTo)">
                  <span
                    v-for="(user, idx) in expandedRows.includes(task._id) ? task.assignedTo : task.assignedTo.slice(0, 3)"
                    :key="user._id || idx" class="badge bg-light text-dark border me-1 small">
                    {{ user.name || "User" }}
                  </span>
                  <span v-if="task.assignedTo.length > 3 && !expandedRows.includes(task._id)"
                    @click="expandedRows.push(task._id)" class="badge bg-light text-muted small"
                    style="cursor: pointer;">
                    +{{ task.assignedTo.length - 3 }}
                  </span>
                  <span v-if="task.assignedTo.length > 3 && expandedRows.includes(task._id)"
                    @click="expandedRows = expandedRows.filter(id => id !== task._id)"
                    class="badge bg-light text-muted small" style="cursor: pointer;">Show less</span>
                </span>
                <span v-else class="badge bg-light text-dark border small">{{ task.assignedTo?.name || "—" }}</span>
              </td>
              <td>
                <span :class="[
                  'badge d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 fw-semibold small',
                  task.status === 'pending' ? 'bg-warning text-dark' :
                    task.status === 'in_progress' ? 'bg-primary text-white' :
                      task.status === 'submitted' ? 'bg-purple text-white' :
                        task.status === 'verified' ? 'bg-success text-white' :
                          'bg-secondary text-white'
                ]">
                  <i :class="{
                    'bi-hourglass-split': task.status === 'pending',
                    'bi-arrow-repeat': task.status === 'in_progress',
                    'bi-upload': task.status === 'submitted',
                    'bi-check-circle': task.status === 'verified',
                    'bi-question-circle': !task.status
                  }"></i>
                  {{
                    {
                      pending: 'Pending',
                      in_progress: 'Progress',
                      submitted: 'Submitted',
                      verified: 'Done'
                    }[task.status] || 'Unknown'
                  }}
                </span>
              </td>
            </tr>
            <tr v-if="tasks.length === 0">
              <td colspan="6" class="text-center text-muted py-4">No tasks found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination and PerPage -->
      <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <div>
          <select v-model="perPage" class="form-select form-select-sm w-auto" @change="handlePerPageChange">
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
            <option :value="100">100 per page</option>
            <option :value="500">500 per page</option>
          </select>
        </div>
        <BasePagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { request } from "@/services/apiWrapper";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { hideBootstrapModal } from "@/utils/bootstrapModal.js";
import BasePagination from "@/components/BasePagination.vue";

defineOptions({ components: { Multiselect } });

const title = ref("");
const description = ref("");
const dueDate = ref("");
const assignedTo = ref([]);
const users = ref([]);
const tasks = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(10);
const createTaskModal = ref(null);
const expandedRows = ref([]);

const { appContext } = getCurrentInstance();
const toast = appContext.config.globalProperties.$toast;

const today = new Date();
const sixMonthsLater = new Date();
sixMonthsLater.setMonth(today.getMonth() + 6);

const formatToDateTimeLocal = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const minDate = formatToDateTimeLocal(today);
const maxDate = formatToDateTimeLocal(sixMonthsLater);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }); // "Nov"
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = hours % 12 || 12;

  return `${day} ${month}, ${year} ${formattedHour}:${minutes}:${seconds} ${ampm}`;
};
const customLabel = (user) => (user?.name ? `${user.name} (${user.email})` : "Unknown");

const fetchTasks = async (page = 1) => {
  const [data, error] = await request(
    "get",
    `/tasks?page=${page}&limit=${perPage.value}`
  );
  if (error) {
    toast.error(error.message || "Failed to load tasks");
  } else {
    tasks.value = data.data.tasks || [];
    totalPages.value = data.data.totalPages || 1;
    currentPage.value = data.data.currentPage || page;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    fetchTasks(page);
  }
};

const handlePerPageChange = () => {
  fetchTasks();
};

const resetForm = () => {
  title.value = "";
  description.value = "";
  dueDate.value = "";
  assignedTo.value = [];
};

const handleTaskCreate = async () => {
  const selectedDate = new Date(dueDate.value);
  const now = new Date();
  const minAllowedDate = new Date(now.getTime() + 5 * 60 * 1000);

  if (selectedDate < minAllowedDate) {
    toast.error("Due date/time must be at least 5 minutes in the future.");
    return;
  }

  const isoDueDate = selectedDate.toISOString();
  const [data, error] = await request("post", "/tasks/create", {
    title: title.value,
    description: description.value,
    dueDate: isoDueDate,
    assignedTo: assignedTo.value.map((user) => user._id),
  });

  if (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, msg]) =>
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
      );
    } else {
      toast.error(error.message || "Task creation failed");
    }
  } else {
    toast.success(data.message || "Task created successfully!");
    await nextTick();
    hideBootstrapModal(createTaskModal);
    fetchTasks(currentPage.value);
    resetForm();
  }
};

onMounted(async () => {
  await fetchTasks();
  const [userData = {}, userError = null] = await request("get", "/users");
  if (!userError) users.value = userData.data;
});
</script>

<style scoped>
.bg-purple {
  background-color: #6f42c1 !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>