<template>
  <div class="container-fluid min-vh-100 d-flex flex-column bg-light px-2 py-3">
    <!-- Create Task Modal -->
    <div class="modal fade" id="createTaskModal" tabindex="-1" aria-labelledby="createTaskModalLabel"
      ref="createTaskModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3 rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title text-primary" id="createTaskModalLabel">
              <i class="bi bi-card-checklist me-2"></i>
              {{ editingTask ? "Edit Task" : "Create and assign a task" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleTaskSubmit" enctype="multipart/form-data">
              <!-- Title -->
              <div class="form-floating mb-3">
                <input v-model="title" type="text" class="form-control" id="floatingTitle" placeholder="Task Title"
                  required />
                <label for="floatingTitle">Task Title</label>
              </div>

              <!-- Description -->
              <div class="form-floating mb-3">
                <textarea v-model="description" class="form-control" placeholder="Task Description" id="floatingDesc"
                  style="height: 100px" required></textarea>
                <label for="floatingDesc">Description</label>
              </div>

              <!-- File Upload -->
              <div class="mb-3">
                <label for="fileUpload" class="form-label fw-semibold">Upload File (PDF/Image)</label>
                <input type="file" class="form-control" id="fileUpload" ref="fileInput" name="file"
                  accept=".pdf,image/*" @change="handleFileChange" />
                <!-- Show file name if selected -->
                <div v-if="file?.name" class="text-success small mt-1">Selected: {{ file.name }}</div>
              </div>

              <!-- Show File Preview if editing -->
              <tr v-if="editingTask?.fileUrl" class="mb-3">
                <td class="attachment-cell">
                  <div v-if="editingTask.fileUrl">
                    <template v-if="isImage(editingTask.fileUrl)">
                      <img :src="getFullFileUrl(editingTask.fileUrl)" alt="Image" class="attachment-preview"
                        :title="editingTask.fileUrl.split('/').pop()" />
                    </template>
                    <template v-else>
                      <a :href="getFullFileUrl(editingTask.fileUrl)" target="_blank" class="attachment-pdf"
                        :title="editingTask.fileUrl.split('/').pop()">
                        <i class="bi bi-file-earmark-pdf me-1"></i> View PDF
                      </a>
                    </template>
                  </div>
                  <div v-else class="no-file">
                    <i class="bi bi-file-earmark-x fs-5 text-muted"></i>
                    <div class="small text-muted">No File</div>
                  </div>
                </td>
              </tr>

              <!-- Due Date -->
              <div class="form-floating mb-3">
                <input v-model="dueDate" type="datetime-local" :min="isMinDateDisabled ? null : minDate" :max="maxDate"
                  class="form-control" id="floatingDueDate" required />
                <label for="floatingDueDate">Due Date</label>
              </div>

              <!-- Status Dropdown (only in edit mode) -->
              <div v-if="editingTask" class="form-floating mb-3">
                <select v-model="status" class="form-select" id="floatingStatus" required>
                  <option value="pending">Pending</option>
                  <option v-if="status === 'in_progress'" value="in_progress">In Progress</option>
                  <option v-if="status === 'submitted'" value="submitted">Submitted</option>
                  <option v-if="status === 'due'" value="due">Expired</option>
                  <option value="verified">Done</option>
                </select>
                <label for="floatingStatus">Task Status</label>
              </div>

              <!-- Assign To -->
              <div class="mb-4">
                <label class="form-label fw-semibold">Assign To</label>
                <multiselect v-model="assignedTo" :options="users" :custom-label="customLabel" track-by="_id"
                  placeholder="Select users" :multiple="true" :close-on-select="false"
                  class="form-control-sm rounded shadow-sm border" />
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm">
                <i :class="editingTask ? 'bi bi-pencil-square' : 'bi bi-plus-circle'" class="me-2"></i>
                {{ editingTask ? "Update Task" : "Create Task" }}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>

    <!-- Task List Card -->
    <div class="card shadow-sm rounded-4 border-0 p-3 flex-grow-1 w-100">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h4 class="text-primary m-0"><i class="bi bi-list-check me-2"></i>Task List</h4>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-success btn-sm px-3 d-flex align-items-center gap-1 shadow-sm"
            @click="handleExportExcel">
            <i class="bi bi-file-earmark-excel"></i>
            <span>Export Excel</span>
          </button>

          <button class="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1 shadow-sm"
            @click="handleExportPDF">
            <i class="bi bi-file-earmark-pdf"></i>
            <span>Export PDF</span>
          </button>
        </div>
        <button class="btn btn-outline-primary btn-sm" @click="openCreateModal">
          <i class="bi bi-plus-circle me-1"></i> New Task
        </button>
      </div>

      <!-- Filters Row -->
      <div class="row g-3 align-items-end mb-3">
        <!-- Search -->
        <div class="col-md-3">
          <label class="form-label fw-semibold">Search</label>
          <input v-model="filters.search" type="text" class="form-control"
            placeholder="Search title or description..." />
        </div>

        <!-- Status -->
        <div class="col-md-2">
          <label class="form-label fw-semibold">Status</label>
          <select v-model="filters.status" class="form-select">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="verified">Done</option>
            <option value="cancelled">Cancelled</option>
            <option value="due">Expired</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="col-md-3">
          <label class="form-label fw-semibold">Due Date Range</label>
          <input v-model="filters.dateRange" type="text" class="form-control" placeholder="Select date range"
            @focus="showDateRangePicker" readonly />
        </div>

        <!-- Assigned To -->
        <div class="col-md-4">
          <label class="form-label fw-semibold">Assigned User</label>
          <multiselect v-model="filters.assignedTo" :options="users" :multiple="true" :close-on-select="false"
            placeholder="Filter by User" label="name" track-by="_id" class="w-100" />
        </div>
      </div>

      <!-- Task Table -->
      <div class="table-responsive">
        <table class="table align-middle text-nowrap table-sm">
          <thead class="table-light">
            <tr>
              <th style="width: 4%;">Sr.</th>
              <th style="width: 17%;">Title</th>
              <th style="width: 25%;">Description</th>
              <th style="width: 14%;">Due Date</th>
              <th style="width: 21%;">Assigned To</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 12%;">Attachmens</th>
              <th style="width: 9%;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, index) in tasks" :key="task._id">
              <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td class="text-truncate" :title="task.title">{{ task.title }}</td>
              <td class="text-truncate" :title="task.description">{{ task.description }}</td>
              <td :title="new Date(task.dueDate).toLocaleString()">
                {{ formatDate(task.dueDate) }}
              </td>
              <td class="assigned-to-cell">
                <div class="badge-container">
                  <span v-if="Array.isArray(task.assignedTo)">
                    <span v-for="(user, idx) in task.assignedTo.slice(0, 3)" :key="user._id || idx"
                      class="badge bg-light text-dark border me-1 small">
                      {{ user.name || "User" }}
                    </span>
                    <span v-if="task.assignedTo.length > 3 && !expandedRows.includes(task._id)"
                      @click="toggleRow(task._id)" class="badge bg-light text-muted small toggle-badge"
                      style="cursor: pointer;">
                      +{{ task.assignedTo.length - 3 }}
                    </span>
                  </span>
                  <span v-else class="badge bg-light text-dark border small">{{ task.assignedTo?.name || "—" }}</span>
                </div>
                <div v-if="task.assignedTo.length > 3 && expandedRows.includes(task._id)" class="expanded-content">
                  <span v-for="(user, idx) in task.assignedTo.slice(3)" :key="user._id || idx"
                    class="badge bg-light text-dark border me-1 small">
                    {{ user.name || "User" }}
                  </span>
                  <span @click="toggleRow(task._id)" class="badge bg-light text-muted small toggle-badge"
                    style="cursor: pointer;">Show less</span>
                </div>
              </td>
              <td>
                <span :class="[
                  'badge d-inline-flex align-items-center gap-1 rounded-pill fw-semibold small',
                  task.status === 'pending' ? 'bg-warning text-dark' :
                    task.status === 'in_progress' ? 'bg-primary text-white' :
                      task.status === 'submitted' ? 'bg-submitted' :
                        task.status === 'verified' ? 'bg-success text-white' :
                          task.status === 'cancelled' ? 'bg-danger text-white' :
                            task.status === 'due' ? 'bg-dark text-white' :
                              'bg-secondary text-white'
                ]">
                  <i :class="{
                    'bi-hourglass-split': task.status === 'pending',
                    'bi-arrow-repeat': task.status === 'in_progress',
                    'bi-upload': task.status === 'submitted',
                    'bi-check-circle': task.status === 'verified',
                    'bi-x-circle': task.status === 'cancelled',
                    'bi-clock-exclamation': task.status === 'due',
                    'bi-question-circle': !task.status
                  }"></i>
                  {{
                    {
                      pending: 'Pending',
                      in_progress: 'Progress',
                      submitted: 'Submitted',
                      verified: 'Done',
                      cancelled: 'Cancelled',
                      due: 'Expired'
                    }[task.status] || 'Unknown'
                  }}
                </span>
              </td>
              <td class="attachment-cell">
                <div v-if="task.fileUrl">
                  <template v-if="isImage(task.fileUrl)">
                    <a :href="getFullFileUrl(task.fileUrl)" target="_blank" :title="task.fileUrl.split('/').pop()">
                      <img :src="getFullFileUrl(task.fileUrl)" alt="Image" class="attachment-preview" />
                    </a>
                  </template>
                  <template v-else>
                    <a :href="getFullFileUrl(task.fileUrl)" target="_blank" class="attachment-pdf"
                      :title="task.fileUrl.split('/').pop()">
                      <i class="bi bi-file-earmark-pdf me-1"></i> View PDF
                    </a>
                  </template>
                </div>
                <div v-else class="no-file">
                  <i class="bi bi-file-earmark-x fs-5 text-muted"></i>
                  <div class="small text-muted">No File</div>
                </div>
              </td>
              <td class="text-nowrap">
                <span :title="task.status === 'cancelled' ? 'Cancelled task cannot be edited' : 'Edit Task'">
                  <button @click="handleTaskEdit(task)" class="btn btn-sm btn-outline-secondary me-1"
                    :disabled="task.status === 'cancelled'">
                    <i class="bi bi-pencil"></i>
                  </button>
                </span>

                <span :title="task.status === 'cancelled' ? 'Task already cancelled' : 'Cancel Task'">
                  <button @click="handleTaskCancel(task)" class="btn btn-sm btn-outline-danger"
                    :disabled="task.status === 'cancelled' || task.status === 'verified' || task.status === 'due'">
                    <i class="bi bi-x-circle"></i>
                  </button>
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
import { ref, reactive, onMounted, getCurrentInstance, nextTick, computed, watch } from "vue";
import { request } from "@/services/apiWrapper";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { hideBootstrapModal, showBootstrapModal } from "@/utils/bootstrapModal.js";
import BasePagination from "@/components/BasePagination.vue";
import Swal from 'sweetalert2';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useExport } from "@/composables/useExport";

