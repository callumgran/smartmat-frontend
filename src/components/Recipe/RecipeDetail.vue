<template>
  <v-img :src="recipe.image ? recipe.image : '/recipe-placeholder.jpg'"></v-img>

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
        <v-btn data-testid="button" @click="modifyServings(-1)">-</v-btn>
        <v-card-title>{{ servings }}</v-card-title>
        <v-btn @click="modifyServings(1)">+</v-btn>
      </v-card-actions>
    </div>
    <v-divider />
    <v-card-title>Ingredienser</v-card-title>
    <v-card-text>
      <ul class="ingredient-list">
        <div v-for="recipeIngredient in recipe.ingredients" :key="recipeIngredient.ingredient.id">
          <li v-if="recipeIngredient.amount > 0">
            {{ recipeIngredient.ingredient.name }} :
            {{ getIngredientAmount(recipeIngredient.amount) }}
            {{ recipeIngredient.unit?.abbreviation }}
          </li>
        </div>
      </ul>
    </v-card-text>
  </v-card>
  <add-to-shopping-list-modal
    :recipeId="recipe.id"
    :servings="servings"
    v-if="showAddToShoppingListModal"
    :recipeIngredientsToList="recipe.ingredients"
    :household="householdId" />

  <v-card class="card-wrapper">
    <v-card-title>Slik gjør du</v-card-title>
    <v-card-text>
      {{ recipe.instructions }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { RecipeDTO, RecipeService } from '@/api';
import AddToShoppingListModal from '@/components/Recipe/AddToShoppingListModal.vue';
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

const householdId = useHouseholdStore().getSelectedId;
const recipe = ref<RecipeDTO>({} as RecipeDTO);

if (props.recipeProp) {
  recipe.value = props.recipeProp;
} else {
  const route = useRoute();
  const id = route.params.recipeId as string;
  recipe.value = await RecipeService.getRecipeById({ id });
}

const servings = ref(useRoute().query.servings ? Number(useRoute().query.servings) : 4);
const modifyServings = (amount: number) => {
  servings.value += amount;
  if (servings.value < 1) {
    servings.value = 1;
  }
};

const getIngredientAmount = (amount: number) => {
  return Math.ceil(amount * servings.value * 100) / 100;
};
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
