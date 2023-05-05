<template>
  <div class="wrapper">
    <h2>Hei {{ username }} !</h2>
    <h2>Klar for å bruke opp restene dine?</h2>

    <total-saved-user v-if="householdId" />

    <div v-if="todaysRecipe">
      <br />
      <h3>I dag har du planlagt å lage:</h3>
      <weekly-recipe-card
        :recipe="todaysRecipe.recipe"
        :servings="todaysRecipe.portions"
        :used="todaysRecipe.used"
        :date="new Date()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/UserStore';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { ApiError, HouseholdService, WeeklyRecipeDTO } from '@/api';
import TotalSavedUser from '@/components/Statistics/TotalSavedUser.vue';
import WeeklyRecipeCard from '@/components/Recipe/WeeklyRecipeCard.vue';

const userInfoStore = useUserInfoStore();
const householdStore = useHouseholdStore();
const householdId = householdStore.getSelectedId;
const username = userInfoStore.username;
let todaysRecipe: WeeklyRecipeDTO;
try {
  if (householdId) {
    todaysRecipe = await HouseholdService.getWeeklyRecipeToday({ id: householdId });
  }
} catch (e) {
  if (!(e instanceof ApiError) || (e instanceof ApiError && e.status !== 404)) {
    throw e;
  }
}
</script>

<style scoped>
.wrapper {
  margin: 1rem;
}
</style>