defineOptions({ components: { Multiselect } });

const title = ref("");
const description = ref("");
const file = ref(null);
const fileInput = ref(null);
const dueDate = ref("");
const status = ref("pending");
const assignedTo = ref([]);
const users = ref([]);
const tasks = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(10);
const createTaskModal = ref(null);
const editingTask = ref(null);
const expandedRows = ref([]);

const filters = reactive({
  search: '',
  status: '',
  dateRange: '',
  assignedTo: []
});

const showDateRangePicker = () => {
  const today = new Date();
  const tenYearsLater = new Date();
  tenYearsLater.setFullYear(today.getFullYear() + 10);
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(today.getFullYear() - 10);

  flatpickr(document.querySelector('input[placeholder="Select date range"]'), {
    mode: "range",
    dateFormat: "Y-m-d",
    maxDate: tenYearsLater,
    minDate: tenYearsAgo,
    onClose: (selectedDates) => {
      if (selectedDates.length === 2) {
        filters.dateRange = `${selectedDates[0].toISOString().slice(0, 10)} to ${selectedDates[1].toISOString().slice(0, 10)}`;
      }
    }
  }).open();
};

const isMinDateDisabled = computed(() => {
  return status.value === 'verified';
});

const { appContext } = getCurrentInstance();
const toast = appContext.config.globalProperties.$toast;

