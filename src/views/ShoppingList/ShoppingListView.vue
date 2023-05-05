<template>
  <suspense data-testid="loading">
    <div>
      <shopping-list />
    </div>
  </suspense>
</template>

<script setup lang="ts">
import ShoppingList from '@/components/ShoppingList/ShoppingList.vue';
</script>
