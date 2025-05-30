<template>
  <div>
    <h2>Edit Task</h2>
    <form @submit.prevent="updateTask">
      <input v-model="title" required />
      <textarea v-model="description"></textarea>
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await axios.get(`http://localhost:5000/api/tasks/${route.params.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  title.value = res.data.title
  description.value = res.data.description
})

const updateTask = async () => {
  const token = localStorage.getItem('token')
  await axios.put(`http://localhost:5000/api/tasks/${route.params.id}`, {
    title: title.value,
    description: description.value
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  router.push('/tasks')
}
</script>
