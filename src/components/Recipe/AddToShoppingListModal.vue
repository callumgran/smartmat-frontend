<template>
  <v-btn
    color="primary"
    data-testid="add-to-shopping-list-modal-button"
    style="position: fixed; bottom: 50px; right: 24px"
    @click="showModal = true">
    <v-icon>mdi-basket-plus-outline</v-icon>
  </v-btn>
  <v-dialog v-model="showModal" max-width="500">
    <v-card data-testid="modal-dialog">
      <v-card-item><h3>Legg ingredienser i handlelisten</h3></v-card-item>
      <v-card-text>
        <v-list>
          <v-checkbox
            v-for="recipeIngredient in recipeIngredientsToList"
            :key="recipeIngredient.ingredient.id"
            :label="formatIngredientItem(recipeIngredient)"
            :value="recipeIngredient"
            density="compact"
            color="green"
            persistent-hint
            :hint="
              recipeIngredient.leftInHousehold > 0
                ? `${recipeIngredient.leftInHousehold} ${recipeIngredient.ingredient.unit?.abbreviation} i din beholdningen`
                : 'Mangler i beholdningen'
            "
            v-model="selectedIngredients"
            data-testid="ingredient-checkbox" />
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="addToShoppingList" data-testid="add-to-shopping-list-button"
          >Legg til</v-btn
        >
        <v-btn @click="showModal = false">Lukk</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  BareIngredientDTO,
  ShoppinglistitemService,
  CreateShoppingListItemDTO,
  HouseholdService,
} from '@/api';
import { ref, watchEffect } from 'vue';
import useFeedbackStore from '@/stores/FeedbackStore';

export type RecipeIngredientsToList = {
  ingredient: BareIngredientDTO;
  amountFromServings: number;
  leftInHousehold: number;
};

const feedbackStore = useFeedbackStore();

const showModal = ref(false);

const props = defineProps<{
  recipeIngredientsToList: RecipeIngredientsToList[];
  household: string;
}>();

const householdHasEnoughOfIngredient = (recipeIngredient: RecipeIngredientsToList) =>
  recipeIngredient.leftInHousehold >= recipeIngredient.amountFromServings;

const selectedIngredients = ref<RecipeIngredientsToList[]>(props.recipeIngredientsToList ?? []);
watchEffect(() => {
  selectedIngredients.value = props.recipeIngredientsToList.filter(
    (ri) => !householdHasEnoughOfIngredient(ri),
  );
});

const formatIngredientItem = (recipeIngredient: RecipeIngredientsToList) => {
  return `${recipeIngredient.ingredient.name} : ${recipeIngredient.amountFromServings} ${recipeIngredient.ingredient.unit?.abbreviation}`;
};

const addToShoppingList = async () => {
  const shoppingList = await HouseholdService.getCurrentShoppingList({
    id: props.household,
  });
  selectedIngredients.value.forEach(async (ri) => {
    const requestBody: CreateShoppingListItemDTO = {
      ingredientId: ri.ingredient.id,
      amount: ri.amountFromServings,
      name: ri.ingredient.name,
      shoppingListId: shoppingList.id,
    };
    await ShoppinglistitemService.addItemToShoppingList({ requestBody });
  });
  feedbackStore.addFeedback('Ingredienser lagt til i handleliste', 'success');
  showModal.value = false;
};
</script>

<style></style>
