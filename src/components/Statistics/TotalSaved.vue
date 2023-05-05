<template>
  <v-sheet class="pa-2 ma-2">
    <v-divider :thickness="1" class="border-opacity-75 mb-3" />
    <v-row no-gutters>
      <v-col cols="12">
        <p class="pa-3 text-subtitle-1">Du har til sammen spart:</p>
      </v-col>
      <v-row>
        <p class="ma-3 text-h2 text-green-lighten-2">{{ formatNumber(moneySaved) }} kr</p>
        <p class="ma-3 text-subtitle-2 align-self-end" v-if="moneySaved != 0">
          Som tilsvarer {{ formatNumber(kilosSaved) }} kg mat
        </p>
      </v-row>
    </v-row>
    <v-divider :thickness="1" class="border-opacity-75 mt-3" />
  </v-sheet>
</template>

<script setup lang="ts">
import { ConsumptionConstants } from '@/utils/ConsumptionConstants';
import { computed } from 'vue';

const props = defineProps<{
  kilosSaved: number;
}>();

const formatNumber = (number: number): string => {
  return new Intl.NumberFormat().format(number).replaceAll(',', ' ');
};

const moneySaved = computed(() => {
  return props.kilosSaved * ConsumptionConstants.PRICE_PER_KILO;
});
</script>

<style scoped></style>
