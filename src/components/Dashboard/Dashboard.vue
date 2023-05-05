<template>
  <div class="wrapper">
    <h2>Hei {{ username }} !</h2>
    <h2>Klar for å bruke opp restene dine?</h2>

    <div v-if="householdId">
      <total-saved-user />

      <div v-if="todaysRecipe">
        <br />
        <h3>I dag har du planlagt å lage:</h3>
        <weekly-recipe-card
          :recipe="todaysRecipe.recipe"
          :servings="todaysRecipe.portions"
          :used="todaysRecipe.used"
          :date="new Date()"
          hide-buttons />
      </div>
      <div v-else>
        <br />
        <h3>Planlegg dagens middag:</h3>
        <div
          @click="
            $router.push({
              name: 'household-weekly',
              params: { id: householdId, year: today.getFullYear(), week: getISOWeek(today) },
            })
          ">
          <weekly-recipe-card :date="new Date()" />
        </div>
      </div>
    </div>
    <div v-else>
      <br />
      <h3>Lag en ny husstand for å komme i gang!</h3>
      <v-btn @click="$router.push({ name: 'household-create' })" color="primary">
        Ny husstand
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/UserStore';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { ApiError, HouseholdService, WeeklyRecipeDTO } from '@/api';
import { getISOWeek } from 'date-fns';
import TotalSavedUser from '@/components/Statistics/TotalSavedUser.vue';
import WeeklyRecipeCard from '@/components/Recipe/WeeklyRecipeCard.vue';

const userInfoStore = useUserInfoStore();
const householdStore = useHouseholdStore();
const householdId = householdStore.getSelectedId;
const username = userInfoStore.username;
const today = new Date();
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
  max-width: 600px;
  display: flex;
  flex-direction: column;
  margin: auto;
}
</style>
