<template>
  <v-card>
    <h1>Tidligere handlelister</h1>
    <v-card-title> Tidligere handlelister </v-card-title>
    <v-list>
      <shopping-list-simple-card
        v-for="(shoppingList, index) in shoppingLists"
        :key="index"
        :shoppingList="shoppingList" />
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { HouseholdService } from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { ref } from 'vue';
import ShoppingListSimpleCard from './ShoppingListSimpleCard.vue';

const householdId = useHouseholdStore().getSelectedId;
const household = await HouseholdService.getHousehold({ id: householdId });

const shoppingLists = ref(household.shoppingLists?.sort((a) => (!a.dateCompleted ? -1 : 1)));
</script>

<style scoped></style>
