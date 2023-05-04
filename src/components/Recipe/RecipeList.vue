<template>
  <v-text-field
    v-if="filterChoice !== 'best-fit'"
    v-model="searchInput"
    density="compact"
    variant="solo"
    label="Søk etter oppskrift"
    append-inner-icon="mdi-magnify"
    single-line
    hide-details
    data-testid="search-input"></v-text-field>

  <div class="d-flex justify-center align-center filter-wrapper">
    <v-btn-toggle v-model="filterChoice" divided variant="outlined" color="primary">
      <v-btn value="best-fit" size="x-small">Bruk opp rester</v-btn>
      <!--<v-btn value="new" size="x-small">Nye oppskrifter</v-btn>-->
      <v-btn value="random" size="x-small" data-testid="sort-by-amount">Bli inspirert</v-btn>
    </v-btn-toggle>
  </div>

  <div
    v-if="currentRecipes.length > 0"
    v-for="rr in currentRecipes"
    :key="rr.recipe.id"
    class="recipe-list">
    <recipe-card
      :data-testid="rr.recipe.id + '-card'"
      :recipe="rr.recipe"
      :score="rr.score > 0 ? rr.score : undefined"
      @click="goToRecipe(rr.recipe.id)" />
  </div>
  <div v-else>
    <v-alert dense type="info" style="margin-top: 1rem"
      >Ingen oppskrifter bruker opp dine rester</v-alert
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useHouseholdStore } from '@/stores/HouseholdStore';
import { useRouter } from 'vue-router';
import {
  RecipeDTO,
  RecipeRecommendationDTO,
  HouseholdService,
  RecipeService,
  FilterRequest,
  SortRequest,
} from '@/api';
import RecipeCard from '@/components/Recipe/RecipeCard.vue';

const props = defineProps<{
  recipes: RecipeDTO[];
  emitOverRouterPush?: boolean;
}>();

const emit = defineEmits(['recipe-clicked']);

const router = useRouter();

const goToRecipe = (id: string) => {
  if (props.emitOverRouterPush) emit('recipe-clicked', id);
  else router.push({ name: 'recipe-detail', params: { recipeId: id } });
};

const setCurrentRecipes = (recipes: RecipeDTO[]) => {
  currentRecipes.value = recipes.map((recipe) => ({
    recipe: recipe,
    score: 0,
  }));
};

const currentRecipes = ref([] as RecipeRecommendationDTO[]);
setCurrentRecipes(props.recipes);

const householdId = useHouseholdStore().getSelectedId;
const searchInput = ref('');
const filterChoice = ref('');

const search = async () => {
  let res = await RecipeService.searchRecipes({
    requestBody: {
      sortRequests: [{ keyWord: 'name', sortDirection: SortRequest.sortDirection.ASC }],
      filterRequests: [
        {
          keyWord: 'name',
          value: searchInput.value,
          operator: FilterRequest.operator.LIKE,
          fieldType: FilterRequest.fieldType.STRING,
          valueTo: '',
          values: [],
        },
      ],
    },
  });

  setCurrentRecipes(res);
};

watch([searchInput], async () => {
  if (searchInput.value.length == 0) {
    setCurrentRecipes(props.recipes);
    return;
  }

  search();
});

watch([filterChoice], async () => {
  if (filterChoice.value === 'best-fit') {
    HouseholdService.getRecommendedRecipes({ id: householdId }).then((recipeRecomendations) => {
      currentRecipes.value = recipeRecomendations;
    });
  } else if (filterChoice.value === 'random') {
    setCurrentRecipes(props.recipes.sort(() => Math.random() - 0.5));
  } else {
    setCurrentRecipes(props.recipes);
    search();
  }
});
</script>

<style scoped>
.recipe-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1em;
}

.filter-wrapper {
  margin-top: 0.25rem;
}
</style>
