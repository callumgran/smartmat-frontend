<template>
  <Suspense data-testid="loading">
    <shopping-trip data-testid="shopping-trip" />
  </Suspense>
</template>

<script setup lang="ts">
import ShoppingTrip from '@/components/ShoppingList/ShoppingTrip.vue';
</script>
