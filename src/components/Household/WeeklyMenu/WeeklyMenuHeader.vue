<template>
  <!-- main navigation header -->
  <div v-if="planningMode === 'OVERVIEW'" class="main-head">
    <div class="d-flex justify-space-between">
      <v-btn icon="mdi-chevron-left" @click="changeWeek(week - 1)" />
      <h2>uke {{ week }}</h2>
      <v-btn icon="mdi-chevron-right" @click="changeWeek(week + 1)" />
    </div>
    <!-- only show add to shopping list if week menu is not from the past -->
    <div v-if="getMondayOfWeek(week + 1) > new Date()" class="add-ingredients">
      <v-btn
        v-if="missingIngridients"
        @click="addMissingIngriedientsToShoppingList()"
        size="small"
        class="add-ingredients-btn"
        >Legg manglende ingredienser i handleliste</v-btn
      >
    </div>
  </div>

  <!-- header when chosing recipe -->
  <div v-else>
    <v-card style="margin-bottom: 1rem; background-color: #e0e0e0">
      <v-card-title class="planning-head">
        <v-btn icon="mdi-arrow-left" @click="$emit('goBack')" />
        planlegg for
        <h3>{{ planningForDateStr }}</h3>
      </v-card-title>

      <v-card-item v-if="planningMode === 'RECIPE_DETAIL'">
        <v-divider />
        <div class="text-center">
          porsjoner
          <div class="d-flex justify-center">
            <v-btn @click="modifyServings(-1)">-</v-btn>
            <v-card-title>{{ servings }}</v-card-title>
            <v-btn @click="modifyServings(1)">+</v-btn>
          </div>
        </div>
        <v-divider />
        <div class="d-flex justify-center align-center">
          <v-btn @click="$emit('setRecipe')" variant="elevated" primary> velg oppskrift </v-btn>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { WeeklyRecipeDTO } from '@/api';

const route = useRoute();
const router = useRouter();
const householdId = route.params.id as string;

const props = defineProps<{
  planningMode: 'OVERVIEW' | 'RECIPE_LIST' | 'RECIPE_DETAIL';
  week: number;
  year: number;
  servings: number;
  planningForDateStr: string;
  weeklyMenu: WeeklyRecipeDTO[];
}>();

const emit = defineEmits(['update:servings', 'goBack', 'setRecipe', 'confirmAddToShoppingList']);

const addMissingIngriedientsToShoppingList = () => {
  emit('confirmAddToShoppingList');
};

const modifyServings = (amount: number) => {
  let servings = props.servings;
  servings += amount;
  if (servings < 1) {
    servings = 1;
  }

  emit('update:servings', servings);
};

const changeWeek = (newWeek: number): void => {
  // code golfers seethe
  let newYear = props.year;
  if (newWeek > 52) {
    newYear++;
    newWeek = 1;
  } else if (newWeek < 1) {
    newYear--;
    newWeek = 52;
  }
  router.push({
    name: 'household-weekly',
    params: {
      id: householdId,
      year: newYear,
      week: newWeek,
    },
  });
};

const getMondayOfWeek = (week: number): Date => {
  const date = new Date(props.year, 0, 0);
  const day = date.getDay() === 0 ? 7 : date.getDay();
  const diff = (week - 1) * 7 + (8 - day);
  return new Date(props.year, 0, diff);
};

const missingIngridients = computed(() => {
  for (const plannedRecipe of props.weeklyMenu) {
    if (plannedRecipe) {
      if (plannedRecipe.used === false) return true;
    }
  }
});
</script>

<style scoped>
.planning-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
}

.add-ingredients-btn {
  margin-top: 0.5rem;
}

.add-ingredients {
  display: flex;
  justify-content: center;
}

.main-head {
  max-width: 720px;
  margin: auto;
}

.choose-recipe-btn {
  text-align: center;
}
</style>
