<template>
  <div class="auth-page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  await authStore.login(email.value, password.value);
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
