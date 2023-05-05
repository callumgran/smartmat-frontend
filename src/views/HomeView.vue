<template>
  <landing-page v-if="!loggedIn" />
  <dashboard v-else />
</template>

<script setup lang="ts">
import LandingPage from '@/components/LandingPage/LandingPage.vue';
import Dashboard from '@/components/Dashboard/Dashboard.vue';
import { useUserInfoStore } from '@/stores/UserStore';
import { computed } from 'vue';

const userStore = useUserInfoStore();
const loggedIn = computed(() => userStore.isLoggedIn);
</script>

<style scoped></style>
