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
        {{ RecipeDifficulty[recipe.recipeDifficulty] }}
      </v-card-item>
    </div>
  </v-card>

  <v-card class="card-wrapper">
    <div v-if="showServingsModal">
      <v-card-title>Antall porsjoner</v-card-title>
      <v-card-actions>
        <v-btn @click="modifyServings(-1)">-</v-btn>
        <v-card-title>{{ servings }}</v-card-title>
        <v-btn @click="modifyServings(1)">+</v-btn>
      </v-card-actions>
    </div>
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

  <add-to-shopping-list-modal
    v-if="showAddToShoppingListModal"
    :recipeIngredientsToList="recipeIngredientsToList"
    :household="householdId" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { HouseholdfoodproductService, RecipeDTO, RecipeService } from '@/api';
import AddToShoppingListModal, {
  RecipeIngredientsToList,
} from '@/components/Recipe/AddToShoppingListModal.vue';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { RecipeDifficulty } from '@/utils/EnumTranslation';

const props = defineProps({
  recipeProp: {
    type: Object as () => RecipeDTO,
    required: false,
  },
  showAddToShoppingListModal: {
    type: Boolean,
    required: false,
    default: true,
  },
  showServingsModal: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const householdId = useHouseholdStore().householdId;
const recipe = ref<RecipeDTO>({} as RecipeDTO);

if (props.recipeProp) {
  recipe.value = props.recipeProp;
} else {
  const route = useRoute();
  const id = route.params.recipeId as string;
  recipe.value = await RecipeService.getRecipeById({ id });
}

const householdFoodProducts = await HouseholdfoodproductService.searchForHouseholdFoodProduct({
  householdId,
  requestBody: {},
});

const servings = ref(useRoute().query.servings ? Number(useRoute().query.servings) : 4);
const modifyServings = (amount: number) => {
  servings.value += amount;
  if (servings.value < 1) {
    servings.value = 1;
  }
};

const getIngredientAmount = (amount: number) => {
  return amount * servings.value;
};

const recipeIngredientsToList = ref<RecipeIngredientsToList[]>([]);

watchEffect(() => {
  recipeIngredientsToList.value = recipe.value.ingredients.map((recipeIngredient) => {
    const leftInHousehold = householdFoodProducts
      .filter((hfp) => hfp.foodProduct?.ingredient?.id === recipeIngredient.ingredient.id)
      .map((hfp) => hfp.amountLeft ?? hfp.foodProduct?.amount)
      .reduce((a, b) => a!! + (!b ? 0 : b), 0);
    return {
      ingredient: recipeIngredient.ingredient,
      amountFromServings: getIngredientAmount(recipeIngredient.amount),
      leftInHousehold: leftInHousehold ?? 0,
    };
  });
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
