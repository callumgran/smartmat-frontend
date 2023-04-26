<template>
  <div class="wrapper">
    <v-navigation-drawer permanent location="bottom" width="50" data-testid="add-ingredients-btn">
      <v-btn style="font-size: small">legg manglende ingredienser i handleliste</v-btn>
    </v-navigation-drawer>

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
      <v-card-title>Ingredienser</v-card-title>
      <v-card-text>
        <ul class="ingredient-list">
          <li v-for="recipeIngredient in recipe.ingredients" :key="recipeIngredient.ingredient.id">
            {{ recipeIngredient.ingredient.name }} : {{ recipeIngredient.amount }}
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { RecipeDTO, RecipeService } from '@/api';

const recipe = ref<RecipeDTO>({} as RecipeDTO);

const props = defineProps({
  recipeProp: {
    type: Object as () => RecipeDTO,
    required: false,
  },
});

onMounted(async () => {
  if (props.recipeProp) {
    recipe.value = props.recipeProp;
    return;
  }

  const route = useRoute();
  const id = route.params.id as string;
  recipe.value = await RecipeService.getRecipeById({ id });
});

const difficultyMappings = {
  [RecipeDTO.recipeDifficulty.EASY]: 'Enkel',
  [RecipeDTO.recipeDifficulty.MEDIUM]: 'Middels',
  [RecipeDTO.recipeDifficulty.ADVANCED]: 'Avansert',
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
