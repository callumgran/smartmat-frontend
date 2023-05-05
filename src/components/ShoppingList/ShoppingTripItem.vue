<template>
  <v-expansion-panel>
    <v-expansion-panel-title :disabled="props.item.amount <= 0 || props.item.checked">
      <span
        v-if="props.item.amount > 0 && !props.item.checked"
        class="bg-red-lighten-2 pa-1 mr-1 rounded"
        >{{ Math.ceil(props.item.amount * 100) / 100 }}
        {{
          (props.item as ShoppingListItemDTO).ingredient?.unit
            ? (props.item as ShoppingListItemDTO).ingredient?.unit?.abbreviation
            : 'stk'
        }}</span
      >
      <span v-else class="bg-green pa-1 mr-1 rounded">
        <v-icon size="1em">mdi-check</v-icon>
      </span>

      <span class="item-text"
        >{{
          (props.item as CustomFoodItemDTO).name
            ? (props.item as CustomFoodItemDTO).name
            : (props.item as ShoppingListItemDTO).ingredient?.name
        }}
      </span>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-btn @click="emit('addToBasket', props.item)" class="bg-orange"
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
</script>

<style scoped>
.item-text {
  text-transform: lowercase;
}

.item-text::first-letter {
  text-transform: uppercase;
}
</style>
