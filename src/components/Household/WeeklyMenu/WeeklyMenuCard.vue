<template>
  <v-divider class="my-4" />
  <div class="list" data-testid="weekly-menu-card">
    <weekly-recipe-card
      v-for="(weeklyRecipe, index) in weeklyMenu"
      :key="index"
      :recipe="weeklyRecipe?.recipe"
      :date="indexToDate(index)"
      :servings="weeklyRecipe?.portions"
      :used="weeklyRecipe?.used"
      @plan-recipe="(dateFmtStr) => planARecipe(dateFmtStr, index)"
      @delete-planned-recipe="deletePlannedRecipe(index)"
      @used="used(index)"
      class="list-item" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { WeeklyRecipeDTO } from '@/api';
import WeeklyRecipeCard from '@/components/Recipe/WeeklyRecipeCard.vue';

defineProps<{
  weeklyMenu: WeeklyRecipeDTO[];
}>();

const route = useRoute();
const year: number = +route.params.year;
const week: number = +route.params.week;

const emit = defineEmits(['plan-recipe', 'delete-planned-recipe', 'used']);

const planARecipe = (dateFmtStr: string, dayIndex: number) => {
  emit('plan-recipe', dateFmtStr, dayIndex);
};

const deletePlannedRecipe = (dayIndex: number) => {
  emit('delete-planned-recipe', dayIndex);
};

const used = (dayIndex: number) => {
  emit('used', dayIndex);
};

/* gets the monday of the week in the format yyyy-MM-dd */
const mondayOfWeek = computed((): string => {
  const date = new Date(year, 0, 0);
  const day = date.getDay() === 0 ? 7 : date.getDay();
  const diff = (week - 1) * 7 + (8 - day);
  const monday = new Date(year, 0, diff);
  const yearString = monday.getFullYear().toString();
  const monthString = (monday.getMonth() + 1).toString().padStart(2, '0');
  const dayString = monday.getDate().toString().padStart(2, '0');
  return `${yearString}-${monthString}-${dayString}`;
});

const indexToDate = (index: number): Date => {
  const date = new Date(mondayOfWeek.value);
  date.setDate(date.getDate() + index);
  return date;
};
</script>

<style scoped>
.list {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin: auto;
  max-width: 720px;
}
</style>
