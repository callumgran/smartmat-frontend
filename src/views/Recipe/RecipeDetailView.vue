<template>
  <v-img
    src="https://www.hackerspace-ntnu.no/media/profilepictures/cache/30/1b/301bbf8859ebf1c2edaf5d0c60a1c1d8.jpg">
  </v-img>

  <v-card class="card-wrapper">
    <v-card-title>{{ recipe.name }} </v-card-title>
    <v-card-text>{{ recipe.description }}</v-card-text>
    <v-divider />

    <div style="display: flex">
      <v-card-item>
        <v-icon>mdi-clock-outline</v-icon>
        {{ recipe.estimatedMinutes }} minutter
      </v-card-item>
      <v-card-item>
        <v-icon>mdi-chef-hat</v-icon>
        {{ difficultyMappings[recipe.recipeDifficulty] }}
      </v-card-item>
    </div>
  </v-card>

  <v-card class="card-wrapper">
    <v-card-title>Antall porsjoner</v-card-title>
    <v-card-actions>
      <v-btn @click="modifyServings(-1)">-</v-btn>
      <v-card-title>{{ servings }}</v-card-title>
      <v-btn @click="modifyServings(1)">+</v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-title>Ingredienser</v-card-title>
    <v-card-text>
      <ul class="ingredient-list">
        <li
          v-for="recipeIngredient in recipeIngredientsToList"
          :key="recipeIngredient.ingredient.id">
          {{ recipeIngredient.ingredient.name }} :
          {{ recipeIngredient.amountFromServings }}
          {{ recipeIngredient.ingredient.unit?.abbreviation }}
        </li>
      </ul>
    </v-card-text>
  </v-card>

  <v-card class="card-wrapper">
    <v-card-title>Slik gjør du</v-card-title>
    <v-card-text>
      {{ recipe.instructions }}
    </v-card-text>
  </v-card>

  <!--Make this into separate component-->
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
              :value="recipeIngredient"
              density="compact"
              color="green"
              v-model="selectedIngredients" />
          </v-list>
        </v-card-text>
        <v-select
          v-model="selectedShoppingList"
          :items="shoppingListsInHouseholds"
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
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { RecipeDTO, RecipeService } from '@/api';
import {
  IngredientDTO,
  ShoppinglistitemService,
  CreateShoppingListItemDTO,
  HouseholdService,
} from '@/api';
import { useUserInfoStore } from '@/stores/UserStore';
import useFeedbackStore from '@/stores/FeedbackStore';

const recipe = ref<RecipeDTO>({} as RecipeDTO);

const props = defineProps({
  recipeProp: {
    type: Object as () => RecipeDTO,
    required: false,
  },
});

if (props.recipeProp) {
  recipe.value = props.recipeProp;
} else {
  const route = useRoute();
  const id = route.params.id as string;
  recipe.value = await RecipeService.getRecipeById({ id });
}

const difficultyMappings = {
  [RecipeDTO.recipeDifficulty.EASY]: 'Enkel',
  [RecipeDTO.recipeDifficulty.MEDIUM]: 'Middels',
  [RecipeDTO.recipeDifficulty.ADVANCED]: 'Avansert',
};

const servings = ref(4);
const modifyServings = (amount: number) => {
  servings.value += amount;
  if (servings.value < 1) {
    servings.value = 1;
  }
};
const getIngredientAmount = (oneServingAmount: number) => {
  return Math.round(servings.value * oneServingAmount * 100) / 100;
};

const recipeIngredientsToList = computed(
  () =>
    recipe.value.ingredients?.map((recipeIngredient) => ({
      ingredient: recipeIngredient.ingredient,
      amountFromServings: getIngredientAmount(recipeIngredient.amount),
    })) as RecipeIngredientsToList[],
);

// Under here can go into separate component

const userStore = useUserInfoStore();
const feedbackStore = useFeedbackStore();

const showModal = ref(false);

type RecipeIngredientsToList = {
  ingredient: IngredientDTO;
  amountFromServings: number;
};

const formatIngredientItem = (recipeIngredient: RecipeIngredientsToList) => {
  return `${recipeIngredient.ingredient.name} : ${recipeIngredient.amountFromServings} ${recipeIngredient.ingredient.unit?.abbreviation}`;
};
const selectedIngredients = ref<RecipeIngredientsToList[]>(recipeIngredientsToList.value ?? []);

// TODO: Get shopping lists in a better way. Perhaps with getting all current shopping lists
const households = await HouseholdService.getHouseholdsForUser({ username: userStore.username });
const shoppingListsInHouseholds = households
  .map((h) => ({
    household: h,
    shoppingList: h.shoppingLists?.filter((h) => h.dateCompleted === null).at(0),
  }))
  .filter((h) => h.shoppingList !== undefined)
  .map((h) => ({
    title: h.household.name,
    value: h.shoppingList!!.id,
  }));
const selectedShoppingList = ref(shoppingListsInHouseholds.at(0)?.value);

// TODO: Store recipeIngredientsToList in select field to get amount and name better.
const addToShoppingList = () => {
  if (!selectedShoppingList.value) {
    feedbackStore.addFeedback('Du må velge en handleliste', 'error');
    return;
  }
  selectedIngredients.value.forEach(async (ri) => {
    const requestBody: CreateShoppingListItemDTO = {
      ingredientId: ri.ingredient.id,
      amount: ri.amountFromServings,
      name: ri.ingredient.name,
      shoppingListId: selectedShoppingList.value!!,
    };
    await ShoppinglistitemService.addItemToShoppingList({ requestBody });
  });
  feedbackStore.addFeedback('Ingredienser lagt til i handleliste', 'success');
  showModal.value = false;
};

watch(recipeIngredientsToList, () => {
  selectedIngredients.value = recipeIngredientsToList.value;
});
</script>

<style scoped>
.card-wrapper {
  margin-top: 1em;
}

.ingredient-list {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
