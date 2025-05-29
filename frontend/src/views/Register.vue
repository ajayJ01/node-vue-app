<template>
  <div class="auth-page">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleRegister = async () => {
  await authStore.register(name.value, email.value, password.value);
};
</script>

<style scoped>
.auth-page {
  max-width: 300px;
  margin: auto;
  padding-top: 50px;
}
input, button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
</style>
