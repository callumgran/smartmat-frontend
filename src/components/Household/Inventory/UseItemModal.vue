<template>
  <v-card>
    <v-card-title>
      <span class="headline">Bruk opp {{ hfp.foodProduct?.name }}</span>
    </v-card-title>

    <v-card-text>
      <v-text-field
        type="number"
        :label="useLabel"
        v-model="amount"
        :rules="[zeroOrNegativeNotAllowed]"
        required
        data-testid="amount"></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="close">Avbryt</v-btn>
      <v-btn color="blue darken-1" text @click="use" :disabled="amount <= 0" data-testid="use-item"
        >Bruk</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { HouseholdFoodProductDTO } from '@/api';

const props = defineProps<{
  hfp: HouseholdFoodProductDTO;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'use', res: number): number;
}>();

const amount = ref(0);

const useLabel = computed(() => {
  return `Bruk opp antall ${props.hfp.foodProduct?.unit?.name}`;
});

const use = () => {
  let ret = amount.value / props.hfp.foodProduct?.amount!;
  emit('use', ret);
};

const close = () => {
  emit('close');
};

const zeroOrNegativeNotAllowed = (value: number) => {
  if (value <= 0) {
    return 'Må være større enn 0';
  }
  return true;
};
</script>
