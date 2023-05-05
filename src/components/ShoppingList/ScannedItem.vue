<template>
  <v-card-item class="d-flex flex-column justify-center align-center">
    <v-card-item-title data-testid="food-product">
      {{ foodProduct.name }}
    </v-card-item-title>
    <v-spacer></v-spacer>
    <img :src="foodProduct.image" alt="" />
  </v-card-item>
</template>

<script setup lang="ts">
import { FoodProductDTO } from '@/api';

const props = defineProps<{
  foodProduct: FoodProductDTO;
}>();

const foodProduct = props.foodProduct;
</script>

<style scoped>
img {
  height: 50vh;
  width: 100%;
  object-fit: contain;
}
</style>
