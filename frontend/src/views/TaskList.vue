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
                <input v-model="dueDate" type="datetime-local" :min="minDate" :max="maxDate" class="form-control" />
                <label for="floatingDueDate">Due Date</label>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Assign To</label>
                <multiselect v-model="assignedTo" :options="users" :custom-label="customLabel" track-by="_id"
                  placeholder="Select users" :multiple="true" :close-on-select="false" :append-to-body="true" />
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm">
                <i class="bi bi-plus-circle me-2"></i>Create Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div class="card shadow-sm rounded-4 border-0 p-4" style="width: 100%; max-width: 960px">
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
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ formatDate(task.dueDate) }}</td>
              <td>
                <span v-if="Array.isArray(task.assignedTo)">
                  <span v-for="(user, idx) in task.assignedTo" :key="user._id || idx">
                    {{ user.name || "Unknown"
                    }}<span v-if="idx < task.assignedTo.length - 1">, </span>
                  </span>
                </span>
                <span v-else>{{ task.assignedTo?.name || "—" }}</span>
              </td>
              <td>
                <span :class="{
                  'badge bg-success': task.status === 'completed',
                  'badge bg-warning text-dark': task.status === 'pending',
                  'badge bg-secondary': !task.status,
                }">
                  {{ task.status || "Pending" }}
                </span>
              </td>
            </tr>
            <tr v-if="tasks.length === 0">
              <td colspan="6" class="text-center text-muted py-4">No tasks found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <!-- Per Page -->
        <div>
          <select v-model="perPage" class="form-select form-select-sm w-auto" @change="handlePerPageChange">
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
            <option :value="100">100 per page</option>
            <option :value="500">500 per page</option>
          </select>
        </div>

        <!-- Pagination -->
        <BasePagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from "vue";
import { request } from "@/services/apiWrapper";
import * as bootstrap from "bootstrap";
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

const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : "-");
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

<style scoped></style>