const today = new Date();
const minAllowedDate = new Date(today.getTime() + 60 * 60 * 1000); // 1hr ahead
const sixMonthsLater = new Date();
sixMonthsLater.setMonth(today.getMonth() + 6);

const formatToDateTimeLocal = (input) => {
  const date = new Date(input);

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn("Invalid date passed to formatToDateTimeLocal:", input);
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

const handleFileChange = (event) => {
  const selected = event.target.files[0];
  if (!selected) return;

  const validTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];
  const maxSizeMB = 5; // Max file size in MB

  if (!validTypes.includes(selected.type)) {
    const allowed = ["PDF", "PNG", "JPEG", "JPG", "WEBP"].join(", ");
    toast.error(`Invalid file type. Allowed types: ${allowed}`);
    file.value = null;
    return;
  }

  const fileSizeMB = selected.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    toast.error(`File too large. Max allowed size is ${maxSizeMB}MB.`);
    file.value = null;
    return;
  }

  file.value = selected;
};


const openCreateModal = () => {
  resetForm();
  editingTask.value = null;
  showBootstrapModal(createTaskModal);
};

const minDate = formatToDateTimeLocal(minAllowedDate);
const maxDate = formatToDateTimeLocal(sixMonthsLater);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12;

  return `${day} ${month}, ${formattedHour}:${minutes} ${ampm}`;
};

