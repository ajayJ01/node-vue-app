<template>
  <div>
    <h2>Task List</h2>
    <router-link to="/tasks/create">+ Create Task</router-link>

    <ul>
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
        <router-link :to="`/tasks/${task._id}/edit`">Edit</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])

const fetchTasks = async () => {
  const token = localStorage.getItem('token')
  const res = await axios.get('http://localhost:5000/api/tasks', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  tasks.value = res.data
}

onMounted(fetchTasks)
</script>
