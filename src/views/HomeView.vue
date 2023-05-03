<template>
  <landing-page v-if="!loggedIn" />
  <dashboard v-else />
</template>

<script setup lang="ts">
import LandingPage from '@/components/LandingPage/LandingPage.vue';
import Dashboard from '@/components/Dashboard/Dashboard.vue';
import { useUserInfoStore } from '@/stores/UserStore';

const loggedIn = useUserInfoStore().isLoggedIn;
</script>

<style scoped></style>
