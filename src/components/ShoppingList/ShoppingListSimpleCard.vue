<template>
  <v-list-item
    v-if="shoppingList.dateCompleted"
    data-testid="previous"
    @click="router.push({ name: 'previous-shopping-list', params: { id: shoppingList.id } })">
    {{ props.shoppingList.dateCompleted }}
  </v-list-item>
  <v-list-item v-else class="bg-green" @click="router.push({ name: 'shopping-list' })">
    Nåværende handleliste
  </v-list-item>
</template>

<script setup lang="ts">
import { ListingShoppingListDTO } from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  shoppingList: ListingShoppingListDTO;
  backgroundColor?: string;
}>();
</script>

<style scoped></style>