const handleExportExcel = () => {
  const { exportToExcel } = useExport(tasks.value, formatDate, currentPage.value, perPage.value);
  exportToExcel();
};

const handleExportPDF = () => {
  const { exportToPDF } = useExport(tasks.value, formatDate, currentPage.value, perPage.value);
  exportToPDF();
};

const customLabel = (user) => (user?.name ? `${user.name} (${user.email})` : "Unknown");

const fetchTasks = async (page = 1) => {
  const raw = {
    page,
    limit: perPage.value,
    search: filters.search?.trim(),
    status: filters.status,
    from: filters.dateRange?.split(" to ")[0],
    to: filters.dateRange?.split(" to ")[1],
    assignedTo: filters.assignedTo.length
      ? filters.assignedTo.map(u => u._id).join(",")
      : null
  };

  const params = Object.fromEntries(
    Object.entries(raw).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const query = new URLSearchParams(params).toString();
  const [data, error] = await request("get", `/tasks?${query}`);

  if (error) {
    toast.error(error.message || "Failed to load tasks");
  } else {
    tasks.value = data.data.tasks || [];
    totalPages.value = data.data.totalPages || 1;
    currentPage.value = data.data.currentPage || page;
  }
};

const handleTaskCancel = async (task) => {
  const result = await Swal.fire({
    title: 'Cancel this task?',
    text: `"${task.title}" will be marked as cancelled.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    const [data, error] = await request("put", `/tasks/${task._id}/cancel`);

    if (error) {
      toast.error(error.message || "Failed to cancel task.");
    } else {
      toast.success(data.message || "Task cancelled successfully.");
      fetchTasks(currentPage.value);
    }
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
  file.value = null;
  fileInput.value.value = "";
  dueDate.value = "";
  assignedTo.value = [];
  status.value = "pending";
  editingTask.value = null;
};

const toggleRow = (taskId) => {
  if (expandedRows.value.includes(taskId)) {
    expandedRows.value = expandedRows.value.filter(id => id !== taskId);
  } else {
    expandedRows.value.push(taskId);
  }
};

const handleTaskSubmit = async () => {
  const isEdit = !!editingTask.value;

  const selectedDate = new Date(dueDate.value);
  const now = new Date();
  const minAllowedDate = new Date(now.getTime() + 5 * 60 * 1000);

  const originalTask = isEdit
    ? tasks.value.find(task => task._id === editingTask.value._id)
    : null;

  // Validation: Only for reverting from verified to pending
  if (originalTask && originalTask.status !== 'pending' && status.value === 'pending') {
    if (selectedDate < minAllowedDate) {
      toast.error("Due date & time must be at least 5 minutes in the future.");
      return;
    }
  }

  const formData = new FormData();
  formData.append('title', title.value.trim());
  formData.append('description', description.value.trim());
  formData.append('dueDate', selectedDate.toISOString());

  // Handle assignedTo
  if (assignedTo.value.length === 0) {
    toast.error("At least one assignee must be selected.");
    return;
  }

  assignedTo.value.forEach((user) => {
    formData.append('assignedTo', user._id);
  });

  if (isEdit) {
    formData.append('status', status.value);
  }

  if (file.value) {
    formData.append('file', file.value);
  }

  const url = isEdit
    ? `/tasks/${editingTask.value._id}/update`
    : "/tasks/create";

  const method = isEdit ? "put" : "post";

  const [data, error] = await request(method, url, formData);

  if (error) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, msg]) => {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`);
      });
    } else {
      toast.error(error.message || (isEdit ? "Task update failed" : "Task creation failed"));
    }
  } else {
    toast.success(data.message || (isEdit ? "Task updated successfully!" : "Task created successfully!"));
    await nextTick();
    hideBootstrapModal(createTaskModal);
    fetchTasks(currentPage.value);
    resetForm();
  }
};

