<template>
  <base-header />
  <v-main>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
  <base-footer />
</template>

<script setup lang="ts">
import BaseHeader from '@/components/BasePage/Header.vue';
import BaseFooter from '@/components/BasePage/Footer.vue';
</script>
