<template>
  <base-header />
  <router-view />
  <base-footer />
</template>

<script setup lang="ts">
import BaseHeader from '@/components/BasePage/Header.vue';
import BaseFooter from '@/components/BasePage/Footer.vue';
</script>
