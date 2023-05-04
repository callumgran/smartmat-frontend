<template>
  <weekly-menu-header
    v-model:servings="servings"
    :planningMode="planningMode"
    :week="week"
    :year="year"
    :planningForDateStr="planningForDateStr"
    :weeklyMenu="weeklyMenu"
    @goBack="goBack()"
    @setRecipe="setRecipe()"
    @confirmAddToShoppingList="confirmAddToShoppingListBool = true" />

  <weekly-menu-card
    v-if="planningMode === 'OVERVIEW'"
    :weeklyMenu="weeklyMenu"
    @plan-recipe="(dateFmtStr, dayIndex) => planRecipe(dateFmtStr, dayIndex)"
    @delete-planned-recipe="(dayIndex: number) => deletePlannedRecipe(dayIndex)"
    @used="(dayIndex: number) => useRecipe(dayIndex)" />

  <div v-else-if="planningMode === 'RECIPE_LIST'" class="recipe-list">
    <recipe-list
      :recipes="recipes"
      :emitOverRouterPush="true"
      @recipe-clicked="(recipeId) => showRecipe(recipeId)" />
  </div>
  <div v-else>
    <p v-if="loadingRecipe">loading...</p>
    <recipe-detail
      v-else
      :recipeProp="chosenRecipe"
      :showAddToShoppingListModal="false"
      :showServingsModal="false" />
  </div>

  <confirm-add-to-shopping-list
    v-if="confirmAddToShoppingListBool"
    :mondayOfWeek="mondayOfWeek"
    @close="confirmAddToShoppingListBool = false" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import useFeedbackStore, { FeedbackType } from '@/stores/FeedbackStore';
import {
  RecipeService,
  RecipeDTO,
  CreateWeeklyRecipeDTO,
  HouseholdService,
  WeeklyRecipeDTO,
} from '@/api';
import WeeklyMenuHeader from '@/components/Household/WeeklyMenu/WeeklyMenuHeader.vue';
import WeeklyMenuCard from '@/components/Household/WeeklyMenu/WeeklyMenuCard.vue';
import RecipeList from '@/components/Recipe/RecipeList.vue';
import RecipeDetail from '@/components/Recipe/RecipeDetail.vue';
import ConfirmAddToShoppingList from '@/components/Household/WeeklyMenu/ConfirmAddToShoppingList.vue';

type PLANNING_MODE = 'OVERVIEW' | 'RECIPE_LIST' | 'RECIPE_DETAIL';

const route = useRoute();
const router = useRouter();
const feedbackStore = useFeedbackStore();

const getMondayOfWeek = (week: number): Date => {
  const date = new Date(year, 0, 0);
  const day = date.getDay() === 0 ? 7 : date.getDay();
  const diff = (week - 1) * 7 + (8 - day);
  return new Date(year, 0, diff);
};

const mondayOfWeek = computed((): string => {
  const monday = getMondayOfWeek(week);
  const yearString = monday.getFullYear().toString();
  const monthString = (monday.getMonth() + 1).toString().padStart(2, '0');
  const dayString = monday.getDate().toString().padStart(2, '0');
  return `${yearString}-${monthString}-${dayString}`;
});

/* immutable state */
const householdId = route.params.id as string;
const week: number = +route.params.week;
const year: number = +route.params.year;
const recipes = ref<RecipeDTO[]>(await RecipeService.getAllRecipes());

/* mutable state, should probably be packed into a struct or something */
const planningMode = ref('OVERVIEW' as PLANNING_MODE);
const planningForDateStr = ref('');
const chosenRecipe = ref<RecipeDTO | undefined>(undefined);
let chosenDay = -1;
const loadingRecipe = ref(false);
const servings = ref(4);
const confirmAddToShoppingListBool = ref(false);
const weeklyMenu = ref<WeeklyRecipeDTO[]>(Array(7).fill(undefined));
HouseholdService.getWeeklyRecipes({ id: householdId, monday: mondayOfWeek.value }).then(
  (response) => {
    for (const weeklyRecipe of response) {
      const date = new Date(weeklyRecipe.dateToUse);
      const day = date.getDay();
      const dayIdx = day == 0 ? 6 : day - 1;
      weeklyMenu.value[dayIdx] = weeklyRecipe;
    }
  },
);

const setRecipe = async () => {
  const date = yearMonthDayToApiFmtStr(year, week, chosenDay);
  const payload = {
    portions: servings.value,
    dateToUse: date,
  } as CreateWeeklyRecipeDTO;
  await HouseholdService.addWeeklyRecipe({
    id: householdId,
    recipeId: chosenRecipe.value?.id!!,
    requestBody: payload,
  });

  feedbackStore.addFeedback(
    `Oppskrift lagt til for ${planningForDateStr.value}`,
    'success' as FeedbackType,
  );
  planningMode.value = 'OVERVIEW';
  router.go(0);
};

const useRecipe = async (dayIndex: number) => {
  const date = yearMonthDayToApiFmtStr(year, week, dayIndex);
  await HouseholdService.useRecipe1({
    id: householdId,
    date: date,
  });
  router.go(0);
};

const deletePlannedRecipe = async (dayIndex: number) => {
  const date = yearMonthDayToApiFmtStr(year, week, dayIndex);
  await HouseholdService.deleteWeeklyRecipe({
    id: householdId,
    date: date,
  });
  //TODO: better solution than just reloading
  router.go(0);
};

const planRecipe = async (dateFmtStr: string, dayIndex: number) => {
  planningMode.value = 'RECIPE_LIST';
  planningForDateStr.value = dateFmtStr;
  chosenDay = dayIndex;
};

const showRecipe = async (recipeId: string) => {
  planningMode.value = 'RECIPE_DETAIL';
  //TODO: better solution when waiting for data
  loadingRecipe.value = true;
  chosenRecipe.value = await RecipeService.getRecipeById({ id: recipeId });
  loadingRecipe.value = false;
};

const goBack = () => {
  if (planningMode.value === 'RECIPE_DETAIL') planningMode.value = 'RECIPE_LIST';
  else planningMode.value = 'OVERVIEW';
};

/* returns on the format yyyy-MM-dd */
const yearMonthDayToApiFmtStr = (year: number, week: number, dayIndex: number): string => {
  // JS Date very ergonomic... !
  const date = new Date(year, 0, (week - 1) * 7 + dayIndex + 2);
  const yearStr = date.getFullYear().toString();
  const monthStr = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1).toString();
  const dayStr = (date.getDate() < 10 ? '0' : '') + date.getDate().toString();
  return `${yearStr}-${monthStr}-${dayStr}`;
};
</script>

<style scoped>
.recipe-list {
  padding-top: 1rem;
}

.chooseRecipeBtn {
  position: absolute;
  z-index: 1;
  left: 25%;
  margin-top: 0.5rem;
}
</style>
