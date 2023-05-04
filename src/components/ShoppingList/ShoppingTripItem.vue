<template>
  <v-expansion-panel>
    <v-expansion-panel-title :disabled="item.amount <= 0 || item.checked">
      <span v-if="item.amount > 0 && !item.checked" class="bg-red-lighten-2 pa-1 mr-1 rounded"
        >{{ item.amount }}
        {{
          (item as ShoppingListItemDTO).ingredient?.unit
            ? (item as ShoppingListItemDTO).ingredient?.unit?.abbreviation
            : 'stk'
        }}</span
      >
      <span v-else class="bg-green pa-1 mr-1 rounded">
        <v-icon size="1em">mdi-check</v-icon>
      </span>

      <span class="item-text"
        >{{
          (item as CustomFoodItemDTO).name
            ? (item as CustomFoodItemDTO).name
            : (item as ShoppingListItemDTO).ingredient?.name
        }}
      </span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-btn @click="emit('addToBasket', item)" class="bg-orange"
        >Legg til i handlekurv manuelt</v-btn
      >
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { CustomFoodItemDTO, ShoppingListItemDTO } from '@/api';
import { computed, ref } from 'vue';

const props = defineProps<{
  item: ShoppingListItemDTO | CustomFoodItemDTO;
}>();

const emit = defineEmits<{
  (e: 'addToBasket', value: ShoppingListItemDTO | CustomFoodItemDTO): void;
}>();

const item = ref(props.item);
</script>

<style scoped>
.item-text {
  text-transform: lowercase;
}
.item-text::first-letter {
  text-transform: uppercase;
}
</style>
