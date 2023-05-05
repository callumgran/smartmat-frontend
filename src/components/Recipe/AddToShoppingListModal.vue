<template>
  <v-btn
    color="primary"
    class="mt-2"
    data-testid="add-to-shopping-list-modal-button"
    @click="showModal = true">
    <v-icon>mdi-basket-plus-outline</v-icon>
  </v-btn>
  <v-dialog v-model="showModal" max-width="500">
    <v-card data-testid="modal-dialog">
      <v-card-item><h3>Legg ingredienser i handlelisten</h3></v-card-item>
      <v-card-text>
        <v-list>
          <div v-for="ingredient in recipeIngredientsToList" :key="ingredient.ingredient.name">
            <v-list-item v-if="ingredient.amount > 0">
              {{ ingredient.ingredient.name }} :
              {{ getIngredientAmount(ingredient.amount) }}
              {{ ingredient.unit?.abbreviation }}
            </v-list-item>
          </div>
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
  ShoppinglistitemService,
  CreateShoppingListItemDTO,
  HouseholdService,
  RecipeIngredientDTO,
  RecipeService,
} from '@/api';
import { ref } from 'vue';
import useFeedbackStore from '@/stores/FeedbackStore';

const feedbackStore = useFeedbackStore();

const showModal = ref(false);

const props = defineProps<{
  recipeIngredientsToList: RecipeIngredientDTO[];
  household: string;
  servings: number;
  recipeId: string;
}>();

const formatIngredientItem = (recipeIngredient: RecipeIngredientDTO) => {
  return `${recipeIngredient.ingredient.name} : ${recipeIngredient.amount * props.servings} ${
    recipeIngredient.ingredient.unit?.abbreviation
  }`;
};

const addToShoppingList = async () => {
  const shoppingList = await HouseholdService.getCurrentShoppingList({
    id: props.household,
  });
  const ingredientsToShoppingList = await RecipeService.getShoppingListItems({
    id: props.recipeId,
    householdId: props.household,
    portions: props.servings,
  });

  ingredientsToShoppingList.forEach(async (i) => {
    const requestBody: CreateShoppingListItemDTO = {
      ingredientId: i.ingredient!!.id,
      amount: i.amount,
      name: i.ingredient!!.name,
      shoppingListId: shoppingList.id,
    };
    await ShoppinglistitemService.addItemToShoppingList({ requestBody });
  });
  feedbackStore.addFeedback('Ingredienser lagt til i handleliste', 'success');
  showModal.value = false;
};

const getIngredientAmount = (amount: number) => {
  return Math.round(amount * props.servings * 100) / 100;
};
</script>

<style></style>
