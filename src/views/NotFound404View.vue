<template>
  <h1 data-testid="not-found-header">Kunne ikke finne siden :-(</h1>
  <div v-if="errorMsg">
    <p>årsak: {{ errorMsg }}</p>
  </div>
  <div>
    <router-link :to="{ name: 'base' }" data-testid="goto-main">til hovedside</router-link>
  </div>
  <div>
    <!-- the 'to' prop is used for fallback -->
    <router-link @click="$router.go(-1)" :to="{ name: 'base' }" data-testid="goback"
      >tilbake</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMsg = route.query.errorMsg as string;
//const props = defineProps({
//  errorMsg: {
//    type: String,
//    required: false,
//  },
//});
</script>
