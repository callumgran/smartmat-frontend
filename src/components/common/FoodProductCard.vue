<template>
  <v-list-item>
    <div class="d-flex align-left">
      <v-checkbox-btn
        v-if="props.selectable"
        v-model="selected"
        hide-details
        density="compact"
        :value="props.selectedValue"></v-checkbox-btn>
      <v-list-item
        :prepend-avatar="props.item.image ? props.item.image : '/product-placeholder.png'">
        <v-list-item-title class="item-text">{{ props.item.name }}</v-list-item-title>
        <v-list-item-subtitle v-if="props.expirationDate">
          {{ props.expirationDate }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="props.amountLeft">
          {{ props.amountLeft }} stk igjen
        </v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import { FoodProductDTO } from '@/api';
import { ref, watch } from 'vue';

const props = defineProps<{
  item: FoodProductDTO;
  expirationDate?: string;
  amountLeft?: number;
  selectable: boolean;
  selected: any;
  selectedValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:selected', value: any): void;
}>();

const selected = ref(props.selected);

watch([selected], () => {
  emit('update:selected', selected.value);
});
</script>

<style scoped>
.item-text {
  text-transform: lowercase;
}
.item-text::first-letter {
  text-transform: uppercase;
}
</style>
