<template>
  <div>
    <h2>Create Task</h2>
    <form @submit.prevent="createTask">
      <input v-model="title" placeholder="Task title" required />
      <textarea v-model="description" placeholder="Description"></textarea>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const router = useRouter()

const createTask = async () => {
  const token = localStorage.getItem('token')
  await axios.post('http://localhost:5000/api/tasks', {
    title: title.value,
    description: description.value
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  router.push('/tasks')
}
</script>
