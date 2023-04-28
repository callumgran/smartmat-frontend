<template>
  <div class="d-flex flex-column">
    <div class="d-flex align-center">
      <v-text-field
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Søk"
        single-line
        hide-details></v-text-field>
    </div>

    <v-divider />

    <div v-if="selected.length">
      <div class="d-flex">
        <v-btn @click="deleteSelected">Slett markerte produkter</v-btn>
      </div>

      <v-divider></v-divider>
    </div>

    <v-list class="h-80vh">
      <!-- <v-list-item-group v-if="shoppingListItemSuggestions.length"> -->
      <!--   <v-list-item v-for="(item, index) in shoppingListItemSuggestions" :key="index"> -->
      <!--     <v-list-item-content class="d-flex justify-space-between"> -->
      <!--       <div> -->
      <!--         <div class="d-flex justify-space-between"> -->
      <!--           <v-list-item-title>{{ item.name }}</v-list-item-title> -->
      <!--           <v-list-item-title>{{ item.amount }} {{ item.unit.shortName }}</v-list-item-title> -->
      <!--         </div> -->
      <!--         <v-list-item-subtitle>Foreslått av {{ item.suggestedBy.name }}</v-list-item-subtitle> -->
      <!--       </div> -->
      <!--       <v-list-item-action> -->
      <!--         <v-btn class="bg-green" @click="addShoppingListSuggestion(item)"><v-icon>mdi-check-bold</v-icon></v-btn> -->
      <!--         <v-btn class="bg-red" @click="addShoppingListItem"><v-icon>mdi-close</v-icon></v-btn> -->
      <!--       </v-list-item-action> -->
      <!--     </v-list-item-content> -->
      <!--   </v-list-item> -->
      <!--   <v-divider /> -->
      <!-- </v-list-item-group> -->
      <v-list-item-group>
        <v-list-item-title v-if="shoppingListItems.length"> Ingredienser </v-list-item-title>
        <v-list-item v-for="(item, index) in shoppingListItems" :key="index">
          <v-list-item-content class="d-flex justify-space-between align-center">
            <div class="d-flex align-center justify-center">
              <v-checkbox
                hide-details
                density="compact"
                v-model="selected"
                :value="item"></v-checkbox>
              <v-list-item-title> {{ item.ingredient?.name }}</v-list-item-title>
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
              <v-checkbox
                hide-details
                density="compact"
                v-model="selected"
                :value="item"></v-checkbox>
              <v-list-item-title> {{ item.name }}</v-list-item-title>
            </div>
            <v-list-item-title>{{ item.amount }} stk</v-list-item-title>
          </v-list-item-content>
          <v-divider />
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-bottom-navigation class="justify-space-around" grow>
      <v-btn class="" @click="addOverlay = true">Legg til vare</v-btn>
      <v-btn :to="{ name: 'shopping-trip' }">Start Handletur</v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="addOverlay">
      <add-shopping-list-item-modal @close="addOverlay = false" :shoppingListId="shoppingListId" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import {
  CustomFoodItemDTO,
  HouseholdService,
  ShoppingListDTO,
  ShoppingListItemDTO,
  ShoppingListService,
  ShoppinglistitemService,
} from '@/api';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import AddShoppingListItemModal from '@/components/ShoppingList/AddShoppingListItemModal.vue';

const householdId = useHouseholdStore().householdId;
const search = ref('');
const shoppingList = ref(await HouseholdService.getCurrentShoppingList({ id: householdId }));
const shoppingListId = ref(shoppingList.value.id);
console.log(shoppingList);
const selected = ref([] as (ShoppingListItemDTO | CustomFoodItemDTO)[]);

const getShoppingListItems = (shoppingList: ShoppingListDTO) => {
  return shoppingList.shoppingListItems;
};

const getCustomShoppingListItems = (shoppingList: ShoppingListDTO) => {
  return shoppingList.customFoodItems;
};

const shoppingListItems = ref(getShoppingListItems(shoppingList.value));
const customShoppingListItems = ref(getCustomShoppingListItems(shoppingList.value));

watch(shoppingList, () => {
  console.log('rerendering list');
  shoppingListItems.value = getShoppingListItems(shoppingList.value);
  customShoppingListItems.value = getCustomShoppingListItems(shoppingList.value);
});
const addOverlay = ref(false);

watch(addOverlay, async () => {
  console.log('addOverlay', addOverlay);
  if (!addOverlay.value) {
    console.log('rerendering');
    shoppingList.value = await HouseholdService.getCurrentShoppingList({ id: householdId });
  }
});

const deleteSelected = async () => {
  console.log('deleteSelected', selected.value);
  selected.value.map(async (item) => {
    await ShoppinglistitemService.deleteItemFromShoppingList({
      id: item.id,
      householdId: householdId,
    });
  });

  shoppingListItems.value = shoppingListItems.value.filter(
    (item) => !selected.value.includes(item),
  );
  customShoppingListItems.value = customShoppingListItems.value.filter(
    (item) => !selected.value.includes(item),
  );
  selected.value = [];
};
</script>

<style scoped>
.h-80vh {
  height: 65vh;
}

.fixed-bottom {
  bottom: 0;
  margin-bottom: 4rem;
  position: fixed;
  transform: translate();
}
</style>
