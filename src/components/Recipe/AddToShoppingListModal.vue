<template>
  <div>
    <v-btn
      color="primary"
      dark
      fab
      style="position: fixed; bottom: 50px; right: 24px"
      @click="showModal = true">
      <v-icon>mdi-basket-plus-outline</v-icon>
    </v-btn>
    <v-dialog v-model="showModal" max-width="500">
      <v-card>
        <v-card-item><h3>Legg ingredienser i husstandens handleliste</h3></v-card-item>
        <v-card-text>
          <v-list>
            <v-checkbox
              v-for="recipeIngredient in recipeIngredientsToList"
              :key="recipeIngredient.ingredient.id"
              :label="formatIngredientItem(recipeIngredient)"
              :value="recipeIngredient.ingredient.id"
              density="compact"
              color="green"
              v-model="selectedIngredients" />
          </v-list>
        </v-card-text>
        <v-select
          v-model="selectedShoppingList"
          :items="shoppingListsInHouseholds"
          item-title="household.name"
          item-value="shoppinglist"
          label="Velg husholdning"
          dense
          outlined
          color="primary" />
        <v-card-actions>
          <v-btn color="primary" @click="addToShoppingList">Legg til</v-btn>
          <v-btn @click="showModal = false">Lukk</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  IngredientDTO,
  ShoppinglistitemService,
  CreateShoppingListItemDTO,
  HouseholdService,
} from '@/api';
import { ref } from 'vue';
import { useUserInfoStore } from '@/stores/UserStore';
import useFeedbackStore from '@/stores/FeedbackStore';

const userStore = useUserInfoStore();
const feedbackStore = useFeedbackStore();

const showModal = ref(false);

type RecipeIngredientsToList = {
  ingredient: IngredientDTO;
  amountFromServings: number;
};

const { recipeIngredientsToList } = defineProps({
  recipeIngredientsToList: {
    type: Array as () => RecipeIngredientsToList[],
    required: true,
  },
});

const formatIngredientItem = (recipeIngredient: RecipeIngredientsToList) => {
  return `${recipeIngredient.ingredient.name} : ${recipeIngredient.amountFromServings} ${recipeIngredient.ingredient.unit?.abbreviation}`;
};
const selectedIngredients = ref<number[]>(
  recipeIngredientsToList.map((s) => s.ingredient.id) ?? [],
);

// TODO: Get shopping lists in a better way. Perhaps with getting all current shopping lists
const households = await HouseholdService.getHouseholdsForUser({ username: userStore.username });
const shoppingListsInHouseholds = households
  .map((h) => ({
    household: h,
    shoppingList: h.shoppingLists,
  }))
  .filter((h) => h.shoppingList !== undefined)
  .map((h) => ({
    household: h.household,
    shoppingList: h.shoppingList!![0],
  }))
  .filter((h) => h.shoppingList.dateCompleted === null)
  .flat();
const selectedShoppingList = ref(shoppingListsInHouseholds.at(0));

// TODO: Store recipeIngredientsToList in select field to get amount and name better.
const addToShoppingList = () => {
  if (!selectedShoppingList.value) {
    feedbackStore.addFeedback('Du må velge en handleliste', 'error');
    return;
  }
  console.log(selectedIngredients.value);
  selectedIngredients.value.forEach((id) => {
    const requestBody: CreateShoppingListItemDTO = {
      ingredientId: id,
      amount: recipeIngredientsToList.find((i) => i.ingredient.id === id)!!.amountFromServings,
      name: recipeIngredientsToList.find((i) => i.ingredient.id === id)!!.ingredient.name,
      shoppingListId: selectedShoppingList.value!!.shoppingList.id,
    };
    ShoppinglistitemService.addItemToShoppingList({ requestBody });
  });
  feedbackStore.addFeedback('Ingredienser lagt til i handleliste', 'success');
  showModal.value = false;
};
</script>

<style></style>
