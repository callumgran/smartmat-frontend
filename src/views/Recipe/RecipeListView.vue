<template>
  <h2 style="text-align: center" data-testid="header">Finn oppskrifter</h2>
  <recipe-list :recipes="recipes" data-testid="recipes" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RecipeService, RecipeDTO } from '@/api';
import RecipeList from '@/components/Recipe/RecipeList.vue';

const recipes = ref<RecipeDTO[]>(await RecipeService.getAllRecipes());
</script>
