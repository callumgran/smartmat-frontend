<template>
  <h2 style="text-align: center">Finn oppskrifter</h2>
  <recipe-list :recipes="recipes" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RecipeService, RecipeDTO } from '@/api';
import RecipeList from '@/components/Recipe/RecipeList.vue';

const recipes = ref<RecipeDTO[]>(await RecipeService.getAllRecipes());
</script>
