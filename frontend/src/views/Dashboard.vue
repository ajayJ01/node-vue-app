<template>
  <div class="dashboard">
    <h2>Welcome, {{ user?.name || 'Guest' }}</h2>
    <p>This is your dashboard.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
const auth = useAuthStore();
const user = auth.user;
</script>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>
