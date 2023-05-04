<template>
  <v-card>
    <v-title data-testid="choose-ingredient-title" class="text-h4 ma-2">Velg ingrediens</v-title>
    <v-text-field
      v-model="search"
      label="Søk etter ingrediens"
      outlined
      dense
      @input="onSearch"
      class="mb-4" />
    <v-divider />
    <v-list>
      <v-list-item-group v-model="ingredients">
        <v-list-item
          v-for="ingredient in ingredients"
          :key="ingredient.id"
          @click="!selectedItem ? (selectedItem = ingredient) : (selectedItem = null)"
          :class="ingredient === selectedItem ? 'bg-green' : ''">
          <v-list-item-title>{{ ingredient.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider />
    <div>
      <v-btn
        class="ma-2"
        data-testid="not-ingredient-button"
        @click="emit('onChoice', selectedItem)"
        :class="!selectedItem ? 'bg-orange' : 'bg-green'">
        {{ !selectedItem ? 'Produktet er ikke en ingrediens' : 'Velg ingrediens' }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { FilterRequest, IngredientDTO, IngredientService, SortRequest } from '@/api';
import { ref } from 'vue';

const props = defineProps<{
  startList?: IngredientDTO[];
}>();

const emit = defineEmits<{
  (e: 'onChoice', ingredient: IngredientDTO | null): void;
}>();

const search = ref('');
const selectedItem = ref<IngredientDTO | null>(null);

const getIngredients = async (search: string): Promise<IngredientDTO[]> => {
  return IngredientService.searchIngredients({
    requestBody: {
      filterRequests: [
        {
          keyWord: 'name',
          operator: FilterRequest.operator.LIKE,
          fieldType: FilterRequest.fieldType.STRING,
          value: search,
        },
      ],
      sortRequests: [{ keyWord: 'name', sortDirection: SortRequest.sortDirection.ASC }],
      size: undefined,
      page: undefined,
    },
  });
};

const ingredients = ref<IngredientDTO[]>(props.startList ?? (await getIngredients('')));

const onSearch = async (search: string) => {
  ingredients.value = await getIngredients(search);
};
</script>

<style scoped></style>