const handleTaskEdit = (task) => {
  editingTask.value = task;
  title.value = task.title;
  description.value = task.description;
  dueDate.value = formatToDateTimeLocal(task.dueDate);
  assignedTo.value = task.assignedTo;
  status.value = task.status || "pending";
  showBootstrapModal(createTaskModal);
};

const getFullFileUrl = (relativePath) => {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/';
  return `${base.replace(/\/$/, '')}${relativePath}`;
};


const isImage = (filePath) => {
  return /\.(jpg|jpeg|png|webp)$/i.test(filePath);
}

onMounted(async () => {
  await fetchTasks();

  const [userData = {}, userError = null] = await request("get", "/users");
  if (!userError) users.value = userData.data;

  const modalEl = createTaskModal.value;
  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", () => {
      resetForm();
      editingTask.value = null;
    });
  }
});

watch(
  () => ({
    ...filters,
    perPage: perPage.value,
    page: currentPage.value
  }),
  () => {
    fetchTasks(currentPage.value);
  },
  { deep: true }
);

</script>

<style scoped>
.btn-outline-success:hover {
  background-color: #198754;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.table {
  table-layout: fixed;
  width: 100%;
}

.table td,
.table th {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td:nth-child(3) {
  max-width: 220px;
  /* Limit description column */
}

.attachment-cell {
  text-align: center;
}

.attachment-preview {
  max-width: 48px;
  max-height: 48px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #dee2e6;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.attachment-preview:hover {
  transform: scale(1.2);
  z-index: 10;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

.attachment-pdf {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: #0d6efd;
  background-color: #eef6ff;
  border-radius: 6px;
  text-decoration: none;
  border: 1px solid #cce5ff;
  transition: background 0.2s ease-in-out;
}

.attachment-pdf:hover {
  background-color: #d4ebff;
  text-decoration: none;
}

.no-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  color: #6c757d;
}

input.form-control::placeholder,
select.form-select {
  font-size: 14px;
}

.multiselect {
  min-height: 38px;
  font-size: 14px;
}

input[readonly] {
  background-color: #fff;
  cursor: pointer;
}

.multiselect__tags {
  min-height: 38px !important;
  padding: 5px 8px !important;
}

.bg-submitted {
  background-color: #e0e7ff !important;
  color: #1d4ed8 !important;
}
</style>