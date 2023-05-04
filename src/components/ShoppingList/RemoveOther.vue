<template>
  <v-card>
    <v-card-title>Velg vare som du skal fjerne</v-card-title>
    <v-list>
      <v-list-item v-for="item in props.items" :key="item.id" @click="emit('onChoice', item)">
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { CustomFoodItemDTO } from '@/api';

const emit = defineEmits<{
  (e: 'onChoice', item: CustomFoodItemDTO): void;
}>();

const props = defineProps<{
  items: CustomFoodItemDTO[];
}>();
</script>

<style scoped></style>
