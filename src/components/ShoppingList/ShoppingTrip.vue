<template>
  <div>
    <div class="d-flex align-center">
      <v-btn
        class="elevation-0"
        icon="mdi-arrow-left"
        @click="$router.push({ name: 'shopping-list' })"></v-btn>
      <v-title class="text-h6">Handleliste</v-title>
    </div>
    <v-divider />
    <v-dialog v-model="scanOpen">
      <shopping-trip-scanner />
    </v-dialog>
    <v-list class="h-80vh">
      <v-list-item-group>
        <v-list-item-title v-if="shoppingListItems.length"> Ingredienser </v-list-item-title>
        <v-list-item v-for="(item, index) in shoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between align-center">
            <div class="d-flex align-center justify-center">
              <v-list-item-title :style="item.checked ? 'text-decoration: line-through' : ''">
                {{ item.ingredient?.name }}</v-list-item-title
              >
            </div>
            <v-list-item-title
              >{{ item.amount }} {{ item.ingredient?.unit?.abbreviation }}</v-list-item-title
            >
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group>
        <v-list-item-title v-if="customShoppingListItems.length"> Annet </v-list-item-title>
        <v-list-item v-for="(item, index) in customShoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between align-center">
            <div class="d-flex align-center justify-center">
              <v-list-item-title :style="item.checked ? 'text-decoration: line-through' : ''">
                {{ item.name }}</v-list-item-title
              >
            </div>
            <v-list-item-title>{{ item.amount }} stk</v-list-item-title>
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-bottom-navigation class="justify-space-around" grow>
      <v-btn class="color-red" @click="closeDialog = true">Avslutt Handletur</v-btn>
      <v-btn class="bg-green" @click="scanOpen = true">Scan vare</v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="closeDialog">
      <v-card>
        <v-card-title>Avslutt handletur</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  >Er du sikker på at du vil avslutte handleturen?</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog = false">Avbryt</v-btn>
          <v-btn @click="onClose">Avslutt</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { HouseholdService, ShoppingListService } from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import ShoppingTripScanner from '@/components/ShoppingList/ShoppingTripScanner.vue';
import ChooseIngredientModal from '@/components/ShoppingList/ChooseIngredientModal.vue';
import { ref } from 'vue';
import router from '@/router';

const householdId = useHouseholdStore().householdId;
const currentShoppingList = await HouseholdService.getCurrentShoppingList({
  id: householdId,
});

const shoppingListItems = currentShoppingList.shoppingListItems;
const customShoppingListItems = currentShoppingList.customFoodItems;

const closeDialog = ref(false);

const onClose = async () => {
  await ShoppingListService.completeShoppingList({ id: currentShoppingList.id });
  await ShoppingListService.createShoppingList({ requestBody: { household: householdId } });
  router.push({ name: 'shopping-list' });
};

const scanOpen = ref(false);
</script>
