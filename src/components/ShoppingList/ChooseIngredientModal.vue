<template>
  <v-card>
    <v-card-title>Velg ingrediens</v-card-title>
    <v-list class="d-flex flex-column justify-center align-center">
      <v-list-item
        v-for="(ingredient, index) in props.ingredients"
        :key="index"
        @click="choose(ingredient)"
        data-testid="ingredient-button"
        >{{ ingredient.ingredient?.name }}
      </v-list-item>
      <v-list-action>
        <v-btn data-testid="no-ingredient-button" @click="choose(null)">Ingen</v-btn>
      </v-list-action>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ShoppingListItemDTO } from '@/api';

const props = defineProps<{
  ingredients: ShoppingListItemDTO[];
}>();

const choose = (ingredient: ShoppingListItemDTO | null) => {
  emit('update:modelValue', ingredient);
  emit('onClose');
};

const emit = defineEmits<{
  (e: 'update:modelValue', value: ShoppingListItemDTO | null): void;
  (e: 'onClose'): void;
}>();
</script>

<style scoped></style>
