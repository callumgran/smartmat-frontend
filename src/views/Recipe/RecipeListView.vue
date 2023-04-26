<template>
  <h1>Alle oppskrifter</h1>
  <div v-for="recipe in recipes" :key="recipe.id" class="recipe-list">
    <recipe-card
      :recipe="recipe"
      @click="$router.push({ name: 'recipe-detail', params: { id: recipe.id } })" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RecipeService, RecipeDTO } from '@/api';
import RecipeCard from '@/components/Recipe/RecipeCard.vue';

const recipes = ref<RecipeDTO[]>([]);

RecipeService.getAllRecipes().then((result) => {
  recipes.value = result;
});
</script>

<style scoped>
.recipe-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1em;
}
</style>
