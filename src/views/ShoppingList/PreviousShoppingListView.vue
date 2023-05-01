<template>
  <suspense>
    <shopping-list :shopping-list-id="shoppingListId" />
  </suspense>
</template>

<script setup lang="ts">
import ShoppingList from '@/components/ShoppingList/ShoppingList.vue';
import { useRoute } from 'vue-router';

const shoppingListId = useRoute().params.id as string;
</script>
