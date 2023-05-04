<template>
  <Suspense>
    <template #fallback>
      <v-card-loading />
    </template>
    <user-content v-if="loggedIn" />
  </Suspense>
</template>

<script setup lang="ts">
import VCardLoading from '@/components/common/VCardLoading.vue';
import UserContent from '@/components/User/UserContent.vue';

import { useUserInfoStore } from '@/stores/UserStore';
const loggedIn = useUserInfoStore().isLoggedIn;
</script>
